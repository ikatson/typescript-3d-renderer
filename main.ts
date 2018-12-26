import {fetchObject} from "./objparser.js";
import {
    clip,
    FullScreenQuad,
    glClearColorAndDepth,
    initGL,
    QuadArrayBufferData,
    tmpVec3
} from "./utils.js";
import {ProgressBar, ProgressBarCommon} from "./progressbar.js";
import {BoundingBoxComponent, GameObjectBuilder, LightComponent, MaterialComponent, MeshComponent} from "./object.js";
import {Camera} from "./camera.js";

import {vec3} from "./gl-matrix.js";
import {randomLight, Scene} from "./scene.js";
import {DeferredRenderer, DeferredRendererConfig, ShadowMapConfig, ShowLayer} from "./deferredRenderer.js";
import {GLArrayBuffer} from "./glArrayBuffer.js";
import * as ui from "./ui.js";
import {SSAOConfig, SSAOState} from "./SSAOState.js";
import {Material} from "./material.js";


const originZero = vec3.create();
const PI2 = Math.PI / 2.0 - 0.01;

function main() {
    const state = {
        lighting: {
            lightCount: {
                value: 1,
                min: 1,
                step: 1,
                onChange: ui.funcRef(),
            },
            sun: {
                ambient: {value: 0.2, min: 0, step: 0.1, onChange: ui.funcRef()},
                diffuse: {value: 0.6, min: 0, step: 0.1, onChange: ui.funcRef()},
                specular: {value: 0.2, min: 0, step: 0.1, onChange: ui.funcRef()},
                intensity: {value: 1., min: 0, step: 0.1, onChange: ui.funcRef()},
            },
            'new': {
                radius: {value: 1.5, min: 0, step: 0.1, onChange: ui.funcRef()},
                posScale: {value: 1.5, min: 0, step: 0.1, onChange: ui.funcRef()},
                attenuation: {value: 0.15, min: 0, step: 0.1, onChange: ui.funcRef()},
                intensity: {value: 1., min: 0, step: 0.1, onChange: ui.funcRef()},
            }
        },
        shadowMap: {
            enable: {
                onChange: ui.funcRef(),
                checked: true,
            },
            bias: {
                fixed: {value: 0.01, min: 0, step: 0.0001, onChange: ui.funcRef()},
                normal: {value: 0.005, min: 0, step: 0.0001, onChange: ui.funcRef()},
            }
        },
        ssao: {
            enable: {
                onChange: ui.funcRef(),
                checked: true,
            },
            sampleCount: {value: 32, min: 1, step: 1, onChange: ui.funcRef()},
            noiseScale: {value: 4, min: 2, step: 1, onChange: ui.funcRef()},
            radius: {value: 0.25, min: 0.001, step: 0.1, onChange: ui.funcRef(),},
            bias: {value: 0.02, step: 0.001, min: 0.001, onChange: ui.funcRef(),},
            strength: {value: 1.0, min: 0, step: 0.5, onChange: ui.funcRef(),},
            scalePower: {value: 2, min: 0, step: 0.5, onChange: ui.funcRef(),},
            blurPositionThreshold: {value: 0.3, min: 0, step: 0.01, onChange: ui.funcRef()},
            blurNormalThreshold: {value: 0.9, min: 0, step: 0.05, onChange: ui.funcRef()},
        },
        showLayer: {
            // value: ShowLayer.Final,
            value: ShowLayer.Final,
            onChange: ui.funcRef(),
            options: [
                {label: 'Final', value: ShowLayer.Final},
                {label: 'Positions', value: ShowLayer.Positions},
                {label: 'Normals', value: ShowLayer.Normals},
                {label: 'SSAO', value: ShowLayer.SSAO},
                {label: 'Color', value: ShowLayer.Color},
                {label: 'Shadow Map', value: ShowLayer.ShadowMap},
                {label: 'Specular', value: ShowLayer.Specular},
                {label: 'Shininess', value: ShowLayer.Shininess},
            ]
        },
        shouldRotate: {
            onChange: ui.funcRef(),
            checked: true
        },
        pause: {
            onChange: ui.funcRef(),
            checked: false,
        },
        materials: {
            corvette: {
                albedo: {
                    value: '#ff0000', onChange: ui.funcRef(),
                },
                specular: {
                    value: '#ffffff', onChange: ui.funcRef(),
                },
                shininess: {value: 20, min: 0, step: 1, max: 256, onChange: ui.funcRef(),},
            },
            plane: {
                albedo: {
                    value: '#ff0000', onChange: ui.funcRef(),
                },
                specular: {
                    value: '#ffffff', onChange: ui.funcRef(),
                },
                shininess: {value: 20, min: 0, step: 1, max: 256, onChange: ui.funcRef(),},
            },
            aphrodite: {
                albedo: {
                    value: '#ff0000', onChange: ui.funcRef(),
                },
                specular: {
                    value: '#ffffff', onChange: ui.funcRef(),
                },
                shininess: {value: 20, min: 0, step: 1, max: 256, onChange: ui.funcRef(),},
            }
        }
    };

    const n = (label: string, props: any) => {
        return ui.NumberInput(label, props, props.onChange);
    };

    const color = (label: string, props: any) => {
        return ui.ColorInput(label, props, props.onChange);
    };

    document.getElementById('app').appendChild(
        ui.Form(
            ui.FormRow(
                ui.e('div', ui.c('col-lg'),
                    ui.FormGroup('SSAO',
                        ui.CheckBoxInput('Enable', state.ssao.enable, state.ssao.enable.onChange),
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
                    ui.FormGroup('Layer to show',
                        ui.RadioInput(state.showLayer.options, state.showLayer, state.showLayer.onChange)
                    ),
                    ui.FormGroup('Other',
                        ui.CheckBoxInput('Should rotate', state.shouldRotate, state.shouldRotate.onChange),

                        ui.CheckBoxInput('Pause', state.pause, state.pause.onChange),
                    ),
                ),
                ui.e('div', ui.c('col-lg'),
                    ui.FormGroup('Shadow Map',
                        ui.CheckBoxInput('Enable', state.shadowMap.enable, state.shadowMap.enable.onChange),
                        n('Fixed bias', state.shadowMap.bias.fixed),
                        n('Normal bias', state.shadowMap.bias.normal),
                    ),
                    ui.FormGroup('Lighting',
                        n('Light count', state.lighting.lightCount),
                    ),
                    ui.FormGroup('Sun',
                        n('Ambient', state.lighting.sun.ambient),
                        n('Diffuse', state.lighting.sun.diffuse),
                        n('Specular', state.lighting.sun.specular),
                        n('Intensity', state.lighting.sun.intensity),
                    ),
                    ui.FormGroup('New lights',
                        n('Radius', state.lighting.new.radius),
                        n('Pos scale', state.lighting.new.posScale),
                        n('Attenuation', state.lighting.new.attenuation),
                        n('Intensity', state.lighting.new.intensity),
                    ),
                    ui.FormGroup('Car colors',
                        color('Albedo', state.materials.corvette.albedo),
                        color('Specular', state.materials.corvette.specular),
                        n('Shininess', state.materials.corvette.shininess),
                    )
                ),
            ),
        )
    );

    const canvas = <HTMLCanvasElement>document.getElementById("gl");
    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;
    const gl = initGL(canvas);

    const quadArrayBuffer = new GLArrayBuffer(gl, QuadArrayBufferData);
    const fb = new FullScreenQuad(gl, quadArrayBuffer);
    const progressBarCommon = new ProgressBarCommon(gl, fb);
    const progressBar = new ProgressBar(gl, progressBarCommon);

    var contentLength = 1;
    var downloaded = 0;

    glClearColorAndDepth(gl, 0, 0, 0, 1);

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

    function hexToRgb1(out, hex: string) {
        const bigint = parseInt(hex.slice(1, hex.length), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;

        out[0] = r / 256;
        out[1] = g / 256;
        out[2] = b / 256;
        return out;
    }

    const onColorChanges = (stateRef: any, material: Material) => {
        stateRef.albedo.onChange.ref = (v) => {
            hexToRgb1(material.albedo, v);
        };
        stateRef.specular.onChange.ref = (v) => {
            hexToRgb1(material.specular, v);
        };
        stateRef.shininess.onChange.ref = v => {
            material.shininess = v;
        }
    };

    Promise.all([
        fetchObject('resources/aphrodite/aphrodite.obj', onHeaders).then(parser => {
            const arrayBuf = parser.getArrayBuffer();
            const aphrodite = new GameObjectBuilder("aphrodite.obj").setMeshComponent(
                new MeshComponent(arrayBuf.intoGLArrayBuffer(gl))
            ).build();
            aphrodite.boundingBox = new BoundingBoxComponent(arrayBuf.computeBoundingBox());
            aphrodite.transform.scale = [1 / 3, 1 / 3, 1 / 3];
            aphrodite.transform.rotation = [0, -Math.PI / 2.0, 0];
            aphrodite.transform.position = [0, 1., 0];
            aphrodite.transform.update();
            return aphrodite;
        }),
        fetchObject('resources/corvette/corvette.obj', onHeaders).then(parser => {
            const arrayBuffer = parser.getArrayBuffer();
            const corvette = new GameObjectBuilder("corvette.obj")
                .setMeshComponent(new MeshComponent(
                    arrayBuffer.intoGLArrayBuffer(gl),
                ))
                .setBoundingBoxComponent(
                    new BoundingBoxComponent(arrayBuffer.computeBoundingBox())
                )
                .setMaterialComponent(new MaterialComponent(
                    new Material().setAlbedo(1, 0, 0).setShininess(10).setSpecular(0.5, 0.5, 0.5)
                ))
                .build();
            corvette.transform.position = [0, -1., 0];
            corvette.transform.update();

            onColorChanges(state.materials.corvette, corvette.material.material);
            return corvette;
        }),
        fetchObject('resources/sphere.obj', onHeaders).then(parser => {
            return parser.getArrayBuffer().intoGLArrayBuffer(gl);
        }),
        // fetchObject('resources/cube.obj', onHeaders, new ObjParser(true)).then(parser => {
        //     return parser;
        // }),
        fetchObject('resources/plane.obj', onHeaders).then(parser => {
            return parser.getArrayBuffer().intoGLArrayBuffer(gl);
        }),
    ]).then(([aphrodite, corvette, sphereMesh, planeMesh]) => {
        const camera = new Camera(gl.canvas.width / gl.canvas.height);
        camera.position = vec3.fromValues(0, 0, -3.);

        // const renderer = new ForwardRenderer(gl);
        const ssaoConfig = new SSAOConfig();
        const shadowMapConfig = new ShadowMapConfig();

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

        const ssaoState = new SSAOState(gl, ssaoConfig);
        const rendererConfig = new DeferredRendererConfig();
        rendererConfig.ssao = ssaoConfig;
        rendererConfig.shadowMap = shadowMapConfig;
        rendererConfig.showLayer = state.showLayer.value;

        const renderer = new DeferredRenderer(gl, rendererConfig, fb, sphereMesh, ssaoState);
        const scene = new Scene();

        const v3 = v => [v, v, v];

        const sun = new GameObjectBuilder("sun").setLightComponent(new LightComponent()).build();
        sun.transform.position = [2., 2., -2.];
        sun.transform.update();
        sun.light.radius = 0;
        sun.light.intensity = state.lighting.sun.intensity.value;
        sun.light.ambient = v3(state.lighting.sun.ambient.value);
        sun.light.diffuse = v3(state.lighting.sun.diffuse.value);
        sun.light.specular = v3(state.lighting.sun.specular.value);

        scene.lights = [sun];

        const plane = new GameObjectBuilder("plane").setMeshComponent(new MeshComponent(planeMesh)).build();
        plane.mesh.setShadowCaster(false);
        plane.transform.position = [0, -0.8, 0];
        plane.transform.scale = [50, 50, 50];
        plane.transform.update();


        scene.addChild(plane);
        scene.addChild(corvette);
        corvette.addChild(aphrodite);

        let delta = 1000. / 60;
        let start = new Date().getTime();

        function processFrame() {
            // console.log({mat4, vec3})
            // debugger;
            if (state.pause.checked) {
                return;
            }

            pressedKeys.forEach((v, k) => {
                const moveSpeed = delta * 0.0015;
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
                corvette.transform.rotation[1] += delta / 2000;
                corvette.transform.update();
            }

            renderer.render(scene, camera);

            const end = new Date().getTime();
            delta = end - start;
            start = end;

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

            event.preventDefault();
        };

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

        state.lighting.sun.ambient.onChange.ref = v => {
            sun.light.ambient = [v, v, v];
        };
        state.lighting.sun.specular.onChange.ref = v => {
            sun.light.specular = [v, v, v];
        };
        state.lighting.sun.diffuse.onChange.ref = v => {
            sun.light.diffuse = [v, v, v];
        };
        state.lighting.sun.intensity.onChange.ref = v => {
            sun.light.intensity = v;
        };
        state.lighting.lightCount.onChange.ref = v => {
            v = clip(v, 1, 500);
            console.log(scene.lights.length);
            const diff = scene.lights.length - v;
            if (diff > 0) {
                for (let index = 0; index < diff; index++) {
                    scene.lights.pop();
                }
            } else if (diff < 0) {
                for (let index = 0; index < -diff; index++) {
                    const l = randomLight(state.lighting.new.posScale.value, state.lighting.new.intensity.value);
                    l.light.radius = state.lighting.new.radius.value;
                    l.light.attenuation = state.lighting.new.attenuation.value;
                    scene.lights.push(l)
                }
            }
            console.log('new light count ' + scene.lights.length);
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
                requestAnimationFrame(processFrame);
            }
        };

        processFrame()

    }, e => console.error(e));
}

window.onload = main;
