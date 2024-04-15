import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

export interface AddBackendForm {
  label: string;
  description: string;
  machineName: string;
  port: number;
}

interface AddBackendFormProps {
  onSubmit: (data: AddBackendForm) => void;
}

export function AddBackendForm({ onSubmit }: AddBackendFormProps) {
  const { register, handleSubmit } = useForm<AddBackendForm>({
    defaultValues: {
      label: "",
      description: "",
      machineName: "localhost",
      port: 8188,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DialogHeader>
        <DialogTitle>Add new backend</DialogTitle>
        <DialogDescription>
          Add the connection details for a ComfyUI server.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="label" className="text-right">
            Label
          </Label>
          <Input
            {...register("label")}
            placeholder="Name to easily differentiate this backend"
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">
            Description
          </Label>
          <Input
            {...register("description")}
            placeholder="Optional details about this backend"
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="machineName" className="text-right">
            Machine Name
          </Label>
          <Input
            {...register("machineName")}
            placeholder="The host name or IP address of the server"
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="port" className="text-right">
            Port
          </Label>
          <Input
            {...register("port")}
            placeholder="The port number of the backend server."
            className="col-span-3"
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit">Save</Button>
      </DialogFooter>
    </form>
  );
}
