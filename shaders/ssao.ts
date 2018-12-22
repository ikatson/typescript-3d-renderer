import { ShaderSourceBuilder } from "../shaders.js";

const SSAO_FS = new ShaderSourceBuilder().addChunk(`
precision lowp float;

in vec2 v_pos;
in vec2 tx_pos;

layout(location = 0) out vec4 color;

uniform sampler2D gbuf_position;
uniform sampler2D gbuf_normal;
uniform sampler2D gbuf_colormap;

uniform float u_ssaoRadius;
uniform float u_ssaoBias;
uniform sampler2D u_ssaoNoise;
uniform vec2 u_ssaoNoiseScale;
uniform vec3[SSAO_SAMPLES] u_ssaoSamples;

uniform vec3 u_cameraPos;
uniform mat4 u_worldToCameraMatrix;
uniform mat4 u_perspectiveMatrix;

float ssao(vec4 normalWS, vec4 posWS, vec2 tx_pos) {
    vec3 random = normalize(texture(u_ssaoNoise, tx_pos * u_ssaoNoiseScale).xyz);
    // vec3 random = normalize(vec3(1., 1., 0.));
    vec3 normalVS = (u_worldToCameraMatrix * vec4(normalWS.xyz, 0.)).xyz;

    vec3 tangent = normalize(random - normalVS * dot(normalVS, random));
    vec3 bitangent = cross(normalVS, tangent);
    
    mat3 tangentToViewSpaceMatrix = mat3(tangent, bitangent, normalVS );

    // return vec4(normal, 1.);
    // return vec4(tangentToViewSpaceMatrix * normalVS, 1.);

    float radius = u_ssaoRadius;
    float samples = float(SSAO_SAMPLES);
    float occlusion = 0.;
    float totalWeight = 0.;
    float bias = u_ssaoBias;

    for (int i = 0; i < SSAO_SAMPLES; i++) {
        vec4 randomVectorVS = vec4(tangentToViewSpaceMatrix * u_ssaoSamples[i], 0.);
        // vec4 randomVectorVS = vec4(tangentToViewSpaceMatrix * vec3(0., 0., 1.), 0.);

        // Sample in view space.
        vec4 posVS = u_worldToCameraMatrix * posWS;
        vec4 sampleVS = posVS + randomVectorVS * radius;

        vec4 sampleSS = u_perspectiveMatrix * sampleVS;
        sampleSS /= sampleSS.w;
        
        float weight = dot(randomVectorVS.xyz, normalVS.xyz);
        totalWeight += weight;

        vec2 absSampleSS = abs(sampleSS.xy);
        if (absSampleSS.x >= 1. || absSampleSS.y >= 1.) {
            continue;
        }
        if (sampleSS.a < 0.00001) {
            continue;
        }

        vec4 storedPosWS = texture(gbuf_position, sampleSS.xy * 0.5 + 0.5);
        vec4 storedPosVS = u_worldToCameraMatrix * storedPosWS;
        float storedDepthVS = storedPosVS.z;

        // float falloff = smoothstep(0.0, 1.0, radius / abs(storedDepthVS - sampleVS.z));
        
        // float falloff = 1.;
        if (storedDepthVS > sampleVS.z + bias) {
            float falloff = smoothstep(0.0, 1.0, radius / length(storedPosVS.xyz - posVS.xyz));
            occlusion += falloff * weight;
        }
    }
    occlusion = 1. - (occlusion / totalWeight);
    return occlusion;
}

void main() {
    vec4 normal = texture(gbuf_normal, tx_pos);
    vec4 pos = texture(gbuf_position, tx_pos);

    float occlusion = ssao(normal, pos, tx_pos);
    color = vec4(vec3(occlusion), pos.a);
}
`)

export const SSAO_SHADER_SOURCE = {
    fs: SSAO_FS
}