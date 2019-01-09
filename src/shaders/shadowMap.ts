import {ShaderSourceBuilder} from "../shaders";
import {WORLD_AND_CAMERA_TRANSFORMS} from "./includes/common";

const VS = new ShaderSourceBuilder()
    .addTopChunk(WORLD_AND_CAMERA_TRANSFORMS)
    .addChunk(`
layout(location = 0) in vec4 a_pos;
out vec4 v_pos;

uniform mat4 u_lightCameraWorldToProjectionMatrix;

void main() {
    v_pos = u_lightCameraWorldToProjectionMatrix * u_modelWorldMatrix * a_pos;
    gl_Position = v_pos;
}
`);


const FS = new ShaderSourceBuilder()
    .addChunk(`
void main() {
}
`);

export const SHADOWMAP_SHADERS = {
    vs: VS,
    fs: FS,
};
