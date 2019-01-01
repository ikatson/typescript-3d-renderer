const VS = `
precision highp float;

in vec4 a_pos;
in vec3 a_norm;
in vec2 a_uv;

uniform mat4 u_modelViewMatrix;
uniform mat4 u_modelWorldMatrix;
uniform mat4 u_worldToCameraMatrix;
uniform mat4 u_perspectiveMatrix;

out vec4 v_pos;
out vec4 v_norm;
out vec2 v_uv;

void main() {
    mat4 modelToCamera = u_worldToCameraMatrix * u_modelWorldMatrix; 
    v_pos = modelToCamera * a_pos;
    gl_Position = u_perspectiveMatrix * u_modelViewMatrix * a_pos;

    v_norm = normalize(modelToCamera * vec4(a_norm, 0.));
    v_uv = a_uv;
    gl_PointSize = 2.;    
}
`;

const FS = `
precision highp float;

in vec4 v_pos;
in vec4 v_norm;
in vec2 v_uv;

uniform vec3 u_albedo;
uniform vec3 u_specular;
uniform float u_shininess;

layout(location = 0) out vec4 gbuf_position;
layout(location = 1) out vec4 gbuf_normal;
layout(location = 2) out vec4 gbuf_albedo;
layout(location = 3) out vec4 gbuf_specular;

void main() {
    gbuf_position = vec4(v_pos.xyz, 1.0);
    gbuf_normal = vec4(v_norm.xyz * .5 + .5, 1.0);
    
    gbuf_albedo = vec4(u_albedo, 1.);
    gbuf_specular = vec4(u_specular, u_shininess / 256.0);
}
`;

export const GBUFFER_SHADER_SOURCE = {
    vs: VS,
    fs: FS,
};
