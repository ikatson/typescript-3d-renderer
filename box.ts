import {GLArrayBufferData, GLArrayBufferDataParams} from "./glArrayBuffer.js";

export class Box {
    min: number[] | Float32Array = new Float32Array([-1, -1, -1]);
    max: number[] | Float32Array = new Float32Array([1, 1, 1]);

    uniqueVertices(): Array<number[]> {
        const x = 0;
        const y = 1;
        const z = 2;

        const dlf = [this.min[x], this.min[y], this.max[z]];
        const dlb = [this.min[x], this.min[y], this.min[z]];

        const drf = [this.max[x], this.min[y], this.max[z]];
        const drb = [this.max[x], this.min[y], this.min[z]];

        const urf = [this.max[x], this.max[y], this.max[z]];
        const urb = [this.max[x], this.max[y], this.min[z]];

        const ulf = [this.min[x], this.max[y], this.max[z]];
        const ulb = [this.min[x], this.max[y], this.min[z]];

        return [
            dlf, dlb, drf, drb, urf, urb, ulf, ulb
        ]
    }

    asWireFrameBuffer(): GLArrayBufferData {
        const params = new GLArrayBufferDataParams(false, false, 24);
        params.elementSize = 3;

        const data = [];
        const [dlf, dlb, drf, drb, urf, urb, ulf, ulb] = this.uniqueVertices();

        // front face edges
        data.push(
            ...dlf, ...drf,
            ...drf, ...urf,
            ...urf, ...ulf,
            ...ulf, ...dlf
        );

        // back face edges
        data.push(
            ...dlb, ...drb,
            ...drb, ...urb,
            ...urb, ...ulb,
            ...ulb, ...dlb
        );

        // top left edge
        data.push(...ulf, ...ulb);

        // top right edge
        data.push(...urf, ...urb);

        // bootom left edge
        data.push(...dlf, ...dlb);

        // bottom right edge
        data.push(...drf, ...drb);
        return new GLArrayBufferData(new Float32Array(data), params);
    }
}
