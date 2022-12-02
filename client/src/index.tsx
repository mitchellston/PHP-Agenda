/* @refresh reload */
import { render } from "solid-js/web";
import { Router } from "@solidjs/router";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import "./index.css";
import App from "./App";
const queryClient = new QueryClient();
render(
  () => (
    <Router>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Router>
  ),
  document.getElementById("root") as HTMLElement
);
