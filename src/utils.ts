import {mat4, vec3, vec4} from "gl-matrix";
import {fetchObject, ObjParser} from "./objparser";
import {computeBoundingBox, GLArrayBufferData} from "./glArrayBuffer";
import {Camera, ProjectionMatrix} from "./camera";
import {AxisAlignedBox} from "./axisAlignedBox";
import {Scene} from "./scene";
import {DirectionalLight, GameObject} from "./object";

export function initGL(canvas: HTMLCanvasElement): WebGL2RenderingContext {
    let gl = <WebGL2RenderingContext>canvas.getContext("webgl2");
    gl.getExtension("EXT_color_buffer_float");

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    return gl;
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

export function randVec3(min: number, max: number): vec3 {
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
export const tmpVec3 = vec3.create();
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

    cubeVertices.iterData((vs: number, ve: number) => {
        const v = tmpVec4;
        const l = ve - vs;

        if (l != 4) {
            // @ts-ignore
            vec4.copy(v, ...cubeVertices.buf.subarray(vs, ve), 1.);
        } else {
            // @ts-ignore
            vec4.copy(v, ...cubeVertices.buf.subarray(vs, ve));
        }

        vec4.transformMat4(v, v, tmpMat4);
        vec4.scale(v, v, 1. / v[3]);
        vec4.transformMat4(v, v, camToWorld);

        data.push(...v.subarray(0, cubeVertices.params.elementSize));
    });

    return new GLArrayBufferData(new Float32Array(data), cubeVertices.params);
};

export const makeDirectionalLightWorldToCameraMatrix = (direction: vec3): any => {
    // A new "camera" IS NOT needed here, but we only need the world to camera matrix from it.
    let tempCamera = new Camera();
    tempCamera.forward = direction;
    tempCamera.calculateUpFromWorldUp();
    tempCamera.update();
    return tempCamera.getWorldToCamera();
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

    const tmpBoundingBoxVerticesBuf = new Float32Array(8 * 3);
    const tmpBoundingBox = new AxisAlignedBox();
    const tmpVec1 = new Array(1);
    let allObjLSBoundingBox: AxisAlignedBox = null;

    scene.children.forEach((o, i) => {
        const bboxForObjInLightScreenSpace = (o: GameObject) => {
            o.children.forEach(c => {
                bboxForObjInLightScreenSpace(c);
            });

            if (!(o.mesh && o.mesh.shadowCaster && o.boundingBox)) {
                return;
            }

            mat4.mul(tmpMat4, worldToLightViewSpace, o.transform.getModelToWorld());

            const objLSBoundingBox = o.boundingBox.box.asVerticesBuffer(true)
                .translateTo(tmpMat4, tmpBoundingBoxVerticesBuf)
                .computeBoundingBox(tmpBoundingBox);

            if (allObjLSBoundingBox === null) {
                allObjLSBoundingBox = new AxisAlignedBox();
                allObjLSBoundingBox.setMin(objLSBoundingBox.min);
                allObjLSBoundingBox.setMax(objLSBoundingBox.max);
            } else {
                tmpVec1[0] = objLSBoundingBox;
                allObjLSBoundingBox = computeBoundingBox(tmpVec1, false, allObjLSBoundingBox, allObjLSBoundingBox);
            }
        };

        bboxForObjInLightScreenSpace(o);
    });

    if (allObjLSBoundingBox === null) {
        allObjLSBoundingBox = tmpBoundingBox;
    }

    const lightClipSpaceMatrix = tmpMat4;
    const result = mat4.create();

    const [x, y, z] = [0, 1, 2];

    const left = allObjLSBoundingBox.min[x];
    const right = allObjLSBoundingBox.max[x];

    const bottom = allObjLSBoundingBox.min[y];
    const top = allObjLSBoundingBox.max[y];

    // note Z is reversed here
    const near = allObjLSBoundingBox.min[z];
    const far = allObjLSBoundingBox.max[z];

    myOrtho(lightClipSpaceMatrix, left, right, bottom, top, near, far);
    mat4.multiply(result, lightClipSpaceMatrix, worldToLightViewSpace);

    return new ProjectionMatrix(near, far, result);
};


export function hexToRgb1(out: vec4, hex: string): vec4 {
    const bigint = parseInt(hex.slice(1, hex.length), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    out[0] = r / 256;
    out[1] = g / 256;
    out[2] = b / 256;
    out[3] = 1.;
    return out;
}

export function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function mapComputeIfAbsent<K, V>(m: Map<K, V>, key: K, callback: (K) => V): V {
    if (m.has(key)) {
        return m.get(key);
    }
    const v = callback(key);
    m.set(key, v);
    return v;
}

