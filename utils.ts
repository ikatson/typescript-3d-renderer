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
import {GameObject, LightComponent} from "./object.js";

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

export const tmpVec3 = vec3.create();

export const makeWorldSpaceCameraFrustum = (camera: Camera, pointsOnly: boolean = false): GLArrayBufferData => {
    const tmp = tmpMatrix();
    const camToWorld = camera.getCameraToWorld();
    let cubeVertices: GLArrayBufferData;
    if (pointsOnly){
        cubeVertices = new AxisAlignedBox().asVerticesBuffer();
    } else {
        cubeVertices = new AxisAlignedBox().asWireFrameBuffer();
    }

    mat4.invert(tmp, camera.projectionMatrix().matrix);

    const data = [];

    cubeVertices.iterData((i: GLArrayBufferDataIterResult) => {
        let v = i.vertex;
        if (v.length != 4) {
            v = [...v, 1.];
        }
        vec4.transformMat4(v, v, tmp);
        vec4.scale(v, v, 1. / v[3]);
        vec4.transformMat4(v, v, camToWorld);

        data.push(...v.slice(0, cubeVertices.params.elementSize));
    });

    return new GLArrayBufferData(new Float32Array(data), cubeVertices.params);
};

export const makeDirectionalLightWorldToCameraMatrix = (direction: number[]): any => {
    // A new "camera" IS NOT needed here, but we only need the world to camera matrix from it.
    let tempCamera = new Camera(1.);
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

export const computeDirectionalLightCameraWorldToProjectionMatrix = (light: LightComponent, camera: Camera, scene: Scene): ProjectionMatrix => {
    const wtc = makeDirectionalLightWorldToCameraMatrix(getLightDirection(tmpVec3, light));
    const cameraClone = camera.clone();
    // cameraClone.far /= 5.;

    const worldSpaceBoundingBoxes = [
        makeWorldSpaceCameraFrustum(cameraClone, true)
            .translate(wtc)
            .computeBoundingBox()
    ];

    scene.children.forEach(o => {
        const bboxForObj = (o: GameObject) => {
            o.children.forEach(c => {
                bboxForObj(c);
            });

            if (!(o.mesh && o.mesh.shadowCaster && o.boundingBox)) {
                return;
            }

            worldSpaceBoundingBoxes.push(
                o.boundingBox.box.asVerticesBuffer()
                    .translate(o.transform.getModelToWorld())
                    .translate(wtc)
                    .computeBoundingBox()
            );
        };

        bboxForObj(o);
    });

    debugger;

    const bb = computeBoundingBox(worldSpaceBoundingBoxes);
    const resultMatrix = mat4.create();

    let left, right, bottom, top, near, far: number;
    const [x, y, z] = [0, 1, 2];

    left = bb.min[x];
    right = bb.max[x];

    bottom = bb.min[y];
    top = bb.max[y];

    near = bb.min[z];
    far = bb.max[z];

    mat4.ortho(resultMatrix, left, right, bottom, top, near, far);

    mat4.multiply(resultMatrix, resultMatrix, wtc);

    return new ProjectionMatrix(near, far, resultMatrix);
};
