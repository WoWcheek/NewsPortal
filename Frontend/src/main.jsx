import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Topmenu from "./components/Topmenu/Topmenu.tsx";
import Lastnews from "./components/Lastnews/Lastnews.tsx";
import Down from "./components/Down/Down.tsx";
import OneNewsAll from "./components/OneNewsAll/OneNewsAll.tsx";
import EditNews from "./components/NewEditNew/NewEditNew.tsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Topmenu />
      <Routes>
        <Route path="/" element={<Lastnews />} />
        <Route path="/news/:id" element={<OneNewsAll />} />
        <Route path="/edit/:id" element={<EditNews />} /> {/* Добавляем маршрут редактирования */}
      </Routes>
      <Down />
    </Router>
  </React.StrictMode>
);
