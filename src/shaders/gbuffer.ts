const VS = `
precision highp float;

layout(location = 0) in vec4 a_pos;
layout(location = 1) in vec3 a_norm;
layout(location = 2) in vec2 a_uv;
layout(location = 3) in vec4 a_tangent;

uniform mat4 u_modelViewMatrix;
uniform mat4 u_modelWorldMatrix;
uniform mat4 u_worldToCameraMatrix;
uniform mat4 u_perspectiveMatrix;

out vec4 v_pos;
out vec4 v_norm;
out vec2 v_uv;
out vec4 v_tangent;

void main() {
    v_pos = u_modelViewMatrix * a_pos;
    gl_Position = u_perspectiveMatrix * u_modelViewMatrix * a_pos;

    v_norm = normalize(u_modelViewMatrix * vec4(a_norm, 0.));
    v_uv = a_uv;
    v_tangent = a_tangent;
    gl_PointSize = 2.;    
}
`;

const FS = `
precision highp float;

in vec4 v_pos;
in vec4 v_norm;
in vec4 v_tangent;
in vec2 v_uv;

uniform mat4 u_modelViewMatrix;
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
uniform bool u_hasTangent;
uniform sampler2D u_normalMapTx;

layout(location = 0) out vec4 gbuf_position;
layout(location = 1) out vec3 gbuf_normal;
layout(location = 2) out vec4 gbuf_albedo;
layout(location = 3) out vec4 gbuf_metallic_roughness;

vec4 srgb(vec4 color) {
    return vec4(pow(color.rgb, vec3(2.2)), color.a);
}

void main() {
    gbuf_position = vec4(v_pos.xyz, 1.0);
    vec3 normal;
    if (u_normalMapHasTexture && u_hasTangent) {
        vec3 normalMap = normalize(texture(u_normalMapTx, v_uv).xyz * 2. - 1.);
        vec3 tangent = normalize(u_modelViewMatrix * vec4(v_tangent.xyz, 0.)).xyz;
        vec3 bitangent = cross(v_norm.xyz, tangent) * v_tangent.w;
        mat3 tangentToView = mat3(
            tangent,
            bitangent,
            v_norm.xyz
        );
        normal = normalize(tangentToView * normalMap);
    } else {
        normal = normalize(v_norm.xyz);
    }
    // encode Z normal sign in R. This is pretty stupid encoding but does the job.
    if (normal.z < 0.) {
        normal.x += 3.;
    }
    gbuf_normal = normal;
    
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
