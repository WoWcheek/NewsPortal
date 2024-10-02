import { Routes, Route } from "react-router-dom";
import Topmenu from "./components/Topmenu/Topmenu.tsx";
import Lastnews from "./components/Lastnews/Lastnews.tsx";
import Down from "./components/Down/Down.tsx";
import OneNewsAll from "./components/OneNewsAll/OneNewsAll.tsx";
import EditNews from "./components/NewEditNew/NewEditNew.tsx";
import AddNewsPage from "./components/AddNewsPage/AddNewsPage.tsx";

function App() {
    return (
        <>
            <Topmenu />
            <Routes>
                <Route path="/" element={<Lastnews />} />
                <Route path="/news/:id" element={<OneNewsAll />} />
                <Route path="/edit/:id" element={<EditNews />} />
                <Route path="/add-news" element={<AddNewsPage />} />
            </Routes>
            <Down />
        </>
    );
}

export default App;
