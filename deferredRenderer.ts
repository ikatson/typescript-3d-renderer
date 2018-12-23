import {Camera} from "./camera.js";
import {mat4, vec3} from "./gl-matrix.js";
import {GLMesh} from "./mesh.js";
import {GameObject} from "./object.js";
import {Scene} from "./scene.js";
import {FragmentShader, ShaderProgram, VertexShader} from "./shaders.js";
import {FINAL_SHADER_SOURCE} from "./shaders/final.js";
import {GBUFFER_SHADER_SOURCE} from "./shaders/gBuffer/shaders.js";
import {SSAO_SHADER_SOURCE} from "./shaders/ssao.js";
import {VISUALIZE_LIGHTS_SHADERS} from "./shaders/visualize-lights.js";
import {SSAOConfig, SSAOState} from "./SSAOState.js";
import {FullScreenQuad, glClearColorAndDepth} from "./utils.js";
import {SHADOWMAP_SHADERS} from "./shaders/shadowMap.js";


export class DeferredRendererConfig {
    showLayer: ShowLayer = ShowLayer.Final;
    ssao = new SSAOConfig();
    shadowMapEnabled: boolean = true;
}

export enum ShowLayer {
    Final = 1,
    Positions,
    Normals,
    Color,
    SSAO,
    ShadowMap
}


const tmpMatrix = (function () {
    const m = mat4.create();
    return () => {
        mat4.identity(m);
        return m;
    }
})();

function bindUniformTx(gl: WebGLRenderingContext, shader: ShaderProgram, uniformName: string, tx: WebGLTexture, index: number) {
    gl.activeTexture(gl.TEXTURE0 + index);
    gl.bindTexture(gl.TEXTURE_2D, tx);
    gl.uniform1i(shader.getUniformLocation(gl, uniformName), index);
}

function createAndBindBufferTexture(gl: WebGLRenderingContext, internalFormat: number, format: number, type: number, x?: number, y?: number, filtering?: number): WebGLTexture {
    x = x || gl.canvas.width;
    y = y || gl.canvas.height;
    filtering = filtering || gl.NEAREST;

    let tx = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tx);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filtering);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filtering);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.texImage2D(gl.TEXTURE_2D,
        0,
        internalFormat,
        x,
        y,
        0,
        format,
        type,
        null
    );
    return tx;
}

export class GBuffer {
    posTx: WebGLTexture;
    normalTX: WebGLTexture;
    colorTX: WebGLTexture;

    gFrameBuffer: WebGLFramebuffer;
    gBufferShader: ShaderProgram;
    depthRB: WebGLRenderbuffer;
    shadowMapEnabled: boolean = true;

    constructor(gl: WebGLRenderingContext) {
        this.setupGBuffer(gl);
        this.compileShader(gl);
    }

    render(gl: WebGLRenderingContext, camera: Camera, worldToCamera, projectionMatrix, scene: Scene) {
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.gFrameBuffer);

        glClearColorAndDepth(gl, 0, 0, 0, 0.);

        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);

        const program = this.gBufferShader;
        gl.useProgram(program.getProgram());

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
            }

            o.children.forEach(o => renderObject(o))
        };

        scene.children.forEach(o => renderObject(o))
    }

    private compileShader(gl: WebGLRenderingContext) {
        this.gBufferShader = new ShaderProgram(
            gl,
            new VertexShader(gl, GBUFFER_SHADER_SOURCE.vs),
            new FragmentShader(gl, GBUFFER_SHADER_SOURCE.fs)
        );
    }

    private setupGBuffer(gl: WebGLRenderingContext) {
        this.colorTX = createAndBindBufferTexture(gl, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE);
        this.normalTX = createAndBindBufferTexture(gl, gl.RGBA16F, gl.RGBA, gl.FLOAT);
        this.posTx = createAndBindBufferTexture(gl, gl.RGBA16F, gl.RGBA, gl.FLOAT);
        this.depthRB = gl.createRenderbuffer();
        this.gFrameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.gFrameBuffer);
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.depthRB);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, gl.canvas.width, gl.canvas.height);
        gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + 0, gl.TEXTURE_2D, this.posTx, 0);
        gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + 1, gl.TEXTURE_2D, this.normalTX, 0);
        gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + 2, gl.TEXTURE_2D, this.colorTX, 0);
        gl.framebufferRenderbuffer(gl.DRAW_FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.depthRB);
        checkFrameBufferStatusOrThrow(gl);
    }
}

export class SSAORenderer {
    private firstPassFB: WebGLFramebuffer;
    private blurPassFB: WebGLFramebuffer;

    private ssaoConfig: SSAOConfig;
    private ssaoState: SSAOState;
    private gBuffer: GBuffer;
    private fullScreenQuad: FullScreenQuad;

    private firstPassShader: ShaderProgram;
    private _ssaoFirstPassTx: WebGLTexture;
    private blurShader: ShaderProgram;

    constructor(gl: WebGLRenderingContext, ssaoParameters: SSAOState, ssaoConfig: SSAOConfig, gBuffer: GBuffer, fullScreenQuad: FullScreenQuad) {
        this.setupSSAOBuffers(gl, ssaoParameters);
        this.ssaoConfig = ssaoConfig;
        this.gBuffer = gBuffer;
        this.fullScreenQuad = fullScreenQuad;

        this.recompileShaders(gl);
    }

    private _ssaoBlurTx: WebGLTexture;

    get ssaoTx(): WebGLTexture {
        return this._ssaoBlurTx;
    }

    onChangeSSAOState(gl: WebGLRenderingContext) {
        this.recompileShaders(gl);
    }

    recompileShaders(gl: WebGLRenderingContext) {
        [this.firstPassShader, this.blurShader].forEach(s => {
            if (s) {
                s.deleteAll(gl);
            }
        });

        this.firstPassShader = new ShaderProgram(
            gl, this.fullScreenQuad.vertexShader, new FragmentShader(gl,
                SSAO_SHADER_SOURCE.first_pass_fs
                    .clone()
                    .define("SSAO_SAMPLES", this.ssaoConfig.sampleCount.toString())
                    .build()
            )
        );

        this.blurShader = new ShaderProgram(
            gl, this.fullScreenQuad.vertexShader, new FragmentShader(gl,
                SSAO_SHADER_SOURCE.blur_pass_fs
                    .clone()
                    .define("SSAO_NOISE_SCALE", this.ssaoConfig.noiseScale.toString())
                    .define("SCREEN_WIDTH", gl.canvas.width.toString())
                    .define("SCREEN_HEIGHT", gl.canvas.height.toString())
                    .build()
            )
        );
    }

    render(gl: WebGLRenderingContext, worldToCamera, projectionMatrix) {

        const firstPass = () => {
            const s = this.firstPassShader;
            s.use(gl);

            gl.bindFramebuffer(gl.FRAMEBUFFER, this.firstPassFB);

            glClearColorAndDepth(gl, 0., 0, 0, 1.);

            this.fullScreenQuad.bind(gl, s.getAttribLocation(gl, "a_pos"));

            bindUniformTx(gl, s, "gbuf_position", this.gBuffer.posTx, 0);
            bindUniformTx(gl, s, "gbuf_normal", this.gBuffer.normalTX, 1);
            bindUniformTx(gl, s, "u_ssaoNoise", this.ssaoState.noiseTexture, 2);

            // Common uniforms
            gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_worldToCameraMatrix"), false, worldToCamera);
            gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_perspectiveMatrix"), false, projectionMatrix);

            // SSAOState
            gl.uniform1f(s.getUniformLocation(gl, "u_ssaoRadius"), this.ssaoConfig.radius);
            gl.uniform1f(s.getUniformLocation(gl, "u_ssaoBias"), this.ssaoConfig.bias);
            gl.uniform3fv(s.getUniformLocation(gl, "u_ssaoSamples"), this.ssaoState.tangentSpaceSamples);
            gl.uniform2fv(
                s.getUniformLocation(gl, "u_ssaoNoiseScale"),
                [gl.canvas.width / this.ssaoConfig.noiseScale, gl.canvas.height / this.ssaoConfig.noiseScale]
            );

            // Draw
            this.fullScreenQuad.drawArrays(gl);
        };

        const blurPass = () => {
            const s = this.blurShader;
            s.use(gl);

            gl.bindFramebuffer(gl.FRAMEBUFFER, this.blurPassFB);

            glClearColorAndDepth(gl, 0., 0, 0, 1.);

            this.fullScreenQuad.bind(gl, s.getAttribLocation(gl, "a_pos"));

            bindUniformTx(gl, s, "gbuf_position", this.gBuffer.posTx, 0);
            bindUniformTx(gl, s, "gbuf_normal", this.gBuffer.normalTX, 1);

            bindUniformTx(gl, s, "u_ssaoNoise", this.ssaoState.noiseTexture, 2);
            bindUniformTx(gl, s, "u_ssaoFirstPassTx", this._ssaoFirstPassTx, 3);

            // Common uniforms
            gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_worldToCameraMatrix"), false, worldToCamera);
            gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_perspectiveMatrix"), false, projectionMatrix);

            // SSAOState
            gl.uniform1f(s.getUniformLocation(gl, "u_ssaoStrength"), this.ssaoConfig.strength);
            gl.uniform1f(s.getUniformLocation(gl, "u_ssaoBias"), this.ssaoConfig.bias);
            gl.uniform1f(s.getUniformLocation(gl, "u_ssaoBlurPositionThreshold"), this.ssaoConfig.blurPositionThreshold);
            gl.uniform1f(s.getUniformLocation(gl, "u_ssaoBlurNormalThreshold"), this.ssaoConfig.blurNormalThreshold);
            gl.uniform3fv(s.getUniformLocation(gl, "u_ssaoSamples"), this.ssaoState.tangentSpaceSamples);

            gl.uniform2fv(
                s.getUniformLocation(gl, "u_ssaoNoiseScale"),
                [gl.canvas.width / this.ssaoConfig.noiseScale, gl.canvas.height / this.ssaoConfig.noiseScale]
            );

            // Draw
            this.fullScreenQuad.drawArrays(gl);
        };

        firstPass();

        blurPass()
    }

    private setupSSAOBuffers(gl: WebGLRenderingContext, ssaoState: SSAOState) {
        this.ssaoState = ssaoState;

        this.firstPassFB = gl.createFramebuffer();
        this._ssaoFirstPassTx = createAndBindBufferTexture(gl, gl.R16F, gl.RED, gl.HALF_FLOAT);
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.firstPassFB);
        gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this._ssaoFirstPassTx, 0);
        checkFrameBufferStatusOrThrow(gl);

        this.blurPassFB = gl.createFramebuffer();
        this._ssaoBlurTx = createAndBindBufferTexture(gl, gl.R16F, gl.RED, gl.HALF_FLOAT);
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.blurPassFB);
        gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this._ssaoBlurTx, 0);
        checkFrameBufferStatusOrThrow(gl);
    }
}

export class ShadowMapRenderer {
    private shadowMapFB: WebGLFramebuffer;
    private shadowMapShader: ShaderProgram;
    private shadowMapRB: WebGLRenderbuffer;

    constructor(gl: WebGLRenderingContext) {
        this.setupShadowMapBuffers(gl);
        this.recompileShaders(gl);
    }

    private _shadowMapTx: WebGLTexture;

    get shadowMapTx(): WebGLTexture {
        return this._shadowMapTx;
    }

    private _shadowMapWidth: number;

    get shadowMapWidth(): number {
        return this._shadowMapWidth;
    }

    private _shadowMapHeight: number;

    get shadowMapHeight(): number {
        return this._shadowMapHeight;
    }

    render(gl: WebGLRenderingContext, lProjection, lWorldToCamera, scene: Scene) {
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);

        const s = this.shadowMapShader;

        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.shadowMapFB);

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
        };

        gl.viewport(0, 0, this._shadowMapWidth, this._shadowMapHeight);
        scene.children.forEach(drawObject);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    }

    private recompileShaders(gl: WebGLRenderingContext) {
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
    }

    private setupShadowMapBuffers(gl: WebGLRenderingContext) {
        this._shadowMapWidth = 2048;
        this._shadowMapHeight = 2048;
        this._shadowMapTx = createAndBindBufferTexture(gl, gl.R16F, gl.RED, gl.HALF_FLOAT, this._shadowMapWidth, this._shadowMapHeight, gl.LINEAR);
        this.shadowMapFB = gl.createFramebuffer();
        this.shadowMapRB = gl.createRenderbuffer();
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.shadowMapFB);
        gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this._shadowMapTx, 0);
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.shadowMapRB);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this._shadowMapWidth, this._shadowMapHeight);
        gl.framebufferRenderbuffer(gl.DRAW_FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.shadowMapRB);
        checkFrameBufferStatusOrThrow(gl);
    }
}

export class FinalLightingRenderer {
    private lightingShader: ShaderProgram = null;
    private fullScreenQuad: FullScreenQuad;

    private config: DeferredRendererConfig;
    private gBuffer: GBuffer;
    private ssaoRenderer: SSAORenderer;
    private shadowMapRenderer: ShadowMapRenderer;
    private visualizeLightsShader: ShaderProgram;
    private sphereMesh: GLMesh;
    private lastLightCount: number = 0;
    private _recompileOnNextRun: boolean = true;

    constructor(gl: WebGLRenderingContext,
                config: DeferredRendererConfig,
                fullScreenQuad: FullScreenQuad,
                gBuffer: GBuffer,
                ssaoRenderer: SSAORenderer,
                shadowMapRenderer: ShadowMapRenderer,
                sphereMesh: GLMesh) {
        this.fullScreenQuad = fullScreenQuad;
        this.gBuffer = gBuffer;
        this.ssaoRenderer = ssaoRenderer;
        this.shadowMapRenderer = shadowMapRenderer;
        this.sphereMesh = sphereMesh;
        this.config = config;

        this.visualizeLightsShader = new ShaderProgram(
            gl,
            new VertexShader(gl, VISUALIZE_LIGHTS_SHADERS.vs.build()),
            new FragmentShader(gl, VISUALIZE_LIGHTS_SHADERS.FS.build())
        );
    }

    recompileOnNextRun() {
        this._recompileOnNextRun = true;
    }

    recompileShaders(gl: WebGLRenderingContext, lightCount: number) {
        if (this.lightingShader) {
            this.lightingShader.deleteAll(gl);
        }
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
                    .define('SHADOW_MAP_WIDTH', `${this.shadowMapRenderer.shadowMapWidth}.`)
                    .define('SHADOW_MAP_HEIGHT', `${this.shadowMapRenderer.shadowMapHeight}.`)
                    .defineIfTrue('SSAO_ENABLED', this.config.ssao.isEnabled())
                    .defineIfTrue('SHADOWMAP_ENABLED', this.config.shadowMapEnabled)
                    .defineIfTrue('SHOW_SSAO', this.config.showLayer === ShowLayer.SSAO)
                    .defineIfTrue('SHOW_COLORS', this.config.showLayer === ShowLayer.Color)
                    .defineIfTrue('SHOW_POSITIONS', this.config.showLayer === ShowLayer.Positions)
                    .defineIfTrue('SHOW_SHADOWMAP', this.config.showLayer === ShowLayer.ShadowMap)
                    .defineIfTrue('SHOW_NORMALS', this.config.showLayer === ShowLayer.Normals)
                    .build()
            )
        );
        this._recompileOnNextRun = false;
    }

    render(gl: WebGLRenderingContext, scene: Scene, camera: Camera, worldToCamera, projectionMatrix, lWorldToCamera, lProjection) {
        const sceneLightCount = scene.lights.length;
        if (this.lightingShader == null || this._recompileOnNextRun || this.lastLightCount != sceneLightCount) {
            this.recompileShaders(gl, sceneLightCount);
            this.lastLightCount = sceneLightCount;
        }

        const s = this.lightingShader;

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.useProgram(s.getProgram());

        glClearColorAndDepth(gl, 0., 0, 0, 1.);

        this.fullScreenQuad.bind(gl, s.getAttribLocation(gl, "a_pos"));

        bindUniformTx(gl, s, "gbuf_position", this.gBuffer.posTx, 0);
        bindUniformTx(gl, s, "gbuf_normal", this.gBuffer.normalTX, 1);
        bindUniformTx(gl, s, "gbuf_colormap", this.gBuffer.colorTX, 2);

        bindUniformTx(gl, s, "u_shadowmapTx", this.shadowMapRenderer.shadowMapTx, 4);
        bindUniformTx(gl, s, "u_ssaoTx", this.ssaoRenderer.ssaoTx, 3);

        // Common uniforms
        gl.uniform3fv(s.getUniformLocation(gl, "u_lightData"), this.generateLightData(scene.lights));
        gl.uniform3fv(s.getUniformLocation(gl, "u_cameraPos"), camera.position);
        gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_worldToCameraMatrix"), false, worldToCamera);
        gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_perspectiveMatrix"), false, projectionMatrix);

        gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_lightWorldToCamera"), false, lWorldToCamera);
        gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_lightPerspectiveMatrix"), false, lProjection);

        // Draw
        this.fullScreenQuad.drawArrays(gl);
        if (this.config.showLayer === ShowLayer.Final) {
            this.renderLightVolumes(gl, worldToCamera, camera, scene);
        }
    }

    private renderLightVolumes(gl: WebGLRenderingContext, worldToCamera, camera: Camera, scene: Scene) {
        const s = this.visualizeLightsShader;
        gl.useProgram(s.getProgram());

        gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_worldToCameraMatrix"), false, worldToCamera);
        gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_perspectiveMatrix"), false, camera.projectionMatrix());

        gl.bindBuffer(gl.ARRAY_BUFFER, this.sphereMesh.getBuf());
        this.sphereMesh.setupVertexPositionsPointer(gl, s.getAttribLocation(gl, "a_pos"));

        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.clear(gl.DEPTH_BUFFER_BIT);

        bindUniformTx(gl, s, "u_posTexture", this.gBuffer.posTx, 0);

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

    private generateLightData(lights: GameObject[]): Float32List {
        let result: number[] = [];
        lights.forEach(l => {
            result.push(...l.transform.position);
            result.push(...l.light.ambient);
            result.push(...l.light.diffuse);
            result.push(...l.light.specular);
            result.push(...[l.light.intensity, l.light.radius, l.light.attenuation])
        });
        return new Float32Array(result);
    }
}

export class DeferredRenderer {
    private finalPass: FinalLightingRenderer;
    private gl: WebGLRenderingContext;
    private gbuffer: GBuffer;
    private ssaoRenderer: SSAORenderer;
    private shadowMap: ShadowMapRenderer;
    private recompileOnNextRun: boolean = false;
    private _config: DeferredRendererConfig;

    constructor(gl: WebGLRenderingContext, config: DeferredRendererConfig, fullScreenQuad: FullScreenQuad, sphere: GLMesh, ssaoState?: SSAOState) {
        this.gl = gl;
        this._config = config;
        this.gbuffer = new GBuffer(gl);
        this.ssaoRenderer = new SSAORenderer(gl, ssaoState, this._config.ssao, this.gbuffer, fullScreenQuad);
        this.shadowMap = new ShadowMapRenderer(gl);
        this.finalPass = new FinalLightingRenderer(
            gl, this.config, fullScreenQuad, this.gbuffer, this.ssaoRenderer, this.shadowMap, sphere
        );
    }

    get config(): DeferredRendererConfig {
        return this._config;
    }

    private static getSunCamera(gl: WebGLRenderingContext, light: GameObject, camera: Camera) {
        let lCamera = new Camera(gl);
        lCamera.fov = 90.;
        lCamera.near = 2.;
        lCamera.far = 50.;
        const tmp1 = vec3.create();
        lCamera.position = light.transform.position;

        // determine forward direction.
        // TODO: in this case the sun just looks at "0,0,0", and acts like a point light,
        // not orthogonal light.
        vec3.scale(lCamera.forward, lCamera.position, -1);
        vec3.normalize(lCamera.forward, lCamera.forward);

        // determine up direction
        const worldUp = [0, 1., 0];
        vec3.scale(tmp1, lCamera.forward, vec3.dot(worldUp, lCamera.forward));
        vec3.sub(lCamera.up, worldUp, tmp1);
        vec3.normalize(lCamera.up, lCamera.up);
        return lCamera;
    }

    onChangeSSAOState() {
        this.ssaoRenderer.onChangeSSAOState(this.gl);
        this.finalPass.recompileOnNextRun();
    }

    recompileShaders() {
        this.recompileOnNextRun = true;
    }

    render(scene: Scene, camera: Camera) {
        const gl: WebGLRenderingContext = this.gl;
        const worldToCamera = camera.getWorldToCamera();
        const projectionMatrix = camera.projectionMatrix();

        const lCamera: Camera = DeferredRenderer.getSunCamera(gl, scene.lights[0], camera);
        const lProjection = lCamera.projectionMatrix();
        const lWorldToCamera = lCamera.getWorldToCamera();

        if (this.recompileOnNextRun) {
            this.ssaoRenderer.recompileShaders(gl);
            this.finalPass.recompileOnNextRun();
            this.recompileOnNextRun = false;
        }

        this.gbuffer.render(gl, camera, worldToCamera, projectionMatrix, scene);
        if (this._config.ssao.isEnabled()) {
            this.ssaoRenderer.render(gl, worldToCamera, projectionMatrix);
        }
        if (this._config.shadowMapEnabled) {
            this.shadowMap.render(gl, lProjection, lWorldToCamera, scene);
        }

        this.finalPass.render(gl, scene, camera, worldToCamera, projectionMatrix, lWorldToCamera, lProjection);
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
