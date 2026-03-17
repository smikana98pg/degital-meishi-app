import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "@/components/ui/provider";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import App from "./App.tsx";
import CardPage from "./pages/CardPage.tsx";
import { CardRegisterPage } from "./pages/CardRegisterPage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider defaultTheme="light">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/cards/:id" element={<CardPage />} />
          <Route path="/cards/register" element={<CardRegisterPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
