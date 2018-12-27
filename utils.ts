import {mat4, vec3, vec4} from "./gl-matrix.js";
import {VertexShader} from "./shaders.js";
import {fetchObject, ObjParser} from "./objparser.js";
import {
    ArrayBufferDataType,
    computeBoundingBox,
    GLArrayBuffer,
    GLArrayBufferData,
    GLArrayBufferDataIterResult,
    GLArrayBufferDataParams
} from "./glArrayBuffer.js";
import {Camera, ProjectionMatrix} from "./camera.js";
import {AxisAlignedBox} from "./axisAlignedBox.js";
import {Scene} from "./scene.js";
import {DirectionalLight, GameObject, LightComponent} from "./object.js";
import {object} from "prop-types";

export const QuadVertices = new Float32Array([
    -1.0, 1.0,
    -1.0, -1.0,
    1.0, 1.0,
    1.0, -1.0,
]);

export const QuadArrayBufferData = (() => {
    const params = new GLArrayBufferDataParams(
        false, false, 4, ArrayBufferDataType.TRIANGLE_STRIP
    );
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

    draw(gl: WebGLRenderingContext) {
        this.glArrayBuffer.draw(gl);
    }
}

export function initGL(canvas: HTMLCanvasElement): WebGLRenderingContext {
    let gl = <WebGLRenderingContext>canvas.getContext("webgl2", {antialias: false, stencil: true});
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

export const tmpMat4 = mat4.create();
export const tmpVec3: number[] = vec3.create();
export const tmpVec4 = vec4.create();
export const tmpIdentityMatrix = (function () {
    const m = mat4.create();
    return () => {
        mat4.identity(m);
        return m;
    }
})();


export const makeWorldSpaceCameraFrustum = (camera: Camera, pointsOnly: boolean = false): GLArrayBufferData => {
    const camToWorld = camera.getCameraToWorld();
    let cubeVertices: GLArrayBufferData;
    if (pointsOnly){
        cubeVertices = new AxisAlignedBox().asVerticesBuffer();
    } else {
        cubeVertices = new AxisAlignedBox().asWireFrameBuffer();
    }

    mat4.invert(tmpMat4, camera.projectionMatrix().matrix);

    const data = [];

    cubeVertices.iterData((i: GLArrayBufferDataIterResult) => {
        let v = i.vertex;
        if (v.length != 4) {
            v = [...v, 1.];
        }
        vec4.transformMat4(v, v, tmpMat4);
        vec4.scale(v, v, 1. / v[3]);
        vec4.transformMat4(v, v, camToWorld);

        data.push(...v.slice(0, cubeVertices.params.elementSize));
    });

    return new GLArrayBufferData(new Float32Array(data), cubeVertices.params);
};

export const makeDirectionalLightWorldToCameraMatrix = (direction: number[] | Float32Array): any => {
    // A new "camera" IS NOT needed here, but we only need the world to camera matrix from it.
    let tempCamera = new Camera();
    tempCamera.forward = direction;
    tempCamera.calculateUpFromWorldUp();
    tempCamera.update();
    return tempCamera.getWorldToCamera();
};

export const getLightDirection = (outVec: any, l: LightComponent): any => {
    vec3.scale(outVec, l.object.transform.position, -1);
    vec3.normalize(outVec, outVec);
    return outVec;
};

export const myOrtho = (out, left, right, bottom, top, near, far) => {
    const fn = 1. / (far - near);
    const tb = 1. / (top - bottom);
    const rl = 1. / (right - left);
    mat4.set(out,
        2* rl, 0, 0, 0,
        0, 2 * tb, 0, 0,
        0, 0, -2 * fn, 0,
        -(right + left) * rl, -(bottom + top) * tb, (far + near) * fn, 1,
    );
};

export const computeDirectionalLightCameraWorldToProjectionMatrix = (light: DirectionalLight, camera: Camera, scene: Scene): ProjectionMatrix => {
    const worldToLightViewSpace = makeDirectionalLightWorldToCameraMatrix(light.direction);

    // TODO: we ONLY need to render objects that are intersecting the camera frustum
    // leaving that for another day.
    // Also we need to LIMIT the resulting bounding box to camera frustum.
    // makeWorldSpaceCameraFrustum(cameraClone, true)

    const lightViewSpaceBoundingBoxes: AxisAlignedBox[] = [];

    scene.children.forEach(o => {
        const bboxForObjInLightScreenSpace = (o: GameObject) => {
            o.children.forEach(c => {
                bboxForObjInLightScreenSpace(c);
            });

            if (!(o.mesh && o.mesh.shadowCaster && o.boundingBox)) {
                return;
            }

            lightViewSpaceBoundingBoxes.push(
                o.boundingBox.box.asVerticesBuffer()
                    .translate(o.transform.getModelToWorld())
                    .translate(worldToLightViewSpace)
                    .computeBoundingBox()
            );
        };

        bboxForObjInLightScreenSpace(o);
    });

    const bb = computeBoundingBox(lightViewSpaceBoundingBoxes);
    const lightClipSpaceMatrix = tmpMat4;
    const result = mat4.create();

    let left, right, bottom, top, near, far: number;
    const [x, y, z] = [0, 1, 2];

    left = bb.min[x];
    right = bb.max[x];

    bottom = bb.min[y];
    top = bb.max[y];

    // note Z is reversed here
    near = bb.min[z];
    far = bb.max[z];

    myOrtho(lightClipSpaceMatrix, left, right, bottom, top, near, far);
    mat4.multiply(result, lightClipSpaceMatrix, worldToLightViewSpace);

    return new ProjectionMatrix(near, far, result);
};


export function hexToRgb1(out: number[], hex: string) {
    const bigint = parseInt(hex.slice(1, hex.length), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    out[0] = r / 256;
    out[1] = g / 256;
    out[2] = b / 256;
    return out;
}

export function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
