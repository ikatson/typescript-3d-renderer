import {vec3} from "gl-matrix";
import {Texture} from "./texture";

export class TextureOrValue<T> {
    value: T;
    texture: Texture = null;

    constructor(value: T, texture?: Texture) {
        this.value = value;
        if (texture) {
            this.texture = texture;
        }
    }

    setValue(value: T): TextureOrValue<T> {
        this.value = value;
        return this;
    }

    hasTexture(): boolean {
        return !!this.texture;
    }

    setTexture(texture: Texture): TextureOrValue<T> {
        this.texture = texture;
        return this;
    }
}

export class Material {
    albedo: TextureOrValue<vec3> = new TextureOrValue(vec3.fromValues(1, 1, 1));
    metallic: TextureOrValue<number> = new TextureOrValue(0);
    roughness: TextureOrValue<number> = new TextureOrValue(0.5);
    normalMap: Texture;

    isReflective: boolean = false;

    constructor(albedo?: vec3, metallic?: number, roughness?: number) {
        if (albedo) {
            vec3.copy(this.albedo.value, albedo);
        }
        if (metallic !== undefined) {
            this.metallic.value = metallic;
        }
        if (roughness !== undefined) {
            this.roughness.value = roughness;
        }
    }

    setAlbedo(r, g, b): Material {
        this.albedo[0] = r;
        this.albedo[1] = g;
        this.albedo[2] = b;
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
