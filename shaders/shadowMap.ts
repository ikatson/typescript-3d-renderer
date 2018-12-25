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
    gl_Position = v_pos;
}
`);


const FS = new ShaderSourceBuilder()
    .addChunk(`
in vec4 v_pos;
out vec4 depth;

void main() {
    depth = vec4(vec3(v_pos.z / v_pos.w), 1.);
}
`);

export const SHADOWMAP_SHADERS = {
    vs: VS,
    fs: FS,
};
