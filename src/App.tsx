import "./App.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WorkflowEditorView } from "./views/editor/workflow-editor";
import { ThemeProvider } from "@/components/theme-provider";
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <WorkflowEditorView />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
