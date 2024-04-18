import { Dispatch, SetStateAction, useState } from "react";

export function useDialogControl(): [
  boolean,
  Dispatch<SetStateAction<boolean>>,
] {
  const [open, setOpen] = useState(false);

  return [open, setOpen];
}
