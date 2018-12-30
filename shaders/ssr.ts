import {ShaderSourceBuilder} from "../shaders.js";
import {GBUF_TEXTURES, QUAD_FRAGMENT_INPUTS, WORLD_AND_CAMERA_TRANSFORMS} from "./includes/common.js";

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
    
    vec3 reflectRay = reflect(normalize(posVS.xyz - eye), normalVS.xyz);
    color = vec4(reflectRay, 1.0);
    
    vec3 c = vec3(0.);
    float minZ = 0.; 
    
    for (int i = 0; i < SSR_STEPS; i++) {
        vec3 sampleVS = posVS.xyz + reflectRay * (SSR_STEP_SIZE * float(i + 1));
        vec4 sampleSS4 = u_perspectiveMatrix * vec4(sampleVS, 1.);
        vec3 sampleSS = sampleSS4.xyz / sampleSS4.w;
        
        // ignore off-screen samples
        if (sampleSS.x < -1. || sampleSS.x > 1. || sampleSS.y < -1. || sampleSS.y > 1.) {
            break;
        } 
        
        vec4 resultVS = GBUFFER_POSITION(sampleSS.xy * 0.5 + 0.5);
        
        float distance = -(sampleVS.z - resultVS.z);
        if (distance > 0. && distance < 0.02) {
            // c = vec3(1. / float(i + 1));
            c = texture(u_lightedSceneTx, sampleSS.xy * 0.5 + 0.5).xyz;
            break;
        }
    }
    
    color = vec4(c, 1.);
}
`);

export const SSR_SHADERS = {
    fs: FS,
};
