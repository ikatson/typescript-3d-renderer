import {vec4} from "gl-matrix";
import {Texture} from "./texture";

export class TextureOrValue<T> {
    value: T;
    texture: Texture = null;
    factor: T;

    constructor(value: T, texture?: Texture, factor?: T) {
        this.value = value;
        this.factor = factor;
        if (texture) {
            this.texture = texture;
        }
    }

    setValue(value: T): TextureOrValue<T> {
        this.value = value;
        return this;
    }

    setFactor(value: T): TextureOrValue<T> {
        this.factor = value;
        return this;
    }

    hasTexture(): boolean {
        return !!this.texture;
    }

    hasFactor(): boolean {
        return this.factor !== undefined && this.factor !== null;
    }

    setTexture(texture: Texture): TextureOrValue<T> {
        this.texture = texture;
        return this;
    }
}

export class Material {
    albedo: TextureOrValue<vec4> = new TextureOrValue(vec4.fromValues(1, 1, 1, 1));
    metallic: TextureOrValue<number> = new TextureOrValue(0);
    roughness: TextureOrValue<number> = new TextureOrValue(0.5);
    normalMap: Texture;

    isReflective: boolean = false;

    constructor(albedo?: vec4, metallic?: number, roughness?: number) {
        if (albedo) {
            vec4.copy(this.albedo.value, albedo);
        }
        if (metallic !== undefined) {
            this.metallic.value = metallic;
        }
        if (roughness !== undefined) {
            this.roughness.value = roughness;
        }
    }

    setAlbedo(r, g, b, a): Material {
        this.albedo.value[0] = r;
        this.albedo.value[1] = g;
        this.albedo.value[2] = b;
        this.albedo.value[3] = a;
        return this;
    }

    setMetallic(v: number): Material {
        this.metallic.setValue(v);
        return this;
    }

    setRoughness(v: number): Material {
        this.roughness.setValue(v);
        return this;
    }

    setReflective(v: boolean): Material {
        this.isReflective = v;
        return this;
    }

    setNormalMap(t: Texture): Material {
        this.normalMap = t;
        return this;
    }
}
