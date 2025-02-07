import {React, useEffect, useState} from 'react'
import {toast} from "react-toastify";
import carsystem_api from "../../services/carsystem_api";

function Autenticar() {
    // const profile = localStorage.getItem("@profile")
    const [usuario, setUsuario] = useState({});

    useEffect(() => {
    }, []);

    function autenticar() {
        let fields = ["email-Email", "password-Senha"];
        const r = fields.some(f => {
            let values = f.split("-");
            let value = document.getElementById(values[0]).value;
            let names = values[1];
            if (value === undefined || value === '') {
                toast.warn(`Campo ${names} obrigatório!`)
                document.getElementById(values[0]).focus();
                return true;
            }
            return false;
        });

        if (!r) {
            setUsuario(usuario);
            let status = 0;
            async function validarUsuario() {
                const checkUser = {email: usuario.email, password: usuario.senha}
                await carsystem_api.post("api/v1/customers/check", JSON.stringify(checkUser))
                    .then(response => {
                        status = response.status;
                        if (status === 404) toast.error(response.data);
                        else {
                            const usuarioDto = {id: response.data.id, name: response.data.name, email: response.data.mail}
                            localStorage.setItem("@profile", JSON.stringify(usuarioDto));
                            toast.info("Usuario autenticado...")
                            window.location.href = '/'
                        }
                    })
                    .catch(reason => {
                        status = reason.status
                        toast.error(status === 404 ? reason.data : "Falha na autenticação");
                    });
            }
            validarUsuario();
        }
    }

    return (
        <div className="usuario-form">
            <h1>Acesso ao sistema</h1>
            <label htmlFor="email">Email</label>
            <input type="email" className="form-control" id="email" name="email"
                   onChange={e => usuario.email = e.target.value}/>
            <label htmlFor="senha">Senha</label>
            <input type="password" className="form-control" id="password" name="password"
                   onChange={e => usuario.senha = e.target.value}/>
            <span className="area-buttons">
                <button onClick={() => autenticar()}>Validar</button><br/>
            </span>
        </div>
    );
}

export default Autenticar;