import { Button } from "@/components/ui/button";
import { WorkflowDocument } from "@/lib/comfyui/workflow";
import { useAlterateStore } from "@/lib/store";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import basic_workflow_data from "../../assets/basic_workflow.json";
import canny_workflow_data from "../../assets/canny_workflow.json";

interface WorkflowDropzoneProps {
  onDrop: (file: File) => void;
}
function WorkflowDropzone({ onDrop }: WorkflowDropzoneProps) {
  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      onDrop(file);
    },
    [onDrop]
  );

  const { getRootProps, getInputProps, isDragAccept, isDragReject } =
    useDropzone({
      onDrop: handleDrop,
      accept: { "application/json": [".json"] },
      maxFiles: 1,
    });

  const borderColour = isDragReject
    ? "border-red-500"
    : isDragAccept
      ? "border-green-500"
      : "border-gray-300";

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed ${borderColour} rounded p-4 text-center cursor-pointer`}
    >
      <input {...getInputProps()} />

      <p>Drag 'n' drop a workflow json file here, or click to select one</p>
    </div>
  );
}

export function WorkflowSelectionView() {
  const loadWorkspace = useAlterateStore((store) => store.loadWorkspace);

  const handleDrop = useCallback(
    (file: File) => {
      console.log("Dropped file", file);

      if (file.type === "application/json" || file.name?.endsWith(".json")) {
        const reader = new FileReader();

        reader.onload = async () => {
          console.log("onload!");
          console.log(reader.result);

          const jsonData = reader.result as string | null;

          if (!jsonData) {
            console.error("No data in file", file);
            return;
          }

          const workflow = JSON.parse(jsonData) as WorkflowDocument;

          const workspace = {
            workflow,
          };

          loadWorkspace(workspace);
        };

        reader.onerror = (error) => {
          console.error("Error reading file", error);
        };

        reader.readAsText(file);
      } else {
        console.error("Invalid file type", file);
      }
    },
    [loadWorkspace]
  );

  const loadBasicWorkflow = async () => {
    await loadWorkspace({
      workflow: basic_workflow_data,
    });
  };

  const loadCannyWorkflow = async () => {
    await loadWorkspace({
      workflow: canny_workflow_data,
    });
  };

  return (
    <div className="flex w-full h-full flex-col content-center items-center justify-center gap-4">
      <div className="flex w-full flex-row content-center items-center justify-center gap-4">
        <Button onClick={loadBasicWorkflow}>Basic Workflow</Button>
        <Button onClick={loadCannyWorkflow}>Canny Workflow</Button>
      </div>

      <WorkflowDropzone onDrop={handleDrop}></WorkflowDropzone>
    </div>
  );
}
