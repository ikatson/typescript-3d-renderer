import {ShaderProgram, VertexShader, FragmentShader} from "./shaders.js";
import {ObjParser, fetchObject} from "./objparser.js";
import { FullScreenQuad, glClearColorAndDepth, initGL, clip, QuadArrayBufferData } from "./utils.js";
import { ProgressBarCommon, ProgressBar } from "./progressbar.js";
import {GLMesh, GLMeshFromObjParser} from "./mesh.js";
import { Texture } from "./texture.js";
import { GameObject, GameObjectBuilder, LightComponent } from "./object.js";
import { Material } from "./material.js";
import { Camera } from "./camera.js";

import {mat4, vec3} from "./gl-matrix.js";
import { ForwardRenderer } from "./forwardRenderer.js";
import { Scene, randomLights, randomLight } from "./scene.js";
import { DeferredRenderer, ShowLayer } from "./deferredRenderer.js";
import { GLArrayBuffer } from "./glArrayBuffer.js";


const originZero = vec3.create();
const PI2 = Math.PI / 2.0 - 0.01;


const VERTEX_SHADER_FORWARD_RENDER_DEFAULT = `
precision highp float;

in vec4 a_pos;
in vec4 a_norm;
in vec2 a_uv;

uniform mat4 u_modelViewMatrix;
uniform mat4 u_perspectiveMatrix;

out vec4 v_pos;
out vec4 v_norm;
out vec2 v_uv;

void main() {
    gl_Position = u_perspectiveMatrix * u_modelViewMatrix * a_pos;
    
    v_pos = gl_Position;
    v_norm = normalize(u_modelViewMatrix * a_norm);
    v_norm.z = -v_norm.z;
    v_uv = a_uv;
}
`;


const FRAGMENT_SHADER_FORWARD_RENDER_DEFAULT = `
precision highp float;
in vec4 v_pos;
in vec4 v_norm;
in vec2 v_uv;

out vec4 color;

uniform float u_time;
uniform sampler2D u_sampler_ao;
uniform sampler2D u_sampler_normals;
uniform mat4 u_modelViewMatrix;
uniform mat4 u_perspectiveMatrix;

struct light {
    vec3 position;
    vec3 color;
    float intensity;
};

struct material {
    vec3 specular;
    vec3 diffuse;
    vec3 ambient;
    float shininess;
};

vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm ) {
    vec2 vUv = v_uv;
    float normalScale = 1.;
    vec3 q0 = vec3( dFdx( eye_pos.x ), dFdx( eye_pos.y ), dFdx( eye_pos.z ) );
    vec3 q1 = vec3( dFdy( eye_pos.x ), dFdy( eye_pos.y ), dFdy( eye_pos.z ) );
    vec2 st0 = dFdx( vUv.st );
    vec2 st1 = dFdy( vUv.st );

    float scale = sign( st1.t * st0.s - st0.t * st1.s ); // we do not care about the magnitude

    vec3 S = normalize( ( q0 * st1.t - q1 * st0.t ) * scale );
    vec3 T = normalize( ( - q0 * st1.s + q1 * st0.s ) * scale );
    vec3 N = normalize( surf_norm );
    mat3 tsn = mat3( S, T, N );

    vec3 mapN = texture( u_sampler_normals, vUv ).xyz * 2.0 - 1.0;

    mapN.xy *= normalScale;
    mapN.xy *= ( float( gl_FrontFacing ) * 2.0 - 1.0 );

    return normalize( tsn * mapN );
}

vec3 phong(vec3 normal, vec3 point, vec3 eye) {
    light l;

    float c = cos(u_time);
    
    l.position = vec3(0.0, cos(u_time) * 5.0 - 10.0, -5.);
    l.color = vec3(1.);
    l.intensity = 0.8;

    vec3 skin = vec3(1., 0.87, 0.74);
    
    material m;
    m.specular = vec3(0.2);
    m.diffuse = skin;
    m.ambient = skin * 0.01;
    m.shininess = 5.;
    
    vec3 color = m.ambient;
    
    vec3 lightDirection = normalize(point - l.position);
    float dNL = max(dot(normal, -lightDirection), 0.);

    vec3 ao = texture(u_sampler_ao, v_uv).xyz;
    // ao = pow(ao, vec3(3.));

    vec3 diffuse = m.diffuse * l.color * l.intensity * ao * dNL;
    vec3 r = reflect(lightDirection, normal);
    vec3 specular = m.specular * l.color * l.intensity * ao * pow(max(dot(r, normalize(eye - point)), 0.), m.shininess);
    color += diffuse + specular;
    
    return color;
}

void main() {
    // texture normal
    // vec4 txNormal = texture(u_sampler_normals, v_uv);
    // txNormal.w = 0.;
    // vec3 normal = normalize(u_perspectiveMatrix * u_modelViewMatrix * txNormal).xyz;
    
    // This is vertex normal, not texture normal.
    vec3 normal = normalize(v_norm.xyz);
    // normal = perturbNormal2Arb(v_pos.xyz, normal);

    color = vec4(vec3(phong(normal, v_pos.xyz, vec3(0., 0., -10.))), 1.);
    // color = vec4(normal / 2.0 + 0.5, 1.);

    //normal = normalize(normal);
    // gl_FragColor = vec4(normal.xyz, 1.);
    // gl_FragColor = vec4(1.);
}
`;

function main() {
    const canvas = <HTMLCanvasElement> document.getElementById("gl");
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
            downloaded += length
            const progress: number = downloaded / contentLength;
            progressBar.render(gl, progress);
        }
    }

    const defaultForwardRenderShader = new ShaderProgram(
        gl,
        new VertexShader(gl, VERTEX_SHADER_FORWARD_RENDER_DEFAULT),
        new FragmentShader(gl, FRAGMENT_SHADER_FORWARD_RENDER_DEFAULT)
    )
    const aphroditeMaterial = new Material(defaultForwardRenderShader);
    aphroditeMaterial.setAmbientOcclusionTexture(new Texture(gl, "ao.png", gl.TEXTURE0));
    aphroditeMaterial.setNormalMapTexture(new Texture(gl, "normals.png", gl.TEXTURE1));

    Promise.all([
        fetchObject('resources/aphrodite/aphrodite.obj', onHeaders).then(parser => {
            const mesh = GLMeshFromObjParser(gl, parser);
            return new GameObjectBuilder().setMesh(mesh).build();
        }),
        fetchObject('resources/corvette/corvette.obj', onHeaders).then(parser => {
            const mesh = GLMeshFromObjParser(gl, parser);
            const corvette = new GameObjectBuilder().setMesh(mesh).build();
            corvette.transform.scale = [3., 3., 3.];
            corvette.transform.rotation = [0, Math.PI / 2.0, 0];
            corvette.transform.position = [0, -3., 0];
            corvette.transform.update();
            return corvette;
        }),
        fetchObject('resources/sphere.obj', onHeaders).then(parser => {
            const mesh = GLMeshFromObjParser(gl, parser);
            return mesh;
        }),
        fetchObject('resources/plane.obj', onHeaders).then(parser => {
            const mesh = GLMeshFromObjParser(gl, parser);
            return mesh;
        }),
    ]).then(([aphrodite, corvette, sphereMesh, planeMesh]) => {
        const camera = new Camera(gl);
        camera.position = vec3.fromValues(0, 0, -10.);

        // const renderer = new ForwardRenderer(gl);
        const renderer = new DeferredRenderer(gl, fb, sphereMesh);
        const scene = new Scene();

        const sun = new GameObjectBuilder().setLightComponent(new LightComponent()).build();
        sun.transform.position = [100., 100., -100.];
        sun.transform.update();
        sun.light.radius = 0;

        scene.lights = [sun]

        const plane = new GameObjectBuilder().setMesh(planeMesh).build();
        plane.transform.position = [0, -2., 0];
        plane.transform.scale = [5, 5, 5];
        plane.transform.update();

        
        scene.addChild(plane);
        scene.addChild(aphrodite);
        aphrodite.addChild(corvette);

        const tmpVec = vec3.create();
        
        function processFrame() {
            pressedKeys.forEach((v, k) => {
                const moveSpeed = 0.05;
                switch(k) {
                    case 'e':
                        vec3.scale(tmpVec, camera.up, moveSpeed);
                        vec3.add(camera.position, camera.position, tmpVec);
                        break;
                    case 'z':
                        vec3.scale(tmpVec, camera.up, -moveSpeed);
                        vec3.add(camera.position, camera.position, tmpVec);
                        break;
                    case 'w':
                        vec3.scale(tmpVec, camera.forward, moveSpeed);
                        vec3.add(camera.position, camera.position, tmpVec);
                        break;
                    case 's':
                        vec3.scale(tmpVec, camera.forward, -moveSpeed);
                        vec3.add(camera.position, camera.position, tmpVec);
                        break;
                    case 'a':
                        vec3.scale(tmpVec, camera.right(), -moveSpeed);
                        vec3.add(camera.position, camera.position, tmpVec);
                        break;
                    case 'd':
                        vec3.scale(tmpVec, camera.right(), moveSpeed);
                        vec3.add(camera.position, camera.position, tmpVec);
                        break;
                }
            })

            if (shouldRotate.checked) {
                aphrodite.transform.rotation[1] += 0.01;
                aphrodite.transform.update();
            }

            renderer.render(scene, camera);

            requestAnimationFrame(processFrame);
        }

        var zoom = 1.0;
        var pitch = 0.;
        var yaw = 0.;
        var sensitivityY = 0.01;
        var sensitivityX = 0.01;

        

        const pressedKeys = new Map<String, Boolean>();

        window.onkeydown = ev => {
            pressedKeys.set(ev.key, true);
        }
        window.onkeyup = ev => {
            pressedKeys.delete(ev.key);
        }

        var initialFov = camera.fov;

        canvas.onwheel = ev => {
            if (ev.ctrlKey) {
                zoom = clip(zoom + ev.deltaY * 0.005, 0.1, 1.90);
                camera.fov = initialFov * zoom;
            } else if (ev.shiftKey) {
                const tmp = vec3.create();
                vec3.scale(tmp, camera.up, -ev.deltaY * 0.01);
                vec3.add(camera.position, camera.position, tmp);

                vec3.scale(tmp, camera.right(), ev.deltaX * 0.01);
                vec3.add(camera.position, camera.position, tmp);
            } else {
                pitch += ev.deltaY * sensitivityY;
                yaw -= ev.deltaX * sensitivityX;

                pitch = clip(pitch, -PI2, PI2);

                let forward = vec3.fromValues(0, 0, 1);
                let up = vec3.fromValues(0, 1, 0);
                
                vec3.rotateX(forward, forward, originZero, pitch);
                vec3.rotateY(forward, forward, originZero, yaw);
                
                vec3.rotateX(up, up, originZero, pitch);
                vec3.rotateY(up, up, originZero, yaw);
                camera.forward = forward;
                camera.up = up;

            }
            
            event.preventDefault();
        }

        const getFormEl = name => {
            const el = <HTMLInputElement> document.getElementsByName(name)[0];
            if (el === undefined) {
                throw new Error(`can't find element by name ${name}`)
            }
            return el;
        }

        const onChange = (name, callback: Function) => {
            const el = getFormEl(name);
            const set = () => {
                console.log(`setting value of ${name} to ${el.value}`)
                callback(el.value);
            }
            el.addEventListener('change', set);
            set();
        }

        const onChangeNumber = (name, callback: Function) => {
            onChange(name, v => {
                callback(Number.parseFloat(v));
            })
        }

        const newLightIntensity = getFormEl('new-light-intensity');
        const newLightRadius = getFormEl('new-light-radius');
        const newLightAttenuation = getFormEl('new-light-attenuation');
        const newLightPosScale = getFormEl('new-light-pos-scale');
        const shouldRotate = getFormEl('rotate');

        onChangeNumber('ssao-strength', v => {
            renderer.config.ssao.strength = v;
            // this is only needed if one changed SSAO to 0 then back to 5, but
            // laziness here, whatever let's just recompile just in case.
            renderer.recompileShaders();
        })
        onChangeNumber('ssao-bias', v => {
            renderer.config.ssao.bias = v;
        })
        onChangeNumber('ssao-radius', v => {
            renderer.config.ssao.radius = v;
        })
        onChangeNumber('sun-ambient', v => {
            sun.light.ambient = [v, v, v];
        })
        onChangeNumber('sun-specular', v => {
            sun.light.specular = [v, v, v];
        })
        onChangeNumber('sun-diffuse', v => {
            sun.light.diffuse = [v, v, v];
        })
        onChangeNumber('sun-intensity', v => {
            sun.light.intensity = v;
        })
        onChangeNumber('lights-count', v => {
            v = clip(v, 1, 500);
            console.log(scene.lights.length);
            const diff = scene.lights.length - v;
            if (diff > 0) {
                for (let index = 0; index < diff; index++) {
                    scene.lights.pop();
                }
            } else if (diff < 0) {
                for (let index = 0; index < -diff; index++) {
                    const l = randomLight(newLightPosScale.valueAsNumber, newLightIntensity.valueAsNumber);
                    l.light.radius = newLightRadius.valueAsNumber;
                    l.light.attenuation = newLightAttenuation.valueAsNumber;
                    scene.lights.push(l)
                }
            }
            console.log('new light count ' + scene.lights.length);
        })

        document.getElementsByName('show-layer').forEach(_el => {
            const el = <HTMLInputElement> _el;
            const set = (el: HTMLInputElement) => {
                if (el.checked) {
                    const v = ShowLayer[el.value];
                    console.log('setting show layer to ' + v);
                    renderer.config.showLayer = v;
                    renderer.recompileShaders();
                }
            }
            set(el);
            el.addEventListener('change', () => set(el))
        });
        
        processFrame()

    }, e => console.error(e));
}

window.onload = main;