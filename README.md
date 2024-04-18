# Alterate

A play on the words alter, generate and iterate. This project aims to implement a UI dashboard for creating images using [ComfyUI](https://github.com/comfyanonymous/ComfyUI) as a backend

## Prerequisites

### ComfyUI

1. Install ComfyUI using their instructions
2. Enable CORS by adding `--enable-cors-header=*` into the `run_nvidia_gpu.bat` file (note: security implications)

#### Custom Nodes

- [ComfyUI Manager](https://github.com/ltdrdata/ComfyUI-Manager)

## Installation

1. Download this repo
2. Run `npm install` to install all dependencies

## Running

1. Run ComfyUI using the batch file and make sure it is usable via their UI
2. Run `npm run dev` to start Alterate
3. Open [http://localhost:5173/](http://localhost:5173/)

## Goals and direction

### Short term

- [x] Setup web socket
- [x] Submit job to ComfyUI
- [x] Edit inputs on workflow via UI
- [x] Submit modified workflow to ComfyUI
- [x] Display progress images via websocket
- [x] Display progress bar via websocket
- [x] Navigate to ComfyUI
- [x] Use a central store (zustand)
- [ ] Websocket reconnection handling
- [x] Display final output images
- [x] Save output image to a final directory
- [ ] Show progress details (node stage)
- [x] Cancel current job
- [x] Loading a workflow
- [x] Improve node editor panel UI
- [x] Select and upload images
- [ ] Show image preview of image input
- [ ] Image masks
- [x] Backend selection UI
- [x] Backend management UI - Add, Remove and save to local storage
- [ ] Remove built in default workflows
- [ ] Disconnect from current backend and show backend management view
- [ ] Seed management
- [ ] Input filtering
- [ ] Display output per node (e.g. image previews)
- [ ] Debug mode - add ImagePreview nodes to every image output of every node

### Long term

- [ ] Image editor
- [ ] Inpainting workflow support
- [ ] Multi workflow projects
- [ ] Multi stage workflows (idea - comfyUI custom nodes to denote breakpoints)
- [ ] Built in image editing using workflows
- [ ] Edit workflows by embedding ComfyUI in an iframe
- [ ]

## Dependencies

- Vite
- React
- [Radix Primitives](https://www.radix-ui.com/primitives/docs/overview/introduction)
- [Shadcn](https://ui.shadcn.com/)

## Ideas

- [p5js](https://p5js.org)

  - [Pan and zoom](https://editor.p5js.org/palpista11/sketches/XRx0nlsXi)
  - [Drawing](https://editor.p5js.org/ebenjmuse/sketches/SyUM1iX0b)

- [tensorflowjs](https://github.com/tensorflow/tfjs)
  - [Segmentation](https://towardsdatascience.com/real-time-semantic-segmentation-in-the-browser-using-tensorflow-js-e2e00a185139)
