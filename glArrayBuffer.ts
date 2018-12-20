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
    computeStride() {
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

export class GLArrayBufferData {
    buf: Float32Array;
    params: GLArrayBufferDataParams;
    constructor(buf: Float32Array, params: GLArrayBufferDataParams) {
        this.buf = buf;
        this.params = params;
    }
}

export class GLArrayBuffer {
    buffer: WebGLBuffer;
    params: GLArrayBufferDataParams;
    constructor(gl: WebGLRenderingContext, data: GLArrayBufferData, usage?: number) {
        if (usage === undefined) {
            usage = gl.STATIC_DRAW;
        }
        this.buffer = gl.createBuffer()
        this.params = data.params;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data.buf, usage);
    }

    bind(gl: WebGLRenderingContext) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    }

    setupVertexPositionsPointer(gl, attribLocation) {
        gl.enableVertexAttribArray(attribLocation);
        gl.vertexAttribPointer(attribLocation, this.params.elementSize, gl.FLOAT, false, this.params.computeStride(), 0);
    }
    setupVertexNormalsPointer(gl, attribLocation) {
        if (!this.params.hasNormals) {
            throw new Error("buf has no normals");
        }
        gl.enableVertexAttribArray(attribLocation);
        gl.vertexAttribPointer(attribLocation, this.params.normalsSize, gl.FLOAT, false, this.params.computeStride(), this.params.computeNormalOffset());
    }
    setupVertexUVPointer(gl, attribLocation) {
        if (!this.params.hasUVs) {
            throw new Error("buf has no UVs");
        }
        gl.enableVertexAttribArray(attribLocation);
        gl.vertexAttribPointer(attribLocation, this.params.uvSize, gl.FLOAT, false, this.params.computeStride(), this.params.computeUVOffset());
    }

    draw(gl: WebGLRenderingContext) {
        gl.drawArrays(this.params.isStrip ? gl.TRIANGLE_STRIP : gl.TRIANGLES, 0, this.params.vertexCount)
    }

    delete(gl: WebGLRenderingContext) {
        gl.deleteBuffer(this.buffer);
    }
}