export const GBUF_TEXTURES = `
uniform sampler2D gbuf_position;
uniform sampler2D gbuf_normal;
uniform sampler2D gbuf_colormap;
uniform sampler2D gbuf_metallic_roughness;

vec4 read_gbuffer_normal(vec2 pos) {
    vec3 val = texture(gbuf_normal, pos).xyz;
    bool zIsNegative = false;
    if (val.x > 1.5) {
        val.x -= 3.;
        zIsNegative = true;
    }
    // clamp is for float error correction
    val.z = sqrt(clamp(1. - val.x * val.x - val.y * val.y, 0., 1.));
    if (zIsNegative) {
        val.z = -val.z;
    }
    val = normalize(val);
    return vec4(val, 0.);
}

struct metallicRoughness {
    float metallic;
    float roughness;
};

void gbufferMetallicRoughness(vec2 coord, out float metallic, out float roughness) {
    vec4 tx = texture(gbuf_metallic_roughness, coord);
    metallic = tx.r;
    roughness = tx.g;
    return;
}

#define GBUFFER_POSITION(coord) (texture(gbuf_position, coord))
#define GBUFFER_NORMAL(coord) (read_gbuffer_normal(coord))
#define GBUFFER_ALBEDO(coord) (texture(gbuf_colormap, coord))
#define GBUFFER_MR(coord, metallic, roughness)     gbufferMetallicRoughness(coord, metallic, roughness)
`;

export const QUAD_FRAGMENT_INPUTS = `
in vec2 v_pos;
in vec2 tx_pos;
`;

export const WORLD_AND_CAMERA_TRANSFORMS = `
uniform vec3 u_cameraPos;
uniform mat4 u_modelViewMatrix;
uniform mat4 u_modelWorldMatrix;
uniform mat4 u_worldToCameraMatrix;
uniform mat4 u_cameraToWorldMatrix;
uniform mat4 u_perspectiveMatrix;
`;
