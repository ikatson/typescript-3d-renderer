import {mat4, vec3} from "gl-matrix";
import {tmpIdentityMatrix} from "./utils";

const tmpVec3: vec3 = vec3.create();

export class ProjectionMatrix {
    near: number;
    far: number;
    matrix: any;

    constructor(near: number, far: number, matrix: any) {
        this.near = near;
        this.far = far;
        this.matrix = matrix;
    }
}

export class Camera {
    near: number;
    far: number;
    fov: number;
    aspect: number;
    private _right: vec3 = vec3.create();
    private _projectionMatrix: any;
    private _worldToCamera: any;

    private _camToWorldNeedsUpdate: boolean = true;
    private _worldToCamNeedsUpdate: boolean = true;
    private _cameraToWorld: mat4;
    private _projectionMatrixNeedsUpdate: boolean = true;

    constructor(aspect: number = 1) {
        this._position = vec3.fromValues(0, 0, -1);
        this._forward = vec3.fromValues(0, 0, 1);
        this._up = vec3.fromValues(0, 1, 0);
        this._right = vec3.create();
        this.near = 0.1;
        this.far = 15.0;
        this.fov = 45.;
        this.aspect = aspect;
        this._projectionMatrix = mat4.create();
        this._worldToCamera = mat4.create();
        this._cameraToWorld = mat4.create();
    }

    private _position: vec3;

    get position(): vec3 {
        return this._position;
    }

    set position(value: vec3) {
        this._position = value;
        this.update();
    }

    private _forward: vec3;

    get forward(): vec3 {
        return this._forward;
    }

    set forward(value: vec3) {
        this._forward = value;
        this.update();
    }

    private _up: vec3;

    get up(): vec3 {
        return this._up;
    }

    set up(value: vec3) {
        this._up = value;
        this.update();
    }

    setFar(v: number): Camera {
        this.far = v;
        return this;
    }

    update() {
        this._camToWorldNeedsUpdate = true;
        this._worldToCamNeedsUpdate = true;
        this._projectionMatrixNeedsUpdate = true;
    }

    getWorldToCamera() {
        if (this._worldToCamNeedsUpdate) {
            this.computeWorldToCamera();
            this._worldToCamNeedsUpdate = false;
        }
        return this._worldToCamera;
    }

    getCameraToWorld() {
        if (this._camToWorldNeedsUpdate) {
            this.computeCameraToWorld();
            this._camToWorldNeedsUpdate = false;
        }
        return this._cameraToWorld;
    }

    right() {
        vec3.cross(this._right, this._forward, this._up);
        return this._right;
    }

    projectionMatrix(): ProjectionMatrix {
        if (this._projectionMatrixNeedsUpdate) {
            mat4.perspective(this._projectionMatrix, this.fov * Math.PI / 180.0, this.aspect, this.near, this.far);
            this._projectionMatrixNeedsUpdate = false;
        }
        return new ProjectionMatrix(this.near, this.far, this._projectionMatrix);
    }

    calculateUpFromWorldUp() {
        // determine up direction
        const worldUp = [0, 1., 0];
        vec3.scale(tmpVec3, this.forward, vec3.dot(worldUp, this.forward));
        vec3.sub(this.up, worldUp, tmpVec3);
        vec3.normalize(this.up, this.up);
        this.update();
    }

    clone(target?: Camera) {
        const c = target || new Camera();
        vec3.copy(c.position, this.position);
        vec3.copy(c.forward, this.forward);
        vec3.copy(c.up, this.up);
        c.near = this.near;
        c.far = this.far;
        c.aspect = this.aspect;
        c.update();
        return c;
    }

    private computeWorldToCamera() {
        const m = this._worldToCamera;
        const r = this.right();
        mat4.set(m,
            r[0], this.up[0], -this.forward[0], 0,
            r[1], this.up[1], -this.forward[1], 0,
            r[2], this.up[2], -this.forward[2], 0,
            0, 0, 0, 1,
        );
        vec3.scale(tmpVec3, this.position, -1);
        mat4.translate(m, m, tmpVec3);
        return m;
    }

    private computeCameraToWorld() {
        // This will essentially be equivalent to the inverset of getWorldToCamera(),
        // but it's much easier to compute by hand instead of inverse.
        const m = this._cameraToWorld;
        mat4.fromTranslation(m, this.position);

        const r = this.right();
        const mr = tmpIdentityMatrix();
        mat4.set(mr,
            r[0], r[1], r[2], 0,
            this.up[0], this.up[1], this.up[2], 0,
            -this.forward[0], -this.forward[1], -this.forward[2], 0,
            0, 0, 0, 1
        );
        mat4.multiply(m, m, mr);
        return m;
    }
}
