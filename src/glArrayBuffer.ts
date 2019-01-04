import {ShaderProgram} from "./shaders";
import {AxisAlignedBox} from "./axisAlignedBox";
import {mat4, vec3, vec4} from "gl-matrix";
import {Accessor} from "gltf-loader-ts/lib/gltf";
import {GLTF} from "./gltf-enums";
import {ATTRIBUTE_NORMALS, ATTRIBUTE_POSITION, ATTRIBUTE_TANGENT, ATTRIBUTE_UV} from "./constants";
import {tmpVec3} from "./utils";

const FLOAT_BYTES = 4;
const VEC3 = 3;
const VEC4 = 4;
const UV_SIZE = 2;

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

export const computeBoundingBox = (objects: DataOrBoundingBox[], invertZ: boolean = false): AxisAlignedBox => {
    const b = new AxisAlignedBox();
    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];
    const compareAndSet = (out: number[] | Float32Array, inp: number[] | Float32Array, f: (v: number, v1: number) => (number)) => {
        for (let i = 0; i < out.length; i++) {
            out[i] = f(out[i], inp[i]);
        }
    };

    objects.forEach(o => {
        if (o instanceof GLArrayBufferData) {
            o.iterData((vs: number, ve: number) => {
                const vertexView = o.buf.subarray(vs, ve);
                compareAndSet(min, vertexView, Math.min);
                compareAndSet(max, vertexView, Math.max);
            });
        } else if (o instanceof AxisAlignedBox) {
            compareAndSet(min, o.min, Math.min);
            compareAndSet(max, o.max, Math.max);
        }
    });

    b.setMin(min);
    b.setMax(max);

    return b;
};

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
        const result = new Float32Array(this.buf.length);
        this.iterData((vs: number, ve: number, ns: number, ne: number, us: number, ue: number) => {
            let l = ve - vs;
            let transform = vec4.transformMat4;
            if (l === 3) {
                tmpVec3[0] = this.buf[vs];
                tmpVec3[1] = this.buf[vs + 1];
                tmpVec3[2] = this.buf[vs + 2];
                vec3.transformMat4(tmpVec3, tmpVec3, matrix);
                result.set(tmpVec3, vs);
            } else {
                tmpVec4[0] = this.buf[vs];
                tmpVec4[1] = this.buf[vs + 1];
                tmpVec4[2] = this.buf[vs + 2];
                tmpVec4[3] = this.buf[vs + 3];
                vec4.transformMat4(tmpVec4, tmpVec4, matrix);
                result.set(tmpVec4, vs);
            }

            // TODO: translate normals. this just copies normals and uvs back
            result.set(this.buf.subarray(ns, ue), ns);
        });
        return new GLArrayBufferData(new Float32Array(result), this.params);
    }

    computeBoundingBox(): AxisAlignedBox {
        return computeBoundingBox([this]);
    }

    iterData(callback: (vs: number, ve: number, ns: number, ne: number, us: number, ue: number) => void) {
        const stride = this.params.computeStrideInElements();
        for (let i = 0; i < this.params.vertexCount; i++) {
            const offset = i * stride;
            const noffset = offset + this.params.elementSize;
            const uvoffset = this.params.hasNormals ? noffset + this.params.normalsSize : noffset;

            callback(
                offset, offset + this.params.elementSize,
                noffset, this.params.hasNormals ? noffset + this.params.normalsSize : noffset,
                uvoffset, this.params.hasUVs ? uvoffset + this.params.uvSize : uvoffset,
            );
        }
    };
}

export interface GLArrayBufferI {
    buffer: WebGLBuffer;

    hasNormals(): boolean;
    hasUV(): boolean;
    hasTangent(): boolean;

    setupVertexPositionsPointer(gl, attribLocation): void;
    setupVertexNormalsPointer(gl, attribLocation): void;
    setupVertexUVPointer(gl, attribLocation): void;
    setupTangentPointer(gl: WebGL2RenderingContext, attribLocation: number);

    draw(gl: WebGL2RenderingContext, renderMode?: number): void;
    delete(gl: WebGL2RenderingContext): void;
    prepareMeshVertexAndShaderDataForRendering(gl: WebGL2RenderingContext, program?: ShaderProgram, normals?: boolean, uv?: boolean, tangent?: boolean): void;
}


export class ArrayWebGLBufferWrapper implements WebGLBufferI {
    buf(): WebGLBuffer {
        return this._buf;
    }
    private _buf: WebGLBuffer;
    constructor(gl: WebGL2RenderingContext, data: ArrayBuffer) {
        this._buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this._buf);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
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
    get byteLength(): number {
        return this._byteLength;
    }
    get byteOffset(): number {
        return this._byteOffset;
    }
    get byteStride(): number {
        return this._byteStride;
    }
    private _byteLength: number;
    private _byteOffset: number;
    private _byteStride: number;
    get buf(): T {
        return this._buf;
    }
    private _buf: T;
    constructor(buf: T, byteLength: number, byteOffset: number = 0, byteStride: number = 0) {
        this._buf = buf;
        this._byteLength = byteLength;
        this._byteOffset = byteOffset;
        this._byteStride = byteStride;
    }
}

export class GLTFAccessor<T extends WebGLBufferI> {
    get data(): BufferView<T> {
        return this._data;
    }
    get accessor(): Accessor {
        return this._accessor;
    }
    private _accessor: Accessor;
    private _data: BufferView<T>;
    constructor(accessor: Accessor, data: BufferView<T>) {
        this._accessor = accessor;
        this._data = data;
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
    buffer: WebGLBuffer;
    private indices: GLTFAccessor<ElementArrayWebGLBufferWrapper>;
    private position: GLTFAccessor<ArrayWebGLBufferWrapper>;
    private uv: GLTFAccessor<ArrayWebGLBufferWrapper>;
    private normal: GLTFAccessor<ArrayWebGLBufferWrapper>;
    private tangent: GLTFAccessor<ArrayWebGLBufferWrapper>;

    constructor(
        indices: GLTFAccessor<ElementArrayWebGLBufferWrapper>,
        position: GLTFAccessor<ArrayWebGLBufferWrapper>,
        uv: GLTFAccessor<ArrayWebGLBufferWrapper>,
        normal: GLTFAccessor<ArrayWebGLBufferWrapper>,
        tangent: GLTFAccessor<ArrayWebGLBufferWrapper>,
    ) {
        this.indices = indices;
        this.position = position;
        this.uv = uv;
        this.normal = normal;
        this.tangent = tangent;
    }

    delete(gl: WebGL2RenderingContext): void {
        console.log('delete called on GLArrayBufferGLTF, not sure what to do')
    }

    draw(gl: WebGL2RenderingContext, renderMode?: number): void {
        if (this.indices) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices.webGlBuf);
            gl.drawElements(
                gl.TRIANGLES,
                this.indices.accessor.count,
                this.indices.componentTypeToGlType(),
                this.indices.accessor.byteOffset
            );
        }
    }

    prepareMeshVertexAndShaderDataForRendering(gl: WebGL2RenderingContext, program?: ShaderProgram, normals?: boolean, uv?: boolean, tangent?: boolean): void {
        program.use(gl);

        if (normals === undefined) {
            normals = !!this.normal;
        }

        if (uv === undefined) {
            uv = !!this.uv;
        }

        if (tangent === undefined) {
            tangent = !!this.tangent;
        }

        this.setupVertexPositionsPointer(gl, program.getAttribLocation(gl, ATTRIBUTE_POSITION));
        if (normals) {
            this.setupVertexNormalsPointer(gl, program.getAttribLocation(gl, ATTRIBUTE_NORMALS));
        }
        if (uv) {
            this.setupVertexUVPointer(gl, program.getAttribLocation(gl, ATTRIBUTE_UV));
        }
        if (tangent) {
            this.setupTangentPointer(gl, program.getAttribLocation(gl, ATTRIBUTE_TANGENT));
        }
    }

    setupVertexNormalsPointer(gl, attribLocation): void {
        this.normal.setupVertexPointer(gl, attribLocation);
    }

    setupVertexPositionsPointer(gl, attribLocation): void {
        this.position.setupVertexPointer(gl, attribLocation);
    }

    setupVertexUVPointer(gl, attribLocation): void {
        this.uv.setupVertexPointer(gl, attribLocation);
    }

    setupTangentPointer(gl: WebGL2RenderingContext, attribLocation: number) {
        this.tangent.setupVertexPointer(gl, attribLocation);
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
}

export class GLArrayBufferV1 implements GLArrayBufferI {
    buffer: WebGLBuffer;
    params: GLArrayBufferDataParams;
    /**
     * @deprecated
     */
    // REMOVE_ME_DATA: GLArrayBufferData;

    constructor(gl: WebGL2RenderingContext, data: GLArrayBufferData, usage?: number) {
        if (usage === undefined) {
            usage = gl.STATIC_DRAW;
        }
        this.buffer = gl.createBuffer();
        this.params = data.params;
        // this.REMOVE_ME_DATA = data;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data.buf, usage);
    }

    bind(gl: WebGL2RenderingContext) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    }

    setupVertexPositionsPointer(gl, attribLocation) {
        this.bind(gl);
        gl.enableVertexAttribArray(attribLocation);
        gl.vertexAttribPointer(attribLocation, this.params.elementSize, gl.FLOAT, false, this.params.computeStrideInBytes(), 0);
    }

    setupVertexNormalsPointer(gl, attribLocation) {
        if (!this.params.hasNormals) {
            throw new Error("buf has no normals");
        }
        if (attribLocation == -1) {
            return;
        }
        this.bind(gl);
        gl.enableVertexAttribArray(attribLocation);
        gl.vertexAttribPointer(attribLocation, this.params.normalsSize, gl.FLOAT, false, this.params.computeStrideInBytes(), this.params.computeNormalOffset());
    }

    setupVertexUVPointer(gl, attribLocation) {
        if (!this.params.hasUVs) {
            throw new Error("buf has no UVs");
        }
        if (attribLocation == -1) {
            return;
        }
        this.bind(gl);
        gl.enableVertexAttribArray(attribLocation);
        gl.vertexAttribPointer(attribLocation, this.params.uvSize, gl.FLOAT, false, this.params.computeStrideInBytes(), this.params.computeUVOffset());
    }

    draw(gl: WebGL2RenderingContext, renderMode?: number) {
        gl.drawArrays(renderMode || ArrayBufferDataTypeToGL(this.params.dataType), 0, this.params.vertexCount)
    }

    delete(gl: WebGL2RenderingContext) {
        gl.deleteBuffer(this.buffer);
    }

    prepareMeshVertexAndShaderDataForRendering(gl: WebGL2RenderingContext, program?: ShaderProgram, normals?: boolean, uv?: boolean) {
        program.use(gl);
        this.bind(gl);

        if (normals === undefined) {
            normals = this.params.hasNormals
        }

        if (uv === undefined) {
            uv = this.params.hasUVs;
        }

        this.setupVertexPositionsPointer(gl, program.getAttribLocation(gl, ATTRIBUTE_POSITION));
        if (normals) {
            this.setupVertexNormalsPointer(gl, program.getAttribLocation(gl, ATTRIBUTE_NORMALS));
        }
        if (uv) {
            this.setupVertexUVPointer(gl, program.getAttribLocation(gl, ATTRIBUTE_UV));
        }
    }

    setupTangentPointer(gl: WebGL2RenderingContext, attribLocation: number) {
        throw new Error("not implemented");
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
}
