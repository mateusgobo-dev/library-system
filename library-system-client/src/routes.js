import {BrowserRouter, Routes, Route} from "react-router-dom";

import "./pages/Home"
import Home from "./pages/Home";
import Header from "./components/Header";
import Erro from "./pages/Erro";
import Marcas from "./pages/Marcas";
import Usuario from "./pages/Usuario";
import Autenticar from "./pages/Autenticar";
import Categorias from "./pages/Categorias";
import Cores from "./pages/Cores";

function RoutesApp(){
    return (
        <BrowserRouter>
            <Header/>
            <Routes>
                <Route path="/" element={<Home/>}></Route>
                <Route path="/:rule" element={<Home/>}></Route>
                <Route path="/marcas/:rule" element={<Marcas/>}></Route>
                <Route path="/categorias/:rule" element={<Categorias/>}></Route>
                <Route path="/cores/:rule" element={<Cores/>}></Route>
                <Route path="/usuario" element={<Usuario />}></Route>
                <Route path="/autenticar" element={<Autenticar/>}></Route>
                <Route path="*" element={<Erro />}></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default RoutesApp;