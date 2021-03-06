import {fetchObject} from "./objparser";
import {clip, hexToRgb1, initGL, optimizeNearFar, tmpVec3, tmpVec4} from "./utils";
import {ProgressBar, ProgressBarCommon} from "./progressbar";
import {DirectionalLight, GameObjectBuilder, MaterialComponent} from "./object";
import {Camera} from "./camera";

import * as vec3 from "gl-matrix/src/gl-matrix/vec3";
import {randomPointLight, Scene} from "./scene";
import {DeferredRenderer, DeferredRendererConfig, ShadowMapConfig, ShowLayer, SSRConfig} from "./deferredRenderer";
import {GLArrayBufferI, GLArrayBufferV1} from "./glArrayBuffer";
import * as ui from "./ui";
import {SSAOConfig, SSAOState} from "./SSAOState";
import {Material} from "./material";
import {FullScreenQuad, QuadArrayBufferData} from "./quad";
import {loadSceneFromGLTF} from "./gltf";
import {SAMPLE_GLTF_SPONZA_DDS} from "./constants";


const originZero = vec3.create();
const PI2 = Math.PI / 2.0 - 0.01;

const printError = e => {
    console.error(e);
    const errE = document.getElementById('error');
    errE.innerText = e.toString();
    errE.style.display = '';
};

function main() {
    const state = {
        lighting: {
            lightCount: {
                value: 1,
                min: 0,
                max: 1000,
                step: 1,
                onChange: ui.funcRef(),
            },
            sun: {
                intensity: {value: 60., min: 0, step: 0.1, onChange: ui.funcRef()},
            },
            'new': {
                radius: {value: 1.5, min: 0, max: 100, step: 0.1, onChange: ui.funcRef()},
                posScale: {value: 1.5, min: 0, max: 100, step: 0.1, onChange: ui.funcRef()},
                intensity: {value: 1., min: 0, max: 100, step: 0.1, onChange: ui.funcRef()},
            }
        },
        ssr: {
            enable: {
                onChange: ui.funcRef(),
                checked: true,
            }
        },
        shadowMap: {
            enable: {
                onChange: ui.funcRef(),
                checked: true,
            },
            bias: {
                fixed: {value: 0.005, min: 0, step: 0.0001, onChange: ui.funcRef()},
                normal: {value: 0.001, min: 0, step: 0.0001, onChange: ui.funcRef()},
            }
        },
        ssao: {
            enable: {
                onChange: ui.funcRef(),
                checked: true,
            },
            sampleCount: {value: 64, min: 1, step: 1, onChange: ui.funcRef()},
            noiseScale: {value: 4, min: 2, step: 1, onChange: ui.funcRef()},
            radius: {value: 1., min: 0.001, step: 0.1, onChange: ui.funcRef(),},
            bias: {value: 0.02, step: 0.001, min: 0.001, onChange: ui.funcRef(),},
            strength: {value: 2.0, min: 0, step: 0.5, onChange: ui.funcRef(),},
            scalePower: {value: 2, min: 0, step: 0.5, onChange: ui.funcRef(),},
            blurPositionThreshold: {value: 0.3, min: 0, step: 0.01, onChange: ui.funcRef()},
            blurNormalThreshold: {value: 0.9, min: 0, step: 0.05, onChange: ui.funcRef()},
        },
        showLayer: {
            value: ShowLayer.Final,
            onChange: ui.funcRef(),
            options: [
                {label: 'Final', value: ShowLayer.Final},
                {label: 'Positions', value: ShowLayer.Positions},
                {label: 'Normals', value: ShowLayer.Normals},
                {label: 'SSAO', value: ShowLayer.SSAO},
                {label: 'Color', value: ShowLayer.Color},
                {label: 'Shadow Map', value: ShowLayer.ShadowMap},
                {label: 'Metallic', value: ShowLayer.Metallic},
                {label: 'Roughness', value: ShowLayer.Roughness},
                {label: 'SSR', value: ShowLayer.SSR},
            ]
        },
        shouldRotate: {
            onChange: ui.funcRef(),
            checked: true
        },
        normalMapsEnabled: {
            onChange: ui.funcRef(),
            checked: true
        },
        albedoTexturesEnabled: {
            onChange: ui.funcRef(),
            checked: true,
        },
        pause: {
            onChange: ui.funcRef(),
            checked: false,
        },
        materials: {},
        fps: {
            min: 0,
            max: 0,
            current: 0,
        }
    };

    const n = (label: string, props: any) => {
        return ui.NumberInput(label, props, props.onChange);
    };

    const color = (label: string, props: any) => {
        return ui.ColorInput(label, props, props.onChange);
    };

    const slider = (label: string, props: any) => {
        return ui.SliderInput(label, props, props.onChange);
    };

    const minFpsE = document.getElementById('min-fps');
    const maxFpsE = document.getElementById('max-fps');
    const currentFpsE = document.getElementById('current-fps');

    const updateFpsHTML = () => {
        currentFpsE.innerText = state.fps.current.toFixed(2);
        minFpsE.innerText = state.fps.min.toFixed(2);
        maxFpsE.innerText = state.fps.max.toFixed(2);
    };
    updateFpsHTML();

    document.getElementById('app').appendChild(
        ui.Form(
            ui.FormRow(
                ui.e('div', ui.c('col-lg'),
                    ui.FormGroup('Features',
                        ui.CheckBoxInput('Pause', state.pause, state.pause.onChange),
                        ui.CheckBoxInput('Rotate / animate', state.shouldRotate, state.shouldRotate.onChange),
                        ui.CheckBoxInput('SSAO', state.ssao.enable, state.ssao.enable.onChange),
                        ui.CheckBoxInput('Shadow Map', state.shadowMap.enable, state.shadowMap.enable.onChange),
                        ui.CheckBoxInput('Normal maps', state.normalMapsEnabled, state.normalMapsEnabled.onChange),
                        ui.CheckBoxInput('Albedo textures', state.albedoTexturesEnabled, state.albedoTexturesEnabled.onChange),
                        ui.CheckBoxInput('Screen-space reflections', state.ssr.enable, state.ssr.enable.onChange),
                    ),
                    ui.FormGroup('Layer to show',
                        ui.RadioInput(state.showLayer.options, state.showLayer, state.showLayer.onChange)
                    ),
                    ui.FormGroup('SSAO',
                        n('Samples', state.ssao.sampleCount),
                        n('Noise scale', state.ssao.noiseScale),
                        n('Radius', state.ssao.radius),
                        n('Bias', state.ssao.bias),
                        n('Strength', state.ssao.strength),
                        n('Scale power', state.ssao.scalePower),
                    ),
                    ui.FormGroup('SSAO Blur',
                        n('Pos. threshold', state.ssao.blurPositionThreshold),
                        n('Normal threshold', state.ssao.blurNormalThreshold),
                    ),
                ),
                ui.e('div', ui.c('col-lg'),
                    ui.FormGroup('Shadow Map',
                        n('Fixed bias', state.shadowMap.bias.fixed),
                        n('Normal bias', state.shadowMap.bias.normal),
                    ),
                    ui.FormGroup('Lighting',
                        n('Light count', state.lighting.lightCount),
                    ),
                    ui.FormGroup('Sun',
                        n('Intensity', state.lighting.sun.intensity),
                    ),
                    ui.FormGroup('New lights',
                        n('Radius', state.lighting.new.radius),
                        n('Pos scale', state.lighting.new.posScale),
                        n('Intensity', state.lighting.new.intensity),
                    ),
                ),
            ),
        )
    );

    const canvas = <HTMLCanvasElement>document.getElementById("gl");
    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;
    const gl = initGL(canvas);

    const quadArrayBuffer: GLArrayBufferI = new GLArrayBufferV1(gl, QuadArrayBufferData);
    const fb = new FullScreenQuad(gl, quadArrayBuffer);
    const progressBarCommon = new ProgressBarCommon(gl, fb);
    const progressBar = new ProgressBar(gl, progressBarCommon);

    var contentLength = 1;
    var downloaded = 0;

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    progressBar.prepare(gl);

    const onHeaders = ({headers, length}) => {
        if (headers) {
            contentLength = parseInt(headers.get("content-length"));
        } else {
            downloaded += length;
            const progress: number = downloaded / contentLength;
            progressBar.render(gl, progress);
        }
    };

    const onColorChanges = (stateRef: any, material: Material) => {
        stateRef.albedo.onChange.ref = (v) => {
            hexToRgb1(material.albedo.value, v);
        };
        stateRef.metallic.onChange.ref = v => {
            material.setMetallic(v);
        };
        stateRef.roughness.onChange.ref = v => {
            material.setRoughness(v);
        };
    };

    const makeMaterialFromState = (stateRef): Material => {
        const albedo = hexToRgb1(tmpVec4, stateRef.albedo.value);
        return new Material()
            .setAlbedo(albedo[0], albedo[1], albedo[2], 1.)
            .setRoughness(stateRef.roughness.value)
            .setMetallic(stateRef.metallic.value)
    };

    Promise.all([
        fetchObject('resources/sphere.obj', onHeaders).then(parser => {
            return parser.getArrayBuffer().intoGLArrayBuffer(gl);
        }),
        fetchObject('resources/plane.obj', onHeaders).then(parser => {
            return parser.getArrayBuffer().intoGLArrayBuffer(gl);
        }),
    ]).then(([sphereMesh, planeMesh]) => {
        const camera = new Camera(gl.canvas.width / gl.canvas.height);
        camera.position = vec3.fromValues(0, 0, -3.);

        const ssaoConfig = new SSAOConfig();
        const shadowMapConfig = new ShadowMapConfig();
        const ssrConfig = new SSRConfig();

        const updateSSAOConfig = () => {
            const c = ssaoConfig;
            const s = state.ssao;
            c.strength = s.strength.value;
            c.scalePower = s.scalePower.value;
            c.bias = s.bias.value;
            c.radius = s.radius.value;
            c.noiseScale = s.noiseScale.value;
            c.sampleCount = s.sampleCount.value;
            c.enabled = state.ssao.enable.checked;
            c.blurNormalThreshold = state.ssao.blurNormalThreshold.value;
            c.blurPositionThreshold = state.ssao.blurPositionThreshold.value;
        };
        updateSSAOConfig();

        const updateShadowMapConfig = () => {
            const c = shadowMapConfig;
            const s = state.shadowMap;
            c.enabled = s.enable.checked;
            c.normalBias = s.bias.normal.value;
            c.fixedBias = s.bias.fixed.value;
        };
        updateShadowMapConfig();

        const updateSSRConfig = () => {
            ssrConfig.enabled = state.ssr.enable.checked;
        };
        updateSSRConfig();

        const ssaoState = new SSAOState(gl, ssaoConfig);
        const rendererConfig = new DeferredRendererConfig();
        rendererConfig.ssao = ssaoConfig;
        rendererConfig.shadowMap = shadowMapConfig;
        rendererConfig.ssr = ssrConfig;
        rendererConfig.showLayer = state.showLayer.value;
        rendererConfig.normalMapsEnabled = state.normalMapsEnabled.checked;
        rendererConfig.albedoTexturesEnabled = state.albedoTexturesEnabled.checked;

        const renderer = new DeferredRenderer(gl, rendererConfig, fb, sphereMesh, ssaoState);
        let scene = new Scene();

        state.normalMapsEnabled.onChange.ref = v => {
            rendererConfig.normalMapsEnabled = v;
        };
        state.albedoTexturesEnabled.onChange.ref = v => {
            rendererConfig.albedoTexturesEnabled = v;
        };

        loadSceneFromGLTF(gl, SAMPLE_GLTF_SPONZA_DDS).then(newScene => {
            scene = newScene;
            scene.directionalLights.push(sun.directionalLight);

            // camera.far = 50;
            vec3.set(camera.position, -6.4035325050354, 1.3013536930084229, -0.20439213514328003);
            vec3.set(camera.forward, 1, 0, 0);
            camera.calculateUpFromWorldUp();
        }, (err) => {
            printError(err);
        });

        const sun = new GameObjectBuilder("sun").setDirectionalLightComponent(new DirectionalLight()).build();
        sun.directionalLight.direction = vec3.normalize(sun.directionalLight.direction, [-1, -1, -1]);
        sun.directionalLight.intensity = state.lighting.sun.intensity.value;

        scene.directionalLights.push(sun.directionalLight);


        // TEST 2 shadow lights
        // const sun2 = new GameObjectBuilder("sun 2").setDirectionalLightComponent(new DirectionalLight()).build();
        // sun2.directionalLight.direction = vec3.normalize(sun2.directionalLight.direction, [-1, -0.2, 1]);
        // sun2.directionalLight.intensity = 0.5;
        // sun2.directionalLight.ambient = v3(state.lighting.sun.ambient.value);
        // sun2.directionalLight.diffuse = v3(state.lighting.sun.diffuse.value);
        // sun2.directionalLight.specular = v3(state.lighting.sun.specular.value);
        //
        // scene.directionalLights.push(sun2.directionalLight);

        let delta = 1000. / 60;
        let lastStart = null;
        let frame = 0;

        function processFrame(timestamp: DOMHighResTimeStamp) {
            if (state.pause.checked) {
                return;
            }

            if (lastStart === null) {
                delta = 1000 / 60;
                lastStart = timestamp;
            } else {
                delta = timestamp - lastStart;
                lastStart = timestamp;
            }

            state.fps.current = 1000 / delta;
            if (frame % 100 === 0) {
                state.fps.min = state.fps.current;
                state.fps.max = state.fps.current;
            } else {
                state.fps.min = Math.min(state.fps.min, state.fps.current);
                state.fps.max = Math.max(state.fps.max, state.fps.current)
            }
            frame++;
            if (frame % 5 === 0) {
                updateFpsHTML();
            }

            pressedKeys.forEach((v, k) => {
                const moveSpeed = delta * 0.003;
                switch (k) {
                    case 'e':
                        vec3.scale(tmpVec3, camera.up, moveSpeed);
                        vec3.add(camera.position, camera.position, tmpVec3);
                        camera.update();
                        break;
                    case 'z':
                        vec3.scale(tmpVec3, camera.up, -moveSpeed);
                        vec3.add(camera.position, camera.position, tmpVec3);
                        camera.update();
                        break;
                    case 'w':
                        vec3.scale(tmpVec3, camera.forward, moveSpeed);
                        vec3.add(camera.position, camera.position, tmpVec3);
                        camera.update();
                        break;
                    case 's':
                        vec3.scale(tmpVec3, camera.forward, -moveSpeed);
                        vec3.add(camera.position, camera.position, tmpVec3);
                        camera.update();
                        break;
                    case 'a':
                        vec3.scale(tmpVec3, camera.right(), -moveSpeed);
                        vec3.add(camera.position, camera.position, tmpVec3);
                        camera.update();
                        break;
                    case 'd':
                        vec3.scale(tmpVec3, camera.right(), moveSpeed);
                        vec3.add(camera.position, camera.position, tmpVec3);
                        camera.update();
                        break;
                }
            });

            if (state.shouldRotate.checked) {
                vec3.normalize(sun.directionalLight.direction,
                    [-0.5, -0.95, Math.sin(timestamp / 8000) * 0.25]
                );
            }

            optimizeNearFar(camera, scene);
            renderer.render(scene, camera);

            requestAnimationFrame(processFrame);
        }

        var zoom = 1.0;
        var pitch = 0.;
        var yaw = 0.;
        var sensitivityY = 0.0001;
        var sensitivityX = 0.0001;

        const pressedKeys = new Map<String, Boolean>();

        window.onkeydown = ev => {
            pressedKeys.set(ev.key, true);
        };
        window.onkeyup = ev => {
            pressedKeys.delete(ev.key);
        };

        var initialFov = camera.fov;

        canvas.onwheel = ev => {
            if (ev.ctrlKey) {
                zoom = clip(zoom + ev.deltaY * camera.fov * 0.0001, 0.1, 1.90);
                camera.fov = initialFov * zoom;
                camera.update()
            } else if (ev.shiftKey) {
                vec3.scale(tmpVec3, camera.up, -ev.deltaY * 0.01);
                vec3.add(camera.position, camera.position, tmpVec3);

                vec3.scale(tmpVec3, camera.right(), ev.deltaX * 0.01);
                vec3.add(camera.position, camera.position, tmpVec3);
                camera.update()
            } else {
                pitch += ev.deltaY * sensitivityY * camera.fov;
                yaw -= ev.deltaX * sensitivityX * camera.fov;

                pitch = clip(pitch, -PI2, PI2);

                let forward = vec3.fromValues(0, 0, 1);
                let up = vec3.fromValues(0, 1, 0);

                vec3.rotateX(forward, forward, originZero, pitch);
                vec3.rotateY(forward, forward, originZero, yaw);

                vec3.rotateX(up, up, originZero, pitch);
                vec3.rotateY(up, up, originZero, yaw);
                camera.forward = forward;
                camera.up = up;
                camera.update()
            }

            ev.preventDefault();
        };

        state.ssr.enable.onChange.ref = updateSSRConfig;

        const onSSSAOStateParamsChange = () => {
            updateSSAOConfig();
            ssaoState.recalculate(gl, ssaoConfig);
            renderer.onChangeSSAOState();
        };

        state.ssao.sampleCount.onChange.ref = onSSSAOStateParamsChange;
        state.ssao.noiseScale.onChange.ref = onSSSAOStateParamsChange;
        state.ssao.scalePower.onChange.ref = onSSSAOStateParamsChange;
        state.ssao.strength.onChange.ref = (v, prev) => {
            renderer.config.ssao.strength = v;
            if (v === 0 || prev === 0) {
                renderer.recompileShaders();
            }
        };
        state.ssao.bias.onChange.ref = updateSSAOConfig;
        state.ssao.radius.onChange.ref = updateSSAOConfig;
        state.ssao.blurPositionThreshold.onChange.ref = updateSSAOConfig;
        state.ssao.blurNormalThreshold.onChange.ref = updateSSAOConfig;
        state.ssao.enable.onChange.ref = v => {
            renderer.config.ssao.enabled = v;
            console.log('SSAOState enabled', renderer.config.ssao.enabled);
            renderer.recompileShaders();
        };

        state.shadowMap.bias.fixed.onChange.ref = updateShadowMapConfig;
        state.shadowMap.bias.normal.onChange.ref = updateShadowMapConfig;
        state.shadowMap.enable.onChange.ref = v => {
            renderer.config.shadowMap.enabled = v;
            console.log('shadowmap enabled', renderer.config.shadowMap.enabled);
            renderer.recompileShaders();
        };

        state.lighting.sun.intensity.onChange.ref = v => {
            sun.directionalLight.intensity = v;
        };
        state.lighting.lightCount.onChange.ref = v => {
            v = clip(v, 0, 500);
            console.log(scene.pointLights.length);
            const diff = scene.pointLights.length - v;
            if (diff > 0) {
                for (let index = 0; index < diff; index++) {
                    scene.pointLights.pop();
                }
            } else if (diff < 0) {
                for (let index = 0; index < -diff; index++) {
                    const l = randomPointLight(state.lighting.new.posScale.value, state.lighting.new.intensity.value);
                    l.radius = state.lighting.new.radius.value;
                    scene.pointLights.push(l)
                }
            }
            console.log('new point light count ' + scene.pointLights.length);
        };
        state.lighting.lightCount.onChange(state.lighting.lightCount.value);


        state.showLayer.onChange.ref = vstring => {
            const v = ShowLayer[vstring];
            console.log('setting show layer to ' + v);
            renderer.config.showLayer = parseInt(vstring);
            renderer.recompileShaders();
        };

        state.pause.onChange.ref = isPaused => {
            if (!isPaused) {
                lastStart = null;
                requestAnimationFrame(processFrame);
            }
        };

        requestAnimationFrame(processFrame)

    }).catch(printError);
}

window.addEventListener('load', () => {
    try {
        main()
    } catch (e) {
        printError(e);
    }
});
