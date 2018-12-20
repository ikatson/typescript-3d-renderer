export class GLArrayBufferDataParams {
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
        return 4 * (4 + (this.hasNormals ? 4 : 0) + (this.hasUVs ? 2 : 0));
    }
    computeNormalOffset() {
        return 4 * 4;
    }
    computeUVOffset() {
        return 4 * 4 + (this.hasNormals ? 4 * 4 : 0);
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
        gl.vertexAttribPointer(attribLocation, 4, gl.FLOAT, false, this.params.computeStride(), 0);
    }
    setupVertexNormalsPointer(gl, attribLocation) {
        if (!this.params.hasNormals) {
            throw new Error("buf has no normals");
        }
        gl.enableVertexAttribArray(attribLocation);
        gl.vertexAttribPointer(attribLocation, 4, gl.FLOAT, false, this.params.computeStride(), this.params.computeNormalOffset());
    }
    setupVertexUVPointer(gl, attribLocation) {
        if (!this.params.hasUVs) {
            throw new Error("buf has no UVs");
        }
        gl.enableVertexAttribArray(attribLocation);
        gl.vertexAttribPointer(attribLocation, 2, gl.FLOAT, false, this.params.computeStride(), this.params.computeUVOffset());
    }

    draw(gl: WebGLRenderingContext) {
        gl.drawArrays(this.params.isStrip ? gl.TRIANGLE_STRIP : gl.TRIANGLES, 0, this.params.vertexCount)
    }

    delete(gl: WebGLRenderingContext) {
        gl.deleteBuffer(this.buffer);
    }
}