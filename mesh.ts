import { ObjParser } from "./objparser.js";
import { GLArrayBuffer } from "./glArrayBuffer.js";

export function GLMeshFromObjParser(gl: WebGLRenderingContext, parser: ObjParser) {
    return new GLMesh(gl, parser.getArrayBuffer());
}

export class GLMesh {
    private buf: WebGLBuffer;
    bufParams: import("/Users/igor/projects/webgl-play/glArrayBuffer").GLArrayBufferParams;

    constructor(gl: WebGLRenderingContext, glArrayBuffer: GLArrayBuffer) {
        this.buf = gl.createBuffer();
        this.bufParams = glArrayBuffer.params;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buf);
        gl.bufferData(gl.ARRAY_BUFFER, glArrayBuffer.buf, gl.STATIC_DRAW);
    }

    getBuf() {
        return this.buf;
    }

    getVertexCount() {
        return this.bufParams.vertexCount;
    }

    setupVertexPositionsPointer(gl: WebGLRenderingContext, attribLocation: number) {
        gl.enableVertexAttribArray(attribLocation);
        gl.vertexAttribPointer(attribLocation, 4, gl.FLOAT, false, this.bufParams.computeStride(), 0);
    }

    setupVertexNormalsPointer(gl: WebGLRenderingContext, attribLocation: number) {
        if (!this.bufParams.hasNormals) {
            throw new Error("buf has no normals")
        }
        gl.enableVertexAttribArray(attribLocation);
        gl.vertexAttribPointer(attribLocation, 4, gl.FLOAT, false, this.bufParams.computeStride(), this.bufParams.computeNormalOffset());
    }

    setupVertexUVPointer(gl: WebGLRenderingContext, attribLocation: number) {
        if (!this.bufParams.hasUVs) {
            throw new Error("buf has no UVs")
        }
        gl.enableVertexAttribArray(attribLocation);
        gl.vertexAttribPointer(attribLocation, 2, gl.FLOAT, false, this.bufParams.computeStride(), this.bufParams.computeUVOffset());
    }
}