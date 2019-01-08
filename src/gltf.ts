import {Scene} from "./scene";
import {vec3, vec4, quat} from "gl-matrix";
import {Texture} from "./texture";
import {Material} from "./material";
import {GlTf, MeshPrimitive} from "gltf-loader-ts/lib/gltf";
import {
    ArrayWebGLBufferWrapper,
    BufferView,
    ElementArrayWebGLBufferWrapper,
    GLArrayBufferGLTF,
    GLArrayBufferI,
    GLTFAccessor
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

export async function loadSceneFromGLTF(gl: WebGL2RenderingContext, gltfFilename: string): Promise<Scene> {
    const scene = new Scene();

    let g: GlTf = await fetch(gltfFilename).then(response => {
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return <Promise<GlTf>> response.json();
    });

    const buffers = new Map();
    const bufferViewsIndices = new Map();
    const bufferViewsArrays = new Map();
    const images = new Map();
    const textures = new Map();
    const materials = new Map();
    const accessorsIndices = new Map();
    const accessorsArrays = new Map();
    const white = vec3.fromValues(1, 1, 1);

    const urlPrefix = constructUrlBase(gltfFilename);

    const urlJoin = (suffix: string): string => {
        return urlPrefix + suffix;
    };

    const loadImage = (id: number): Promise<HTMLImageElement> => {
        return mapComputeIfAbsent(images, id, (id) => {
            // console.log(`loading image ${id}`);
            const img = g.images[id];
            const uri = urlJoin(img.uri);
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

    async function loadBufferAsync(id: number): Promise<Uint8Array> {
        const uri = urlJoin(g.buffers[id].uri);
        const response = await fetch(uri);
        if (response.status != 200) {
            throw new Error(`Unexpected response: ${response.status}`);
        }
        const buf =  await response.arrayBuffer();
        return new Uint8Array(buf);
    }

    const loadBuffer = (id: number): Promise<Uint8Array> => {
        return mapComputeIfAbsent(buffers, id, id => {
            return loadBufferAsync(id);
        });
    };

    const loadBufferViewIndices = (id: number): Promise<BufferView<ElementArrayWebGLBufferWrapper>> => {
        return mapComputeIfAbsent(bufferViewsIndices, id, id => {
            const bv = g.bufferViews[id];
            return loadBuffer(bv.buffer).then(buf => {
                const glbuf = new ElementArrayWebGLBufferWrapper(gl, buf.subarray(bv.byteOffset, bv.byteOffset + bv.byteLength));
                return new BufferView(glbuf, bv.byteLength);
            })
        })
    };

    const loadBufferViewArray = (id: number): Promise<BufferView<ArrayWebGLBufferWrapper>> => {
        return mapComputeIfAbsent(bufferViewsArrays, id, id => {
            const bv = g.bufferViews[id];
            return loadBuffer(bv.buffer).then(buf => {
                const glbuf = new ArrayWebGLBufferWrapper(gl, buf.subarray(bv.byteOffset, bv.byteOffset + bv.byteLength));
                return new BufferView(glbuf, bv.byteLength);
            })
        })
    };

    const loadAccessorIndices = (id: number): Promise<GLTFAccessor<ElementArrayWebGLBufferWrapper>> => {
        return mapComputeIfAbsent(accessorsIndices, id, id => {
            const accessor = g.accessors[id];
            return loadBufferViewIndices(accessor.bufferView).then(bv => {
                return new GLTFAccessor<ElementArrayWebGLBufferWrapper>(accessor, bv);
            });
        })
    };

    const loadAccessorArrays = (id: number): Promise<GLTFAccessor<ArrayWebGLBufferWrapper>> => {
        if (id === null || id === undefined) {
            return Promise.resolve(undefined);
        }
        return mapComputeIfAbsent(accessorsArrays, id, id => {
            const accessor = g.accessors[id];
            return loadBufferViewArray(accessor.bufferView).then(bv => {
                return new GLTFAccessor<ArrayWebGLBufferWrapper>(accessor, bv);
            });
        })
    };

    const loadTexture = (id: number): Texture => {
        return mapComputeIfAbsent(textures, id, () => {
            const t = g.textures[id];
            const img = loadImage(t.source);
            return new Texture(gl, img, white);
        });
    };

    const loadMaterial = (id: number): Material => {
        return mapComputeIfAbsent(materials, id, () => {
            const nm = new Material();
            const m = g.materials[id];

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
                nm.albedo.setTexture(loadTexture(mr.baseColorTexture.index));
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
                nm.metallic.texture = loadTexture(mr.metallicRoughnessTexture.index);
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
                nm.roughness.texture = loadTexture(mr.metallicRoughnessTexture.index);
            }
            if (m.normalTexture) {
                nm.setNormalMap(loadTexture(m.normalTexture.index));
            }
            return nm;
        })
    };

    async function loadPrimitive(p: MeshPrimitive): Promise<GLArrayBufferI> {
        if (p.mode !== undefined && p.mode != GLTF.TRIANGLES) {
            throw new Error(`Not trianges: ${p.mode}`);
        }
        return await Promise.all([
            loadAccessorIndices(p.indices),
            loadAccessorArrays(p.attributes.POSITION),
            loadAccessorArrays(p.attributes.TEXCOORD_0),
            loadAccessorArrays(p.attributes.NORMAL),
            loadAccessorArrays(p.attributes.TANGENT)
        ]).then(([indices, pos, uv, normal, tangent]) => {
            return new GLArrayBufferGLTF(
                indices, pos, uv, normal, tangent
            );
        });
    }

    const toGameObject = (nodeId: number): GameObject => {
        const node = g.nodes[nodeId];
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
            const mesh = g.meshes[node.mesh];
            mesh.primitives.forEach((p, pi) => {
                loadPrimitive(p).then(buf => {
                    const posAccessor = g.accessors[p.attributes.POSITION];
                    const primitiveGameObject = new GameObjectBuilder(`mesh ${node.mesh}, primitive ${pi}`)
                        .setMeshComponent(new MeshComponent(buf))
                        .setBoundingBoxComponent(
                            new BoundingBoxComponent(new AxisAlignedBox().setMin(posAccessor.min).setMax(posAccessor.max))
                        )
                        .setMaterialComponent(
                            new MaterialComponent(loadMaterial(p.material))
                        ).build();

                    gameObject.addChild(primitiveGameObject);
                });
            })
        }
        if (node.children) {
            node.children.forEach(nodeId => {
                const child = toGameObject(nodeId);
                gameObject.addChild(child);
            })
        }
        return gameObject;
    }

    g.scenes[g.scene].nodes.forEach(nodeId => {
        scene.addChild(toGameObject(nodeId));
    });

    return scene;
}
