import {GLArrayBufferData, GLArrayBufferDataParams} from "./glArrayBuffer.js";

export class Box {
    min: number[] | Float32Array;
    max: number[] | Float32Array;

    asBuffer(): GLArrayBufferData {
        const params = new GLArrayBufferDataParams(false, false, 8);
        params.elementSize = 3;

        const data = [];
        const minmax = [this.min, this.max];

        for (let xi = 0; xi < 2; xi++) {
            for (let yi = 0; yi < 2; yi++) {
                for (let zi = 0; zi < 2; zi++) {
                    data.push(minmax[xi][0]);
                    data.push(minmax[yi][1]);
                    data.push(minmax[zi][2]);
                }
            }
        }

        return new GLArrayBufferData(new Float32Array(data), params);
    }
}
