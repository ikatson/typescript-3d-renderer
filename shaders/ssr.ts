import {ShaderSourceBuilder} from "../shaders.js";

const FS = new ShaderSourceBuilder().addChunk(`
out vec4 color;
void main() {
    color = vec4(0., 0., 1., 1.);
}
`);

export const SSR_SHADERS = {
    fs: FS,
};
