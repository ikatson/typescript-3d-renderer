import {mat4, vec3, vec4} from "gl-matrix";
import {fetchObject, ObjParser} from "./objparser";
import {computeBoundingBox, GLArrayBufferData, tmpIter} from "./glArrayBuffer";
import {Camera, ProjectionMatrix} from "./camera";
import {AxisAlignedBox} from "./axisAlignedBox";
import {Scene} from "./scene";
import {DirectionalLight, GameObject} from "./object";

export function initGL(canvas: HTMLCanvasElement): WebGL2RenderingContext {
    let gl = <WebGL2RenderingContext>canvas.getContext("webgl2", {
        antialias: false,
    });
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

export function cacheOnFirstUse<T>(factory: () => T): () => T {
    let obj: T = null;
    return (): T => {
        if (obj === null) {
            obj = factory();
        }
        return obj;
    };
}

export function makeCache<T>(factory: () => T): (index: number) => T {
    let cache: T[] = new Array(1);
    return (index: number): T => {
        if (cache[index] === undefined) {
            cache[index] = factory();
        }
        return cache[index];
    };
}

export const loadSphere = makeObjLoader('resources/sphere.obj');
export const loadCube = makeObjLoader('resources/cube.obj');

export const tmpMat4 = mat4.create();
export const tmpVec3 = vec3.create();
export const tmpVec4 = vec4.create();
export const tmpBoundingBoxCache = makeCache(() => new AxisAlignedBox());
export const tmpIdentityMatrix = (function () {
    const m = mat4.create();
    return () => {
        mat4.identity(m);
        return m;
    }
})();


export const makeWorldSpaceCameraFrustum = (() => {
    const identityAABB = cacheOnFirstUse(() => new AxisAlignedBox());
    const identityAABBVertexBuffer = cacheOnFirstUse(() => new Float32Array(8 * 3));
    const identityAABBWireframeBuffer = cacheOnFirstUse(() => new Float32Array(24 * 3));

    return (camera: Camera, pointsOnly: boolean = false, isTemporary: boolean = true): GLArrayBufferData => {
        const camToWorld = camera.getCameraToWorld();
        let cubeVertices: GLArrayBufferData;
        if (pointsOnly) {
            cubeVertices = identityAABB().asVerticesBuffer();
        } else {
            cubeVertices = identityAABB().asWireFrameBuffer();
        }

        mat4.invert(tmpMat4, camera.projectionMatrix().matrix);

        let data: Float32Array;
        if (isTemporary) {
            if (pointsOnly) {
                data = identityAABBVertexBuffer();
            } else {
                data = identityAABBWireframeBuffer();
            }
        } else {
            if (pointsOnly) {
                data = new Float32Array(8 * 3);
            } else {
                data = new Float32Array(24 * 3);
            }
        }

        for (const it of cubeVertices.iterator(tmpIter)) {
            const v = tmpVec4;
            const l = it.ve - it.vs;
            if (l != 3) {
                throw new Error('unsupported length of cubeVertices, should be 3');
            }

            v[0] = cubeVertices.buf[it.vs];
            v[1] = cubeVertices.buf[it.vs + 1];
            v[2] = cubeVertices.buf[it.vs + 2];
            v[3] = 1;

            vec4.transformMat4(v, v, tmpMat4);
            vec4.scale(v, v, 1. / v[3]);
            vec4.transformMat4(v, v, camToWorld);

            data[it.vs] = v[0];
            data[it.vs + 1] = v[1];
            data[it.vs + 2] = v[2];
        }

        return new GLArrayBufferData(data, cubeVertices.params);
    };
})();

export const makeDirectionalLightWorldToCameraMatrix = (() => {
    const tmpCamera = new Camera();
    return (direction: vec3): any => {
        // A new "camera" IS NOT needed here, but we only need the world to camera matrix from it.
        tmpCamera.forward = direction;
        tmpCamera.calculateUpFromWorldUp();
        tmpCamera.update();
        return tmpCamera.getWorldToCamera();
    }
})();

export const orthoProjection = (out, left, right, bottom, top, near, far) => {
    const fn = 1. / (far - near);
    const tb = 1. / (top - bottom);
    const rl = 1. / (right - left);
    mat4.set(out,
        2 * rl, 0, 0, 0,
        0, 2 * tb, 0, 0,
        0, 0, -2 * fn, 0,
        -(right + left) * rl, -(bottom + top) * tb, (far + near) * fn, 1,
    );
};

export const computeBoundingBoxInTransformedSpace = (() => {
    const tmpBoundingBoxVerticesBuf = cacheOnFirstUse(() => new AxisAlignedBox().asVerticesBuffer());
    const tmpVec1 = new Array(1);
    const tmpVec3_2 = vec3.create();
    const bb = makeCache(() => new AxisAlignedBox());

    return (scene: Scene, transform: mat4, objFilter: (o: GameObject) => boolean = null, target: AxisAlignedBox = null, includePointLights: boolean = false): AxisAlignedBox => {
        let allBB: AxisAlignedBox = null;
        objFilter = objFilter || (_ => true);

        const bboxForChildInTransformedSpace = (o: GameObject) => {
            // only process children's bounding boxes if the current object does not have a bounding box computed
            // from children.
            if (!o.boundingBoxComponent || !o.boundingBoxComponent.computedFromChildren) {
                o.children.forEach(bboxForChildInTransformedSpace);
            }

            if (!(o.boundingBoxComponent && objFilter(o))) {
                return;
            }

            mat4.mul(tmpMat4, transform, o.transform.getModelToWorld());

            const objLSBoundingBox = o.boundingBoxComponent.box.asVerticesBuffer(true)
                .translateTo(tmpMat4, tmpBoundingBoxVerticesBuf())
                .computeBoundingBox(bb(0));

            if (allBB === null) {
                allBB = target || bb(1);
                allBB.setMin(objLSBoundingBox.min);
                allBB.setMax(objLSBoundingBox.max);
            } else {
                tmpVec1[0] = objLSBoundingBox;
                allBB = computeBoundingBox(tmpVec1, false, allBB, allBB);
            }
        };

        scene.children.forEach(bboxForChildInTransformedSpace);

        // this is inefficient and incorrect, but works around artifacts with point lights.
        if (allBB && includePointLights) {
            scene.pointLights.forEach(l => {
                vec3.transformMat4(tmpVec3, l.object.transform.position, transform);
                const b = bb(0);
                const offset = l.radius + 0.1;
                b.setMin(vec3.set(tmpVec3_2, tmpVec3[0] - offset, tmpVec3[1] - offset, tmpVec3[2] - offset));
                b.setMax(vec3.set(tmpVec3_2, tmpVec3[0] + offset, tmpVec3[1] + offset, tmpVec3[2] + offset));

                tmpVec1[0] = b;
                allBB = computeBoundingBox(tmpVec1, false, allBB, allBB);
            });
        }

        if (allBB === null) {
            allBB = target || bb(1);
        }
        return allBB;
    };
})();

export const optimizeNearFar = (
    camera: Camera, scene: Scene,
    minNear: number = 0.1, minFar: number = 1.,
    objFilter: (o: GameObject) => boolean = null
): Camera => {
    const bb = computeBoundingBoxInTransformedSpace(
        scene, camera.getWorldToCamera(), objFilter, tmpBoundingBoxCache(0), true
    );
    camera.near = Math.max(minNear, -bb.max[2]);
    camera.far = Math.max(minFar, -bb.min[2]);
    camera.update();
    return camera;
};

export const tmpProjectionMatrix = new ProjectionMatrix(0, 1, mat4.create());
export const computeDirectionalLightCameraWorldToProjectionMatrix = (() => {
    const bb = tmpBoundingBoxCache;

    return (light: DirectionalLight, camera: Camera, scene: Scene, out?: ProjectionMatrix): ProjectionMatrix => {
        const worldToLightViewSpace = makeDirectionalLightWorldToCameraMatrix(light.direction);
        out = out || new ProjectionMatrix(0, 1, mat4.create());

        let cameraFrustumBB = makeWorldSpaceCameraFrustum(
            camera,
            true, true
        )
            .translateInPlace(worldToLightViewSpace)
            .computeBoundingBox(bb(0));

        let allBB = computeBoundingBoxInTransformedSpace(
            scene, worldToLightViewSpace, o => o.mesh ? o.mesh.shadowCaster : true, bb(2)
        );

        if (allBB === null) {
            allBB = bb(2);
        }

        const lightClipSpaceMatrix = tmpMat4;

        const x = 0;
        const y = 1;
        const z = 2;

        const left = Math.max(allBB.min[x], cameraFrustumBB.min[x]);
        const right = Math.min(allBB.max[x], cameraFrustumBB.max[x]);

        const bottom = Math.max(allBB.min[y], cameraFrustumBB.min[y]);
        const top = Math.min(allBB.max[y], cameraFrustumBB.max[y]);

        // note Z is reversed here
        const near = allBB.min[z];
        const far = allBB.max[z];

        orthoProjection(lightClipSpaceMatrix, left, right, bottom, top, near, far);
        mat4.multiply(out.matrix, lightClipSpaceMatrix, worldToLightViewSpace);
        out.near = near;
        out.far = far;
        return out;
    };
})();


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
