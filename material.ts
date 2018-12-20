import { ShaderProgram } from "./shaders";
import { Texture } from "./texture";

export class Material {
    private _program: ShaderProgram;
    private _ambientOcclusionTexture: Texture = null;
    private _normalMapTexture: Texture = null;

    constructor(program: ShaderProgram) {
        this._program = program;
        this._ambientOcclusionTexture = null;
        this._normalMapTexture = null;
    }
    
    getProgram() {
        return this._program;
    }

    getAmbientOcclusionTexture() {
        return this._ambientOcclusionTexture;
    }
    setAmbientOcclusionTexture(t: Texture) {
        this._ambientOcclusionTexture = t;
    }
    
    getNormalMapTexture() {
        return this._normalMapTexture;
    }
    setNormalMapTexture(t: Texture) {
        this._normalMapTexture = t;
    }

}