import {ArrayBufferDataType, GLArrayBufferData, GLArrayBufferDataParams, GLArrayBufferI} from "./glArrayBuffer";
import {VertexShader} from "./shaders";

export const QuadVertices = new Float32Array([
    -1.0, 1.0,
    -1.0, -1.0,
    1.0, 1.0,
    1.0, -1.0,
]);
export const QuadArrayBufferData = (() => {
    const params = new GLArrayBufferDataParams(
        false, false, 4, ArrayBufferDataType.TRIANGLE_STRIP
    );
    params.elementSize = 2;
    return new GLArrayBufferData(QuadVertices, params);
})();
export const FULLSCREEN_QUAD_VS = `
precision highp float;

in vec2 a_pos;
out vec2 v_pos;
out vec2 tx_pos;

void main() {
    gl_Position = vec4(a_pos, 0., 1.);
    v_pos = a_pos;
    tx_pos = v_pos.xy * 0.5 + 0.5;
}
`;

export class FullScreenQuad {
    private glArrayBuffer: GLArrayBufferI;
    vertexShader: VertexShader;

    constructor(gl: WebGL2RenderingContext, quadBuffer: GLArrayBufferI) {
        this.glArrayBuffer = quadBuffer;
        this.vertexShader = new VertexShader(gl, FULLSCREEN_QUAD_VS);
        // this object owns the shader, don't let others delete it recursively.
        this.vertexShader.setAutodelete(false);
    }

    bind(gl: WebGL2RenderingContext, vertexPositionLocation: number) {
        this.glArrayBuffer.setupVertexPositionsPointer(gl, vertexPositionLocation);
    }

    draw(gl: WebGL2RenderingContext) {
        this.glArrayBuffer.draw(gl);
    }
}
