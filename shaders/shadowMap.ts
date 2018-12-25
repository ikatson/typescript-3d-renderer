import { ShaderSourceBuilder } from "../shaders.js";
import {WORLD_AND_CAMERA_TRANSFORMS} from "./includes/common.js";

const VS = new ShaderSourceBuilder()
    .addTopChunk(WORLD_AND_CAMERA_TRANSFORMS)
    .addChunk(`
in vec4 a_pos;
out vec4 v_pos;

uniform mat4 u_lightCameraWorldToProjectionMatrix;

void main() {
    v_pos = u_lightCameraWorldToProjectionMatrix * u_modelWorldMatrix * a_pos;
    v_pos.xy /= 2.0;
    gl_Position = v_pos;
}
`);


const FS = new ShaderSourceBuilder()
    .addChunk(`
in vec4 v_pos;

void main() {
    vec4 v_pos_f = v_pos;
    
    if (abs(v_pos.x) > 0.501 || abs(v_pos.y) > 0.501) {
        v_pos_f.z = -0.999;
    }

    gl_FragDepth = v_pos_f.z * 0.5 + 0.5;
}
`);

export const SHADOWMAP_SHADERS = {
    vs: VS,
    fs: FS,
};
