import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThemeProvider, createTheme } from "@mui/material";
import { QueryClient, QueryClientProvider } from "react-query";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Quiz from "./quiz";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={createTheme()}>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/quiz" element={<Quiz />} />
        </Routes>
      </Router>
    </ThemeProvider>
  </QueryClientProvider>
);
