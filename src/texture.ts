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

export function loadImage(uri: string): Promise<HTMLImageElement> {
    return <Promise<HTMLImageElement>>new Promise((resolve, reject) => {
        const img = new Image();
        img.src = uri;

        img.addEventListener('load', () => {
            resolve(img);
        })
    });
}

export class Texture {
    private promise: Promise<void>;
    private texture: WebGLTexture;

    constructor(gl: WebGL2RenderingContext, data: Promise<HTMLImageElement>, defaultColor: vec3) {
        this.texture = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        fillWithEmptyTexture(gl, defaultColor);

        data.then(img => {
            this.bind(gl, img);
        });
    }

    private bind(gl: WebGL2RenderingContext, img: HTMLImageElement) {
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.generateMipmap(gl.TEXTURE_2D);
    }

    getTexture() {
        return this.texture;
    }

    getPromise() {
        return this.promise;
    }
}
