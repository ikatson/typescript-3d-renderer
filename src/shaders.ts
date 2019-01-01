import {ShaderLoadError, LinkError} from "./errors";

export function redefine(shaderSource: string, defineName: string, value: string) {
    return shaderSource.replace(new RegExp(`#define ${defineName} .*`), `#define ${defineName} ${value}`);
}

export function addLineNumbers(source: string) {
    let line = 1;
    let result = [];
    source.split('\n').forEach(l => {
        result.push(`${line} ${l}`);
        line += 1;
    });
    return result.join('\n');
}

class RawShader {
    private shader: WebGLShader;
    private autodelete = false;

    constructor(gl: WebGLRenderingContext, type: number, source: string) {
        source = '#version 300 es\n' + source;
        let shader = gl.createShader(type);
        gl.shaderSource(shader, source);

        gl.compileShader(shader);

        let compiled = <Boolean>gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!compiled) {
            let error = gl.getShaderInfoLog(shader);
            gl.deleteShader(shader);
            throw new ShaderLoadError(error + "\n\n\n" + addLineNumbers(source));
        }

        this.shader = shader;
    }

    setAutodelete(v: boolean) {
        this.autodelete = v;
    }
    shouldAutodelete(): boolean {
        return this.autodelete;
    }

    getShader(): WebGLShader {
        return this.shader;
    }

    delete(gl: WebGLRenderingContext) {
        gl.deleteShader(this.shader);
        this.shader = null;
    }
}

export class ShaderProgram {
    private program: WebGLProgram;
    private _attribs = new Map<String, number>();
    private _uniforms = new Map<String, WebGLUniformLocation>();
    private vs: VertexShader;
    private fs: FragmentShader;

    constructor(gl: WebGLRenderingContext, vs: VertexShader, fs: FragmentShader) {
        this.program = gl.createProgram();
        gl.attachShader(this.program, vs.getShader());
        gl.attachShader(this.program, fs.getShader());
        gl.linkProgram(this.program);

        this.vs = vs;
        this.fs = fs;

        if (!<Boolean>gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            let error = gl.getProgramInfoLog(this.program);
            gl.deleteProgram(this.program);
            throw new LinkError(error);
        }
    }

    use(gl: WebGLRenderingContext): ShaderProgram {
        gl.useProgram(this.getProgram());
        return this;
    }

    getProgram(): WebGLProgram {
        return this.program;
    }

    deleteAll(gl: WebGLRenderingContext) {
        this.delete(gl);
        if (this.fs.shouldAutodelete()) {
            this.fs.delete(gl);
        }
        if (this.vs.shouldAutodelete()) {
            this.vs.delete(gl);
        }
    }

    delete(gl: WebGLRenderingContext) {
        gl.deleteProgram(this.program);
    }

    getAttribLocation(gl: WebGLRenderingContext, name: string): number {
        if (this._attribs.get(name) !== undefined) {
            return this._attribs.get(name);
        }
        const loc = gl.getAttribLocation(this.program, name);
        this._attribs.set(name, loc);
        return loc;
    }

    getUniformLocation(gl: WebGLRenderingContext, name: string): WebGLUniformLocation {
        const existing = this._uniforms.get(name);
        if (existing !== undefined) {
            return existing;
        }
        const u = gl.getUniformLocation(this.program, name);
        this._uniforms.set(name, u);
        return u;
    }
}

export class FragmentShader extends RawShader {
    constructor(gl: WebGLRenderingContext, source: string) {
        super(gl, gl.FRAGMENT_SHADER, source);
    }
}

export class VertexShader extends RawShader {
    constructor(gl: WebGLRenderingContext, source: string) {
        super(gl, gl.VERTEX_SHADER, source);
    }
}

export class ShaderSourceBuilder {
    private topChunks: string[] = [];
    private chunks: string[] = [];
    private defines: Map<string, string> = new Map();
    private redefines: Map<string, string> = new Map();
    private precision = 'highp';

    clone(): ShaderSourceBuilder {
        const b = new ShaderSourceBuilder();
        b.topChunks = this.topChunks.slice();
        b.chunks = this.chunks.slice();
        this.defines.forEach((v, k) => {
            b.defines.set(k, v);
        });
        this.redefines.forEach((v, k) => {
            b.redefines.set(k, v);
        });
        b.precision = this.precision;
        return b;
    }

    setPrecision(p: string): ShaderSourceBuilder {
        this.precision = p;
        return this;
    }

    defineIfTrue(name: string, value: boolean): ShaderSourceBuilder {
        if (value) {
            this.defines.set(name, '1');
        }
        return this;
    }

    define(name: string, value: string): ShaderSourceBuilder {
        this.defines.set(name, value);
        return this;
    }

    redefine(name: string, value: string): ShaderSourceBuilder {
        this.redefines.set(name, value);
        return this;
    }

    addChunk(chunk: string): ShaderSourceBuilder {
        this.chunks.push(chunk);
        return this;
    }

    addTopChunk(chunk: string): ShaderSourceBuilder {
        this.topChunks.push(chunk);
        return this;
    }

    include(other: ShaderSourceBuilder): ShaderSourceBuilder {
        other.topChunks.forEach(tc => {
            this.topChunks.push(tc);
        });
        other.chunks.forEach(c => {
            this.chunks.push(c);
        });
        other.defines.forEach((v, k) => {
            this.defines.set(k, v);
        });
        other.redefines.forEach((v, k) => {
            this.redefines.set(k, v);
        });
        return this;
    }

    build(): string {
        const result: string[] = [];
        result.push(`precision ${this.precision} float;`)

        this.defines.forEach((v, k) => {
            result.push(`#define ${k} ${v}`)
        });
        this.topChunks.forEach(c => {
            this.redefines.forEach((v, k) => {
                c = redefine(c, k, v);
            });
            result.push(c);
        });
        this.chunks.forEach(c => {
            this.redefines.forEach((v, k) => {
                c = redefine(c, k, v);
            });
            result.push(c);
        });
        return result.join('\n');
    }
}
