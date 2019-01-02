import {mat4, vec3} from "gl-matrix"
import {ShaderProgram} from "./shaders";
import {AxisAlignedBox} from "./axisAlignedBox";
import {ArrayBufferDataTypeToGL, GLArrayBuffer} from "./glArrayBuffer";
import {Material} from "./material";

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
    private forceRenderMode: GLenum = undefined;

    constructor(buf: GLArrayBuffer) {
        super();
        this.arrayBuffer = buf;
    }

    replaceBuf(gl: WebGL2RenderingContext, newBuf: GLArrayBuffer) {
        if (this.arrayBuffer) {
            this.arrayBuffer.delete(gl);
        }
        this.arrayBuffer = newBuf;
    }

    setRenderMode(m: GLenum): MeshComponent {
        this.forceRenderMode = m;
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

    prepareMeshVertexAndShaderDataForRendering(gl: WebGL2RenderingContext, program?: ShaderProgram, normals?: boolean, uv?: boolean) {
        this.arrayBuffer.prepareMeshVertexAndShaderDataForRendering(gl, program, normals, uv);
    }

    draw(gl: WebGL2RenderingContext) {
        this.arrayBuffer.draw(gl, this.forceRenderMode);
    }
}

export class BoundingBoxComponent extends Component {
    box: AxisAlignedBox;
    visible: boolean = false;
    private glArrayBuffer: GLArrayBuffer;
    constructor(box: AxisAlignedBox) {
        super();
        this.box = box;
    }

    asArrayBuffer(gl: WebGL2RenderingContext): GLArrayBuffer {
        if (!this.glArrayBuffer) {
            this.glArrayBuffer = new GLArrayBuffer(gl, this.box.asWireFrameBuffer());
        }
        return this.glArrayBuffer;
    }
}

export class BaseLightComponent extends Component {
    color: vec3 = vec3.fromValues(1., 1., 1.);
    intensity: number = 1.;
}

export class DirectionalLight extends BaseLightComponent {
    direction: vec3 = vec3.fromValues(0, -1, 0);
    castsShadows: boolean;
}

export class PointLightComponent extends BaseLightComponent {
    radius: number = 1.;
}

export class TransformComponent extends Component {
    position: vec3;
    rotation: vec3;
    scale: vec3;
    object: GameObject;

    private modelToWorld = mat4.create();
    private modelToParent = mat4.create();

    constructor(object: GameObject) {
        super();
        this.object = object;
        this.position = vec3.fromValues(0, 0, 0);
        this.rotation = vec3.fromValues(0, 0, 0);
        this.scale = vec3.fromValues(1, 1, 1);
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

export class MaterialComponent extends Component{
    material: Material;

    constructor(m: Material) {
        super();
        this.material = m;
    }
}

export class GameObject {
    children: GameObject[] = [];
    parent: GameObject;
    name: string;
    transform: TransformComponent;
    mesh: MeshComponent = null;
    pointLight: PointLightComponent = null;
    directionalLight: DirectionalLight = null;
    boundingBox: BoundingBoxComponent = null;
    material: MaterialComponent;

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

    setDirectionalLightComponent(light: DirectionalLight): GameObjectBuilder {
        this.o.directionalLight = light;
        light.object = this.o;
        return this;
    }

    setPointLightComponent(light: PointLightComponent): GameObjectBuilder {
        this.o.pointLight = light;
        light.object = this.o;
        return this;
    }

    setBoundingBoxComponent(bbox: BoundingBoxComponent) {
        this.o.boundingBox = bbox;
        bbox.object = this.o;
        return this;
    }

    setMaterialComponent(c: MaterialComponent): GameObjectBuilder {
        this.o.material = c;
        c.object = this.o;
        return this;
    }

    build(): GameObject {
        return this.o;
    }
}
