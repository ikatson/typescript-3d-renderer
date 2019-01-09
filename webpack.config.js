const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: './src/main.ts',
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                // exclude: /node_modules/,
                options: {
                    // transpileOnly: true
                }
            },
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    optimization: {
        usedExports: true,
        sideEffects: true,
        minimizer: [new TerserPlugin({
            cache: true,
            parallel: true,
            sourceMap: true, // Must be set to true if using source-maps in production
            terserOptions: {
                ecma: 8,
                mangle: {
                    // properties: {
                    //     reserved: [
                    //         'getReader', // new dom API
                    //         'fromValues',
                    //         // gl-matrix
                    //         'rotateX',
                    //         'rotateY',
                    //         'rotateZ',
                    //         'cross',
                    //         'copy', 'scale', 'dot', 'sub', 'normalize', 'mul', 'transformMat4', 'transformMat3', 'fromTranslation',
                    //         // webgl2
                    //         'RG', 'RGB16F', 'RG16F', 'RGBA16F', 'HALF_FLOAT', 'DRAW_FRAMEBUFFER', 'DEPTH24_STENCIL8', 'UNSIGNED_INT_24_8',
                    //         'R16F', 'RED',
                    //         'drawBuffers',
                    //     ]
                    // }
                }
            },

        })],
    },
    mode: 'development',
};
