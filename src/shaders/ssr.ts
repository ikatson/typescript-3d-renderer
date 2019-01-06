import {ShaderSourceBuilder} from "../shaders";
import {GBUF_TEXTURES, QUAD_FRAGMENT_INPUTS, WORLD_AND_CAMERA_TRANSFORMS} from "./includes/common";

const FS = new ShaderSourceBuilder()
    .addChunk(QUAD_FRAGMENT_INPUTS)
    .addChunk(WORLD_AND_CAMERA_TRANSFORMS)
    .addChunk(GBUF_TEXTURES)
    .addChunk(`
out vec4 color;
uniform sampler2D u_lightedSceneTx;

void main() {
    vec3 eye = vec3(0., 0., 0.);
    vec4 posVS = GBUFFER_POSITION(tx_pos);
    vec4 normalVS = GBUFFER_NORMAL(tx_pos);
    
    float metallic;
    float roughness;
    GBUFFER_MR(tx_pos, metallic, roughness);
    
    vec3 reflectRay = reflect(normalize(posVS.xyz - eye), normalVS.xyz);

    // float strength = (1. - roughness) * metallic;
    float strength = (1. - roughness);
    // float strength = (1. - pow(roughness, 3.));
    if (strength < 0.01) {
        color = vec4(vec3(0.), 0.);
        return;
    }
    
    vec3 c = vec3(0.);
    
    int i = 0;

    bool isFound = false;
    
    for (; i < SSR_STEPS; i++) {
        vec3 sampleVS = posVS.xyz + reflectRay * (SSR_STEP_SIZE * float(i + 1));
        vec4 sampleSS4 = u_perspectiveMatrix * vec4(sampleVS, 1.);
        vec3 sampleSS = sampleSS4.xyz / sampleSS4.w;
        
        // ignore off-screen samples
        if (abs(sampleSS.x) > 1. || abs(sampleSS.y) > 1.) {
            break;
        } 
        
        vec4 resultVS = GBUFFER_POSITION(sampleSS.xy * 0.5 + 0.5);
        
        // The ray intersected smth, do binary search
        float distance = resultVS.z - sampleVS.z;
        float minDistance = abs(distance);
        vec3 minPosSS = sampleSS;
        
        if (distance > 0. && resultVS.a > 0.) {
            vec3 dir = reflectRay * (SSR_STEP_SIZE * 0.5);
            for (int j = 0; j < SSR_BINARY_SEARCH_STEPS; ++j) {
                if (distance > 0. && resultVS.a > 0.) {
                    sampleVS -= dir;
                } else {
                    sampleVS += dir;
                }
                dir *= 0.5;
                
                sampleSS4 = u_perspectiveMatrix * vec4(sampleVS, 1.);
                sampleSS = sampleSS4.xyz / sampleSS4.w;
                
                resultVS = GBUFFER_POSITION(sampleSS.xy * 0.5 + 0.5);
                
                distance = resultVS.z - sampleVS.z;
                if (abs(distance) < minDistance) {
                    minDistance = abs(distance);
                    minPosSS = sampleSS;
                }
            }
            
            // c = vec3(distance);
            if (abs(minDistance) < 0.05) {
                float howFar = clamp(length(sampleVS - posVS.xyz) / (float(SSR_STEPS) * SSR_STEP_SIZE), 0., 1.);
                // the further the sample is from the start and the closer it is to screen edges, the more is attenuation.
                float attenuation = (1. - howFar) * (1. - smoothstep(.7, .95, abs(sampleSS.x))) * (1. - smoothstep(.7, .95, abs(sampleSS.y)));
                strength *= attenuation;
                c = texture(u_lightedSceneTx, minPosSS.xy * 0.5 + 0.5).xyz;
                isFound = true;
            }
            break;
        }
    }

    if (!isFound) {
        strength = 0.;
    }

    color = vec4(c, strength);
}
`);

export const SSR_SHADERS = {
    fs: FS,
};
