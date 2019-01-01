import {Camera, ProjectionMatrix} from "./camera";
import {mat4, vec3} from "gl-matrix";
import {DirectionalLight, GameObject, GameObjectBuilder, MeshComponent, PointLightComponent} from "./object";
import {Scene} from "./scene";
import {FragmentShader, ShaderProgram, ShaderSourceBuilder, VertexShader} from "./shaders";
import {FINAL_SHADER_SOURCE} from "./shaders/final";
import {GBUFFER_SHADER_SOURCE} from "./shaders/gBuffer/shaders";
import {SSAO_SHADER_SOURCE} from "./shaders/ssao";
import {VISUALIZE_LIGHTS_SHADERS} from "./shaders/visualize-lights";
import {SSAOConfig, SSAOState} from "./SSAOState";
import {computeDirectionalLightCameraWorldToProjectionMatrix, FullScreenQuad, tmpMat4,} from "./utils";
import {SHADOWMAP_SHADERS} from "./shaders/shadowMap";
import {GLArrayBuffer} from "./glArrayBuffer";
import {Material} from "./material";
import {SSR_SHADERS} from "./shaders/ssr";
import {QUAD_FRAGMENT_INPUTS} from "./shaders/includes/common";

export class ShadowMapConfig {
    enabled: boolean;
    fixedBias: number = 0.001;
    normalBias: number = 0.001;
}

export class DeferredRendererConfig {
    showLayer: ShowLayer = ShowLayer.Final;
    ssao = new SSAOConfig();
    shadowMap = new ShadowMapConfig();
}

export enum ShowLayer {
    Final = 1,
    Positions,
    Normals,
    Color,
    SSAO,
    ShadowMap,
    Specular,
    Shininess
}

export enum StencilValues {
    NORMAL = 1,
    SSR = 2,
}

export enum StencilBits {
    TEMP = 1 << 7,
}


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

export function withViewport(gl: WebGLRenderingContext, x: number, y: number, callback: Function): any {
    let needReverse = false;
    if (gl.canvas.width != x || gl.canvas.height != y) {
        gl.viewport(0, 0, x, y);
        needReverse = true;
    }
    const result = callback();
    if (needReverse) {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    }
    return result;
}

export class GBuffer {
    posTx: WebGLTexture;
    normalTX: WebGLTexture;
    colorTX: WebGLTexture;
    specularTX: WebGLTexture;
    depthTX: WebGLTexture;

    gFrameBuffer: WebGLFramebuffer;
    gBufferShader: ShaderProgram;

    defaultMaterial: Material = new Material();

    ATTACHMENT_POSITION = WebGLRenderingContext.COLOR_ATTACHMENT0;
    ATTACHMENT_NORMAL = WebGLRenderingContext.COLOR_ATTACHMENT0 + 1;
    ATTACHMENT_ALBEDO = WebGLRenderingContext.COLOR_ATTACHMENT0 + 2;
    ATTACHMENT_SPECULAR = WebGLRenderingContext.COLOR_ATTACHMENT0 + 3;

    constructor(gl: WebGLRenderingContext) {
        this.setupGBuffer(gl);
        this.compileShader(gl);
    }

    render(gl: WebGLRenderingContext, camera: Camera, scene: Scene) {
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.gFrameBuffer);

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);

        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.STENCIL_TEST);
        gl.stencilMask(0x0f);

        const s = this.gBufferShader;
        s.use(gl);

        gl.uniform3fv(s.getUniformLocation(gl, "u_cameraPos"), camera.position);
        gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_worldToCameraMatrix"), false, camera.getWorldToCamera());
        gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_perspectiveMatrix"), false, camera.projectionMatrix().matrix);

        gl.drawBuffers([
            this.ATTACHMENT_POSITION,
            this.ATTACHMENT_NORMAL,
            this.ATTACHMENT_ALBEDO,
            this.ATTACHMENT_SPECULAR
        ]);

        // disable blending so that the specular shininess encoding does not mess with the results.
        gl.disable(gl.BLEND);

        const renderObject = (o: GameObject) => {
            if (o.mesh != null) {
                const modelWorldMatrix = o.transform.getModelToWorld();
                const modelViewMatrix = tmpMat4;
                const material = o.material ? o.material.material : this.defaultMaterial;

                mat4.multiply(modelViewMatrix, camera.getWorldToCamera(), modelWorldMatrix);

                o.mesh.prepareMeshVertexAndShaderDataForRendering(gl, s);

                gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_modelViewMatrix"), false, modelViewMatrix);
                gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_modelWorldMatrix"), false, modelWorldMatrix);
                gl.uniform3fv(s.getUniformLocation(gl, "u_albedo"), material.albedo);
                gl.uniform3fv(s.getUniformLocation(gl, "u_specular"), material.specular);
                gl.uniform1f(s.getUniformLocation(gl, "u_shininess"), material.shininess);

                let stencilValue = StencilValues.NORMAL;
                if (material.isReflective) {
                    stencilValue = StencilValues.SSR;
                }

                // always pass and overwrite the stencil value.
                gl.stencilFunc(gl.ALWAYS, stencilValue, 0xff);
                gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
                o.mesh.draw(gl);

                if (o.boundingBox && o.boundingBox.visible) {
                    const buf = o.boundingBox.asArrayBuffer(gl);
                    buf.prepareMeshVertexAndShaderDataForRendering(gl, s);
                    buf.draw(gl);
                }
            }

            o.children.forEach(o => renderObject(o))
        };

        scene.children.forEach(o => renderObject(o))

        // restore state.
        gl.disable(gl.STENCIL_TEST);
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
        this.specularTX = createAndBindBufferTexture(gl, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE);
        this.normalTX = createAndBindBufferTexture(gl, gl.RG16F, gl.RG, gl.HALF_FLOAT);
        this.posTx = createAndBindBufferTexture(gl, gl.RGBA16F, gl.RGBA, gl.FLOAT);
        this.depthTX = createAndBindBufferTexture(gl, gl.DEPTH24_STENCIL8, gl.DEPTH_STENCIL, gl.UNSIGNED_INT_24_8);
        this.gFrameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.gFrameBuffer);
        gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, this.ATTACHMENT_POSITION, gl.TEXTURE_2D, this.posTx, 0);
        gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, this.ATTACHMENT_NORMAL, gl.TEXTURE_2D, this.normalTX, 0);
        gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, this.ATTACHMENT_ALBEDO, gl.TEXTURE_2D, this.colorTX, 0);
        gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, this.ATTACHMENT_SPECULAR, gl.TEXTURE_2D, this.specularTX, 0);
        gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.TEXTURE_2D, this.depthTX, 0);
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
    private width: number;
    private height: number;

    constructor(gl: WebGLRenderingContext, ssaoParameters: SSAOState, ssaoConfig: SSAOConfig, gBuffer: GBuffer, fullScreenQuad: FullScreenQuad) {
        this.ssaoConfig = ssaoConfig;
        this.gBuffer = gBuffer;
        this.fullScreenQuad = fullScreenQuad;

        // this.width = gl.canvas.width / 4.0;
        // this.height = gl.canvas.height / 4.0;

        this.width = gl.canvas.width;
        this.height = gl.canvas.height;

        this.setupSSAOBuffers(gl, ssaoParameters);
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

        // FIRST PASS SHADER
        this.firstPassShader = new ShaderProgram(
            gl, this.fullScreenQuad.vertexShader, new FragmentShader(gl,
                SSAO_SHADER_SOURCE.first_pass_fs
                    .clone()
                    .define("SSAO_SAMPLES", this.ssaoConfig.sampleCount.toString())
                    .build()
            )
        );

        this.firstPassShader.use(gl);

        // BLUR SHADER
        this.blurShader = new ShaderProgram(
            gl, this.fullScreenQuad.vertexShader, new FragmentShader(gl,
                SSAO_SHADER_SOURCE.blur_pass_fs
                    .clone()
                    .define("SSAO_NOISE_SCALE", this.ssaoConfig.noiseScale.toString())
                    .define("SSAO_TEXEL_SIZE_X", this.width.toString())
                    .define("SSAO_TEXEL_SIZE_Y", this.height.toString())
                    .build()
            )
        );
        this.blurShader.use(gl);
    }

    render(gl: WebGLRenderingContext, camera: Camera) {

        const firstPass = () => {
            const s = this.firstPassShader;
            s.use(gl);

            gl.bindFramebuffer(gl.FRAMEBUFFER, this.firstPassFB);
            gl.clearColor(0., 0, 0, 1.);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            this.fullScreenQuad.bind(gl, s.getAttribLocation(gl, "a_pos"));

            // Common uniforms
            gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_worldToCameraMatrix"), false, camera.getWorldToCamera());
            gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_perspectiveMatrix"), false, camera.projectionMatrix().matrix);

            // SSAOState
            gl.uniform1f(s.getUniformLocation(gl, "u_ssaoRadius"), this.ssaoConfig.radius);
            gl.uniform1f(s.getUniformLocation(gl, "u_ssaoBias"), this.ssaoConfig.bias);
            gl.uniform3fv(s.getUniformLocation(gl, "u_ssaoSamples"), this.ssaoState.tangentSpaceSamples);
            gl.uniform2fv(
                s.getUniformLocation(gl, "u_ssaoNoiseScale"),
                [this.width / this.ssaoConfig.noiseScale, this.height / this.ssaoConfig.noiseScale]
            );

            bindUniformTx(gl, this.firstPassShader, "gbuf_position", this.gBuffer.posTx, 0);
            bindUniformTx(gl, this.firstPassShader, "gbuf_normal", this.gBuffer.normalTX, 1);
            bindUniformTx(gl, this.firstPassShader, "u_ssaoNoise", this.ssaoState.noiseTexture, 2);

            // Draw
            withViewport(gl, this.width, this.height, () => {
                this.fullScreenQuad.draw(gl);
            })
        };

        const blurPass = () => {
            const s = this.blurShader;
            s.use(gl);

            gl.bindFramebuffer(gl.FRAMEBUFFER, this.blurPassFB);
            gl.clearColor(0., 0, 0, 1.);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            this.fullScreenQuad.bind(gl, s.getAttribLocation(gl, "a_pos"));

            // Common uniforms
            gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_worldToCameraMatrix"), false, camera.getWorldToCamera());
            gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_perspectiveMatrix"), false, camera.projectionMatrix().matrix);

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

            bindUniformTx(gl, this.blurShader, "gbuf_position", this.gBuffer.posTx, 0);
            bindUniformTx(gl, this.blurShader, "gbuf_normal", this.gBuffer.normalTX, 1);
            bindUniformTx(gl, this.blurShader, "u_ssaoNoise", this.ssaoState.noiseTexture, 2);
            bindUniformTx(gl, this.blurShader, "u_ssaoFirstPassTx", this._ssaoFirstPassTx, 3);

            this.fullScreenQuad.draw(gl);
        };

        firstPass();
        blurPass();
    }

    private setupSSAOBuffers(gl: WebGLRenderingContext, ssaoState: SSAOState) {
        this.ssaoState = ssaoState;

        this.firstPassFB = gl.createFramebuffer();
        this._ssaoFirstPassTx = createAndBindBufferTexture(gl, gl.R16F, gl.RED, gl.HALF_FLOAT, this.width, this.height);
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

    render(gl: WebGLRenderingContext, lightCameraWorldToProjectionMatrix: ProjectionMatrix, scene: Scene) {
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);

        const s = this.shadowMapShader;

        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.shadowMapFB);

        gl.clearColor(0., 0, 0., 1.);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        s.use(gl);

        gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_lightCameraWorldToProjectionMatrix"), false, lightCameraWorldToProjectionMatrix.matrix);

        const drawObject = (o: GameObject) => {
            if (!o.mesh) {
                return;
            }
            if (!o.mesh.shadowCaster && !o.mesh.shadowReceiver) {
                return;
            }

            gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_modelWorldMatrix"), false, o.transform.getModelToWorld());

            o.mesh.prepareMeshVertexAndShaderDataForRendering(gl, s, false, false);
            o.mesh.draw(gl);
            o.children.forEach(drawObject);
        };

        withViewport(gl, this._shadowMapWidth, this._shadowMapHeight, () => {
            scene.children.forEach(drawObject);
        });
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
        this._shadowMapWidth = 1024;
        this._shadowMapHeight = 1024;

        this._shadowMapTx = createAndBindBufferTexture(gl, gl.DEPTH_COMPONENT16, gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, this._shadowMapWidth, this._shadowMapHeight, gl.NEAREST);
        this.shadowMapFB = gl.createFramebuffer();

        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.shadowMapFB);
        gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this._shadowMapTx, 0);
        checkFrameBufferStatusOrThrow(gl);
    }
}

export class LightingRenderer {
    private showBuffersShader: ShaderProgram = null;
    private directionalLightShader: ShaderProgram = null;
    private pointLightShader: ShaderProgram = null;

    private fullScreenQuad: FullScreenQuad;

    private config: DeferredRendererConfig;
    private gBuffer: GBuffer;
    private ssaoRenderer: SSAORenderer;
    private shadowMapRenderer: ShadowMapRenderer;
    private visualizeLightsShader: ShaderProgram;
    private _recompileOnNextRun: boolean = true;
    private sphereObject: GameObject;
    private fb: WebGLFramebuffer;
    resultTX: WebGLTexture;

    constructor(gl: WebGLRenderingContext,
                config: DeferredRendererConfig,
                fullScreenQuad: FullScreenQuad,
                gBuffer: GBuffer,
                ssaoRenderer: SSAORenderer,
                shadowMapRenderer: ShadowMapRenderer,
                sphereMesh: GLArrayBuffer) {
        this.fullScreenQuad = fullScreenQuad;
        this.gBuffer = gBuffer;
        this.ssaoRenderer = ssaoRenderer;
        this.shadowMapRenderer = shadowMapRenderer;
        this.sphereObject = new GameObjectBuilder("sphere")
            .setMeshComponent(new MeshComponent(sphereMesh))
            .build();
        this.config = config;

        this.fb = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);
        this.resultTX = createAndBindBufferTexture(gl, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE);
        gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.resultTX, 0);
        gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.TEXTURE_2D, this.gBuffer.depthTX, 0);
        checkFrameBufferStatusOrThrow(gl);

        this.visualizeLightsShader = new ShaderProgram(
            gl,
            new VertexShader(gl, VISUALIZE_LIGHTS_SHADERS.vs.build()),
            new FragmentShader(gl, VISUALIZE_LIGHTS_SHADERS.FS.build())
        );

        this.recompileOnNextRun();
    }

    recompileOnNextRun() {
        this._recompileOnNextRun = true;
    }

    recompileShaders(gl: WebGLRenderingContext) {
        [this.showBuffersShader, this.pointLightShader, this.directionalLightShader].forEach(s => {
            if (s) {
                s.deleteAll(gl);
            }
        });

        this.showBuffersShader = new ShaderProgram(
            gl,
            this.fullScreenQuad.vertexShader,
            new FragmentShader(
                gl,
                FINAL_SHADER_SOURCE.showLayerFS
                    .clone()
                    .define('SCREEN_WIDTH', gl.canvas.width.toString())
                    .define('SCREEN_HEIGHT', gl.canvas.height.toString())
                    .define('SHADOW_MAP_WIDTH', `${this.shadowMapRenderer.shadowMapWidth}.`)
                    .define('SHADOW_MAP_HEIGHT', `${this.shadowMapRenderer.shadowMapHeight}.`)
                    .defineIfTrue('SSAO_ENABLED', this.config.ssao.isEnabled())
                    .defineIfTrue('SHADOWMAP_ENABLED', this.config.shadowMap.enabled)
                    .defineIfTrue('SHOW_SSAO', this.config.showLayer === ShowLayer.SSAO)
                    .defineIfTrue('SHOW_COLORS', this.config.showLayer === ShowLayer.Color)
                    .defineIfTrue('SHOW_POSITIONS', this.config.showLayer === ShowLayer.Positions)
                    .defineIfTrue('SHOW_SHADOWMAP', this.config.showLayer === ShowLayer.ShadowMap)
                    .defineIfTrue('SHOW_NORMALS', this.config.showLayer === ShowLayer.Normals)
                    .defineIfTrue('SHOW_SPECULAR', this.config.showLayer === ShowLayer.Specular)
                    .defineIfTrue('SHOW_SHININESS', this.config.showLayer === ShowLayer.Shininess)
                    .build()
            )
        );
        this.showBuffersShader.use(gl);

        this.directionalLightShader = new ShaderProgram(
            gl,
            this.fullScreenQuad.vertexShader,
            new FragmentShader(
                gl,
                FINAL_SHADER_SOURCE.fs
                    .clone()
                    .define('SCREEN_WIDTH', gl.canvas.width.toString())
                    .define('SCREEN_HEIGHT', gl.canvas.height.toString())
                    .define('SHADOW_MAP_WIDTH', `${this.shadowMapRenderer.shadowMapWidth}.`)
                    .define('SHADOW_MAP_HEIGHT', `${this.shadowMapRenderer.shadowMapHeight}.`)
                    .define('DIRECTIONAL_LIGHT', '')
                    .defineIfTrue('SSAO_ENABLED', this.config.ssao.isEnabled())
                    .defineIfTrue('SHADOWMAP_ENABLED', this.config.shadowMap.enabled)
                    .build()
            )
        );
        this.directionalLightShader.use(gl);

        this.pointLightShader = new ShaderProgram(
            gl,
            new VertexShader(gl, FINAL_SHADER_SOURCE.pointLightSphere.build()),
            new FragmentShader(
                gl,
                FINAL_SHADER_SOURCE.fs
                    .clone()
                    .define('SCREEN_WIDTH', gl.canvas.width.toString())
                    .define('SCREEN_HEIGHT', gl.canvas.height.toString())
                    .define('SHADOW_MAP_WIDTH', `${this.shadowMapRenderer.shadowMapWidth}.`)
                    .define('SHADOW_MAP_HEIGHT', `${this.shadowMapRenderer.shadowMapHeight}.`)
                    .define('POINT_LIGHT', '')
                    .defineIfTrue('SSAO_ENABLED', this.config.ssao.isEnabled())
                    // .defineIfTrue('SHADOWMAP_ENABLED', this.config.shadowMap.enabled)
                    .build()
            )
        );
        this.pointLightShader.use(gl);
        bindUniformTx(gl, this.pointLightShader, "gbuf_position", this.gBuffer.posTx, 0);
        bindUniformTx(gl, this.pointLightShader, "gbuf_normal", this.gBuffer.normalTX, 1);
        bindUniformTx(gl, this.pointLightShader, "gbuf_colormap", this.gBuffer.colorTX, 2);
        bindUniformTx(gl, this.pointLightShader, "gbuf_specular", this.gBuffer.specularTX, 3);
        bindUniformTx(gl, this.pointLightShader, "u_shadowmapTx", this.shadowMapRenderer.shadowMapTx, 4);
        bindUniformTx(gl, this.pointLightShader, "u_ssaoTx", this.ssaoRenderer.ssaoTx, 5);

        this._recompileOnNextRun = false;
    }

    render(gl: WebGLRenderingContext, scene: Scene, camera: Camera) {
        if (this._recompileOnNextRun) {
            this.recompileShaders(gl);
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);

        // No need for depth test when rendering full-screen framebuffers.
        gl.disable(gl.DEPTH_TEST);
        gl.clearColor(0, 0, 0, 1.);

        // NO depth clearing here.
        // No stencil clearing too as it may contain important information in bits other than TEMP.
        gl.clear(gl.COLOR_BUFFER_BIT);

        if (this.config.showLayer != ShowLayer.Final) {
            if (this.config.showLayer == ShowLayer.ShadowMap) {
                this.shadowMapRenderer.render(gl, computeDirectionalLightCameraWorldToProjectionMatrix(
                    scene.directionalLights[0], camera, scene
                ), scene);
            }
            const s = this.showBuffersShader.use(gl);
            this.fullScreenQuad.bind(gl, s.getAttribLocation(gl, "a_pos"));
            bindUniformTx(gl, this.showBuffersShader, "gbuf_position", this.gBuffer.posTx, 0);
            bindUniformTx(gl, this.showBuffersShader, "gbuf_normal", this.gBuffer.normalTX, 1);
            bindUniformTx(gl, this.showBuffersShader, "gbuf_colormap", this.gBuffer.colorTX, 2);
            bindUniformTx(gl, this.showBuffersShader, "gbuf_specular", this.gBuffer.specularTX, 3);
            bindUniformTx(gl, this.showBuffersShader, "u_shadowmapTx", this.shadowMapRenderer.shadowMapTx, 4);
            bindUniformTx(gl, this.showBuffersShader, "u_ssaoTx", this.ssaoRenderer.ssaoTx, 5);
            this.fullScreenQuad.draw(gl);
            return;
        }


        gl.enable(gl.STENCIL_TEST);

        const setStencilOnlyNormal = () => {
            gl.stencilFunc(gl.EQUAL, StencilValues.NORMAL, 0x0f);
            gl.stencilMask(0x00);
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
        };

        setStencilOnlyNormal();

        scene.directionalLights.forEach((light, i) => {
            const lightCameraWorldToProjectionMatrix = computeDirectionalLightCameraWorldToProjectionMatrix(
                light, camera, scene
            );

            if (this.config.shadowMap.enabled) {
                gl.disable(gl.STENCIL_TEST);
                this.shadowMapRenderer.render(gl, lightCameraWorldToProjectionMatrix, scene);

                // Bind back the null framebuffer.
                gl.disable(gl.DEPTH_TEST);
                gl.enable(gl.STENCIL_TEST);
                gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);
            }

            gl.enable(gl.BLEND);

            gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
            gl.blendFuncSeparate(gl.ONE, gl.ONE, gl.ONE, gl.ONE);

            let s = this.directionalLightShader;
            s.use(gl);

            this.fullScreenQuad.bind(gl, s.getAttribLocation(gl, "a_pos"));

            // Shadow map stuff
            gl.uniform1f(s.getUniformLocation(gl, "u_shadowMapFixedBias"), this.config.shadowMap.fixedBias);
            gl.uniform1f(s.getUniformLocation(gl, "u_shadowMapNormalBias"), this.config.shadowMap.normalBias);

            // Common uniforms
            gl.uniform3fv(s.getUniformLocation(gl, "u_cameraPos"), camera.position);
            gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_worldToCameraMatrix"), false, camera.getWorldToCamera());
            gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_perspectiveMatrix"), false, camera.projectionMatrix().matrix);
            gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_cameraToWorldMatrix"), false, camera.getCameraToWorld());

            const cameraViewSpaceToLightCamera = tmpMat4;
            mat4.multiply(cameraViewSpaceToLightCamera, lightCameraWorldToProjectionMatrix.matrix, camera.getCameraToWorld());
            gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_cameraViewSpaceToLightCamera"), false, cameraViewSpaceToLightCamera);
            gl.uniform1f(s.getUniformLocation(gl, "u_lightNear"), lightCameraWorldToProjectionMatrix.near);
            gl.uniform1f(s.getUniformLocation(gl, "u_lightFar"), lightCameraWorldToProjectionMatrix.far);

            gl.uniform3fv(s.getUniformLocation(gl, "u_lightData"), this.generateDirectionalLightData(light));

            bindUniformTx(gl, s, "gbuf_position", this.gBuffer.posTx, 0);
            bindUniformTx(gl, s, "gbuf_normal", this.gBuffer.normalTX, 1);
            bindUniformTx(gl, s, "gbuf_colormap", this.gBuffer.colorTX, 2);
            bindUniformTx(gl, s, "gbuf_specular", this.gBuffer.specularTX, 3);
            bindUniformTx(gl, s, "u_shadowmapTx", this.shadowMapRenderer.shadowMapTx, 4);
            bindUniformTx(gl, s, "u_ssaoTx", this.ssaoRenderer.ssaoTx, 5);

            this.fullScreenQuad.draw(gl);
        });

        const renderPointLights = () => {
            const s = this.pointLightShader;
            const obj = new GameObject("sphere");
            const tc = obj.transform;
            const modelView = tmpMat4;
            s.use(gl);

            gl.enable(gl.BLEND);
            gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.CULL_FACE);
            gl.enable(gl.STENCIL_TEST);
            gl.stencilMask(StencilBits.TEMP);
            gl.depthMask(false);

            gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
            gl.blendFuncSeparate(gl.ONE, gl.ONE, gl.ONE, gl.ONE);

            this.sphereObject.mesh.arrayBuffer.bind(gl);
            this.sphereObject.mesh.prepareMeshVertexAndShaderDataForRendering(gl, s, false, false);

            // Shadow map stuff
            gl.uniform1f(s.getUniformLocation(gl, "u_shadowMapFixedBias"), this.config.shadowMap.fixedBias);
            gl.uniform1f(s.getUniformLocation(gl, "u_shadowMapNormalBias"), this.config.shadowMap.normalBias);

            // Common uniforms
            gl.uniform3fv(s.getUniformLocation(gl, "u_cameraPos"), camera.position);
            gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_worldToCameraMatrix"), false, camera.getWorldToCamera());
            gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_perspectiveMatrix"), false, camera.projectionMatrix().matrix);
            gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_cameraToWorldMatrix"), false, camera.getCameraToWorld());

            bindUniformTx(gl, s, "gbuf_position", this.gBuffer.posTx, 0);
            bindUniformTx(gl, s, "gbuf_normal", this.gBuffer.normalTX, 1);
            bindUniformTx(gl, s, "gbuf_colormap", this.gBuffer.colorTX, 2);
            bindUniformTx(gl, s, "gbuf_specular", this.gBuffer.specularTX, 3);
            bindUniformTx(gl, s, "u_shadowmapTx", this.shadowMapRenderer.shadowMapTx, 4);
            bindUniformTx(gl, s, "u_ssaoTx", this.ssaoRenderer.ssaoTx, 5);

            scene.pointLights.forEach((light, i) => {
                // NO shadow map support yet.
                gl.uniform3fv(s.getUniformLocation(gl, "u_lightData"), this.generatePointLightData(light));

                // 2 is because the sphere mesh is of size 1.
                // 2.1 is to round the imperfect sphere shape, as it is very low poly.
                const scale = (light.radius + light.attenuation) * 2.1;
                tc.scale = [scale, scale, scale];
                vec3.copy(tc.position, light.object.transform.position);
                tc.update();

                mat4.multiply(modelView, camera.getWorldToCamera(), tc.getModelToWorld());

                gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_modelViewMatrix"), false, modelView);
                gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_worldToCameraMatrix"), false, camera.getWorldToCamera());

                // https://kayru.org/articles/deferred-stencil/

                // first pass
                gl.depthFunc(gl.LEQUAL);
                gl.cullFace(gl.BACK);
                gl.colorMask(false, false, false, false);
                // stencil function will ALWAYS pass, BUT it will set the TEMP bit
                // for all front-facing faces that are occluded by scene geometry.
                // if they are occluded, it's not possible for them to be lighted.
                // this is used in the second pass.
                gl.stencilFunc(gl.ALWAYS, StencilBits.TEMP, StencilBits.TEMP);
                gl.stencilOp(gl.KEEP, gl.REPLACE, gl.KEEP);
                this.sphereObject.mesh.draw(gl);

                // second pass
                gl.depthFunc(gl.GEQUAL);
                gl.cullFace(gl.FRONT);
                gl.colorMask(true, true, true, true);
                // only renders the BACK parts of the light that ARE occluded by scene geometry (using GEQUAL depth func)
                // BUT WHERE the front part of the sphere is NOT occluded by scene geometry using the TEMP bit
                // from the previous pass.
                // essentially this only will light up the pixels that are within the volume light's sphere.
                gl.stencilFunc(gl.EQUAL, StencilValues.NORMAL, StencilBits.TEMP | 0x0f);
                gl.stencilOp(gl.ZERO, gl.ZERO, gl.ZERO);
                this.sphereObject.mesh.draw(gl);
            });

            // Restore state.
            gl.depthMask(true);
            gl.depthFunc(gl.LEQUAL);
            gl.disable(gl.STENCIL_TEST);
            gl.stencilMask(0xff);
            gl.cullFace(gl.BACK);
        };

        renderPointLights();

        // if (this.config.showLayer === ShowLayer.Final) {
        //     this.renderLightVolumes(gl, camera, scene);
        // }
    }

    private renderLightVolumes(gl: WebGLRenderingContext, camera: Camera, scene: Scene) {
        const s = this.visualizeLightsShader;
        gl.useProgram(s.getProgram());

        gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_worldToCameraMatrix"), false, camera.getWorldToCamera());
        gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_perspectiveMatrix"), false, camera.projectionMatrix().matrix);

        this.sphereMesh.prepareMeshVertexAndShaderDataForRendering(gl, s);

        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.clear(gl.DEPTH_BUFFER_BIT);

        bindUniformTx(gl, s, "u_posTexture", this.gBuffer.posTx, 0);

        scene.pointLights.forEach(light => {
            const modelWorldMatrix = light.transform.getModelToWorld();
            const modelViewMatrix = tmpMat4;

            mat4.multiply(modelViewMatrix, camera.getWorldToCamera(), modelWorldMatrix);

            gl.uniform3fv(s.getUniformLocation(gl, "u_color"), light.light.diffuse);
            gl.uniform1f(s.getUniformLocation(gl, "u_intensity"), light.light.intensity);
            gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_modelViewMatrix"), false, modelViewMatrix);
            gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_modelWorldMatrix"), false, modelWorldMatrix);

            this.sphereMesh.draw(gl);
        })
    }

    private generateDirectionalLightData(l: DirectionalLight): Float32List {
        let result: number[] = [];
        result.push(...l.direction);
        result.push(...l.ambient);
        result.push(...l.diffuse);
        result.push(...l.specular);
        // the 2 zeroes are unused.
        result.push(...[l.intensity, 0, 0]);
        return new Float32Array(result);
    }

    private generatePointLightData(l: PointLightComponent): Float32List {
        let result: number[] = [];
        result.push(...l.object.transform.position);
        result.push(...l.ambient);
        result.push(...l.diffuse);
        result.push(...l.specular);
        result.push(...[l.intensity, l.radius, l.attenuation]);
        return new Float32Array(result);
    }
}


class SSRRenderer {
    private gbuffer: GBuffer;
    get resultTX(): WebGLTexture {
        return this._resultTX;
    }
    private lightingRenderer: LightingRenderer;
    private shader: ShaderProgram;
    private fullScreenQuad: FullScreenQuad;
    private fb: WebGLFramebuffer;
    private _resultTX: WebGLTexture;

    constructor(gl: WebGLRenderingContext, config: DeferredRendererConfig, gbuffer: GBuffer, light: LightingRenderer, fullScreenQuad: FullScreenQuad) {
        this.fullScreenQuad = fullScreenQuad;

        this.fb = gl.createFramebuffer();
        this.lightingRenderer = light;
        this.gbuffer = gbuffer;
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);
        this._resultTX = createAndBindBufferTexture(gl, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE);
        gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this._resultTX, 0);
        gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.TEXTURE_2D, gbuffer.depthTX, 0);
        checkFrameBufferStatusOrThrow(gl);

        this.shader = new ShaderProgram(
            gl,
            fullScreenQuad.vertexShader,
            new FragmentShader(gl, SSR_SHADERS.fs
                .define('SSR_STEPS', '30')
                .define('SSR_STEP_SIZE', '0.15')
                .define('SSR_BINARY_SEARCH_STEPS', '10')
                .build()
            ),
        )
    }

    render(gl: WebGLRenderingContext, scene: Scene, camera: Camera) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.disable(gl.DEPTH_TEST);
        gl.enable(gl.STENCIL_TEST);
        gl.stencilMask(0x00);

        gl.stencilFunc(gl.EQUAL, StencilValues.SSR,0x0f);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);

        const s = this.shader;
        s.use(gl);

        bindUniformTx(gl, s, "u_lightedSceneTx", this.lightingRenderer.resultTX, 0);
        bindUniformTx(gl, s, "gbuf_normal", this.gbuffer.normalTX, 1);
        bindUniformTx(gl, s, "gbuf_position", this.gbuffer.posTx, 2);
        gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_worldToCameraMatrix"), false, camera.getWorldToCamera());
        gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_cameraToWorldMatrix"), false, camera.getCameraToWorld());
        gl.uniformMatrix4fv(s.getUniformLocation(gl, "u_perspectiveMatrix"), false, camera.projectionMatrix().matrix);

        // full screen quad final draw
        this.fullScreenQuad.bind(gl, s.getAttribLocation(gl, "a_pos"));
        this.fullScreenQuad.draw(gl);
    }
}

class CopierShader {
    get shader(): ShaderProgram {
        return this._shader;
    }
    private _shader: ShaderProgram;

    constructor(gl: WebGLRenderingContext, fullScreenQuad: FullScreenQuad) {
        this._shader = new ShaderProgram(
            gl,
            fullScreenQuad.vertexShader,
            new FragmentShader(gl, new ShaderSourceBuilder().addTopChunk(QUAD_FRAGMENT_INPUTS).addChunk(`
            uniform sampler2D tx;
            out vec4 color;
            void main() {
                color = texture(tx, tx_pos);
            }
            `).build())
        );
    }
}

class TextureToFbCopier {
    private tx: WebGLTexture;
    private targetFB: GLint;
    private fsq: FullScreenQuad;
    private shader: CopierShader;

    constructor(gl: WebGLRenderingContext, tx: WebGLTexture, targetFramebuffer: GLint, shader: CopierShader, fullScreenQuad: FullScreenQuad) {
        this.tx = tx;
        this.targetFB = targetFramebuffer;
        this.fsq = fullScreenQuad;
        this.shader = shader;
    }

    copy(gl: WebGLRenderingContext) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.targetFB);
        const s = this.shader.shader;
        s.use(gl);
        this.fsq.bind(gl, s.getAttribLocation(gl, "a_pos"));
        bindUniformTx(gl, s, "tx", this.tx, 0);
        this.fsq.draw(gl);
    }
}


export class DeferredRenderer {
    private lightingRenderer: LightingRenderer;
    private gl: WebGLRenderingContext;
    private gbuffer: GBuffer;
    private ssaoRenderer: SSAORenderer;
    private shadowMap: ShadowMapRenderer;
    private recompileOnNextRun: boolean = false;
    private _config: DeferredRendererConfig;
    private ssr: SSRRenderer;
    private finalToDefaultFB: TextureToFbCopier;
    private ssrToDefaultFB: TextureToFbCopier;

    constructor(gl: WebGLRenderingContext, config: DeferredRendererConfig, fullScreenQuad: FullScreenQuad, sphere: GLArrayBuffer, ssaoState?: SSAOState) {
        this.gl = gl;
        this._config = config;
        this.gbuffer = new GBuffer(gl);
        this.ssaoRenderer = new SSAORenderer(gl, ssaoState, this._config.ssao, this.gbuffer, fullScreenQuad);
        this.shadowMap = new ShadowMapRenderer(gl);
        this.lightingRenderer = new LightingRenderer(
            gl, this.config, fullScreenQuad, this.gbuffer, this.ssaoRenderer, this.shadowMap, sphere
        );
        this.ssr = new SSRRenderer(
            gl, this.config, this.gbuffer, this.lightingRenderer, fullScreenQuad
        );

        const copierShader = new CopierShader(gl, fullScreenQuad);
        this.finalToDefaultFB = new TextureToFbCopier(gl, this.lightingRenderer.resultTX, null, copierShader, fullScreenQuad);
        this.ssrToDefaultFB = new TextureToFbCopier(gl, this.ssr.resultTX, null, copierShader, fullScreenQuad);
    }

    get config(): DeferredRendererConfig {
        return this._config;
    }

    onChangeSSAOState() {
        this.ssaoRenderer.onChangeSSAOState(this.gl);
        this.lightingRenderer.recompileOnNextRun();
    }

    recompileShaders() {
        this.recompileOnNextRun = true;
    }

    render(scene: Scene, camera: Camera) {
        const gl: WebGLRenderingContext = this.gl;

        if (this.recompileOnNextRun) {
            this.ssaoRenderer.recompileShaders(gl);
            this.lightingRenderer.recompileOnNextRun();
            this.recompileOnNextRun = false;
        }

        this.gbuffer.render(gl, camera, scene);
        if (this._config.ssao.isEnabled()) {
            this.ssaoRenderer.render(gl, camera);
        }

        this.lightingRenderer.render(gl, scene, camera);

        this.ssr.render(gl, scene, camera);

        this.finalToDefaultFB.copy(gl);

        if (this.config.showLayer == ShowLayer.Final) {
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            // gl.blendFunc(gl.ONE, gl.ZERO);
            this.ssrToDefaultFB.copy(gl);
        }
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