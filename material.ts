import {vec3} from "./gl-matrix.js";

export class Material {
    albedo = vec3.fromValues(1, 1, 1);
    specular = vec3.fromValues(1, 1, 1);
    shininess: number = 1;
}
