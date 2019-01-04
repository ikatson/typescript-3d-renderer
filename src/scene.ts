import {DirectionalLight, GameObject, GameObjectBuilder, PointLightComponent} from "./object";
import { vec3 } from "gl-matrix";
import { randFloat, randVec3 } from "./utils";

export function randomPointLight(posScale: number, intensity?: number) {
    intensity = intensity || 1.;
    const l = new GameObjectBuilder("a light").setPointLightComponent(new PointLightComponent()).build();
    l.transform.position = randVec3(-posScale, posScale);
    l.transform.scale = vec3.fromValues(0.1, 0.1, 0.1);
    l.transform.update();

    l.pointLight.color = vec3.normalize(l.pointLight.color, randVec3(0., 1.));
    l.pointLight.intensity = intensity;
    return l.pointLight;
}

export function randomPointLights(count: number, posScale: number, totalIntensity?: number): PointLightComponent[] {
    if (totalIntensity === undefined) {
        totalIntensity = 1.0;
    }
    const result: PointLightComponent[] = [];
    for (let index = 0; index < count; index++) {
        const l = randomPointLight(posScale, totalIntensity / count);
        result.push(l);
    }
    return result;
}

export class Scene {
    children = new Array<GameObject>();
    directionalLights = new Array<DirectionalLight>();
    pointLights = new Array<PointLightComponent>();
    constructor() {}

    addChild(o: GameObject) {
        this.children.push(o);
        o.parent = null;
        o.transform.update();
        // console.log(`added ${o.fqdn()} to scene`)
    }
}
