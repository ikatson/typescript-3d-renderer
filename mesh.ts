import { ObjParser } from "./objparser.js";
import { GLArrayBufferData, GLArrayBuffer } from "./glArrayBuffer.js";

export function GLMeshFromObjParser(gl: WebGLRenderingContext, parser: ObjParser) {
    return new GLMesh(
        gl, 
        new GLArrayBuffer(gl, parser.getArrayBuffer())
    );
}

export class GLMesh {
    private buf: WebGLBuffer;
    private glArrayBuffer: GLArrayBuffer
    constructor(gl: WebGLRenderingContext, glArrayBuffer: GLArrayBuffer) {
        this.glArrayBuffer = glArrayBuffer;
    }

    getBuf() {
        return this.glArrayBuffer.buffer;
    }

    getVertexCount() {
        return this.glArrayBuffer.params.vertexCount;
    }

    setupVertexPositionsPointer(gl: WebGLRenderingContext, attribLocation: number) {
        return this.glArrayBuffer.setupVertexPositionsPointer(gl, attribLocation);
    }

    setupVertexNormalsPointer(gl: WebGLRenderingContext, attribLocation: number) {
        return this.glArrayBuffer.setupVertexNormalsPointer(gl, attribLocation);
    }

    setupVertexUVPointer(gl: WebGLRenderingContext, attribLocation: number) {
        return this.glArrayBuffer.setupVertexUVPointer(gl, attribLocation);
    }
}