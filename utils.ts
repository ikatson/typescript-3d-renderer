import { vec3 } from "./gl-matrix.js";
import { VertexShader } from "./shaders.js";
import { GLMesh } from "./mesh.js";
import { fetchObject, ObjParser } from "./objparser.js";
import { GLArrayBufferData, GLArrayBufferDataParams } from "./glArrayBuffer.js";

export const QuadVertices = new Float32Array([
    -1.0, 1.0,
    -1.0, -1.0,
    1.0, 1.0,
    1.0, -1.0,
]);

export const QuadArrayBufferData = (() => {
    const d = new GLArrayBufferData(
        QuadVertices, new GLArrayBufferDataParams(
            false, false, 4
        ));
    d.params.isStrip = true;
    return d;
})();

export const FULLSCREEN_QUAD_VS = `
precision highp float;

in vec2 a_pos;
out vec2 v_pos;
out vec2 tx_pos;

void main() {
    gl_Position = vec4(a_pos, 0., 1.);
    v_pos = a_pos;
    tx_pos = v_pos.xy / 2. + 0.5;
}
`

export class FullScreenQuad {
    buf: WebGLBuffer;
    vertexShader: VertexShader;

    constructor(gl: WebGLRenderingContext) {
        this.buf = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buf);
        gl.bufferData(gl.ARRAY_BUFFER, QuadVertices, gl.STATIC_DRAW);
        this.vertexShader = new VertexShader(gl, FULLSCREEN_QUAD_VS);
        // this object owns the shader, don't let others delete it recursively.
        this.vertexShader.setAutodelete(false);
    }

    bind(gl: WebGLRenderingContext, vertexPositionLocation: number) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buf)
        gl.enableVertexAttribArray(vertexPositionLocation);
        gl.vertexAttribPointer(vertexPositionLocation, 2, gl.FLOAT, false, 0, 0);
    }

    drawArrays(gl: WebGLRenderingContext) {
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
}

export function initGL(canvas: HTMLCanvasElement): WebGLRenderingContext {
    let gl = <WebGLRenderingContext>canvas.getContext("webgl2");
    gl.getExtension("EXT_color_buffer_float");

    glClearColorAndDepth(gl, 0.0, 0.0, 0.0, 1.0);
    return gl;
}

export function glClearColorAndDepth(gl: WebGLRenderingContext, a: number, b: number, c: number, d: number) {
    gl.clearColor(a, b, c, d);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

export const clip = (v: number, min: number, max: number): number => {
    if (v < min) {
        return min;
    }
    if (v > max) {
        return max;
    }
    return v;
};

export const clamp = clip;

export function lerp(v, a, b, c, d) {
    return c + v / (b - a) * (d - c);
}

export function randFloat(min, max) {
    const v = Math.random();
    return lerp(v, 0, 1, min, max);
}

export function randVec3(min: number, max: number): Float32Array | number[] {
    return vec3.fromValues(randFloat(min, max), randFloat(min, max), randFloat(min, max));
}

export function makeObjLoader(name: string) {
    let sphere: Promise<ObjParser> = null;
    return function loadObject() {
        if (sphere) {
            return sphere;
        }
        sphere = fetchObject(name);
        return sphere;
    }
}

export const loadSphere = makeObjLoader('resources/sphere.obj');
export const loadCube = makeObjLoader('resources/cube.obj');