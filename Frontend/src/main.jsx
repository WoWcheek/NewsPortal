import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Topmenu from "./components/Topmenu/Topmenu.tsx";
import Lastnews from "./components/Lastnews/Lastnews.tsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    
    <React.StrictMode>
        <Topmenu />
        <Lastnews />
    </React.StrictMode>
);
