import React from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./contexts/AuthContext";
import App from "./App";
import "./styles/tailwind.css";
import "./styles/index.css";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
    <HelmetProvider>
        <AuthProvider>
            <App />
        </AuthProvider>
    </HelmetProvider>
);
