import {BrowserRouter, Routes, Route} from "react-router-dom";

import "./pages/Home"
import Home from "./pages/Home";
import Header from "./components/Header";
import Erro from "./pages/Erro";
import Usuario from "./pages/Usuario";
import Autenticar from "./pages/Autenticar";
import Assuntos from "./pages/Assuntos";
import Autores from "./pages/Autores";

function RoutesApp(){
    return (
        <BrowserRouter>
            <Header/>
            <Routes>
                <Route path="/" element={<Home/>}></Route>
                <Route path="/:rule" element={<Home/>}></Route>
                <Route path="/autores/:rule" element={<Autores/>}></Route>
                <Route path="/assuntos/:rule" element={<Assuntos/>}></Route>
                <Route path="/usuario" element={<Usuario />}></Route>
                <Route path="/autenticar" element={<Autenticar/>}></Route>
                <Route path="*" element={<Erro />}></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default RoutesApp;