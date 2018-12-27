import { ShaderSourceBuilder } from "../shaders.js";
import {GBUF_TEXTURES, QUAD_FRAGMENT_INPUTS, WORLD_AND_CAMERA_TRANSFORMS} from "./includes/common.js";

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
    vec4 tcolor = GBUFFER_ALBEDO(tx_pos);
    vec4 _specular = GBUFFER_SPECULAR(tx_pos);
    vec3 tspecular = _specular.xyz;
    float tshininess = _specular.a * 256.;

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
    color = tcolor;
    return;
    #endif
    
    #ifdef SHOW_SPECULAR
    color = vec4(tspecular, pos.a);
    return;
    #endif
    
    #ifdef SHOW_SHININESS
    color = vec4(vec3(tshininess / 256.0), pos.a);
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
    .addChunk(`
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
    
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float intensity;
};

uniform vec3[5] u_lightData;

float getSsaoBlurred() {
    return texture(u_ssaoTx, tx_pos).r;
}

light makeLight() {
    // TODO: remove i
    int i = 0;
    light l;
    
    #ifdef DIRECTIONAL_LIGHT
    l.direction = u_lightData[0];
    #endif
    
    #ifdef POINT_LIGHT
    l.position = (u_worldToCameraMatrix * vec4(u_lightData[i * 5], 1.)).xyz;
    l.radius = u_lightData[i * 5 + 4].y;
    l.attenuation = u_lightData[i * 5 + 4].z;
    #endif
    
    l.ambient = u_lightData[i * 5 + 1];
    l.diffuse = u_lightData[i * 5 + 2];
    l.specular = u_lightData[i * 5 + 3];
    l.intensity = u_lightData[i * 5 + 4].x;
    
    return l;
}

float eye_space_z(float depth, float near, float far) {
    float eye_z = near * far / ((depth * (far - near)) - far);
    float val = ( eye_z - (-near) ) / ( -far - (-near) );
    return val;
} 

void main() {
    vec4 normal = GBUFFER_NORMAL(tx_pos);
    vec4 pos = GBUFFER_POSITION(tx_pos);
    vec4 tcolor = GBUFFER_ALBEDO(tx_pos);
    vec4 _specular = GBUFFER_SPECULAR(tx_pos);
    vec3 tspecular = _specular.xyz;
    float tshininess = _specular.a * 256.;

    vec3 eye = vec3(0.);

    // final color.
    vec3 c = vec3(0.);

    light l = makeLight();

    vec3 colAmbient = tcolor.xyz * l.ambient;
    vec3 colDiffuse = tcolor.xyz * l.diffuse;
    vec3 colSpecular = tspecular.xyz * l.specular;
    float shininess = tshininess;

    vec3 lc = vec3(0.);
    
    #ifdef POINT_LIGHT
    vec3 lightDir = normalize(pos.xyz - l.position);
    #endif
    
    #ifdef DIRECTIONAL_LIGHT
    vec3 lightDir = l.direction;
    #endif
    
    #ifdef SSAO_ENABLED
    float ssao = texture(u_ssaoTx, tx_pos).r;
    #else
    float ssao = 1.0;
    #endif

    //ambient
    vec3 ambient = colAmbient * l.intensity * ssao;
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

    // diffuse
    lc += colDiffuse * l.intensity * max(dot(normal.xyz, normalize(-lightDir)), 0.) * pos.a;

    // specular
    lc += colSpecular * l.intensity * pow(
        max(
            dot(
                normalize(reflect(lightDir, normal.xyz)),
                normalize(eye - pos.xyz)
            ), 
            0.
        ), 
        shininess
    );

    #ifdef POINT_LIGHT
    if (l.radius > 0.) {
        lc *= 1. - smoothstep(l.radius, l.radius + l.attenuation, length(lightDir));
    }
    #endif

    c += lc;

    color = vec4(c.xyz, 1.);
}
`);

export const FINAL_SHADER_SOURCE = {
    fs: LIGHTING_FS,
    showLayerFS: SHOW_LAYER_FS,
};
