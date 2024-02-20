import React from "react";
import ReactDOM from "react-dom/client";
import { Theme } from "@radix-ui/themes";

// styles
import "./tailwind.css";
import "@radix-ui/themes/styles.css";

// internals
import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Theme accentColor="grass" grayColor="gray" panelBackground="solid" scaling="110%" radius="large">
      <App />
    </Theme>
  </React.StrictMode>,
);
