import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  connect: () => void;
  remove: () => void;
  name: string;
  description: string;
  machineName: string;
  port: number;
}

export function BackendConnectionCard({
  connect,
  remove,
  name,
  description,
  machineName,
  port,
}: Props) {
  return (
    <Card className="flex-grow flex-shrink basis-0 w-0 max-w-96">
      <CardHeader>
        <CardTitle>
          <span>{name}</span>
          <span className="text-sm font-normal text-slate-500 dark:text-slate-400 pl-2">{`${machineName}:${port}`}</span>
        </CardTitle>
        <CardDescription className="min-h-[1rem]">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row gap-4 justify-stretch">
        <Button variant="secondary" className="w-full" onClick={remove}>
          Delete
        </Button>
        <Button variant="default" className="w-full" onClick={connect}>
          Connect
        </Button>
      </CardContent>
    </Card>
  );
}
