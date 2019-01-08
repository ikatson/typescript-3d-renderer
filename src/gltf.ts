import {Scene} from "./scene";
import {quat, vec3, vec4} from "gl-matrix";
import {Texture} from "./texture";
import {Material} from "./material";
import {GlTf, MeshPrimitive} from "gltf-loader-ts/lib/gltf";
import {
    ArrayWebGLBufferWrapper,
    BufferView, computeBoundingBox,
    ElementArrayWebGLBufferWrapper,
    GLArrayBufferGLTF,
    GLArrayBufferI,
    GLTFAccessor,
} from "./glArrayBuffer";
import {GLTF} from "./gltf-enums";
import {BoundingBoxComponent, GameObject, GameObjectBuilder, MaterialComponent, MeshComponent} from "./object";
import {mapComputeIfAbsent} from "./utils";
import {AxisAlignedBox} from "./axisAlignedBox";

export function constructUrlBase(url: string) {
    const parts = url.split('/');
    if (parts.length === 1) { return './'; }
    parts.pop();
    return parts.join('/') + '/';
}

const m = () => new Map();
const white = vec3.fromValues(1, 1, 1);

export class GLTFLoader {
    private buffers: Map<number, Promise<Uint8Array>> = m();
    private bufferViewsIndices: Map<number, Promise<BufferView<ElementArrayWebGLBufferWrapper>>> = m();
    private bufferViewsArrays: Map<number, Promise<BufferView<ArrayWebGLBufferWrapper>>> = m();
    private images: Map<number, Promise<HTMLImageElement>> = m();
    private textures: Map<number, Texture> = m();
    private materials: Map<number, Material> = m();
    private accessorsIndices: Map<number, Promise<GLTFAccessor<ElementArrayWebGLBufferWrapper>>> = m();
    private accessorsArrays: Map<number, Promise<GLTFAccessor<ArrayWebGLBufferWrapper>>> = m();
    private readonly urlPrefix: string;
    private g: GlTf;
    private readonly gl: WebGL2RenderingContext;

    constructor(gl: WebGL2RenderingContext, g: GlTf, urlPrefix: string) {
        this.urlPrefix = urlPrefix;
        this.g = g;
        this.gl = gl;
    }

    async loadScene(id?: number): Promise<Scene> {
        if (id === undefined) {
            id = this.g.scene;
            if (id === undefined) {
                console.warn("Assuming the scene to load is 0 as it was not explicitly specified and GlTf has no default scene");
                id = 0;
            }
        }

        const scene = new Scene();
        this.g.scenes[id].nodes.forEach(nodeId => {
            scene.addChild(this.toGameObject(nodeId));
        });

        return scene;

    }

    private urlJoin = (suffix: string): string => {
        return this.urlPrefix + suffix;
    };

    private loadImage(id: number): Promise<HTMLImageElement> {
        return mapComputeIfAbsent(this.images, id, id => {
            const img = this.g.images[id];
            const uri = this.urlJoin(img.uri);
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = uri;
                img.crossOrigin = "anonymous";
                img.addEventListener('load', () => {
                    resolve(img);
                });
                img.addEventListener('error', e => {
                    console.log(`error loading image ${id}`);
                    reject(e);
                })
            });
        });
    };

    private loadBuffer = (id: number): Promise<Uint8Array> => {
        return mapComputeIfAbsent(this.buffers, id, async id => {
            const uri = this.urlJoin(this.g.buffers[id].uri);
            const response = await fetch(uri);
            if (response.status != 200) {
                throw new Error(`Unexpected response: ${response.status}`);
            }
            const buf =  await response.arrayBuffer();
            return new Uint8Array(buf);
        });
    };

    private loadBufferViewIndices = (id: number): Promise<BufferView<ElementArrayWebGLBufferWrapper>> => {
        return mapComputeIfAbsent(this.bufferViewsIndices, id, async id => {
            const bv = this.g.bufferViews[id];
            const buf = await this.loadBuffer(bv.buffer);
            const glbuf = new ElementArrayWebGLBufferWrapper(this.gl, buf.subarray(bv.byteOffset, bv.byteOffset + bv.byteLength));
            return new BufferView(glbuf, bv.byteLength);
        })
    };

    private loadBufferViewArray = (id: number): Promise<BufferView<ArrayWebGLBufferWrapper>> => {
        return mapComputeIfAbsent(this.bufferViewsArrays, id, async id => {
            const bv = this.g.bufferViews[id];
            const buf = await this.loadBuffer(bv.buffer);
            const glbuf = new ArrayWebGLBufferWrapper(this.gl, buf.subarray(bv.byteOffset, bv.byteOffset + bv.byteLength));
            return new BufferView(glbuf, bv.byteLength);
        })
    };

    private loadAccessorIndices = (id: number): Promise<GLTFAccessor<ElementArrayWebGLBufferWrapper>> => {
        if (id === null || id === undefined) {
            return Promise.resolve(undefined);
        }
        return mapComputeIfAbsent(this.accessorsIndices, id, async id => {
            const accessor = this.g.accessors[id];
            const bv = await this.loadBufferViewIndices(accessor.bufferView);
            return new GLTFAccessor<ElementArrayWebGLBufferWrapper>(accessor, bv);
        })
    };

    private loadAccessorArrays(id: number): Promise<GLTFAccessor<ArrayWebGLBufferWrapper>> {
        if (id === null || id === undefined) {
            return Promise.resolve(undefined);
        }
        return mapComputeIfAbsent(this.accessorsArrays, id, async id => {
            const accessor = this.g.accessors[id];
            const bv = await this.loadBufferViewArray(accessor.bufferView);
            return new GLTFAccessor<ArrayWebGLBufferWrapper>(accessor, bv);
        })
    };

    private loadTexture(id: number): Texture {
        return mapComputeIfAbsent(this.textures, id, () => {
            const t = this.g.textures[id];
            const img = this.loadImage(t.source);
            return new Texture(this.gl, img, white);
        });
    };

    private loadMaterial(id: number): Material {
        return mapComputeIfAbsent(this.materials, id, id => {
            const nm = new Material();
            const m = this.g.materials[id];

            const mr = m.pbrMetallicRoughness;

            // albedo
            if (mr.baseColorFactor) {
                if (mr.baseColorTexture) {
                    // @ts-ignore
                    nm.albedo.setFactor(vec4.fromValues(...mr.baseColorFactor))
                } else {
                    vec4.copy(nm.albedo.value, mr.baseColorFactor);
                }
            }
            if (mr.baseColorTexture) {
                nm.albedo.setTexture(this.loadTexture(mr.baseColorTexture.index));
            }

            // metallic
            if (mr.metallicFactor) {
                if (mr.metallicRoughnessTexture) {
                    nm.metallic.factor = mr.metallicFactor;
                } else {
                    nm.metallic.value = mr.metallicFactor;
                }
            }
            if (mr.metallicRoughnessTexture) {
                nm.metallic.texture = this.loadTexture(mr.metallicRoughnessTexture.index);
            }

            // roughness
            if (mr.roughnessFactor) {
                if (mr.metallicRoughnessTexture) {
                    nm.roughness.factor = mr.roughnessFactor;
                } else {
                    nm.roughness.value = mr.roughnessFactor;
                }
            }
            if (mr.metallicRoughnessTexture) {
                nm.roughness.texture = this.loadTexture(mr.metallicRoughnessTexture.index);
            }
            if (m.normalTexture) {
                nm.setNormalMap(this.loadTexture(m.normalTexture.index));
            }
            return nm;
        })
    };

    private loadPrimitive(p: MeshPrimitive): Promise<GLArrayBufferI> {
        if (p.mode !== undefined && p.mode != GLTF.TRIANGLES) {
            throw new Error(`Not trianges: ${p.mode}`);
        }
        return Promise.all([
            this.loadAccessorIndices(p.indices),
            this.loadAccessorArrays(p.attributes.POSITION),
            this.loadAccessorArrays(p.attributes.TEXCOORD_0),
            this.loadAccessorArrays(p.attributes.NORMAL),
            this.loadAccessorArrays(p.attributes.TANGENT)
        ]).then(([indices, pos, uv, normal, tangent]) => {
            return new GLArrayBufferGLTF(
                indices, pos, uv, normal, tangent
            );
        });
    }

    private toGameObject(nodeId: number): GameObject {
        const node = this.g.nodes[nodeId];
        const gameObject = new GameObject(node.name || nodeId.toString());
        if (node.scale) {
            vec3.copy(gameObject.transform.scale, node.scale);
        }
        if (node.translation) {
            vec3.copy(gameObject.transform.position, node.translation);
        }
        if (node.rotation) {
            // @ts-ignore
            quat.getAxisAngle(gameObject.transform.rotation, quat.fromValues(...node.rotation));
        }
        gameObject.transform.update();

        if (node.mesh !== undefined) {
            const mesh = this.g.meshes[node.mesh];
            let bb = new AxisAlignedBox().setMin([0, 0, 0]).setMax([0, 0, 0]);

            mesh.primitives.forEach((p, pi) => {
                this.loadPrimitive(p).then(buf => {
                    const posAccessor = this.g.accessors[p.attributes.POSITION];
                    const primitiveBB = new AxisAlignedBox().setMin(posAccessor.min).setMax(posAccessor.max);
                    const primitiveGameObject = new GameObjectBuilder(`mesh ${node.mesh}, primitive ${pi}`)
                        .setMeshComponent(new MeshComponent(buf))
                        .setBoundingBoxComponent(
                            new BoundingBoxComponent(primitiveBB)
                        )
                        .setMaterialComponent(
                            new MaterialComponent(this.loadMaterial(p.material))
                        ).build();
                    bb = computeBoundingBox([bb, primitiveBB], false, bb);
                    gameObject.addChild(primitiveGameObject);
                });
            });
            gameObject.boundingBox = new BoundingBoxComponent(bb);
        }
        if (node.children) {
            node.children.forEach(nodeId => {
                const child = this.toGameObject(nodeId);
                gameObject.addChild(child);
            })
        }
        return gameObject;
    }
}

export async function fetchGLTF(gltfFilename: string): Promise<GlTf> {
    const response = await fetch(gltfFilename);
    if (!response.ok) {
        throw new Error(`Error loading gltf from ${gltfFilename}: ${response.statusText}`);
    }
    return response.json();
}

export async function newGLTFLoader(gl: WebGL2RenderingContext, gltfFilename: string): Promise<GLTFLoader> {
    const g = await fetchGLTF(gltfFilename);
    return new GLTFLoader(gl, g, constructUrlBase(gltfFilename));
}

export async function loadSceneFromGLTF(gl: WebGL2RenderingContext, gltfFilename: string): Promise<Scene> {
    const loader = await newGLTFLoader(gl, gltfFilename);
    return loader.loadScene();
}
