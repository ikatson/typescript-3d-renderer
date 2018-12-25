import { ShaderSourceBuilder } from "../shaders.js";
import {GBUF_TEXTURES, QUAD_FRAGMENT_INPUTS, WORLD_AND_CAMERA_TRANSFORMS} from "./includes/common.js";

const LIGHTING_FS = new ShaderSourceBuilder()
    .setPrecision('highp')
    .addTopChunk(QUAD_FRAGMENT_INPUTS)
    .addTopChunk(WORLD_AND_CAMERA_TRANSFORMS)
    .addTopChunk(GBUF_TEXTURES)
    .addChunk(`
layout(location = 0) out vec4 color;

uniform sampler2D u_ssaoTx;
uniform sampler2D u_shadowmapTx;

uniform mat4 u_cameraViewSpaceToLightCamera;

struct light {
    vec3 position;
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float intensity;
    float radius;
    float attenuation;
};

uniform vec3[LIGHT_COUNT * 5] u_lightData;

float getSsaoBlurred() {
    return texture(u_ssaoTx, tx_pos).r;
}

light makeLight(int i) {
    light l;
    l.position = (u_worldToCameraMatrix * vec4(u_lightData[i * 5], 1.)).xyz;
    l.ambient = u_lightData[i * 5 + 1];
    l.diffuse = u_lightData[i * 5 + 2];
    l.specular = u_lightData[i * 5 + 3];
    l.intensity = u_lightData[i * 5 + 4].x;
    l.radius = u_lightData[i * 5 + 4].y;
    l.attenuation = u_lightData[i * 5 + 4].z;
    return l;
}

void main() {
    #ifdef SHOW_SSAO
    color = vec4(vec3(getSsaoBlurred()), 1.);
    return;
    #endif

    vec4 normal = texture(gbuf_normal, tx_pos);
    vec4 pos = texture(gbuf_position, tx_pos);
    vec4 tcolor = texture(gbuf_colormap, tx_pos);

    #ifdef SHOW_NORMALS
    color = vec4(normal.xyz / 2.0 + 0.5, normal.a);
    return;
    #endif

    #ifdef SHOW_POSITIONS
    // vec4 lpos = u_cameraViewSpaceToLightCamera * pos;
    // lpos /= lpos.w;
    // color = vec4(vec3(lpos.z * 0.5 + 0.5), 1.);
    color = pos;
    return;
    #endif

    #ifdef SHOW_COLORS
    color = tcolor;
    return;
    #endif

    #ifdef SHADOWMAP_ENABLED
    #ifdef SHOW_SHADOWMAP
    color = vec4(abs(texture(u_shadowmapTx, tx_pos).rrr), 1.);
    return;
    #endif
    #endif

    #ifdef SSAO_ENABLED
    float ssao = getSsaoBlurred();
    #else
    float ssao = 1.0;
    #endif

    vec3 eye = vec3(0.);

    // final color.
    vec3 c = vec3(0.);

    for (int i = 0; i < LIGHT_COUNT; i++) {
        light l = makeLight(i);

        vec3 colAmbient = tcolor.xyz * l.ambient;
        vec3 colDiffuse = tcolor.xyz * l.diffuse;
        vec3 colSpecular = tcolor.xyz * l.specular;
        float shininess = 10.;

        vec3 lc = vec3(0.);
        vec3 lightDir = pos.xyz - l.position;

        //ambient
        vec3 ambient = colAmbient * l.intensity * ssao;
        lc += ambient;

        #ifdef SHADOWMAP_ENABLED
        // SHADOW MAP sample
        // Only the first light casts shadows for now
        if (i == 0) {
            float bias = 0.001 + 0.002 * (1.0 - abs(dot(normal.xyz, normalize(l.position - pos.xyz))));

            vec4 posLSS = u_cameraViewSpaceToLightCamera * pos;
            posLSS.xyz /= posLSS.w;
            
            // color = posLSS;
            // return;

            vec2 texmapscale = vec2(1. / SHADOW_MAP_WIDTH, 1. / SHADOW_MAP_HEIGHT);

            int sum = 0;
            float x, y;
            float shadowMapDepth;
            vec2 base = posLSS.xy * 0.5 + 0.5;

            for (y = -1.5; y <= 1.5; y += 1.0) {
                for (x = -1.5; x <= 1.5; x += 1.0) {
                    vec2 offset = base + vec2(x, y) * texmapscale;
                    shadowMapDepth = texture(u_shadowmapTx, offset).r;
                    if (abs(offset.x) < 1. && abs(offset.y) < 1. && abs(posLSS.z) < 1. && shadowMapDepth > posLSS.z - bias)  {
                        sum++;
                    }
                }
            }
            l.intensity *= float(sum) / 16.0;
        }
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

        if (l.radius > 0.) {
            lc *= 1. - smoothstep(l.radius, l.radius + l.attenuation, length(lightDir));
        }

        c += lc;
    }
    color = vec4(c.xyz, 1.);
}
`);

export const FINAL_SHADER_SOURCE = {
    fs: LIGHTING_FS
};
