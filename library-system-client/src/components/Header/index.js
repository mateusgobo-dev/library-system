import "./header.css"
import { Link } from "react-router-dom";
import {useEffect, useState} from "react";

function Header(){
    const profile = localStorage.getItem("@profile");
    const [usuario, setUsuario] = useState({})

    useEffect(() => {
        let usuario = {};
        if(profile === null) {
            usuario = {
                id: 0,
                name: 'Usuário',
                email: 'usuario@usuario.com'
            }
        }else{
            usuario = JSON.parse(profile);
        }
        setUsuario(usuario);
    }, [profile]);

    return(
        <header>
            <div style={{float: "left", width: "60%"}}>
                <Link className="logo" to="/" style={{float: "Left"}}>Biblioteca Online</Link>
            </div>
            <div style={{float: "left", width: "20%"}}>
                {<label className="welcome">Bem vindo(a), {usuario.name}</label>}
            </div>
            <div style={{float: "right", width: "20%"}}>
                <Link className="acessos" to="/autores/list">Autor</Link>
                <Link className="acessos" to="/assuntos/list">Assunto</Link>
                <Link className="acessos" to="/list">Livros</Link>
            </div>
        </header>
)
}

export default Header;