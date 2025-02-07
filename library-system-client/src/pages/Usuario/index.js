import {React, useEffect, useState} from "react";
import './usuario-form.css'
import {Link} from "react-router-dom";
import {toast} from "react-toastify";
import librarysystem_api from "../../services/librarysystem_api";

function Usuario() {
    const [usuario, setUsuario] = useState({});
    useEffect(() => {
    }, []);

    function salvar() {
        setUsuario(usuario);
        let fields = ["nome-Nome", "endereco-Endereço", "email-Email", "password-Senha"];
        const r = fields.some(f => {
            let values = f.split("-");
            let value = document.getElementById(values[0]).value;
            let names = values[1];
            if (value === undefined || value === '') {
                toast.warn(`Prencha o campo ${names}!`)
                document.getElementById(values[0]).focus();
                return true;
            }
            return false;
        });

        if (!r) {
            async function addUser() {
                const usuarioDto = {
                    id: null,
                    name: usuario.nome,
                    address: usuario.endereco,
                    mail: usuario.email,
                    password: usuario.password
                }
                await librarysystem_api.post("/api/v1/customers", JSON.stringify(usuarioDto)).then(response => {
                    toast.info(`Usuario ${usuarioDto.name} criado com sucesso.`);
                    fields.forEach(f => {
                        let values = f.split("-");
                        document.getElementById(values[0]).value = '';
                    });
                }).catch((reason) => {
                    toast.error(reason.status === 409 ? `O email ${usuarioDto.mail} já foi utilizado por outro usuário.` : "Erro ao criar usuário");
                });
            }

            addUser();
        }
    }

    return (
        <div className="usuario-form">
            <h1>Usuario</h1>
            <label htmlFor="nome">Nome</label>
            <input type="text" className="form-control" id="nome" name="nome" value={usuario.nome}
                   onChange={e => usuario.nome = e.target.value}/>
            <label htmlFor="endereco">Endereço</label>
            <input type="text" className="form-control" id="endereco" name="endereco" value={usuario.endereco}
                   onChange={e => usuario.endereco = e.target.value}/>
            <label htmlFor="email">Email</label>
            <input type="email" className="form-control" id="email" name="email" value={usuario.email}
                   onChange={e => usuario.email = e.target.value}/>
            <label htmlFor="senha">Senha</label>
            <input type="password" className="form-control" id="password" name="password" value={usuario.senha}
                   onChange={e => usuario.password = e.target.value}/>
            <span className="area-buttons">
                <button type="button" onClick={() => salvar()}>Salvar</button><br/>
                <span>Já possui cadastro?</span><Link to="/autenticar"> Clique aqui</Link></span>
        </div>)
}

export default Usuario