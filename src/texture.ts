import {vec3} from "gl-matrix";
import {tmpVec4} from "./utils";
import * as parseDDS from 'parse-dds';

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

export function fillTexture2DWithEmptyTexture(gl: WebGL2RenderingContext, defaultColor: vec3) {
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

export interface Pixels {
    setupTexture(gl: WebGL2RenderingContext)
}

export class ImagePixels implements Pixels {
    private img: HTMLImageElement;

    constructor(img: HTMLImageElement) {
        this.img = img;
    }

    setupTexture(gl: WebGL2RenderingContext) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.generateMipmap(gl.TEXTURE_2D);
    }
}

function getDDSFormat (ext: WEBGL_compressed_texture_s3tc, ddsFormat: string) {
    switch (ddsFormat) {
        case 'dxt1':
            return ext.COMPRESSED_RGB_S3TC_DXT1_EXT;
        case 'dxt3':
            return ext.COMPRESSED_RGBA_S3TC_DXT3_EXT;
        case 'dxt5':
            return ext.COMPRESSED_RGBA_S3TC_DXT5_EXT;
        default:
            throw new Error('unsupported format ' + ddsFormat)
    }
}

export class DDSPixels implements Pixels {
    private data: ArrayBuffer;
    private dds: any;

    constructor(data: ArrayBuffer) {
        this.data = data;
        this.dds = parseDDS(this.data);
    }

    setupTexture(gl: WebGL2RenderingContext) {
        const ext = gl.getExtension("WEBGL_compressed_texture_s3tc");
        if (!ext) {
            throw new Error("Compressed textures not supported, can't load WEBGL_compressed_texture_s3tc")
        }

        console.log(`mip levels ${this.dds.images.length}`);

        for (let mip = 0; mip < this.dds.images.length; mip++) {
            const image = this.dds.images[mip];
            const data = new Uint8Array(this.data, image.offset, image.length);
            var width = image.shape[0];
            var height = image.shape[1];
            gl.compressedTexImage2D(gl.TEXTURE_2D, mip, getDDSFormat(ext, this.dds.format), width, height, 0, data);
        }
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    }
}

export class Texture {
    private promise: Promise<void>;
    private texture: WebGLTexture;

    constructor(gl: WebGL2RenderingContext, pixels: Promise<Pixels>, defaultColor: vec3) {
        this.texture = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        fillTexture2DWithEmptyTexture(gl, defaultColor);

        this.promise = pixels.then(img => this.bindImageToTexture(gl, img));
    }

    private bindImageToTexture(gl: WebGL2RenderingContext, pixels: Pixels) {
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        pixels.setupTexture(gl);
    }

    getTexture() {
        return this.texture;
    }

    getPromise() {
        return this.promise;
    }
}
