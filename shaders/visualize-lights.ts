import { ShaderSourceBuilder } from "../shaders.js";

const VS = `
precision highp float;

in vec4 a_pos;

uniform mat4 u_modelViewMatrix;
uniform mat4 u_modelWorldMatrix;
uniform mat4 u_worldToCameraMatrix;
uniform mat4 u_perspectiveMatrix;

out vec4 v_pos;
out vec2 tx_pos;

void main() {
    v_pos = u_modelViewMatrix * a_pos;
    gl_Position = u_perspectiveMatrix * v_pos;
    tx_pos = (gl_Position.xy / gl_Position.w) / 2. + 0.5;
}
`

const FS = `
precision highp float;

in vec4 v_pos;
in vec2 tx_pos;

uniform vec3 u_color;
uniform float u_intensity;
uniform sampler2D u_posTexture;
uniform mat4 u_worldToCameraMatrix;

out vec4 color;

void main() {
    float alpha = 1.0;
    vec4 sceneTexel = texture(u_posTexture, tx_pos);
    vec4 scenePos = u_worldToCameraMatrix * sceneTexel;
    if (scenePos.z > v_pos.z && sceneTexel.a > 0.) {
        alpha = 0.;
    }
    color = vec4(u_color * u_intensity, alpha);
}
`

export const VISUALIZE_LIGHTS_SHADERS = {
    vs: new ShaderSourceBuilder().addChunk(VS),
    FS: new ShaderSourceBuilder().addChunk(FS),
}