export const GBUF_TEXTURES = `
uniform sampler2D gbuf_position;
uniform sampler2D gbuf_normal;
uniform sampler2D gbuf_colormap;
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
uniform mat4 u_perspectiveMatrix;
`;
