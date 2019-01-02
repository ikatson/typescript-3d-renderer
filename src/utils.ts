import {mat4, vec3, vec4} from "gl-matrix";
import {VertexShader} from "./shaders";
import {fetchObject, ObjParser} from "./objparser";
import {
    ArrayBufferDataType,
    computeBoundingBox,
    GLArrayBuffer,
    GLArrayBufferData,
    GLArrayBufferDataIterResult,
    GLArrayBufferDataParams
} from "./glArrayBuffer";
import {Camera, ProjectionMatrix} from "./camera";
import {AxisAlignedBox} from "./axisAlignedBox";
import {Scene} from "./scene";
import {DirectionalLight, GameObject} from "./object";
// import {GltfLoader} from "../node_modules/gltf-loader-ts/dist/gltf-loader.js";
import {GltfLoader} from "gltf-loader-ts";
import {Texture} from "./texture";
import {Material} from "./material";
import {MeshPrimitive} from "gltf-loader-ts/lib/gltf";
import {GLTF} from "./gltf-enums";

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

    constructor(gl: WebGL2RenderingContext, quadBuffer: GLArrayBuffer) {
        this.glArrayBuffer = quadBuffer;
        this.vertexShader = new VertexShader(gl, FULLSCREEN_QUAD_VS);
        // this object owns the shader, don't let others delete it recursively.
        this.vertexShader.setAutodelete(false);
    }

    bind(gl: WebGL2RenderingContext, vertexPositionLocation: number) {
        this.glArrayBuffer.bind(gl);
        this.glArrayBuffer.setupVertexPositionsPointer(gl, vertexPositionLocation);
    }

    draw(gl: WebGL2RenderingContext) {
        this.glArrayBuffer.draw(gl);
    }
}

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

    cubeVertices.iterData((i: GLArrayBufferDataIterResult) => {
        const v = tmpVec4;

        if (i.vertex.length != 4) {
            vec4.copy(v, [...i.vertex, 1.]);
        } else {
            vec4.copy(v, <vec4> i.vertex);
        }

        vec4.transformMat4(v, v, tmpMat4);
        vec4.scale(v, v, 1. / v[3]);
        vec4.transformMat4(v, v, camToWorld);

        data.push(...v.slice(0, cubeVertices.params.elementSize));
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


export function hexToRgb1(out: vec3, hex: string): vec3 {
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

export function mapComputeIfAbsent<K, V>(m: Map<K, V>, key: K, callback: (K) => V): V {
    if (m.has(key)) {
        return m.get(key);
    }
    const v = callback(key);
    m.set(key, v);
    return v;
}

export async function loadSceneFromGLTF(gl: WebGL2RenderingContext, filename: string): Promise<Scene> {
    const loader = new GltfLoader();
    const scene = new Scene();

    let asset = await loader.load(filename);
    let g = asset.gltf;

    const images = new Map();
    const textures = new Map();
    const materials = new Map();
    const white = vec3.fromValues(1, 1, 1);

    const loadImage = (id: number): Promise<HTMLImageElement> => {
        return mapComputeIfAbsent(images, id, (id) => {
            console.log('loading image with id ', id);
            return asset.imageData.get(id);
        });

    };

    const loadTexture = (id: number): Texture => {
        return mapComputeIfAbsent(textures, id, () => {
            const t = g.textures[id];
            const img = loadImage(t.source);
            return new Texture(gl, img, white);
        });
    };

    const loadMaterial = (id: number) => {
        return mapComputeIfAbsent(materials, id, () => {
            const nm = new Material();
            const m = g.materials[id];

            if (m.pbrMetallicRoughness.baseColorFactor) {
                vec3.copy(nm.albedo.value, m.pbrMetallicRoughness.baseColorFactor);
            }
            if (m.pbrMetallicRoughness.baseColorTexture) {
                nm.albedo.setTexture(loadTexture(m.pbrMetallicRoughness.baseColorTexture.index));
            }
            if (m.pbrMetallicRoughness.metallicFactor) {
                nm.metallic.value = m.pbrMetallicRoughness.metallicFactor;
            }
            if (m.pbrMetallicRoughness.metallicRoughnessTexture) {
                nm.metallic.texture = loadTexture(m.pbrMetallicRoughness.metallicRoughnessTexture.index);
            }
            if (m.pbrMetallicRoughness.roughnessFactor) {
                nm.roughness.value = m.pbrMetallicRoughness.roughnessFactor;
            }
            if (m.pbrMetallicRoughness.metallicRoughnessTexture) {
                nm.roughness.texture = loadTexture(m.pbrMetallicRoughness.metallicRoughnessTexture.index);
            }
            if (m.normalTexture) {
                nm.setNormalMap(loadTexture(m.normalTexture.index));
            }
            return nm;
        })
    };

    const loadPrimitive = (p: MeshPrimitive): Promise<GLArrayBufferData> => {
        return new Promise((resolve, reject) => {
            if (p.mode != GLTF.TRIANGLES) {
                throw new Error(`Not trianges: ${p.mode}`);
            }

            Promise.all([
                asset.accessorData(p.indices),
                asset.accessorData(p.attributes.POSITION),
                asset.accessorData(p.attributes.TEXCOORD_0),
                asset.accessorData(p.attributes.NORMAL),
                asset.accessorData(p.attributes.TANGENT)
            ]).then(([indices, positionUint, uvUint, normalUint, tangentUint]) => {
                const pos = new Float32Array(positionUint.buffer);
                const uv = new Float32Array(uvUint.buffer);
                const normal = new Float32Array(normalUint.buffer);
                const tangent = new Float32Array(tangentUint.buffer);
            })
        });
    };

    g.scenes[g.scene].nodes.forEach(nodeId => {
        const node = g.nodes[nodeId];
        const go = new GameObject(node.name || nodeId.toString());
        if (node.scale) {
            vec3.copy(go.transform.scale, node.scale);
        }

        if (node.mesh !== undefined) {
            const mesh = g.meshes[node.mesh];
            const allPrimitives = [];
            mesh.primitives.forEach(p => {
                const pgo = new GameObject("");
                const accessor = g.accessors[p.indices];
                p.material
            })
        }
    });

    return scene;
}
