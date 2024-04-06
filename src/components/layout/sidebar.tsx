interface Props {
  children?: React.ReactNode | React.ReactNode[] | null | undefined;
}

export function Sidebar({ children }: Props) {
  return (
    <aside className="border-2 rounded-md p-2 flex flex-col gap-4">
      {children}
    </aside>
  );
}
