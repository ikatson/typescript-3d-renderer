import { Camera } from "./camera.js";
import { mat4 } from "./gl-matrix.js";
import { GLMesh } from "./mesh.js";
import { GameObject } from "./object.js";
import { Scene } from "./scene.js";
import { FragmentShader, ShaderProgram, VertexShader } from "./shaders.js";
import { FINAL_SHADER_SOURCE } from "./shaders/final.js";
import { GBUFFER_SHADER_SOURCE } from "./shaders/gBuffer/shaders.js";
import { SSAO_SHADER_SOURCE } from "./shaders/ssao.js";
import { VISUALIZE_LIGHTS_SHADERS } from "./shaders/visualize-lights.js";
import { SSAO } from "./ssao.js";
import { FullScreenQuad, glClearColorAndDepth } from "./utils.js";
import { vec3 } from "./gl-matrix.js";
import { SHADOWMAP_SHADERS } from "./shaders/shadowMap.js";


export class SSAORuntimConfigurables {
    radius: number = 0.1;
    bias: number = 0.025;
    strength: number = 1.0;
}

export enum ShowLayer {
    Final = 1,
    Positions,
    Normals,
    Color,
    SSAO,
    ShadowMap
}

export class DeferredRendererRuntimeConfigurables {
    showLayer: ShowLayer = ShowLayer.Final;
    ssao = new SSAORuntimConfigurables();
}

const tmpMatrix = (function () {
    const m = mat4.create();
    return () => {
        mat4.identity(m);
        return m;
    }
})()

export class DeferredRenderer {
    private gl: WebGLRenderingContext;
    timeStart: number;

    posTx: WebGLTexture;
    normalTX: WebGLTexture;
    colorTX: WebGLTexture;
    depthTx: WebGLTexture;

    gFrameBuffer: WebGLFramebuffer;
    gBufferShader: ShaderProgram;

    fullScreenQuad: FullScreenQuad;

    lightingShader: ShaderProgram;

    ssaoFrameBuffer: WebGLFramebuffer;
    ssaoParameters: SSAO;
    ssaoShader: ShaderProgram;
    ssaoTx: WebGLTexture;
    config = new DeferredRendererRuntimeConfigurables()
    forceShadersRecompile: boolean = true;
    lastLightCount: number = 0;
    sphereMesh: GLMesh;
    visualizeLightsShader: ShaderProgram;
    shadowMapTx: WebGLTexture;
    shadowMapFB: WebGLFramebuffer;
    shadowMapShader: ShaderProgram;

    constructor(gl: WebGLRenderingContext, fullScreenQuad: FullScreenQuad, sphere: GLMesh) {
        this.gl = gl;
        this.timeStart = (new Date()).getTime() / 1000.

        this.colorTX = this.createAndBindFullScreenBufferTexture(gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE);
        this.normalTX = this.createAndBindFullScreenBufferTexture(gl.RGBA16F, gl.RGBA, gl.FLOAT);
        this.posTx = this.createAndBindFullScreenBufferTexture(gl.RGBA16F, gl.RGBA, gl.FLOAT);
        this.depthTx = this.createAndBindFullScreenBufferTexture(gl.DEPTH_COMPONENT16, gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT);

        this.shadowMapTx = this.createAndBindFullScreenBufferTexture(gl.R32F, gl.RED, gl.FLOAT);
        this.shadowMapFB = gl.createFramebuffer();

        this.gFrameBuffer = gl.createFramebuffer();
        this.fullScreenQuad = fullScreenQuad;
        this.ssaoParameters = new SSAO(gl, 16, 4);

        // TODO: remove this fb, use the same one.
        this.ssaoFrameBuffer = gl.createFramebuffer()
        this.ssaoTx = this.createAndBindFullScreenBufferTexture(gl.R16F, gl.RED, gl.FLOAT);
        
        this.sphereMesh = sphere;
        this.recompileShaders();
    }

    private createAndBindFullScreenBufferTexture(internalFormat: number, format: number, type: number): WebGLTexture {
        const gl = this.gl;

        let tx = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tx);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        gl.texImage2D(gl.TEXTURE_2D,
            0,
            internalFormat,
            gl.canvas.width,
            gl.canvas.height,
            0,
            format,
            type,
            null
        );
        return tx;
    }

    recompileShaders() {
        this.forceShadersRecompile = true;
    }

    private shadersNeedRecompile(lightCount: number) {
        return this.forceShadersRecompile || this.lastLightCount != lightCount;
    }

    private actuallyRecompileShaders(lightCount: number) {
        [this.ssaoShader, this.lightingShader, this.gBufferShader, this.visualizeLightsShader, this.shadowMapShader].forEach(s => {
            if (!s) {
                return;
            }
            s.deleteAll(this.gl);
        });

        const gl = this.gl;

        this.ssaoShader = new ShaderProgram(
            gl, this.fullScreenQuad.vertexShader, new FragmentShader(gl,
                SSAO_SHADER_SOURCE.fs
                    .clone()
                    .define("SSAO_SAMPLES", this.ssaoParameters.sampleCount.toString())
                    .build()
            )
        )

        this.lightingShader = new ShaderProgram(
            gl,
            this.fullScreenQuad.vertexShader,
            new FragmentShader(
                gl,
                FINAL_SHADER_SOURCE.fs
                    .clone()
                    .define('LIGHT_COUNT', lightCount.toString())
                    .define('SCREEN_WIDTH', gl.canvas.width.toString())
                    .define('SCREEN_HEIGHT', gl.canvas.height.toString())
                    .defineIfTrue('SSAO_ENABLED', this.ssaoEnabled())
                    .defineIfTrue('SHOW_SSAO', this.config.showLayer === ShowLayer.SSAO)
                    .defineIfTrue('SHOW_COLORS', this.config.showLayer === ShowLayer.Color)
                    .defineIfTrue('SHOW_POSITIONS', this.config.showLayer === ShowLayer.Positions)
                    .defineIfTrue('SHOW_SHADOWMAP', this.config.showLayer === ShowLayer.ShadowMap)
                    .defineIfTrue('SHOW_NORMALS', this.config.showLayer === ShowLayer.Normals)
                    .define('SSAO_NOISE_SCALE', this.ssaoParameters.rotationPower.toString())
                    .build()
            )
        )

        this.shadowMapShader = new ShaderProgram(
            gl,
            new VertexShader(
                gl,
                SHADOWMAP_SHADERS.vs
                .build(),
            ),
            new FragmentShader(
                gl,
                SHADOWMAP_SHADERS.fs
                .build(),
            )
        );

        this.gBufferShader = new ShaderProgram(
            gl,
            new VertexShader(gl, GBUFFER_SHADER_SOURCE.vs),
            new FragmentShader(gl, GBUFFER_SHADER_SOURCE.fs)
        )

        this.visualizeLightsShader = new ShaderProgram(
            gl,
            new VertexShader(gl, VISUALIZE_LIGHTS_SHADERS.vs.build()),
            new FragmentShader(gl, VISUALIZE_LIGHTS_SHADERS.FS.build())
        )

        this.forceShadersRecompile = false;
        this.lastLightCount = lightCount;
    }

    private ssaoEnabled(): boolean {
        return this.config.ssao.strength > 0;
    }

    render(scene: Scene, camera: Camera) {
        const gl = this.gl;
        const deltaTime: number = (new Date()).getTime() / 1000. - this.timeStart;
        const worldToCamera = camera.getWorldToCamera();
        const projectionMatrix = camera.projectionMatrix();

        const lCamera = this.getSunCamera(gl, scene.lights[0], camera);
        const lProjection = lCamera.projectionMatrix();
        const lWorldToCamera = lCamera.getWorldToCamera();

        if (this.forceShadersRecompile || this.lastLightCount != scene.lights.length) {
            this.actuallyRecompileShaders(scene.lights.length);
        }

        gl.disable(gl.BLEND);

        const renderGBuffer = () => {
            gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.gFrameBuffer);

            gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + 0, gl.TEXTURE_2D, this.posTx, 0);
            gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + 1, gl.TEXTURE_2D, this.normalTX, 0);
            gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + 2, gl.TEXTURE_2D, this.colorTX, 0);
            gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.depthTx, 0);

            checkFrameBufferStatusOrThrow(gl);

            glClearColorAndDepth(gl, 0, 0, 0, 0.);

            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST);

            const program = this.gBufferShader;
            gl.useProgram(program.getProgram());

            gl.uniform1f(program.getUniformLocation(gl, "u_time"), deltaTime);
            gl.uniform3fv(program.getUniformLocation(gl, "u_cameraPos"), camera.position);
            gl.uniformMatrix4fv(program.getUniformLocation(gl, "u_worldToCameraMatrix"), false, worldToCamera);
            gl.uniformMatrix4fv(program.getUniformLocation(gl, "u_perspectiveMatrix"), false, projectionMatrix);

            const renderObject = (o: GameObject) => {
                if (o.mesh != null) {
                    const modelWorldMatrix = o.transform.getModelToWorld();
                    const modelViewMatrix = tmpMatrix();
                    mat4.multiply(modelViewMatrix, worldToCamera, modelWorldMatrix);
    
                    o.mesh.prepareMeshVertexAndShaderDataForRendering(gl, program);
    
                    gl.uniformMatrix4fv(program.getUniformLocation(gl, "u_modelViewMatrix"), false, modelViewMatrix);
                    gl.uniformMatrix4fv(program.getUniformLocation(gl, "u_modelWorldMatrix"), false, modelWorldMatrix);
                    
                    gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1, gl.COLOR_ATTACHMENT2]);

                    o.mesh.mesh.draw(gl);
                    // gl.drawArrays(gl.TRIANGLES, 0, o.mesh.mesh.getVertexCount());
                }

                o.children.forEach(o => renderObject(o))
            }

            scene.children.forEach(o => renderObject(o))
        }

        const renderSSAO = () => {
            const s = this.ssaoShader;

            gl.bindFramebuffer(gl.FRAMEBUFFER, this.ssaoFrameBuffer);
            gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.ssaoTx, 0);
            checkFrameBufferStatusOrThrow(gl);

            s.use(gl);

            glClearColorAndDepth(gl, 0., 0, 0, 1.);

            this.fullScreenQuad.bind(gl, s.getAttribLocation(gl, "a_pos"));

            this.bindUniformTx(s, "gbuf_position", this.posTx, 0);
            this.bindUniformTx(s, "gbuf_normal", this.normalTX, 1);
            this.bindUniformTx(s, "u_ssaoNoise", this.ssaoParameters.noiseTexture, 2);

            // Common uniforms
            gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_worldToCameraMatrix"), false, worldToCamera);
            gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_perspectiveMatrix"), false, projectionMatrix);

            // SSAO
            gl.uniform1f(s.getUniformLocation(gl, "u_ssaoRadius"), this.config.ssao.radius);
            gl.uniform1f(s.getUniformLocation(gl, "u_ssaoBias"), this.config.ssao.bias);
            gl.uniform3fv(s.getUniformLocation(gl, "u_ssaoSamples"), this.ssaoParameters.tangentSpaceSamples);
            gl.uniform2fv(
                s.getUniformLocation(gl, "u_ssaoNoiseScale"),
                [gl.canvas.width / this.ssaoParameters.rotationPower, gl.canvas.height / this.ssaoParameters.rotationPower]
            );

            // Draw
            this.fullScreenQuad.drawArrays(gl);
        }

        const renderShadowMap = () => {
            gl.enable(gl.DEPTH_TEST);
            gl.disable(gl.CULL_FACE);

            const s = this.shadowMapShader;

            gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.shadowMapFB);
            gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.shadowMapTx, 0);
            checkFrameBufferStatusOrThrow(gl);

            glClearColorAndDepth(gl, 0., 0, 0., 1.);

            s.use(gl);

            gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_perspectiveMatrix"), false, lProjection);

            const drawObject = (o: GameObject) => {
                if (!o.mesh || !o.mesh.shadowCaster) {
                    return;
                }
                const modelViewMatrix = tmpMatrix();
                mat4.multiply(modelViewMatrix, lWorldToCamera, o.transform.getModelToWorld());

                gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_modelViewMatrix"), false, modelViewMatrix);

                o.mesh.prepareMeshVertexAndShaderDataForRendering(gl, s, false, false);
                o.mesh.mesh.draw(gl);
                o.children.forEach(drawObject);
            }
            scene.children.forEach(drawObject);
        }

        const renderLighting = () => {
            const s = this.lightingShader;

            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.useProgram(s.getProgram());

            glClearColorAndDepth(gl, 0., 0, 0, 1.);

            this.fullScreenQuad.bind(gl, s.getAttribLocation(gl, "a_pos"));

            this.bindUniformTx(s, "gbuf_position", this.posTx, 0);
            this.bindUniformTx(s, "gbuf_normal", this.normalTX, 1);
            this.bindUniformTx(s, "gbuf_colormap", this.colorTX, 2);
            this.bindUniformTx(s, "gbuf_ssao", this.ssaoTx, 3);
            this.bindUniformTx(s, "gbuf_shadowmap", this.shadowMapTx, 4);

            // Common uniforms
            gl.uniform3fv(s.getUniformLocation(gl, "u_lightData"), this.generateLightData(scene.lights));
            gl.uniform1f(s.getUniformLocation(gl, "u_ssaoStrength"), this.config.ssao.strength);
            gl.uniform3fv(s.getUniformLocation(gl, "u_cameraPos"), camera.position);
            gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_worldToCameraMatrix"), false, worldToCamera);
            gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_perspectiveMatrix"), false, projectionMatrix);

            gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_lightWorldToCamera"), false, lWorldToCamera);
            gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_lightPerspectiveMatrix"), false, lProjection);

            // Draw
            this.fullScreenQuad.drawArrays(gl);
        }

        renderGBuffer()
        if (this.ssaoEnabled()) {
            renderSSAO()
        }
        renderShadowMap()
        renderLighting()     
        
        if (this.config.showLayer === ShowLayer.Final) {
            const renderLights = () => {
                const s = this.visualizeLightsShader;
                gl.useProgram(s.getProgram());

                gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_worldToCameraMatrix"), false, worldToCamera);
                gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_perspectiveMatrix"), false, camera.projectionMatrix());

                gl.bindBuffer(gl.ARRAY_BUFFER, this.sphereMesh.getBuf());
                this.sphereMesh.setupVertexPositionsPointer(gl, s.getAttribLocation(gl, "a_pos"));

                gl.enable(gl.DEPTH_TEST);
                gl.enable(gl.BLEND)
                gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
                gl.clear(gl.DEPTH_BUFFER_BIT)

                this.bindUniformTx(s, "u_posTexture", this.posTx, 0);
                
                scene.lights.forEach(light => {
                    const modelWorldMatrix = light.transform.getModelToWorld();
                    const modelViewMatrix = tmpMatrix();

                    mat4.multiply(modelViewMatrix, worldToCamera, modelWorldMatrix);
    
                    gl.uniform3fv(s.getUniformLocation(gl, "u_color"), light.light.diffuse);
                    gl.uniform1f(s.getUniformLocation(gl, "u_intensity"), light.light.intensity);
                    gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_modelViewMatrix"), false, modelViewMatrix);
                    gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_modelWorldMatrix"), false, modelWorldMatrix);

                    this.sphereMesh.draw(gl);
                    // gl.drawArrays(gl.TRIANGLES, 0, this.sphereMesh.getVertexCount());
                })
            }
            renderLights();
        }

    }
    private getSunCamera(gl: WebGLRenderingContext, light: GameObject, camera: Camera) {
        let lCamera = new Camera(gl);
        lCamera.fov = 90.;
        const tmp1 = vec3.create();
        const tmp2 = vec3.create();
        lCamera.position = light.transform.position;
        // determine forward direction
        vec3.sub(tmp1, light.transform.position, camera.position); // tmp1 = from camera to light DIR
        vec3.scale(tmp1, camera.forward, vec3.dot(tmp1, camera.forward)); // tmp1 = forward multiplied by projection DIR
        vec3.add(tmp1, camera.position, tmp1);
        vec3.sub(tmp1, light.transform.position, tmp1);
        vec3.scale(tmp1, tmp1, -1);
        vec3.normalize(lCamera.forward, tmp1);
        // determine up direction
        const worldUp = [0, 1., 0];
        vec3.scale(tmp1, lCamera.forward, vec3.dot(worldUp, lCamera.forward));
        vec3.sub(lCamera.up, worldUp, tmp1);
        vec3.normalize(lCamera.up, lCamera.up);
        return lCamera;
    }

    generateLightData(lights: GameObject[]): Float32List {
        let result: number[] = [];
        lights.forEach(l => {
            result.push(...l.transform.position)
            result.push(...l.light.ambient)
            result.push(...l.light.diffuse)
            result.push(...l.light.specular)
            result.push(...[l.light.intensity, l.light.radius, l.light.attenuation])
        })
        // console.log(result);
        return new Float32Array(result);
    }

    bindUniformTx(shader: ShaderProgram, uniformName: string, tx: WebGLTexture, index: number) {
        const gl = this.gl;
        gl.activeTexture(gl.TEXTURE0 + index);
        gl.bindTexture(gl.TEXTURE_2D, tx);
        gl.uniform1i(shader.getUniformLocation(gl, uniformName), index);
    }
}

function checkFrameBufferStatusOrThrow(gl: WebGLRenderingContext) {
    // return true;
    const fbStatus = gl.checkFramebufferStatus(gl.DRAW_FRAMEBUFFER);
    if (fbStatus !== gl.FRAMEBUFFER_COMPLETE) {
        switch (fbStatus) {
            case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
                throw new Error("gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT");
            case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
                throw new Error("gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT");
            case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
                throw new Error("gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS");
            case gl.FRAMEBUFFER_UNSUPPORTED:
                throw new Error("gl.FRAMEBUFFER_UNSUPPORTED");
            case gl.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE:
                throw new Error("gl.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE");
            case gl.RENDERBUFFER_SAMPLES:
                throw new Error("gl.RENDERBUFFER_SAMPLES");
            default:
                throw new Error("unknown error, but framebuffer is not complete. Error is " + fbStatus);
        }
    }
}