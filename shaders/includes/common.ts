export const GBUF_TEXTURES = `
uniform sampler2D gbuf_position;
uniform sampler2D gbuf_normal;
uniform sampler2D gbuf_colormap;
uniform sampler2D gbuf_specular;

#define GBUFFER_POSITION(coord) (texture(gbuf_position, coord))
#define GBUFFER_NORMAL(coord) (texture(gbuf_normal, coord) * 2. - 1.)
#define GBUFFER_ALBEDO(coord) (texture(gbuf_colormap, coord))
#define GBUFFER_SPECULAR(coord) (texture(gbuf_specular, coord).xyz)
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
