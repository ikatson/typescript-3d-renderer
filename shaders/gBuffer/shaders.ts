const VS = `
precision mediump float;

in vec4 a_pos;
in vec4 a_norm;
in vec2 a_uv;

uniform mat4 u_modelViewMatrix;
uniform mat4 u_modelWorldMatrix;
uniform mat4 u_worldToCameraMatrix;
uniform mat4 u_perspectiveMatrix;

out vec4 v_pos;
out vec4 v_norm;
out vec2 v_uv;

void main() {
    v_pos = u_modelWorldMatrix * a_pos;
    gl_Position = u_perspectiveMatrix * u_modelViewMatrix * a_pos;

    v_norm = normalize(u_modelWorldMatrix * a_norm);
    v_uv = a_uv;
}
`

const FS = `
precision mediump float;

in vec4 v_pos;
in vec4 v_norm;
in vec2 v_uv;

layout(location = 0) out vec4 gbuf_position;
layout(location = 1) out vec4 gbuf_normal;
layout(location = 2) out vec4 gbuf_colmap;

void main() {
    gbuf_position = vec4(v_pos.xyz, 1.0);
    gbuf_normal = vec4(v_norm.xyz, 1.0);
    gbuf_colmap = vec4(1., 0.87, 0.74, 1.);
}
`

export const GBUFFER_SHADER_SOURCE = {
    vs: VS,
    fs: FS,
}