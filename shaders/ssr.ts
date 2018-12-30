import {ShaderSourceBuilder} from "../shaders.js";
import {QUAD_FRAGMENT_INPUTS, WORLD_AND_CAMERA_TRANSFORMS} from "./includes/common.js";

const FS = new ShaderSourceBuilder()
    .addChunk(QUAD_FRAGMENT_INPUTS)
    .addChunk(WORLD_AND_CAMERA_TRANSFORMS)
    .addChunk(`
out vec4 color;
void main() {
    color = vec4(0., 0., 1., 1.);
}
`);

export const SSR_SHADERS = {
    fs: FS,
};
