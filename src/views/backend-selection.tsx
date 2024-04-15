import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAlterateStore } from "@/lib/store";
import { defaultBackends } from "@/lib/store/backend";

interface BackendConnectionCardProps {
  connect: () => void;
  name: string;
  description: string;
  machineName: string;
  port: number;
}

function BackendConnectionCard({
  connect,
  name,
  description,
  machineName,
  port,
}: BackendConnectionCardProps) {
  return (
    <Card className="flex-grow flex-shrink basis-0 w-0 max-w-96">
      <CardHeader>
        <CardTitle>
          <span>{name}</span>
          <span className="text-sm font-normal text-slate-500 dark:text-slate-400 pl-2">{`${machineName}:${port}`}</span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Button className="w-full" onClick={connect}>
          Connect
        </Button>
      </CardContent>
    </Card>
  );
}

export function BackendSelectionView() {
  const connect = useAlterateStore((store) => store.connect);

  const cards = defaultBackends.map((backend) => (
    <BackendConnectionCard
      key={backend.name}
      {...backend}
      connect={() => connect(backend)}
    />
  ));

  return (
    <div className="flex w-full h-full flex-row content-center items-center justify-center gap-4">
      {cards}
    </div>
  );
}
