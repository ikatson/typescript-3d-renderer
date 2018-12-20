import { randFloat, lerp } from "./utils.js";

export class SSAO {
    sampleCount: number;
    rotationPower: number;
    
    tangentSpaceSamples: Float32Array;
    noiseTexture: WebGLTexture;

    constructor(gl: WebGLRenderingContext, sampleCount: number, rotationPower: number) {
        this.sampleCount = sampleCount;
        this.rotationPower = rotationPower;

        // Generate random samples.
        const samples = new Array<number>();
        for (let index = 0; index < sampleCount; index++) {
            let scale = index / sampleCount;
            scale = lerp(scale * scale, 0., 1., 0.1, 1.);
            samples.push(randFloat(-1, 1)) * scale;
            samples.push(randFloat(-1, 1)) * scale;
            samples.push(randFloat(0, 1)) * scale;
        }
        this.tangentSpaceSamples = new Float32Array(samples);

        const randomRotationVectors = [];

        // screen space random vector that points only in xy direction so that it's 
        // orthogonal to screen-space normal vector.
        for (let i = 0; i < rotationPower * rotationPower; i++) {
            randomRotationVectors.push(randFloat(-1, 1))
            randomRotationVectors.push(randFloat(-1, 1))
            randomRotationVectors.push(0)
        }
        const randomRotationVectorsView = new Float32Array(randomRotationVectors);

        // Generate random rotations texture;
        this.noiseTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.noiseTexture)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB16F, rotationPower, rotationPower, 0, gl.RGB, gl.FLOAT, randomRotationVectorsView);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    }
}