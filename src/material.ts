import {vec3} from "gl-matrix";

export class Material {
    albedo = vec3.fromValues(1, 1, 1);
    specular = vec3.fromValues(1, 1, 1);
    shininess: number = 1;
    isReflective: boolean = false;

    constructor(albedo?, specular?, shininess?) {
        this.albedo = albedo || vec3.fromValues(1, 1, 1);
        this.specular = specular || vec3.fromValues(1, 1, 1);
        this.shininess = shininess === undefined ? 1 : shininess;
    }

    setAlbedo(r, g, b): Material {
        this.albedo[0] = r;
        this.albedo[1] = g;
        this.albedo[2] = b;
        return this;
    }

    setSpecular(r, g, b): Material {
        this.specular[0] = r;
        this.specular[1] = g;
        this.specular[2] = b;
        return this;
    }

    setShininess(v): Material {
        this.shininess = v;
        return this;
    }

    setReflective(v: boolean): Material {
        this.isReflective = v;
        return this;
    }
}
