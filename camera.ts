import { mat4, vec3 } from "./gl-matrix.js";

export class Camera {
    position: Float32Array | number[] | vec3;
    forward: Float32Array | number[] | vec3;
    up: Float32Array | number[] | vec3;
    near: number;
    far: number;
    fov: number;
    aspect: number;

    private _right: Float32Array;
    private _projectionMatrix: any;
    private _worldToCamera: any;
    private _lookAt: any;

    constructor(gl: WebGLRenderingContext) {
        this.position = vec3.fromValues(0, 0, -1);
        this.forward = vec3.fromValues(0, 0, 1);
        this.up = vec3.fromValues(0, 1, 0);
        this._right = vec3.create()
        this.near = 0.1;
        this.far = 30.0;
        this.fov = Math.PI * 45. / 180.0;
        this.aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        this._projectionMatrix = mat4.create();
        this._worldToCamera = mat4.create();
        this._lookAt = vec3.create();
    }

    getWorldToCamera() {
        const m = this._worldToCamera;
        const lookAt = this._lookAt;
        vec3.add(lookAt, this.position, this.forward)
        mat4.lookAt(m, this.position, lookAt, this.up);
        return m;
    }

    right() {
        vec3.cross(this._right, this.forward, this.up);
        return this._right;
    }

    projectionMatrix() {
        mat4.perspective(this._projectionMatrix, this.fov, this.aspect, this.near, this.far);
        return this._projectionMatrix;
    }
}