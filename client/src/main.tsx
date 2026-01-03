import React from "react";
import ReactDOM from "react-dom/client";
import { CssBaseline, ThemeProvider, createTheme } from "./lib/mui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import App from "./App";
import "./styles.css";

const queryClient = new QueryClient();
const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#e11d48" },
    secondary: { main: "#f472b6" }
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: ["Inter", "system-ui", "sans-serif"].join(",")
  }
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <App />
          <Toaster richColors />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
