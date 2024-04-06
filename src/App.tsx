import "./App.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ComfyUI } from "./ComfyUI";
import { ThemeProvider } from "@/components/theme-provider";
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <ComfyUI />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
