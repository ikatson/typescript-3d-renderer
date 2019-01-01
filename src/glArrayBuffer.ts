import {ShaderProgram} from "./shaders";
import {AxisAlignedBox} from "./axisAlignedBox";
import {mat4, vec3, vec4} from "gl-matrix";

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

export type GLArrayBufferDataIterResult = {
    vertex: Float32Array,
    normal: Float32Array,
    uv: Float32Array,
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
            o.iterData((v: GLArrayBufferDataIterResult) => {
                compareAndSet(min, v.vertex, Math.min);
                compareAndSet(max, v.vertex, Math.max);
            });
        } else if (o instanceof AxisAlignedBox) {
            compareAndSet(min, o.min, Math.min);
            compareAndSet(max, o.max, Math.max);
        }
    });

    b.min = min;
    b.max = max;

    return b;
};

export class GLArrayBufferData {
    buf: Float32Array;
    params: GLArrayBufferDataParams;
    constructor(buf: Float32Array, params: GLArrayBufferDataParams) {
        this.buf = buf;
        this.params = params;
    }

    intoGLArrayBuffer(gl: WebGL2RenderingContext): GLArrayBuffer {
        return new GLArrayBuffer(gl, this);
    }

    translate(matrix: mat4): GLArrayBufferData {
        const result = [];
        this.iterData((i: GLArrayBufferDataIterResult) => {
            let v = i.vertex;
            let l = v.length;
            let transform = vec4.transformMat4;
            if (l === 3) {
                // @ts-ignore
                transform = vec3.transformMat4;
            }
            // @ts-ignore
            transform(tmpVec4, v, matrix);
            result.push(...tmpVec4.slice(0, l));

            // TODO: translate normal
            result.push(...i.normal);
            result.push(...i.uv);
        });
        return new GLArrayBufferData(new Float32Array(result), this.params);
    }

    computeBoundingBox(): AxisAlignedBox {
        return computeBoundingBox([this]);
    }

    iterData(callback: (GLArrayBufferDataIterResult) => void) {
        const stride = this.params.computeStrideInElements();
        for (let i = 0; i < this.params.vertexCount; i++) {
            const offset = i * stride;
            const noffset = offset + this.params.elementSize;
            const uvoffset = this.params.hasNormals ? noffset + this.params.normalsSize : noffset;

            callback({
                vertex: this.buf.slice(offset, offset + this.params.elementSize),
                normal: this.buf.slice(noffset, this.params.hasNormals ? noffset + this.params.normalsSize : noffset),
                uv: this.buf.slice(uvoffset, this.params.hasUVs ? uvoffset + this.params.uvSize : uvoffset),
            });
        }
    };
}

export class GLArrayBuffer {
    buffer: WebGLBuffer;
    params: GLArrayBufferDataParams;
    /**
     * @deprecated
     */
    // REMOVE_ME_DATA: GLArrayBufferData;

    constructor(gl: WebGL2RenderingContext, data: GLArrayBufferData, usage?: number, defaultRenderMode?: GLenum) {
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

        this.setupVertexPositionsPointer(gl, program.getAttribLocation(gl, "a_pos"));
        if (normals) {
            this.setupVertexNormalsPointer(gl, program.getAttribLocation(gl, "a_norm"));
        }
        if (uv) {
            this.setupVertexUVPointer(gl, program.getAttribLocation(gl, "a_uv"));
        }
    }
}
