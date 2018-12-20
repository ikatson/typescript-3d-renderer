import { ShaderSourceBuilder } from "../shaders.js";

const SSAO_FS = new ShaderSourceBuilder().addChunk(`
precision highp float;

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
    vec3 normalVS = (u_worldToCameraMatrix * vec4(normalWS.xyz, 0.)).xyz;

    vec3 tangent = normalize(random - normalVS * dot(normalVS, random));
    vec3 bitangent = cross(normalVS, tangent);
    
    mat3 tangentToViewSpaceMatrix = mat3(tangent, bitangent, normalVS );

    // return vec4(normal, 1.);
    // return vec4(tangentToViewSpaceMatrix * normalVS, 1.);

    float radius = u_ssaoRadius;
    float samples = float(SSAO_SAMPLES);
    float occlusion = samples;
    float bias = u_ssaoBias;

    for (int i = 0; i < SSAO_SAMPLES; i++) {
        vec4 randomVectorVS = vec4(tangentToViewSpaceMatrix * normalize(u_ssaoSamples[i]), 0.);

        // Sample in view space.
        vec4 sampleVS = u_worldToCameraMatrix * posWS + randomVectorVS * radius;

        vec4 sampleSS = u_perspectiveMatrix * sampleVS;
        vec3 sampleSS3 = sampleSS.xyz / sampleSS.w;

        vec4 storedPosWS = texture(gbuf_position, sampleSS3.xy / 2.0 + 0.5);
        float storedDepthVS = (u_worldToCameraMatrix * storedPosWS).z;

        float rangeCheck = smoothstep(0.0, 1.0, radius / abs(storedDepthVS - sampleVS.z));
        if (storedDepthVS > sampleVS.z + bias) {
            occlusion -= 1.0 * rangeCheck;
        }
    }
    occlusion = clamp(occlusion / samples, 0., 1.);
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