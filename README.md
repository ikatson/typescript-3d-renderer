# An experimental 3D rendering engine in TypeScript

Built this just to learn how 3D rendering engines work. This is built on pure WebGL 2 with some help from gl-matrix math library.

Code quality, structure, comments, documentation etc where not the goal. The goal was only to learn various techniques just to have some understanding of how modern games work.

At the moment of writing this, the project is complete and no further work is planned. I got my understanding to the level where I'm comfortable watching GDC presentations and understanding what people are talking about there.

## Demo

Demo is here.

In the Demo you can navigate the camera with WASD, Space and Ctrl, tweak various settings, looks at textures etc.

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