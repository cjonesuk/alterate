import { Button } from "@/components/ui/button";
import { useAlterateStore } from "@/lib/store";
import { defaultBackends } from "@/lib/store/backend";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useCallback, useState } from "react";
import { ConnectionDetails } from "@/lib/store/types";
import { v4 as uuidv4 } from "uuid";
import { BackendConnectionCard } from "./backend-card";
import { AddBackendForm } from "./form";
import { useLocalStorage } from "./local-storage";

function useBackends(close: () => void) {
  const [backends, updateBackends] = useLocalStorage<ConnectionDetails[]>(
    "backends:v1",
    defaultBackends
  );

  const addBackend = useCallback(
    (data: AddBackendForm) => {
      updateBackends([
        ...backends,
        {
          id: uuidv4(),
          name: data.label,
          description: data.description,
          machineName: data.machineName,
          port: data.port,
          clientId: uuidv4(),
        },
      ]);

      close();
    },
    [backends, updateBackends, close]
  );

  const removeBackend = useCallback(
    (id: string) => {
      updateBackends(backends.filter((backend) => backend.id !== id));
    },
    [backends, updateBackends]
  );

  return {
    backends,
    addBackend,
    removeBackend,
  };
}

export function BackendSelectionView() {
  const connect = useAlterateStore((store) => store.connect);
  const [open, setOpen] = useState(false);

  const { backends, addBackend, removeBackend } = useBackends(() =>
    setOpen(false)
  );

  const cards = backends.map((backend) => (
    <BackendConnectionCard
      key={backend.name}
      {...backend}
      connect={() => connect(backend)}
      remove={() => removeBackend(backend.id)}
    />
  ));

  return (
    <div className="flex w-full h-full flex-col content-center items-center justify-center gap-4">
      <div className="flex w-full flex-row content-center items-center justify-center gap-4">
        {cards}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary">Add Backend</Button>
        </DialogTrigger>
        <DialogContent>
          <AddBackendForm onSubmit={addBackend} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
