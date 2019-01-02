import {Scene} from "./scene";
import {GltfLoader} from "gltf-loader-ts";
import {vec3} from "gl-matrix";
import {Texture} from "./texture";
import {Material} from "./material";
import {MeshPrimitive} from "gltf-loader-ts/lib/gltf";
import {
    ArrayWebGLBufferWrapper,
    BufferView,
    ElementArrayWebGLBufferWrapper,
    GLArrayBufferGLTF,
    GLArrayBufferI,
    GLTFAccessor
} from "./glArrayBuffer";
import {GLTF} from "./gltf-enums";
import {GameObject, GameObjectBuilder, MaterialComponent, MeshComponent} from "./object";
import {mapComputeIfAbsent} from "./utils";

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

    const loadMaterial = (id: number): Material => {
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

    async function loadPrimitive(p: MeshPrimitive): Promise<GLArrayBufferI> {
        if (p.mode != GLTF.TRIANGLES) {
            throw new Error(`Not trianges: ${p.mode}`);
        }
        return await Promise.all([
            asset.accessorData(p.indices),
            asset.accessorData(p.attributes.POSITION),
            asset.accessorData(p.attributes.TEXCOORD_0),
            asset.accessorData(p.attributes.NORMAL),
            // asset.accessorData(p.attributes.TANGENT)
        ]).then(([indices, positionUint, uvUint, normalUint]) => {
            const nb = (d: Uint8Array) => {
                return new BufferView(
                    new ArrayWebGLBufferWrapper(
                        gl, d,
                    ),
                    d.length
                );
            };
            const indicesB = new GLTFAccessor(
                g.accessors[p.indices],
                new BufferView(new ElementArrayWebGLBufferWrapper(gl, indices), indices.length)
            );

            const pos = new GLTFAccessor(g.accessors[p.attributes.POSITION], nb(positionUint));
            const uv = new GLTFAccessor(g.accessors[p.attributes.TEXCOORD_0], nb(uvUint));
            const normal = new GLTFAccessor(g.accessors[p.attributes.NORMAL], nb(normalUint));
            // const tangent = new GLTFAccessor(g.accessors[p.attributes.TANGENT], nb(positionUint));

            return new GLArrayBufferGLTF(
                indicesB, pos, uv, normal, null
            );
        });
    }

    await asset.preFetchAll();
    console.log('fetched everything');

    g.scenes[g.scene].nodes.forEach(nodeId => {
        const node = g.nodes[nodeId];
        const gameObject = new GameObject(node.name || nodeId.toString());
        if (node.scale) {
            vec3.copy(gameObject.transform.scale, node.scale);
        }

        if (node.mesh !== undefined) {
            const mesh = g.meshes[node.mesh];
            mesh.primitives.forEach((p, pi) => {
                loadPrimitive(p).then(buf => {
                    const primitiveGameObject = new GameObjectBuilder(`mesh ${node.mesh}, primitive ${pi}`)
                        .setMeshComponent(new MeshComponent(buf))
                        .setMaterialComponent(
                            new MaterialComponent(loadMaterial(p.material))
                        ).build();

                    gameObject.addChild(primitiveGameObject);
                });
            })
        }
        scene.addChild(gameObject);
    });

    return scene;
}
