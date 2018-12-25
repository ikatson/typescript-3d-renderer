import { ShaderProgram } from "./shaders.js";
import {AxisAlignedBox} from "./axisAlignedBox.js";
import {mat4, vec4} from "./gl-matrix.js";

const FLOAT_BYTES = 4;
const VEC3 = 3;
const VEC4 = 4;
const UV_SIZE = 2;


export enum ArrayBufferDataType {
    TRIANGLES = WebGLRenderingContext.TRIANGLES,
    LINES = WebGLRenderingContext.LINES,
    LINE_STRIP = WebGLRenderingContext.LINE_STRIP,
    POINTS = WebGLRenderingContext.POINTS,
    TRIANGLE_STRIP = WebGLRenderingContext.TRIANGLE_STRIP,
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

export const computeBoundingBox = (objects: DataOrBoundingBox[]): AxisAlignedBox => {
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
            compareAndSet(min, o.max, Math.max);
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

    intoGLArrayBuffer(gl: WebGLRenderingContext): GLArrayBuffer {
        return new GLArrayBuffer(gl, this);
    }

    translate(matrix: mat4): GLArrayBufferData {
        const result = [];
        const tmp = vec4.create();
        this.iterData((i: GLArrayBufferDataIterResult) => {
            let v = i.vertex;
            if (v.length != 4) {
                tmp[0] = v[0];
                tmp[1] = v[1];
                tmp[2] = v[2];
                tmp[3] = 1.;
                v = tmp;
            }
            vec4.transformMat4(tmp, v, matrix);
            result.push(...tmp);

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

    constructor(gl: WebGLRenderingContext, data: GLArrayBufferData, usage?: number, defaultRenderMode?: GLenum) {
        if (usage === undefined) {
            usage = gl.STATIC_DRAW;
        }
        this.buffer = gl.createBuffer();
        this.params = data.params;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data.buf, usage);
    }

    bind(gl: WebGLRenderingContext) {
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

    draw(gl: WebGLRenderingContext, renderMode?: number) {
        gl.drawArrays(renderMode || ArrayBufferDataTypeToGL(this.params.dataType), 0, this.params.vertexCount)
    }

    delete(gl: WebGLRenderingContext) {
        gl.deleteBuffer(this.buffer);
    }

    prepareMeshVertexAndShaderDataForRendering(gl: WebGLRenderingContext, program?: ShaderProgram, normals?: boolean, uv?: boolean) {
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
