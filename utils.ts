import { vec3, mat4, vec4 } from "./gl-matrix.js";
import { VertexShader } from "./shaders.js";
import { fetchObject, ObjParser } from "./objparser.js";
import {
    GLArrayBufferData,
    GLArrayBufferDataParams,
    GLArrayBuffer,
    GLArrayBufferDataIterResult
} from "./glArrayBuffer.js";
import {Camera} from "./camera.js";
import {Box} from "./box.js";

export const QuadVertices = new Float32Array([
    -1.0, 1.0,
    -1.0, -1.0,
    1.0, 1.0,
    1.0, -1.0,
]);

export const QuadArrayBufferData = (() => {
    const params = new GLArrayBufferDataParams(
        false, false, 4
    );
    params.isStrip = true;
    params.elementSize = 2;
    return new GLArrayBufferData(QuadVertices, params);
})();

export const FULLSCREEN_QUAD_VS = `
precision highp float;

in vec2 a_pos;
out vec2 v_pos;
out vec2 tx_pos;

void main() {
    gl_Position = vec4(a_pos, 0., 1.);
    v_pos = a_pos;
    tx_pos = v_pos.xy * 0.5 + 0.5;
}
`

export class FullScreenQuad {
    private glArrayBuffer: GLArrayBuffer;
    vertexShader: VertexShader;

    constructor(gl: WebGLRenderingContext, quadBuffer: GLArrayBuffer) {
        this.glArrayBuffer = quadBuffer;
        this.vertexShader = new VertexShader(gl, FULLSCREEN_QUAD_VS);
        // this object owns the shader, don't let others delete it recursively.
        this.vertexShader.setAutodelete(false);
    }

    bind(gl: WebGLRenderingContext, vertexPositionLocation: number) {
        this.glArrayBuffer.bind(gl);
        this.glArrayBuffer.setupVertexPositionsPointer(gl, vertexPositionLocation);
    }

    drawArrays(gl: WebGLRenderingContext) {
        this.glArrayBuffer.draw(gl);
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

export const tmpMatrix = (function () {
    const m = mat4.create();
    return () => {
        mat4.identity(m);
        return m;
    }
})();

export const makeFrustum = (camera: Camera): GLArrayBufferData => {
    const tmp = tmpMatrix();
    const camToWorld = camera.getCameraToWorld();
    const cubeVertices = new Box().asWireFrameBuffer();

    mat4.invert(tmp, camera.projectionMatrix());

    const data = [];

    cubeVertices.iterData((i: GLArrayBufferDataIterResult) => {
        const v = i.vertex;
        vec4.transformMat4(v, v, tmp);
        vec4.scale(v, v, 1. / v[3]);
        vec4.transformMat4(v, v, camToWorld);

        data.push(...v);
    });

    return new GLArrayBufferData(new Float32Array(data), cubeVertices.params);
};


export const makeCameraThatBoundsAnotherOne = (camera: Camera, position: number[], cubeVertices: GLArrayBufferData): Camera => {
    const tmp = tmpMatrix();
    mat4.invert(tmp, camera.projectionMatrix());

    // debugger;
    cubeVertices.iterData((i: GLArrayBufferDataIterResult) => {
        const v = i.vertex;
        const n = i.normal;
        vec4.transformMat4(v, v, tmp);
        vec4.transformMat4(n, n, tmp);
        vec4.scale(v, v, 1. / v[3]);
    });

    const result = new Camera(1.);
    return result;
};
