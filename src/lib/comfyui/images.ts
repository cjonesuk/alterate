export interface ImageReference {
  filename: string;
  subfolder: string;
  type: "input" | "temp" | "output";
}

export interface UploadImageResult {
  name: string;
  subfolder: string;
  type: "input" | "temp" | "output";
}

export interface UploadImageRequest {
  image: Blob;
  overwrite: boolean;
  type: "input" | "temp" | "output";
  subfolder: string;
  filename: string;
}
