import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from 'react-router-dom';

// Importaciones de estilos de fuentes
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

// Importaciones locales
import App from "./App.jsx";
import "../src/css/App.css";

/**
 * Punto de entrada principal para la aplicación React.
 * Configura el router y renderiza la aplicación en el DOM.
 */
const Root = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

const rootElement = document.getElementById('root');
const appRoot = createRoot(rootElement);

try {
  appRoot.render(
    <React.StrictMode>
      <Root />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Error al renderizar la aplicación React:", error);
}
