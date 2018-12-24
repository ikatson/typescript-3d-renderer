import { ShaderProgram } from "./shaders.js";
import {Box} from "./box.js";

const FLOAT_BYTES = 4;
const VEC3 = 3;
const VEC4 = 4;
const UV_SIZE = 2;

export class GLArrayBufferDataParams {
    // how many floats per element
    elementSize: number = VEC4;
    normalsSize: number = VEC4;
    uvSize: number = UV_SIZE;

    hasNormals: boolean;
    hasUVs: boolean;
    vertexCount: number;
    isStrip = false;

    constructor(hasNormals: boolean, hasUVs: boolean, vertexCount: number) {
        this.hasNormals = hasNormals;
        this.hasUVs = hasUVs;
        this.vertexCount = vertexCount;
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

export class GLArrayBufferData {
    buf: Float32Array;
    params: GLArrayBufferDataParams;
    constructor(buf: Float32Array, params: GLArrayBufferDataParams) {
        this.buf = buf;
        this.params = params;
    }

    computeBoundingBox(): Box {
        const b = new Box();
        const min = [Infinity, Infinity, Infinity];
        const max = [-Infinity, -Infinity, -Infinity];

        // TODO: how to write (number, number) => number???
        const compareAndSet = (out: number[], inp: number[], f: (v: number, v1: number) => (number)) => {
            for (let i = 0; i < out.length; i++) {
                out[i] = f(out[i], inp[i]);
            }
        };

        this.iterData((v: GLArrayBufferDataIterResult) => {
            compareAndSet(min, v.vertex, Math.min);
            compareAndSet(max, v.vertex, Math.max);
        });

        b.min = min;
        b.max = max;

        return b;
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
            })
        }
    };
}

export class GLArrayBuffer {
    buffer: WebGLBuffer;
    params: GLArrayBufferDataParams;
    constructor(gl: WebGLRenderingContext, data: GLArrayBufferData, usage?: number) {
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
        gl.enableVertexAttribArray(attribLocation);
        gl.vertexAttribPointer(attribLocation, this.params.normalsSize, gl.FLOAT, false, this.params.computeStrideInBytes(), this.params.computeNormalOffset());
    }
    setupVertexUVPointer(gl, attribLocation) {
        if (!this.params.hasUVs) {
            throw new Error("buf has no UVs");
        }
        gl.enableVertexAttribArray(attribLocation);
        gl.vertexAttribPointer(attribLocation, this.params.uvSize, gl.FLOAT, false, this.params.computeStrideInBytes(), this.params.computeUVOffset());
    }

    draw(gl: WebGLRenderingContext) {
        gl.drawArrays(this.params.isStrip ? gl.TRIANGLE_STRIP : gl.TRIANGLES, 0, this.params.vertexCount)
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
