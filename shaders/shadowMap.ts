import { ShaderSourceBuilder } from "../shaders.js";

const VS = new ShaderSourceBuilder().addChunk(`
precision highp float;

in vec4 a_pos;

uniform mat4 u_modelViewMatrix;
uniform mat4 u_perspectiveMatrix;

out vec4 v_pos;

void main() {
    v_pos = u_modelViewMatrix * a_pos;
    gl_Position = u_perspectiveMatrix * v_pos;
}
`);


const FS = new ShaderSourceBuilder().addChunk(`
precision highp float;

in vec4 v_pos;

out vec4 depth;

void main() {
    // depth = vec4(1.);
    depth = vec4(vec3(v_pos.z), 1.);
}
`);

export const SHADOWMAP_SHADERS = {
    vs: VS,
    fs: FS,
}