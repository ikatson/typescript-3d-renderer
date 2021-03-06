export const ATTRIBUTE_POSITION = "a_pos";
export const ATTRIBUTE_POSITION_LOC = 0;
export const ATTRIBUTE_NORMALS = "a_norm";
export const ATTRIBUTE_NORMALS_LOC = 1;
export const ATTRIBUTE_UV = "a_uv";
export const ATTRIBUTE_UV_LOC = 2;
export const ATTRIBUTE_TANGENT = "a_tangent";
export const ATTRIBUTE_TANGENT_LOC = 3;
export const UNIFORM_CAMERA_POSITION = "u_cameraPos";
export const UNIFORM_WORLD_TO_CAMERA_MAT4 = "u_worldToCameraMatrix";
export const UNIFORM_CAMERA_TO_WORLD_MAT4 = "u_cameraToWorldMatrix";
export const UNIFORM_PERSPECTIVE_MATRIX = "u_perspectiveMatrix";
export const UNIFORM_MODEL_WORLD_MATRIX = "u_modelWorldMatrix";
export const UNIFORM_MODEL_VIEW_MATRIX = "u_modelViewMatrix";
export const UNIFORM_GBUF_POSITION = "gbuf_position";
export const UNIFORM_GBUF_NORMAL = "gbuf_normal";
export const UNIFORM_GBUF_ALBEDO = "gbuf_colormap";
export const UNIFORM_GBUF_MR = "gbuf_metallic_roughness";
export const UNIFORM_HAS_TANGENT = "u_hasTangent";

export const SAMPLE_GLTF_SPONZA = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Sponza/glTF/Sponza.gltf";

// DDS variant produced like this:
// cat Sponza.gltf | sed -E 's/\.(jpg|png)/.\1.dds/g' | sed -E 's/(image\/jpeg|image\/png)/image\/vnd-ms.dds/g' > Sponza-dds.gltf
export const SAMPLE_GLTF_SPONZA_DDS = "https://raw.githubusercontent.com/ikatson/glTF-Sample-Models/master/2.0/Sponza/glTF/Sponza-dds.gltf";
