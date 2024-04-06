# Alterate

A play on the words alter, generate and iterate. This project aims to implement a UI dashboard for creating images using [ComfyUI](https://github.com/comfyanonymous/ComfyUI) as a backend

## Prerequisites

### ComfyUI

1. Install ComfyUI using their instructions
2. Enable CORS by adding `--enable-cors-header` into the `run_nvidia_gpu.bat` file

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
- [ ] Navigate to ComfyUI
- [ ] Websocket reconnection handling
- [ ] Display final output images
- [ ] Show progress details (node stage)
- [ ] Cancel current job
- [ ] Loading a workflow (removing built in default workflow)
- [ ] Improve node editor panel UI
- [ ] Image input support

### Long term

- [ ] Image editor
- [ ] Inpainting workflow support
- [ ] Multi workflow projects
- [ ] Built in image editing using workflows
- [ ] Edit workflows by embedding ComfyUI in an iframe

## Dependencies

- Vite
- React
- [Radix Primitives](https://www.radix-ui.com/primitives/docs/overview/introduction)
- [Shadcn](https://ui.shadcn.com/)
