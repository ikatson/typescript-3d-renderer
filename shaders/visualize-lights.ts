import { ShaderSourceBuilder } from "../shaders.js";
import {WORLD_AND_CAMERA_TRANSFORMS} from "./includes/common.js";

const VS = new ShaderSourceBuilder()
    .addTopChunk(WORLD_AND_CAMERA_TRANSFORMS)
    .addChunk(`
in vec4 a_pos;
out vec4 v_pos;
out vec2 tx_pos;

void main() {
    v_pos = u_modelViewMatrix * a_pos;
    gl_Position = u_perspectiveMatrix * v_pos;
    tx_pos = (gl_Position.xy / gl_Position.w) / 2. + 0.5;
}
`)

const FS = new ShaderSourceBuilder()
    .addTopChunk(WORLD_AND_CAMERA_TRANSFORMS)
    .addChunk(`
in vec4 v_pos;
in vec2 tx_pos;

uniform vec3 u_color;
uniform float u_intensity;
uniform sampler2D u_posTexture;

out vec4 color;

void main() {
    float alpha = 1.0;
    vec4 sceneTexel = texture(u_posTexture, tx_pos);
    vec4 scenePos = sceneTexel;
    if (scenePos.z > v_pos.z && sceneTexel.a > 0.) {
        alpha = 0.;
    }
    color = vec4(u_color * u_intensity, alpha);
}
`);

export const VISUALIZE_LIGHTS_SHADERS = {
    vs: VS,
    FS: FS,
}
