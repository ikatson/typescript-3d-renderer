import {mat4, vec3} from "gl-matrix"
import {ShaderProgram} from "./shaders";
import {AxisAlignedBox} from "./axisAlignedBox";
import {GLArrayBufferV1, GLArrayBufferI, GLArrayBufferGLTF} from "./glArrayBuffer";
import {Material} from "./material";

export abstract class Component {
    object: GameObject = null;

    setObject(o: GameObject) {
        this.object = o;
        return this;
    }
}

export class MeshComponent extends Component {
    primitives: GLArrayBufferI[];
    shadowCaster: boolean = true;
    shadowReceiver: boolean = true;
    private forceRenderMode: GLenum = undefined;

    constructor(primitives: GLArrayBufferI | GLArrayBufferI[]) {
        super();
        if (Array.isArray(primitives)) {
            this.primitives = primitives;
        } else {
            this.primitives = [primitives];
        }
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

    draw(gl: WebGL2RenderingContext) {
        for (let i = 0; i < this.primitives.length; i++) {
            const p = this.primitives[i];
            p.draw(gl, this.forceRenderMode);
        }
    }
}

export class BoundingBoxComponent extends Component {
    box: AxisAlignedBox;
    visible: boolean = false;
    computedFromChildren: boolean = false;

    private glArrayBuffer: GLArrayBufferI;
    constructor(box: AxisAlignedBox) {
        super();
        this.box = box;
    }

    setComputedFromChildren(v: boolean): this {
        this.computedFromChildren = v;
        return this;
    }

    asArrayBuffer(gl: WebGL2RenderingContext): GLArrayBufferI {
        if (!this.glArrayBuffer) {
            this.glArrayBuffer = new GLArrayBufferV1(gl, this.box.asWireFrameBuffer());
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
    material: MaterialComponent;

    constructor(name: string) {
        this._transform = new TransformComponent(this);
        this.name = name;
    }

    private _transform: TransformComponent;

    get transform(): TransformComponent {
        return this._transform;
    }

    set transform(value: TransformComponent) {
        this._transform = value;
        value.object = this;
    }

    private _mesh: MeshComponent = null;

    get mesh(): MeshComponent {
        return this._mesh;
    }

    set mesh(value: MeshComponent) {
        this._mesh = value;
        value.object = this;
    }

    private _pointLight: PointLightComponent = null;

    get pointLight(): PointLightComponent {
        return this._pointLight;
    }

    set pointLight(value: PointLightComponent) {
        this._pointLight = value;
        value.object = this;
    }

    private _directionalLight: DirectionalLight = null;

    get directionalLight(): DirectionalLight {
        return this._directionalLight;
    }

    set directionalLight(value: DirectionalLight) {
        this._directionalLight = value;
        value.object = this;
    }

    private _boundingBoxComponent: BoundingBoxComponent = null;

    get boundingBoxComponent(): BoundingBoxComponent {
        return this._boundingBoxComponent;
    }

    set boundingBoxComponent(value: BoundingBoxComponent) {
        this._boundingBoxComponent = value;
        value.object = this;
    }

    addChild(o: GameObject) {
        this.children.push(o);
        o.parent = this;
        o._transform.update();
        // console.log(`added ${o.name} as child of ${this.fqdn()}`);
    }

    fqdn() {
        const name = [];
        let o: GameObject = this;

        while (o) {
            name.push(o.name);
            o = o.parent;
        }
        name.reverse();
        return name.join(' / ')
    }
}

export class GameObjectBuilder {
    o: GameObject;

    constructor(name: string) {
        this.o = new GameObject(name);
    }

    setMeshFromBuffer(mesh: GLArrayBufferI): this {
        this.o.mesh = new MeshComponent(mesh);
        this.o.boundingBoxComponent = new BoundingBoxComponent(mesh.getBoundingBox());
        return this;
    }

    setMeshComponent(meshComponent: MeshComponent): this {
        this.o.mesh = meshComponent;
        meshComponent.setObject(this.o);
        return this;
    }

    setDirectionalLightComponent(light: DirectionalLight): this {
        this.o.directionalLight = light;
        light.object = this.o;
        return this;
    }

    setPointLightComponent(light: PointLightComponent): this {
        this.o.pointLight = light;
        light.object = this.o;
        return this;
    }

    setBoundingBoxComponent(bbox: BoundingBoxComponent): this {
        this.o.boundingBoxComponent = bbox;
        bbox.object = this.o;
        return this;
    }

    setMaterialComponent(c: MaterialComponent): this {
        this.o.material = c;
        c.object = this.o;
        return this;
    }

    build(): GameObject {
        return this.o;
    }
}
