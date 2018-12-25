import {mat4, vec3, vec4} from "./gl-matrix.js";
import {VertexShader} from "./shaders.js";
import {fetchObject, ObjParser} from "./objparser.js";
import {
    ArrayBufferDataType,
    computeBoundingBox,
    GLArrayBuffer,
    GLArrayBufferData,
    GLArrayBufferDataIterResult,
    GLArrayBufferDataParams
} from "./glArrayBuffer.js";
import {Camera} from "./camera.js";
import {AxisAlignedBox} from "./axisAlignedBox.js";
import {Scene} from "./scene.js";
import {GameObject, LightComponent} from "./object.js";

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
`

export class FullScreenQuad {
    private glArrayBuffer: GLArrayBuffer;
    vertexShader: VertexShader;

    constructor(gl: WebGLRenderingContext, quadBuffer: GLArrayBuffer) {
        this.glArrayBuffer = quadBuffer;
        this.vertexShader = new VertexShader(gl, FULLSCREEN_QUAD_VS);
        // this object owns the shader, don't let others delete it recursively.
        this.vertexShader.setAutodelete(false);
    }

    bind(gl: WebGLRenderingContext, vertexPositionLocation: number) {
        this.glArrayBuffer.bind(gl);
        this.glArrayBuffer.setupVertexPositionsPointer(gl, vertexPositionLocation);
    }

    draw(gl: WebGLRenderingContext) {
        this.glArrayBuffer.draw(gl);
    }
}

export function initGL(canvas: HTMLCanvasElement): WebGLRenderingContext {
    let gl = <WebGLRenderingContext>canvas.getContext("webgl2");
    gl.getExtension("EXT_color_buffer_float");

    glClearColorAndDepth(gl, 0.0, 0.0, 0.0, 1.0);
    return gl;
}

export function glClearColorAndDepth(gl: WebGLRenderingContext, a: number, b: number, c: number, d: number) {
    gl.clearColor(a, b, c, d);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

export const clip = (v: number, min: number, max: number): number => {
    if (v < min) {
        return min;
    }
    if (v > max) {
        return max;
    }
    return v;
};

export const clamp = clip;

export function lerp(v, a, b, c, d) {
    return c + v / (b - a) * (d - c);
}

export function randFloat(min, max) {
    const v = Math.random();
    return lerp(v, 0, 1, min, max);
}

export function randVec3(min: number, max: number): Float32Array | number[] {
    return vec3.fromValues(randFloat(min, max), randFloat(min, max), randFloat(min, max));
}

export function makeObjLoader(name: string) {
    let sphere: Promise<ObjParser> = null;
    return function loadObject() {
        if (sphere) {
            return sphere;
        }
        sphere = fetchObject(name);
        return sphere;
    }
}

export const loadSphere = makeObjLoader('resources/sphere.obj');
export const loadCube = makeObjLoader('resources/cube.obj');

export const tmpMatrix = (function () {
    const m = mat4.create();
    return () => {
        mat4.identity(m);
        return m;
    }
})();

export const tmpVec3 = vec3.create();

export const makeFrustum = (camera: Camera, pointsOnly: boolean = false): GLArrayBufferData => {
    const tmp = tmpMatrix();
    const camToWorld = camera.getCameraToWorld();
    let cubeVertices: GLArrayBufferData;
    if (pointsOnly){
        cubeVertices = new AxisAlignedBox().asVerticesBuffer();
    } else {
        cubeVertices = new AxisAlignedBox().asWireFrameBuffer();
    }

    mat4.invert(tmp, camera.projectionMatrix());

    const data = [];

    cubeVertices.iterData((i: GLArrayBufferDataIterResult) => {
        let v = i.vertex;
        if (v.length != 4) {
            v = [...v, 1.];
        }
        vec4.transformMat4(v, v, tmp);
        vec4.scale(v, v, 1. / v[3]);
        vec4.transformMat4(v, v, camToWorld);

        data.push(...v.slice(0, cubeVertices.params.elementSize));
    });

    return new GLArrayBufferData(new Float32Array(data), cubeVertices.params);
};

export const getLightCamera = (light: GameObject) => {
    let lCamera = new Camera(1.);
    lCamera.fov = 86.;
    lCamera.near = 0.1;
    lCamera.far = 10.;
    lCamera.position = light.transform.position;

    // determine forward direction.
    // TODO: in this case the sun just looks at "0,0,0", and acts like a point light,
    // not orthogonal light.
    vec3.scale(lCamera.forward, lCamera.position, -1);
    vec3.normalize(lCamera.forward, lCamera.forward);

    // determine up direction
    const worldUp = [0, 1., 0];
    vec3.scale(tmpVec3, lCamera.forward, vec3.dot(worldUp, lCamera.forward));
    vec3.sub(lCamera.up, worldUp, tmpVec3);
    vec3.normalize(lCamera.up, lCamera.up);
    return lCamera;
};


export const makeShadowMapCamera = (camera: Camera, scene: Scene, light: LightComponent): Camera => {
    const frustum = makeFrustum(camera);

    const forward = vec3.create();
    const up = vec3.create();
    // determine forward direction.
    // TODO: in this case the sun just looks at "0,0,0", and acts like a point light,
    // TODO: CHANGE IT BY ADDITION "direction"
    // not orthogonal light.
    vec3.scale(forward, light.object.transform.position, -1);
    vec3.normalize(forward, forward);

    // determine up direction
    const worldUp = [0, 1., 0];
    vec3.scale(tmpVec3, forward, vec3.dot(worldUp, forward));
    vec3.sub(up, worldUp, tmpVec3);
    vec3.normalize(up, up);

    const lCamera = new Camera(1);
    lCamera.up = up;
    lCamera.forward = forward;

    const lWorldToCamera = lCamera.getWorldToCamera();

    const objectsToBind = [frustum];

    scene.children.forEach(o => {
        const bboxForObj = (o: GameObject) => {
            o.children.forEach(c => {
                bboxForObj(c);
            });

            if (!(o.mesh && o.mesh.shadowCaster && o.boundingBox)) {
                return;
            }

            objectsToBind.push(o.boundingBox.box.asVerticesBuffer().translate(o.transform.getModelToWorld()).translate(lWorldToCamera));
        };

        bboxForObj(o);
    });

    const box = computeBoundingBox(objectsToBind);

};
