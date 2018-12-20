export class LightComponent {
    diffuse: number[] | Float32Array = [1., 1., 1.];
    specular: number[] | Float32Array = [1., 1., 1.]
    ambient: number[] | Float32Array = [0., 0., 0.];
    intensity: number = 1.;
    radius: number = 1.;
    attenuation: number = 0.2;
}