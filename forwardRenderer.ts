import { Scene } from "./scene.js";
import { Camera } from "./camera.js";
import { mat4 } from "./gl-matrix.js";
import { GameObject } from "./object.js";
import { glClearColorAndDepth } from "./utils.js";

export class ForwardRenderer {
    gl: WebGLRenderingContext;
    timeStart: number;
    
    constructor(gl: WebGLRenderingContext) {
        this.gl = gl;
        this.timeStart = (new Date()).getTime() / 1000.;
    }

    render(scene: Scene, camera: Camera) {
        const gl = this.gl;
        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);

        // Global variables
        const df: number = (new Date()).getTime() / 1000. - this.timeStart;

        const mv = camera.getWorldToCamera();

        glClearColorAndDepth(gl, 0, 0, 0, 1);

        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);

        function renderObject(o: GameObject) {
            const modelViewMatrix = mat4.create();
            mat4.multiply(modelViewMatrix, mv, o.getModelToWorld());
            
            const program = o.material.getProgram();
            
            o.prepareMeshVertexAndShaderDataForRendering(gl);

            const mvLoc = program.getUniformLocation(gl, "u_modelViewMatrix");
            const perspLoc = program.getUniformLocation(gl, "u_perspectiveMatrix");
            const timeLoc = program.getUniformLocation(gl, "u_time");
            const aoTexLoc = program.getUniformLocation(gl, "u_sampler_ao");
            const normTexLoc = program.getUniformLocation(gl, "u_sampler_normals");

            // Render the object
            gl.uniformMatrix4fv(mvLoc, false, modelViewMatrix);
            gl.uniformMatrix4fv(perspLoc, false, camera.projectionMatrix());
            
            gl.uniform1f(timeLoc, df);

            // ambient occlusion map.
            const AOtexture = o.material.getAmbientOcclusionTexture();
            if (AOtexture) {
                gl.uniform1i(aoTexLoc, AOtexture.getShaderLocation(gl));
            }

            // normal map.
            const NORMtexture = o.material.getNormalMapTexture();
            if (NORMtexture) {
                gl.uniform1i(normTexLoc, NORMtexture.getShaderLocation(gl));
            }

            gl.drawArrays(gl.TRIANGLES, 0, o.mesh.getVertexCount());

            o.children.forEach(o => renderObject(o))
        }

        scene.children.forEach(o => renderObject(o))
    }
}