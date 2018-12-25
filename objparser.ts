import {ArrayBufferDataType, GLArrayBufferData, GLArrayBufferDataParams} from "./glArrayBuffer.js";

// Parses one object from an object file only.

export class ObjParser {
    private textDecoder = new TextDecoder('utf-8');
    private lineBuf: string = "";
    private faceCount: number = 0;
    private vertexBuf: Array<number> = [];
    private normalBuf: Array<number> = [];
    private texBuf: Array<number> = [];
    private hasNormals = false;
    private hasUVs = false;
    private finalBuf: Array<number> = [];
    private addHomogenous: boolean;

    constructor(addHomogenousCoordinate: boolean = false) {
        this.addHomogenous = addHomogenousCoordinate;
    }

    getArrayBuffer(): GLArrayBufferData {
        const params = new GLArrayBufferDataParams(this.hasNormals, this.hasUVs, this.getTriangleCount() * 3, ArrayBufferDataType.TRIANGLES);
        params.elementSize = 3 + (this.addHomogenous ? 1 : 0);
        params.normalsSize = 3 + (this.addHomogenous ? 1 : 0);
        return new GLArrayBufferData(
            new Float32Array(this.finalBuf),
            params
        );
    }

    getTriangleCount(): number {
        return this.faceCount;
    }

    feedLine(line: string) {
        if (line.startsWith('v ')) {
            const vertices = line.split(' ');
            vertices.slice(1).forEach((v: string) => {
                this.vertexBuf.push(parseFloat(v));
            })
        } else if (line.startsWith('vt ')) {
            const tx = line.split(' ');
            tx.slice(1).forEach((v: string) => {
                this.texBuf.push(parseFloat(v));
            });
            this.hasUVs = true;
        } else if (line.startsWith('f ')) {
            const indexes = line.split(' ');
            indexes.slice(1).forEach((v: string) => {
                const values = v.split('/');

                const vidx = (parseInt(values[0]) - 1) * 3;
                const tidx = (parseInt(values[1]) - 1) * 2;
                const nidx = (parseInt(values[2]) - 1) * 3;

                if (this.hasNormals && nidx === undefined) {
                    throw new Error(`incomplete object, has normals, but can't parse normals from line: ${line}`)
                }

                if (this.hasUVs && tidx === undefined) {
                    throw new Error(`incomplete object, has normals, but can't parse UVs from line: ${line}`)
                }

                this.finalBuf.push(this.vertexBuf[vidx]);
                this.finalBuf.push(this.vertexBuf[vidx + 1]);
                this.finalBuf.push(this.vertexBuf[vidx + 2]);

                if (this.addHomogenous) {
                    this.finalBuf.push(1.);
                }

                // normal
                if (this.hasNormals) {
                    this.finalBuf.push(this.normalBuf[nidx]);
                    this.finalBuf.push(this.normalBuf[nidx + 1]);
                    this.finalBuf.push(this.normalBuf[nidx + 2]);
                    if (this.addHomogenous) {
                        this.finalBuf.push(0.);
                    }
                }
                // UV
                if (this.hasUVs) {
                    this.finalBuf.push(this.texBuf[tidx] || 0.);
                    this.finalBuf.push(1. - this.texBuf[tidx + 1] || 0.);
                }
            });
            this.faceCount += 1;
        } else if (line.startsWith('vn ')) {
            const normals = line.split(' ');
            normals.slice(1).forEach((v: string) => {
                this.normalBuf.push(parseFloat(v));
            });
            this.hasNormals = true;
        }
    }

    feedByteChunk(data: Uint8Array) {
        const text = this.textDecoder.decode(data, { stream: true });
        const lines = text.split('\n');
        lines[0] = this.lineBuf + lines[0];
        this.lineBuf = lines.pop();

        // debugger;
        lines.forEach(line => this.feedLine(line));
    }

    endParsing() {
        if (this.lineBuf != "") {
            this.feedLine(this.lineBuf);
            this.lineBuf = "";
        }
    }

    clear() {
        this.lineBuf = "";
        this.vertexBuf = [];
        this.normalBuf = [];
        this.finalBuf = [];
        this.faceCount = 0;
        this.hasNormals = false;
        this.hasUVs = false;
    }
}

export function fetchObject(url: string, progressCallback?: Function, parser?: ObjParser): Promise<ObjParser> {
    return new Promise<ObjParser>((resolve, reject) => {
        fetch(url).then(response => {
            if (progressCallback) {
                progressCallback({ headers: response.headers });
            }

            const reader = response.body.getReader();
            const objParser = parser || new ObjParser();

            reader.read().then(function readChunk({ done, value }) {
                try {
                    if (done) {
                        objParser.endParsing();
                        console.log(`fetched object from ${url}`);
                        resolve(objParser);
                        return;
                    }
                    objParser.feedByteChunk(value);
                } catch (e) {
                    reject(e);
                    reader.cancel();
                    return;
                }

                if (progressCallback) {
                    progressCallback({ length: value.length });
                }

                reader.read().then(readChunk, reject);
            });
        }, reject);
    });
}
