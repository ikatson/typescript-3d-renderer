# An experimental 3D rendering engine in TypeScript

Built this just to learn how 3D rendering engines work. This is built on pure WebGL 2 with some help from gl-matrix math library.

Code quality, structure, comments, documentation etc where not the goal. The goal was only to learn various techniques just to have some understanding of how modern games work.

At the moment of writing this, the project is complete and no further work is planned. I got my understanding to the level where I'm comfortable watching GDC presentations and understanding what people are talking about there.

## Screenshots

![alt Crytek Sponza](https://ikatson.github.io/typescript-3d-renderer/docs/screenshots/sponza.png)

## Demo

> WARNING: at the moment it won't display any textures on devices that don't support DDS compression.
> TODO: select a different scene in this case, that referes to the original Sponza with JPG textures.

[Demo is here](https://ikatson.github.io/typescript-3d-renderer/)

In the Demo you can navigate the camera with WASD, Space and Ctrl, tweak various settings, look at intenal framebuffer textures etc.

## Features

- Written in TypeScript
- Deferred shading
- PBR (Physically based rendering)
- Directional and point lights
- SSAO (Screen space ambient occlusion)
- SSR (Screen space reflections)
- Shadow maps
- DDS-compressed textures
- GLTF parser

Missing important features:
- Cube maps and cube map generation
- Image-based lighting
- Optimizations for algorithms and their state-of-the-art implementations
- Does not support transparency at all
- Only this shading/lighting model is supported. There was a forward renderer here before but I removed it as I didn't need it to further study the topic.