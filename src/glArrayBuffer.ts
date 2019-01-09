import {AxisAlignedBox} from "./axisAlignedBox";
import {mat4, vec3, vec4} from "gl-matrix";
import {Accessor} from "./gltf-types";
import {GLTF} from "./gltf-enums";
import {ATTRIBUTE_NORMALS_LOC, ATTRIBUTE_POSITION_LOC, ATTRIBUTE_TANGENT_LOC, ATTRIBUTE_UV_LOC,} from "./constants";
import {tmpVec3} from "./utils";

const FLOAT_BYTES = 4;
const VEC3 = 3;
const VEC4 = 4;
const UV_SIZE = 2;

const tmpVec1 = new Array(1);
const tmpVec4 = vec4.create();

export enum ArrayBufferDataType {
    TRIANGLES = WebGL2RenderingContext.TRIANGLES,
    LINES = WebGL2RenderingContext.LINES,
    LINE_STRIP = WebGL2RenderingContext.LINE_STRIP,
    POINTS = WebGL2RenderingContext.POINTS,
    TRIANGLE_STRIP = WebGL2RenderingContext.TRIANGLE_STRIP,
}

export function ArrayBufferDataTypeToGL(a: ArrayBufferDataType) {
    return a;
}

export class GLArrayBufferDataParams {
    // how many floats per element
    elementSize: number = VEC4;
    normalsSize: number = VEC4;
    uvSize: number = UV_SIZE;

    hasNormals: boolean;
    hasUVs: boolean;
    vertexCount: number;

    dataType: ArrayBufferDataType = ArrayBufferDataType.TRIANGLES;

    constructor(hasNormals: boolean, hasUVs: boolean, vertexCount: number, dataType: ArrayBufferDataType) {
        this.hasNormals = hasNormals;
        this.hasUVs = hasUVs;
        this.vertexCount = vertexCount;
        this.dataType = dataType || this.dataType;
    }

    computeStrideInElements() {
        return this.computeStrideInBytes() / FLOAT_BYTES;
    }

    computeStrideInBytes() {
        let size = this.elementSize * FLOAT_BYTES;
        if (this.hasNormals) {
            size += this.normalsSize * FLOAT_BYTES;
        }
        if (this.hasUVs) {
            size += this.uvSize * FLOAT_BYTES;
        }
        return size;
    }

    computeNormalOffset() {
        return FLOAT_BYTES * this.elementSize;
    }

    computeUVOffset() {
        return this.computeNormalOffset() + (this.hasNormals ? this.normalsSize * FLOAT_BYTES : 0);
    }
}

type DataOrBoundingBox = GLArrayBufferData | AxisAlignedBox;

export const computeBoundingBox = (() => {
    const min = vec3.create();
    const max = vec3.create();

    const compareAndSet = (out: number[] | Float32Array, inp: number[] | Float32Array, offset: number, f: (v: number, v1: number) => (number)) => {
        for (let i = 0; i < out.length; i++) {
            out[i] = f(out[i], inp[offset + i]);
        }
    };
    return (objects: DataOrBoundingBox[], invertZ: boolean = false, target?: AxisAlignedBox, start?: AxisAlignedBox): AxisAlignedBox => {
        target = target || new AxisAlignedBox();

        if (start) {
            vec3.copy(min, start.min);
            vec3.copy(max, start.max);
        } else {
            vec3.set(min, Infinity, Infinity, Infinity);
            vec3.set(max, -Infinity, -Infinity, -Infinity);
        }
        for (let i = 0; i < objects.length; i++) {
            const o = objects[i];
            if (o === null) {
                continue;
            }
            if (o instanceof GLArrayBufferData) {
                for (const it of o.iterator(tmpIter)) {
                    compareAndSet(min, o.buf, it.vs, Math.min);
                    compareAndSet(max, o.buf, it.vs, Math.max);
                }
            } else if (o instanceof AxisAlignedBox) {
                compareAndSet(min, o.min, 0, Math.min);
                compareAndSet(max, o.max, 0, Math.max);
            }
        }

        target.setMin(min);
        target.setMax(max);
        return target;
    };
})();

export class GLArrayBufferData {
    buf: Float32Array;
    params: GLArrayBufferDataParams;

    constructor(buf: Float32Array, params: GLArrayBufferDataParams) {
        this.buf = buf;
        this.params = params;
    }

    intoGLArrayBuffer(gl: WebGL2RenderingContext): GLArrayBufferV1 {
        return new GLArrayBufferV1(gl, this);
    }

    translate(matrix: mat4): GLArrayBufferData {
        const result = new GLArrayBufferData(new Float32Array(this.buf.length), this.params);
        return this.translateTo(matrix, result);
    }

    translateInPlace(matrix: mat4): GLArrayBufferData {
        this.translateToBuf(matrix, this.buf);
        return this;
    }

    translateToBuf(matrix: mat4, result: Float32Array): Float32Array {
        for (const it of this.iterator(tmpIter)) {
            let l = it.ve - it.vs;
            if (l === 3) {
                tmpVec3[0] = this.buf[it.vs];
                tmpVec3[1] = this.buf[it.vs + 1];
                tmpVec3[2] = this.buf[it.vs + 2];
                vec3.transformMat4(tmpVec3, tmpVec3, matrix);
                result.set(tmpVec3, it.vs);
            } else {
                tmpVec4[0] = this.buf[it.vs];
                tmpVec4[1] = this.buf[it.vs + 1];
                tmpVec4[2] = this.buf[it.vs + 2];
                tmpVec4[3] = this.buf[it.vs + 3];
                vec4.transformMat4(tmpVec4, tmpVec4, matrix);
                result.set(tmpVec4, it.vs);
            }

            // TODO: translate normals. this just copies normals and uvs back
            for (let i = it.ns; i < it.ue; i++) {
                result[i] = this.buf[i];
            }
        }
        return result;
    }

    translateTo(matrix: mat4, result: GLArrayBufferData): GLArrayBufferData {
        this.translateToBuf(matrix, result.buf);
        result.params = this.params;
        return result;
    }

    computeBoundingBox(target?: AxisAlignedBox): AxisAlignedBox {
        tmpVec1[0] = this;
        return computeBoundingBox(tmpVec1, false, target);
    }

    iterator(outIter?: GlArrayBufferDataIterator) {
        outIter = outIter || new GlArrayBufferDataIterator(this);
        outIter.initialize(this);
        return outIter;
    }
}

export class GlArrayBufferDataIterator {
    data: GLArrayBufferData;
    currentVertex: number = -1;

    vs: number;
    ve: number;
    ns: number;
    ne: number;
    us: number;
    ue: number;

    constructor(data: GLArrayBufferData) {
        this.initialize(data);
    }

    get done(): boolean {
        return this.currentVertex >= this.data.params.vertexCount;
    }

    get value(): GlArrayBufferDataIterator {
        if (!this.done) {
            return this;
        }
        return null;
    }

    initialize(data: GLArrayBufferData) {
        this.data = data;
        this.currentVertex = -1;
    }

    computeOffsets() {
        const p = this.data.params;
        const offset = this.currentVertex * p.computeStrideInElements();
        const noffset = offset + p.elementSize;
        const uvoffset = p.hasNormals ? noffset + p.normalsSize : noffset;

        this.vs = offset;
        this.ve = offset + p.elementSize;
        this.ns = noffset;
        this.ne = p.hasNormals ? noffset + p.normalsSize : noffset;
        this.us = uvoffset;
        this.ue = p.hasUVs ? uvoffset + p.uvSize : uvoffset;
    }

    [Symbol.iterator]() {
        return this;
    }

    next(): GlArrayBufferDataIterator {
        this.currentVertex++;
        this.computeOffsets();
        return this;
    }
}

export const tmpIter = new GlArrayBufferDataIterator(null);

export interface GLArrayBufferI {
    getBoundingBox(): AxisAlignedBox

    hasNormals(): boolean;

    hasUV(): boolean;

    hasTangent(): boolean;

    draw(gl: WebGL2RenderingContext, renderMode?: number): void;

    delete(gl: WebGL2RenderingContext): void;
}


export class ArrayWebGLBufferWrapper implements WebGLBufferI {
    private _buf: WebGLBuffer;

    constructor(gl: WebGL2RenderingContext, data: ArrayBuffer) {
        this._buf = gl.createBuffer();
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, this._buf);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    }

    buf(): WebGLBuffer {
        return this._buf;
    }

    delete(gl: WebGL2RenderingContext) {
        gl.deleteBuffer(this._buf);
        this._buf = null;
    }

    target(): GLenum {
        return WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER;
    }
}

export interface WebGLBufferI {
    buf(): WebGLBuffer

    target(): GLenum
}

export class ElementArrayWebGLBufferWrapper implements WebGLBufferI {
    private _buf: WebGLBuffer;

    constructor(gl: WebGL2RenderingContext, data: ArrayBuffer) {
        this._buf = gl.createBuffer();
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._buf);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
    }

    buf() {
        return this._buf;
    }

    delete(gl: WebGL2RenderingContext) {
        gl.deleteBuffer(this._buf);
        this._buf = null;
    }

    target(): GLenum {
        return WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER;
    }
}

export class BufferView<T extends WebGLBufferI> {
    constructor(buf: T, byteLength: number, byteOffset: number = 0, byteStride: number = 0) {
        this._buf = buf;
        this._byteLength = byteLength;
        this._byteOffset = byteOffset;
        this._byteStride = byteStride;
    }

    private _byteLength: number;

    get byteLength(): number {
        return this._byteLength;
    }

    private _byteOffset: number;

    get byteOffset(): number {
        return this._byteOffset;
    }

    private _byteStride: number;

    get byteStride(): number {
        return this._byteStride;
    }

    private _buf: T;

    get buf(): T {
        return this._buf;
    }
}

export class GLTFAccessor<T extends WebGLBufferI> {
    constructor(accessor: Accessor, data: BufferView<T>) {
        this._accessor = accessor;
        this._data = data;
    }

    private _accessor: Accessor;

    get accessor(): Accessor {
        return this._accessor;
    }

    private _data: BufferView<T>;

    get data(): BufferView<T> {
        return this._data;
    }

    get webGlBuf(): WebGLBuffer {
        return this.data.buf.buf();
    }

    componentTypeToGlType(): GLint {
        return GLTF.COMPONENT_TYPES_TO_GL_TYPE[this._accessor.componentType];
    }

    numberOfComponents(): GLint {
        switch (this._accessor.type) {
            case "SCALAR":
                return 1;
            case "VEC2":
                return 2;
            case "VEC3":
                return 3;
            case "VEC4":
                return 4;
            case "MAT2":
                return 4;
            case "MAT3":
                return 9;
            case "MAT4":
                return 16;
            default:
                throw new Error(`Unknown type ${this._accessor.type}`)
        }
    }

    setupVertexPointer(gl: WebGL2RenderingContext, attribLocation: number) {
        if (attribLocation === -1) {
            return;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webGlBuf);
        gl.enableVertexAttribArray(attribLocation);
        gl.vertexAttribPointer(
            attribLocation,
            this.numberOfComponents(),
            this.componentTypeToGlType(),
            this.accessor.normalized || false,
            this.data.byteStride,
            (this.data.byteOffset || 0) + (this.accessor.byteOffset || 0),
        );
    }
}

export class GLArrayBufferGLTF implements GLArrayBufferI {
    private indices: GLTFAccessor<ElementArrayWebGLBufferWrapper>;
    private position: GLTFAccessor<ArrayWebGLBufferWrapper>;
    private uv: GLTFAccessor<ArrayWebGLBufferWrapper>;
    private normal: GLTFAccessor<ArrayWebGLBufferWrapper>;
    private tangent: GLTFAccessor<ArrayWebGLBufferWrapper>;
    private bb: AxisAlignedBox;
    private vao: WebGLVertexArrayObject;

    constructor(
        gl: WebGL2RenderingContext,
        indices: GLTFAccessor<ElementArrayWebGLBufferWrapper>,
        position: GLTFAccessor<ArrayWebGLBufferWrapper>,
        uv: GLTFAccessor<ArrayWebGLBufferWrapper>,
        normal: GLTFAccessor<ArrayWebGLBufferWrapper>,
        tangent: GLTFAccessor<ArrayWebGLBufferWrapper>,
        boundingBox: AxisAlignedBox,
    ) {
        this.indices = indices;
        this.position = position;
        this.uv = uv;
        this.normal = normal;
        this.tangent = tangent;
        this.vao = this.prepareVAO(gl);
        this.bb = boundingBox;
    }

    getBoundingBox(): AxisAlignedBox {
        return this.bb;
    }

    delete(gl: WebGL2RenderingContext): void {
        console.log('delete called on GLArrayBufferGLTF, not sure what to do')
    }

    draw(gl: WebGL2RenderingContext, renderMode?: number): void {
        if (renderMode === undefined) {
            renderMode = gl.TRIANGLES;
        }

        gl.bindVertexArray(this.vao);

        if (this.indices) {
            gl.drawElements(
                renderMode,
                this.indices.accessor.count,
                this.indices.componentTypeToGlType(),
                this.indices.accessor.byteOffset
            );
        } else {
            gl.drawArrays(
                renderMode,
                0,
                this.position.accessor.count,
            );
        }
    }

    hasNormals(): boolean {
        return !!this.normal;
    }

    hasTangent(): boolean {
        return !!this.tangent;
    }

    hasUV(): boolean {
        return !!this.uv;
    }

    private prepareVAO(gl: WebGL2RenderingContext): WebGLVertexArrayObject {
        const arr = gl.createVertexArray();
        try {
            gl.bindVertexArray(arr);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices.webGlBuf);

            const normals = !!this.normal;
            const uv = !!this.uv;
            const tangent = !!this.tangent;

            this.setupVertexPositionsPointer(gl, ATTRIBUTE_POSITION_LOC);
            if (normals) {
                this.setupVertexNormalsPointer(gl, ATTRIBUTE_NORMALS_LOC);
            }
            if (uv) {
                this.setupVertexUVPointer(gl, ATTRIBUTE_UV_LOC);
            }
            if (tangent) {
                this.setupTangentPointer(gl, ATTRIBUTE_TANGENT_LOC);
            }
        } catch (e) {
            gl.deleteVertexArray(arr);
            throw e;
        }
        return arr;
    }

    private setupVertexNormalsPointer(gl, attribLocation): void {
        this.normal.setupVertexPointer(gl, attribLocation);
    }

    private setupVertexPositionsPointer(gl, attribLocation): void {
        this.position.setupVertexPointer(gl, attribLocation);
    }

    private setupVertexUVPointer(gl, attribLocation): void {
        this.uv.setupVertexPointer(gl, attribLocation);
    }

    private setupTangentPointer(gl: WebGL2RenderingContext, attribLocation: number) {
        this.tangent.setupVertexPointer(gl, attribLocation);
    }
}

export class GLArrayBufferV1 implements GLArrayBufferI {
    buffer: WebGLBuffer;
    params: GLArrayBufferDataParams;
    private vao: WebGLVertexArrayObject;
    private bb: AxisAlignedBox;

    constructor(gl: WebGL2RenderingContext, data: GLArrayBufferData, usage?: number) {
        if (usage === undefined) {
            usage = gl.STATIC_DRAW;
        }
        this.buffer = gl.createBuffer();
        this.params = data.params;
        this.vao = this.parepareVAO(gl);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data.buf, usage);
        gl.bindVertexArray(null);
        this.bb = data.computeBoundingBox();
    }

    getBoundingBox(): AxisAlignedBox {
        return this.bb;
    }

    draw(gl: WebGL2RenderingContext, renderMode?: number) {
        gl.bindVertexArray(this.vao);
        gl.drawArrays(renderMode || ArrayBufferDataTypeToGL(this.params.dataType), 0, this.params.vertexCount)
    }

    delete(gl: WebGL2RenderingContext) {
        gl.deleteVertexArray(this.vao);
        gl.deleteBuffer(this.buffer);
    }

    hasNormals(): boolean {
        return this.params.hasNormals;
    }

    hasTangent(): boolean {
        return false;
    }

    hasUV(): boolean {
        return this.params.hasUVs;
    }

    private setupVertexPositionsPointer(gl, attribLocation) {
        gl.enableVertexAttribArray(attribLocation);
        gl.vertexAttribPointer(attribLocation, this.params.elementSize, gl.FLOAT, false, this.params.computeStrideInBytes(), 0);
    }

    private setupVertexNormalsPointer(gl, attribLocation) {
        if (!this.params.hasNormals) {
            throw new Error("buf has no normals");
        }
        if (attribLocation == -1) {
            return;
        }
        gl.enableVertexAttribArray(attribLocation);
        gl.vertexAttribPointer(attribLocation, this.params.normalsSize, gl.FLOAT, false, this.params.computeStrideInBytes(), this.params.computeNormalOffset());
    }

    private setupVertexUVPointer(gl, attribLocation) {
        if (!this.params.hasUVs) {
            throw new Error("buf has no UVs");
        }
        if (attribLocation == -1) {
            return;
        }
        gl.enableVertexAttribArray(attribLocation);
        gl.vertexAttribPointer(attribLocation, this.params.uvSize, gl.FLOAT, false, this.params.computeStrideInBytes(), this.params.computeUVOffset());
    }

    private parepareVAO(gl: WebGL2RenderingContext): WebGLVertexArrayObject {
        const arr = gl.createVertexArray();
        try {
            gl.bindVertexArray(arr);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

            const normals = this.params.hasNormals;
            const uv = this.params.hasUVs;

            this.setupVertexPositionsPointer(gl, ATTRIBUTE_POSITION_LOC);
            if (normals) {
                this.setupVertexNormalsPointer(gl, ATTRIBUTE_NORMALS_LOC);
            }
            if (uv) {
                this.setupVertexUVPointer(gl, ATTRIBUTE_UV_LOC);
            }
        } catch (e) {
            gl.deleteVertexArray(arr);
        }
        return arr;
    }
}
