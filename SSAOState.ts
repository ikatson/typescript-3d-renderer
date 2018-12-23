import {randFloat, lerp} from "./utils.js";

export class SSAOConfig {
    enabled: boolean = true;
    sampleCount: number = 32;
    noiseScale: number = 2;
    scalePower: number = 2;
    radius: number = 0.75;
    bias: number = 0.025;
    strength: number = 1.0;
    blurPositionThreshold: number = 0.3;
    blurNormalThreshold: number = 0.9;

    isEnabled() {
        return this.enabled && this.strength > 0;
    }

    copy(): SSAOConfig {
        return Object.assign(new SSAOConfig(), this);
    }
}

export class SSAOState {
    usedConfig: SSAOConfig;
    tangentSpaceSamples: Float32Array;
    noiseTexture: WebGLTexture;

    constructor(gl: WebGLRenderingContext, config: SSAOConfig) {
        // Generate random samples.
        this.recalculate(gl, config);
    }

    recalculate(gl: WebGLRenderingContext, config: SSAOConfig): SSAOState {
        this.delete(gl);
        this.usedConfig = config.copy();

        const samples = new Array<number>();
        for (let index = 0; index < config.sampleCount; index++) {
            const scale = lerp(Math.pow(index / config.sampleCount, config.scalePower), 0., 1., 0.1, 1.);
            samples.push(randFloat(-1, 1) * scale);
            samples.push(randFloat(-1, 1) * scale);
            samples.push(randFloat(0, 1) * scale);
        }
        this.tangentSpaceSamples = new Float32Array(samples);

        const randomRotationVectors = [];

        // screen space random vector that points only in xy direction so that it's
        // orthogonal to screen-space normal vector.
        for (let i = 0; i < config.noiseScale * config.noiseScale; i++) {
            randomRotationVectors.push(randFloat(-1, 1));
            randomRotationVectors.push(randFloat(-1, 1));
            randomRotationVectors.push(0)
        }
        const randomRotationVectorsView = new Float32Array(randomRotationVectors);

        // Generate random rotations texture;
        this.noiseTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.noiseTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB16F, config.noiseScale, config.noiseScale, 0, gl.RGB, gl.FLOAT, randomRotationVectorsView);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        return this;
    }

    delete(gl: WebGLRenderingContext) {
        if (this.noiseTexture) {
            gl.deleteTexture(this.noiseTexture);
        }
    }
}
