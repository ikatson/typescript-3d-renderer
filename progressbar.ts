import {FragmentShader, ShaderProgram, VertexShader} from "./shaders.js";
import { FullScreenQuad } from "./utils.js";

export class ProgressBarCommon {
    fs: FragmentShader
    vs: VertexShader
    program: ShaderProgram
    fullScreenBuffer: FullScreenQuad
    posLoc: number
    percentLoc: WebGLUniformLocation

    constructor(gl: WebGLRenderingContext, fullScreenBuffer: FullScreenQuad) {
        this.fullScreenBuffer = fullScreenBuffer;
        this.vs = new VertexShader(gl, `
        precision highp float;
        in vec2 a_pos;
        uniform float percent;
        out vec2 v_pos;

        void main() {
            gl_Position = vec4((a_pos.x + 1.) * percent - 1., a_pos.y * 0.05, 0., 1.);
            v_pos = a_pos;
        }
        `)
        this.fs = new FragmentShader(gl, `
        precision highp float;
        in vec2 v_pos;
        out vec4 color;
        uniform float percent;
        
        void main() {
            // color = vec4(0.5, 1., 1., 1.);

            // just some random crap to test that variables work.
            // looks OK in the end, so left it.
            color = vec4(v_pos / 2. + 0.5, percent, 1.);
        }
        `)
        this.program = new ShaderProgram(gl, this.vs, this.fs);
        
        this.posLoc = this.program.getAttribLocation(gl, "a_pos");
        this.percentLoc = this.program.getUniformLocation(gl, "percent")
    }

    bind(gl: WebGLRenderingContext) {
        gl.useProgram(this.program.getProgram());
        this.fullScreenBuffer.bind(gl, this.posLoc);
    }

    delete(gl: WebGLRenderingContext) {
        this.fs.delete(gl);
    }
}

export class ProgressBar {
    common: ProgressBarCommon;
    constructor(gl: WebGLRenderingContext, common: ProgressBarCommon) {
        this.common = common;
    }
    prepare(gl: WebGLRenderingContext) {
        this.common.bind(gl);
    }
    render(gl: WebGLRenderingContext, percent: number) {
        gl.uniform1f(this.common.percentLoc, percent);
        this.common.fullScreenBuffer.drawArrays(gl);
    }
    delete() {

    }
}