export interface ImageReference {
  filename: string;
  subfolder: string;
  type: "input" | "temp" | "output";
}
