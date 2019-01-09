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
                    properties: {
                        keep_quoted: true,
                        reserved: [
                            'getReader', // new dom API
                            'fromValues',
                            // gl-matrix
                            'rotateX',
                            'rotateY',
                            'rotateZ',
                            'cross',
                            'copy', 'scale', 'dot', 'sub', 'normalize', 'mul', 'transformMat4', 'transformMat3', 'fromTranslation', "invert",
                            // webgl2
                            'RG',
                            'RGB16F',
                            'RG16F',
                            'RG32F',
                            'RGBA16F',
                            'HALF_FLOAT',
                            'DRAW_FRAMEBUFFER',
                            'DEPTH24_STENCIL8',
                            'UNSIGNED_INT_24_8',
                            'DEPTH_STENCIL_ATTACHMENT',
                            'R16F',
                            'RED',
                            'COMPRESSED_RGB_S3TC_DXT1_EXT',
                            'COMPRESSED_RGBA_S3TC_DXT3_EXT',
                            'COMPRESSED_RGBA_S3TC_DXT5_EXT',
                            'drawBuffers',
                            'createVertexArray',
                            'deleteVertexArray',
                            'bindVertexArray',

                            // cat src/gltf-types.d.ts | egrep -o '".*?"\??:' | egrep -o '".*"' | tr '\n' ',' | pbcopy
                            "bufferView","byteOffset","componentType","extensions","extras","bufferView","byteOffset","extensions","extras","count","indices","values","extensions","extras","bufferView","byteOffset","componentType","normalized","count","type","max","min","sparse","name","extensions","extras","node","path","extensions","extras","sampler","target","extensions","extras","input","interpolation","output","extensions","extras","channels","samplers","name","extensions","extras","copyright","generator","version","minVersion","extensions","extras","uri","byteLength","name","extensions","extras","buffer","byteOffset","byteLength","byteStride","target","name","extensions","extras","xmag","ymag","zfar","znear","extensions","extras","aspectRatio","yfov","zfar","znear","extensions","extras","orthographic","perspective","type","name","extensions","extras","uri","mimeType","bufferView","name","extensions","extras","index","texCoord","extensions","extras","baseColorFactor","baseColorTexture","metallicFactor","roughnessFactor","metallicRoughnessTexture","extensions","extras","index","texCoord","scale","extensions","extras","index","texCoord","strength","extensions","extras","name","extensions","extras","pbrMetallicRoughness","normalTexture","occlusionTexture","emissiveTexture","emissiveFactor","alphaMode","alphaCutoff","doubleSided","attributes","indices","material","mode","targets","extensions","extras","primitives","weights","name","extensions","extras","camera","children","skin","matrix","mesh","rotation","scale","translation","weights","name","extensions","extras","magFilter","minFilter","wrapS","wrapT","name","extensions","extras","nodes","name","extensions","extras","inverseBindMatrices","skeleton","joints","name","extensions","extras","sampler","source","name","extensions","extras","extensionsUsed","extensionsRequired","accessors","animations","asset","buffers","bufferViews","cameras","images","materials","meshes","nodes","samplers","scene","scenes","skins","textures","extensions","extras",
                        ]
                    }
                }
            },

        })],
    },
    mode: 'development',
};
