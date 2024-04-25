import { useEffect, useState } from "react";

export function useBlobObjectUrl(blob: Blob | null | undefined) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!blob) {
      setUrl(null);
      return;
    }

    const url = URL.createObjectURL(blob);
    setUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [blob]);

  return { url };
}
