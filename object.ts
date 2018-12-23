import {GLMesh} from "./mesh";
import {mat4, vec3} from "./gl-matrix.js"
import {ShaderProgram} from "./shaders";

export abstract class Component {
    object: GameObject = null;
}

export class MeshComponent extends Component {
    mesh: GLMesh;
    object: GameObject = null;
    shadowCaster: boolean = true;
    shadowReceiver: boolean = true;

    constructor(mesh: GLMesh) {
        super();
        this.mesh = mesh;
    }

    prepareMeshVertexAndShaderDataForRendering(gl: WebGLRenderingContext, program?: ShaderProgram, normals?: boolean, uv?: boolean) {
        this.mesh.glArrayBuffer.prepareMeshVertexAndShaderDataForRendering(gl, program, normals, uv);
    }
}

export class LightComponent extends Component {
    diffuse: number[] | Float32Array = [1., 1., 1.];
    specular: number[] | Float32Array = [1., 1., 1.];
    ambient: number[] | Float32Array = [0., 0., 0.];
    intensity: number = 1.;
    radius: number = 1.;
    attenuation: number = 0.2;
}

export class TransformComponent extends Component {
    position: number[] | Float32Array | vec3;
    rotation: number[] | Float32Array | vec3;
    scale: number[] | Float32Array | vec3;
    object: GameObject;

    private modelToWorld = mat4.create();
    private modelToParent = mat4.create();

    constructor(object: GameObject) {
        super();
        this.object = object;
        this.position = [0, 0, 0];
        this.rotation = [0, 0, 0];
        this.scale = [1, 1, 1];
        this.computeModelToParent();
        this.computeModelToWorld();
    }

    getModelToWorld() {
        return this.modelToWorld;
    }

    getModelToParent() {
        return this.modelToParent;
    }

    computeModelToWorld() {
        mat4.copy(this.modelToWorld, this.getModelToParent());
        const mw = this.modelToWorld;
        let parent = this.object.parent;
        while (parent) {
            mat4.multiply(mw, parent.transform.getModelToParent(), mw);
            parent = parent.parent;
        }
        return mw;
    }

    computeModelToParent(): any {
        mat4.identity(this.modelToParent);
        const modelToParent = this.modelToParent;

        mat4.translate(modelToParent, modelToParent, this.position);
        mat4.scale(modelToParent, modelToParent, this.scale);
        mat4.rotateX(modelToParent, modelToParent, this.rotation[0]);
        mat4.rotateY(modelToParent, modelToParent, this.rotation[1]);
        mat4.rotateZ(modelToParent, modelToParent, this.rotation[2]);
        return modelToParent;
    }

    update() {
        this.computeModelToParent();
        this.computeModelToWorld();
        this.object.children.forEach(c => c.transform.update());
    }

}

export class GameObject {
    children: GameObject[] = [];
    parent: GameObject;

    transform: TransformComponent;
    mesh: MeshComponent = null;
    light: LightComponent = null;

    constructor() {
        this.transform = new TransformComponent(this);
    }

    addChild(o: GameObject) {
        this.children.push(o);
        o.parent = this;
    }
}

export class GameObjectBuilder {
    o: GameObject;

    constructor() {
        this.o = new GameObject();
    }

    setMesh(mesh: GLMesh): GameObjectBuilder {
        this.o.mesh = new MeshComponent(mesh);
        this.o.mesh.object = this.o;
        return this;
    }

    setLightComponent(light: LightComponent): GameObjectBuilder {
        this.o.light = light;
        light.object = this.o;
        return this;
    }

    build(): GameObject {
        return this.o;
    }
}
