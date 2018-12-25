import {mat4, vec3} from "./gl-matrix.js"
import {ShaderProgram} from "./shaders";
import {Box} from "./box.js";
import {GLArrayBuffer} from "./glArrayBuffer.js";

export abstract class Component {
    object: GameObject = null;

    setObject(o: GameObject) {
        this.object = o;
        return this;
    }
}

export class MeshComponent extends Component {
    arrayBuffer: GLArrayBuffer;
    object: GameObject = null;
    shadowCaster: boolean = true;
    shadowReceiver: boolean = true;
    renderMode: GLenum = WebGLRenderingContext.TRIANGLES;

    constructor(buf: GLArrayBuffer) {
        super();
        this.arrayBuffer = buf;
    }

    setRenderMode(m: GLenum): MeshComponent {
        this.renderMode = m;
        return this;
    }

    setShadowCaster(v: boolean): MeshComponent {
        this.shadowCaster = v;
        return this;
    }

    setShadowReceiver(v: boolean): MeshComponent {
        this.shadowReceiver = v;
        return this;
    }

    prepareMeshVertexAndShaderDataForRendering(gl: WebGLRenderingContext, program?: ShaderProgram, normals?: boolean, uv?: boolean) {
        this.arrayBuffer.prepareMeshVertexAndShaderDataForRendering(gl, program, normals, uv);
    }
}

export class BoundingBoxComponent extends Component {
    box: Box;
    visible: boolean = true;
    private glArrayBuffer: GLArrayBuffer;
    constructor(box: Box) {
        super();
        this.box = box;
    }

    asArrayBuffer(gl: WebGLRenderingContext): GLArrayBuffer {
        if (!this.glArrayBuffer) {
            this.glArrayBuffer = new GLArrayBuffer(gl, this.box.asWireFrameBuffer());
        }
        return this.glArrayBuffer;
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
    name: string;
    transform: TransformComponent;
    mesh: MeshComponent = null;
    light: LightComponent = null;
    boundingBox: BoundingBoxComponent = null;

    constructor(name: string) {
        this.transform = new TransformComponent(this);
        this.name = name;
    }

    addChild(o: GameObject) {
        this.children.push(o);
        o.parent = this;
    }
}

export class GameObjectBuilder {
    o: GameObject;

    constructor(name: string) {
        this.o = new GameObject(name);
    }

    setMeshComponent(meshComponent: MeshComponent): GameObjectBuilder {
        this.o.mesh = meshComponent;
        meshComponent.setObject(this.o);
        return this;
    }

    setLightComponent(light: LightComponent): GameObjectBuilder {
        this.o.light = light;
        light.object = this.o;
        return this;
    }

    setBoundingBoxComponent(bbox: BoundingBoxComponent) {
        this.o.boundingBox = bbox;
        bbox.object = this.o;
        return this;
    }

    build(): GameObject {
        return this.o;
    }
}
