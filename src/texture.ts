function fillWithEmptyTexture(gl: WebGL2RenderingContext) {
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
        width, height, border, srcFormat, srcType,
        pixel);
}

export class Texture {
    private img: HTMLImageElement;
    private promise: Promise<void>;
    private texture: WebGLTexture;
    private unit: number;

    constructor(gl: WebGL2RenderingContext, url: string, unit: number) {
        this.texture = gl.createTexture();
        this.unit = unit;

        gl.activeTexture(unit);

        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        fillWithEmptyTexture(gl);

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
        gl.activeTexture(this.unit);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.img);
        gl.generateMipmap(gl.TEXTURE_2D);
        this.img = null;
    }

    getTexture() {
        return this.texture;
    }

    getShaderLocation(gl: WebGL2RenderingContext) {
        return this.unit - gl.TEXTURE0;
    }

    getPromise() {
        return this.promise;
    }
}
