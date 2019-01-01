import {vec3} from "gl-matrix";
import {tmpVec4} from "./utils";

function r1to255 (v: number): number {
    return Math.trunc(v * 255);
}

export function vec3ToUnit8Array(v: vec3) {
    const nv = tmpVec4;
    nv[0] = r1to255(v[0]);
    nv[1] = r1to255(v[1]);
    nv[2] = r1to255(v[2]);
    nv[3] = 255;
    return new Uint8Array(nv);
}

export function fillWithEmptyTexture(gl: WebGL2RenderingContext, defaultColor: vec3) {
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = vec3ToUnit8Array(defaultColor);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
        width, height, border, srcFormat, srcType,
        pixel);
}

export class Texture {
    private img: HTMLImageElement;
    private promise: Promise<void>;
    private texture: WebGLTexture;

    constructor(gl: WebGL2RenderingContext, url: string, defaultColor: vec3) {
        this.texture = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        fillWithEmptyTexture(gl, defaultColor);

        this.promise = new Promise((resolve, reject) => {
            this.img = new Image();
            this.img.src = url;

            this.img.addEventListener('load', () => {
                this.bind(gl);
                resolve();
            })
        });
    }

    private bind(gl: WebGL2RenderingContext) {
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.img);
        gl.generateMipmap(gl.TEXTURE_2D);
        this.img = null;
    }

    getTexture() {
        return this.texture;
    }

    getPromise() {
        return this.promise;
    }
}
