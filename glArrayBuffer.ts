export class GLArrayBufferDataParams {
    hasNormals: boolean;
    hasUVs: boolean;
    vertexCount: number;
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