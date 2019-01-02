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

uniform vec4 u_albedo;
uniform vec4 u_albedoFactor;
uniform bool u_albedoHasFactor;
uniform bool u_albedoHasTexture;
uniform sampler2D u_albedoTexture;

uniform float u_metallic;
uniform bool u_metallicHasTexture;
uniform sampler2D u_metallicTexture;

uniform float u_roughness;
uniform bool u_roughnessHasTexture;
uniform sampler2D u_roughnessTexture;

uniform bool u_normalMapHasTexture;
uniform sampler2D u_normalMapTx;

layout(location = 0) out vec4 gbuf_position;
layout(location = 1) out vec4 gbuf_normal;
layout(location = 2) out vec4 gbuf_albedo;
layout(location = 3) out vec4 gbuf_metallic_roughness;

vec4 srgb(vec4 color) {
    return vec4(pow(color.rgb, vec3(2.2)), color.a);
}

void main() {
    gbuf_position = vec4(v_pos.xyz, 1.0);
    
    // TODO: use normal map here.
    gbuf_normal = vec4(normalize(v_norm.xyz), 1.0);
    
    if (u_albedoHasTexture) {
        gbuf_albedo = srgb(texture(u_albedoTexture, v_uv));
        if (u_albedoHasFactor) {
           gbuf_albedo *= u_albedoFactor;
        }
    } else {
        gbuf_albedo = u_albedo;
    }

    if (gbuf_albedo.a == 0.) {
        discard;
        return;
    }
    
    float metallic;
    float roughness;
    
    if (u_metallicHasTexture) {
        metallic = texture(u_metallicTexture, v_uv).b;
    } else {
        metallic = u_metallic;
    }
    
    if (u_roughnessHasTexture) {
        roughness = texture(u_roughnessTexture, v_uv).g;
    } else {
        roughness = u_roughness;
    }
    
    gbuf_metallic_roughness = vec4(metallic, roughness, 1., 1.);
}
`;

export const GBUFFER_SHADER_SOURCE = {
    vs: VS,
    fs: FS,
};
