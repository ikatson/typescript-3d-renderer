import { GameObject, GameObjectBuilder, LightComponent } from "./object.js";
import { vec3 } from "./gl-matrix.js";
import { randFloat, randVec3 } from "./utils.js";

export function randomLight(posScale: number, intensity?: number) {
    intensity = intensity || 1.;
    const l = new GameObjectBuilder().setLightComponent(new LightComponent()).build();
    l.transform.position = randVec3(-posScale, posScale);
    l.transform.scale = [0.1, 0.1, 0.1];
    l.transform.update();

    l.light.specular = vec3.normalize(l.light.specular, randVec3(0., 1.));
    l.light.diffuse = vec3.normalize(l.light.diffuse, randVec3(0., 1.));
    
    const diffuseSpecularRatio = Math.random();
    l.light.diffuse = vec3.scale(l.light.diffuse, l.light.diffuse, diffuseSpecularRatio);
    l.light.specular = vec3.scale(l.light.specular, l.light.specular, 1. - diffuseSpecularRatio);
    l.light.intensity = intensity;
    return l;
}

export function randomLights(count: number, posScale: number, totalIntensity?: number): GameObject[] {
    if (totalIntensity === undefined) {
        totalIntensity = 1.0;
    }
    const result: GameObject[] = []
    for (let index = 0; index < count; index++) {
        const l = randomLight(posScale, totalIntensity / count);
        result.push(l);
    }
    return result;
}

export class Scene {
    children = new Array<GameObject>();
    lights = new Array<GameObject>();
    constructor() {}
    
    addChild(o: GameObject) {
        this.children.push(o);
        this.lights.push(randomLight(5.))
        o.parent = null;
    }
}