import {mat4, vec3} from "./gl-matrix.js";
import {tmpMatrix} from "./utils.js";

export class Camera {
    near: number;
    far: number;
    fov: number;
    aspect: number;
    private _right: Float32Array = vec3.create();
    private _projectionMatrix: any;
    private _worldToCamera: any;
    private _lookAt: any;
    private _camToWorldNeedsUpdate: boolean = true;
    private _worldToCamNeedsUpdate: boolean = true;
    private _cameraToWorld: mat4;
    private _projectionMatrixNeedsUpdate: boolean = true;

    constructor(gl: WebGLRenderingContext) {
        this._position = vec3.fromValues(0, 0, -1);
        this._forward = vec3.fromValues(0, 0, 1);
        this._up = vec3.fromValues(0, 1, 0);
        this._right = vec3.create();
        this.near = 0.03;
        this.far = 30.0;
        this.fov = Math.PI * 45. / 180.0;
        this.aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        this._projectionMatrix = mat4.create();
        this._worldToCamera = mat4.create();
        this._cameraToWorld = mat4.create();
        this._lookAt = vec3.create();
    }

    private _position: Float32Array | number[] | vec3;

    get position(): Float32Array | number[] | vec3 {
        return this._position;
    }

    set position(value: Float32Array | number[] | vec3) {
        this._position = value;
        this.update();
    }

    private _forward: Float32Array | number[] | vec3;

    get forward(): Float32Array | number[] | vec3 {
        return this._forward;
    }

    set forward(value: Float32Array | number[] | vec3) {
        this._forward = value;
        this.update();
    }

    private _up: Float32Array | number[] | vec3;

    get up(): Float32Array | number[] | vec3 {
        return this._up;
    }

    set up(value: Float32Array | number[] | vec3) {
        this._up = value;
        this.update();
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

    projectionMatrix() {
        if (this._projectionMatrixNeedsUpdate) {
            mat4.perspective(this._projectionMatrix, this.fov, this.aspect, this.near, this.far);
            this._projectionMatrixNeedsUpdate = false;
        }
        return this._projectionMatrix;
    }

    private computeWorldToCamera() {
        const m = this._worldToCamera;
        const r = this.right();
        mat4.set(m,
            r[0], this.up[0], -this.forward[0], 0,
            r[1], this.up[1], -this.forward[1], 0,
            r[2], this.up[2], -this.forward[2],0,
            0, 0, 0, 1,
        );
        vec3.scale(this._lookAt, this.position, -1);
        mat4.translate(m, m, this._lookAt);
        return m;
    }

    private computeCameraToWorld() {
        // This will essentially be equivalent to the inverset of getWorldToCamera(),
        // but it's much easier to compute by hand instead of inverse.
        const m = this._cameraToWorld;
        mat4.fromTranslation(m, this.position);

        const r = this.right();
        const mr = tmpMatrix();
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
