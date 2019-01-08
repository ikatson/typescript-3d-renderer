import {ArrayBufferDataType, GLArrayBufferData, GLArrayBufferDataParams} from "./glArrayBuffer";
import {vec3} from "gl-matrix";

export class AxisAlignedBox {
    get max(): vec3 {
        return this._max;
    }
    get min(): vec3 {
        return this._min;
    }
    private _min = vec3.fromValues(-1, -1, -1);
    private _max = vec3.fromValues(1, 1, 1);

    private _cacheNeedsUpdate = false;
    private _vertexBufferCache: GLArrayBufferData = null;

    setMin(v: vec3 | number[]): AxisAlignedBox {
        vec3.copy(this._min, v);
        this._cacheNeedsUpdate = true;
        return this;
    }

    setMax(v: vec3 | number[]): AxisAlignedBox {
        vec3.copy(this._max, v);
        this._cacheNeedsUpdate = true;
        return this;
    }

    containsPoint(v: vec3): boolean {
        return (
            v[0] > this._min[0] && v[0] < this._max[0]
            &&
            v[1] > this._min[1] && v[1] < this._max[1]
            &&
            v[2] > this._min[2] && v[3] < this._max[2]
        );
    }

    uniqueVertices(): Array<number[]> {
        const x = 0;
        const y = 1;
        const z = 2;

        const dlf = [this._min[x], this._min[y], this._max[z]];
        const dlb = [this._min[x], this._min[y], this._min[z]];

        const drf = [this._max[x], this._min[y], this._max[z]];
        const drb = [this._max[x], this._min[y], this._min[z]];

        const urf = [this._max[x], this._max[y], this._max[z]];
        const urb = [this._max[x], this._max[y], this._min[z]];

        const ulf = [this._min[x], this._max[y], this._max[z]];
        const ulb = [this._min[x], this._max[y], this._min[z]];

        return [
            dlf, dlb, drf, drb, urf, urb, ulf, ulb
        ]
    }

    asVerticesBuffer(allowCached: boolean = true): GLArrayBufferData {
        if (allowCached && !this._cacheNeedsUpdate && !!this._vertexBufferCache) {
            return this._vertexBufferCache;
        }
        const params = new GLArrayBufferDataParams(false, false, 8, ArrayBufferDataType.POINTS);
        params.elementSize = 3;
        const data = [];
        for (const v of this.uniqueVertices()) {
            data.push(...v);
        }
        this._vertexBufferCache = new GLArrayBufferData(new Float32Array(data), params);
        this._cacheNeedsUpdate = false;
        return this._vertexBufferCache;
    }

    asWireFrameBuffer(): GLArrayBufferData {
        const params = new GLArrayBufferDataParams(false, false, 24, ArrayBufferDataType.LINES);
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
