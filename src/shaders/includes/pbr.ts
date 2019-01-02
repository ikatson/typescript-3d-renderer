export const PBR_INCLUDE = `
const float PI = 3.14159265359;

// https://blog.selfshadow.com/publications/s2013-shading-course/karis/s2013_pbs_epic_notes_v2.pdf
float UE4Falloff(float distance, float lightRadius) {
    float nominator = clamp(0., 1., 1. - pow(distance / lightRadius, 4.)); 
    return nominator * nominator / (distance * distance + 1.);
}

float UE4NDF(float NdotH, float roughness)
{
    float a      = roughness*roughness;
    float a2     = a*a;
    float NdotH2 = NdotH*NdotH;
	
    float num   = a2;
    float denom = (NdotH2 * (a2 - 1.0) + 1.0);
    denom = PI * denom * denom;
	
    return num / denom;
}

float GeometrySchlickGGX(float NdotV, float roughness) {
    float r = (roughness + 1.0);
    float k = (r*r) / 8.0;

    float num   = NdotV;
    float denom = NdotV * (1.0 - k) + k;
	
    return num / denom;
}

float GeometrySmith(float NdotV, float NdotL, float roughness) {
    float ggx2  = GeometrySchlickGGX(NdotV, roughness);
    float ggx1  = GeometrySchlickGGX(NdotL, roughness);
    return ggx1 * ggx2;
}

vec3 fresnelSchlick(float cosTheta, vec3 F0) {
    return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);
}  


vec3 CookTorranceBRDF(
    vec3 albedo, float roughness, float metallic, 
    vec3 V, vec3 normal, vec3 L, vec3 radiance
) {
    vec3 H = normalize(V + L);
    vec3 N = normal;
    
    float NdotL = max(dot(N, L), 0.);
    float NdotH = max(dot(N, H), 0.);
    float NdotV = max(dot(N, V), 0.);
    float HdotV = max(dot(H, V), 0.);

    vec3 F0 = vec3(0.04); 
    F0 = mix(F0, albedo, metallic);

    float NDF = UE4NDF(NdotH, roughness);
    // return NDF * radiance * NdotL;
    
    float G = GeometrySmith(NdotV, NdotL, roughness);      
    vec3 F = fresnelSchlick(HdotV, F0);       
    
    vec3 kD = vec3(1.0) - F;
    kD *= 1.0 - metallic;	  
    
    vec3 numerator    = NDF * G * F;
    float denominator = 4.0 * NdotV * NdotL;
    vec3 specular     = numerator / max(denominator, 0.001);
        
    // add to outgoing radiance Lo
    return (kD * albedo.xyz / PI + specular) * radiance * NdotL; 
}

vec3 toneMap(vec3 color) {
    color = color / (color + vec3(1.0));
    color = pow(color, vec3(1.0/2.2));
    return color; 
}

`;
