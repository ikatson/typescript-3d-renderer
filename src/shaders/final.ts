import { ShaderSourceBuilder } from "../shaders";
import {GBUF_TEXTURES, QUAD_FRAGMENT_INPUTS, WORLD_AND_CAMERA_TRANSFORMS} from "./includes/common";
import {PBR_INCLUDE} from "./includes/pbr";

const SHOW_LAYER_FS = new ShaderSourceBuilder()
    .addTopChunk(QUAD_FRAGMENT_INPUTS)
    .addTopChunk(GBUF_TEXTURES)
    .addChunk(`
layout(location = 0) out vec4 color;

uniform sampler2D u_ssaoTx;
uniform sampler2D u_shadowmapTx;

uniform float u_lightNear;
uniform float u_lightFar;

float eye_space_z(float depth, float near, float far) {
    float eye_z = near * far / ((depth * (far - near)) - far);
    float val = ( eye_z - (-near) ) / ( -far - (-near) );
    return val;
} 

void main() {
    #ifdef SHOW_SSAO
    color = vec4(vec3(texture(u_ssaoTx, tx_pos).r), 1.);
    return;
    #endif

    vec4 normal = GBUFFER_NORMAL(tx_pos);
    vec4 pos = GBUFFER_POSITION(tx_pos);
    vec4 albedo = GBUFFER_ALBEDO(tx_pos);
    
    metallicRoughness mr = gbufferMetallicRoughness(tx_pos);

    #ifdef SHOW_NORMALS
    // color = vec4(normal.xyz * .5 + .5, normal.a);
    color = normal;
    return;
    #endif

    #ifdef SHOW_POSITIONS
    color = pos;
    return;
    #endif

    #ifdef SHOW_COLORS
    color = albedo;
    return;
    #endif
    
    #ifdef SHOW_METALLIC
    color = vec4(vec3(mr.metallic), pos.a);
    return;
    #endif
    
    #ifdef SHOW_ROUGHNESS
    color = vec4(vec3(mr.roughness), pos.a);
    return;
    #endif

    #ifdef SHADOWMAP_ENABLED
    #ifdef SHOW_SHADOWMAP
    // color = vec4(vec3(eye_space_z(texture(u_shadowmapTx, tx_pos).r, u_lightNear, u_lightFar)), 1.);
    color = vec4(vec3(texture(u_shadowmapTx, tx_pos).r), 1.);
    return;
    #endif
    #endif

    color = vec4(.5, .0, .0, 1.);
    return;
}
`);

const LIGHTING_FS = new ShaderSourceBuilder()
    .addTopChunk(QUAD_FRAGMENT_INPUTS)
    .addTopChunk(WORLD_AND_CAMERA_TRANSFORMS)
    .addTopChunk(GBUF_TEXTURES)
    .addTopChunk(`
layout(location = 0) out vec4 color;

#define SHADOW_MAP_ERROR 0.99

uniform sampler2D u_ssaoTx;
uniform sampler2D u_shadowmapTx;

uniform mat4 u_cameraViewSpaceToLightCamera;

uniform float u_shadowMapFixedBias;
uniform float u_shadowMapNormalBias;
uniform float u_lightNear;
uniform float u_lightFar;

struct light {
    #ifdef DIRECTIONAL_LIGHT
    vec3 direction;
    #endif
    
    #ifdef POINT_LIGHT
    float radius;
    float attenuation;
    vec3 position;
    #endif
    
    vec3 color;
    float intensity;
};

uniform vec3[3] u_lightData;

light makeLight() {
    light l;
    
    #ifdef DIRECTIONAL_LIGHT
    l.direction = (u_worldToCameraMatrix * vec4(u_lightData[0], 0.)).xyz;
    #endif
    
    #ifdef POINT_LIGHT
    l.position = (u_worldToCameraMatrix * vec4(u_lightData[0], 1.)).xyz;
    l.radius = u_lightData[2].y;
    l.attenuation = u_lightData[2].z;
    #endif
    
    l.color = u_lightData[1];
    l.intensity = u_lightData[2].x;
    
    return l;
}
`)
    .addTopChunk(PBR_INCLUDE)
    .addChunk(`
void main() {
    vec4 normal = GBUFFER_NORMAL(tx_pos);
    vec4 pos = GBUFFER_POSITION(tx_pos);
    vec4 albedo = GBUFFER_ALBEDO(tx_pos);

    float metallic;
    float roughness;
    {
        metallicRoughness mr = gbufferMetallicRoughness(tx_pos);
        metallic = mr.metallic;
        roughness = mr.roughness;
    }

    // final color.
    vec3 c = vec3(0.);

    light l = makeLight();
    vec3 lc = vec3(0.);
    
    #ifdef POINT_LIGHT
    vec3 lightDir = normalize(pos.xyz - l.position);
    float distanceForAttenuation    = length(l.position - pos.xyz);
    float attenuation = UE4Falloff(distanceForAttenuation, l.radius);
    
    // color = vec4(1.);
    // return;
    #endif
    
    #ifdef DIRECTIONAL_LIGHT
    vec3 lightDir = l.direction;
    float attenuation = 1.;
    #endif
    
    #ifdef SSAO_ENABLED
    float ssao = texture(u_ssaoTx, tx_pos).r;
    #else
    float ssao = 1.0;
    #endif
    
    //ambient
    vec3 ambient = vec3(0.03) * albedo.rgb * l.color * ssao * attenuation;
    lc += ambient;

    #ifdef SHADOWMAP_ENABLED
    float bias = u_shadowMapFixedBias + u_shadowMapNormalBias * (1.0 - abs(dot(normal.xyz, -lightDir)));

    vec4 posLSS = u_cameraViewSpaceToLightCamera * pos;
    posLSS.xyz /= posLSS.w;
    
    // color = posLSS;
    // return;

    vec2 texmapscale = vec2(1. / SHADOW_MAP_WIDTH, 1. / SHADOW_MAP_HEIGHT);

    int notInShadowSamples = 0;
    float x, y;
    float shadowMapDepth;
    vec2 base = posLSS.xy * 0.5 + 0.5;

    for (y = -1.5; y <= 1.5; y += 1.0) {
        for (x = -1.5; x <= 1.5; x += 1.0) {
            vec2 offset = base + vec2(x, y) * texmapscale;
            
            // the depth buffer texture is clamped to 0, 1, so unclamp.
            shadowMapDepth = texture(u_shadowmapTx, offset).r * 2. - 1.;
            
            // out of bounds by X or Y
            if (offset.x < 0. || offset.y < 0. || offset.x > 1. || offset.y > 1.) {
                notInShadowSamples++;
                continue;
            }
            
            // out of bounds by Z case
            if (abs(posLSS.z) > 1.) {
                // if out of bounds by Z, then it's in shadow if there's anything else in view (i.e. there's depth)
                if (abs(shadowMapDepth) < SHADOW_MAP_ERROR) {
                    continue;
                }
                notInShadowSamples++;
                continue;
            } else if (shadowMapDepth > posLSS.z - bias) {
                notInShadowSamples++;
            }
        }
    }
    l.intensity *= float(notInShadowSamples) / 16.0;
    #endif
    
    // calculate per-light radiance
    vec3 radiance = l.color * attenuation * l.intensity;
    
    lc += CookTorranceBRDF(
        albedo.xyz, roughness, metallic, 
        -normalize(pos.xyz), normal.xyz, -lightDir, radiance
    );

    c += lc;

    color = vec4(c.xyz, 1.);
}
`);


const POINT_LIGHT_RADIUS_VS = new ShaderSourceBuilder()
    .addTopChunk(WORLD_AND_CAMERA_TRANSFORMS)
    .addChunk(`
in vec4 a_pos;
out vec2 tx_pos;

void main() {
    gl_Position = u_perspectiveMatrix * u_modelViewMatrix * a_pos;
    gl_Position /= gl_Position.w;
    tx_pos = (gl_Position.xy / gl_Position.w) / 2. + 0.5;
}
`);

export const FINAL_SHADER_SOURCE = {
    fs: LIGHTING_FS,
    showLayerFS: SHOW_LAYER_FS,
    pointLightSphere: POINT_LIGHT_RADIUS_VS,
};
