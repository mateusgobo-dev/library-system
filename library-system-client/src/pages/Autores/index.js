import {React, useEffect, useState} from "react";
import {Link, useLinkClickHandler, useParams} from "react-router-dom";
import {toast} from "react-toastify";
import librarysystem_api from "../../services/librarysystem_api"
import "./autores.css"


function Autores() {
    const {rule} = useParams();
    const [autores, setAutores] = useState([]);
    const [id, setId] = useState(0);
    const [autor, setAutor] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    // const profile = localStorage.getItem("@profile")
    // if(profile === null){
    //     toast.warn("Realize seu cadastro ou efetue o login para acessar as áreas do sistema...");
    //     setTimeout(redirectToUser, 3000);
    // }

    useEffect(() => {
        switch (rule) {
            case 'list':
                librarysystem_api.get("/api/v1/autores")
                    .then(response => {
                        if (JSON.stringify(autores) !== JSON.stringify(response.data)) {
                            setAutores(response.data);
                            localStorage.setItem("@autores", JSON.stringify(response.data))
                        }
                    }).catch(reason => {
                        setError(reason.response.data);
                        toast.error(`Falha na leitura de autores ${reason.response.data}`);
                    });
                break;
            case 'edit':
                const autorEdit = localStorage.getItem("autor");
                if (autorEdit !== undefined && autorEdit !== '') {
                    let autorEditAsObject = JSON.parse(autorEdit);
                    setId(autorEditAsObject.id);
                    setAutor(autorEditAsObject.nome)
                }
                setLoading(false);
                break;
            default : break;
        }
        setLoading(false);
    }, [autores, rule]);

    function salvarAutores() {
        if (autor === undefined || autor === '') {
            toast.warn('Informe da autor');
            document.getElementById('nome').focus();
        } else {
            let autorDto = {
                id: id,
                nome: autor
            }
            if (id === 0) {
                autorDto.id = null;

                async function create() {
                    await librarysystem_api.post("/api/v1/autores", JSON.stringify(autorDto))
                        .then(response => {
                            toast.info(`Registro criado ${autorDto.nome}!`);
                        })
                        .catch(reason => {
                            toast.error(`Falha no registro da autor ${reason.response.data}`);
                        });
                }
                create();
            } else {
                async function update() {
                    await librarysystem_api.put("/api/v1/autores", JSON.stringify(autorDto))
                        .then(response => {
                            toast.info(`Registro alterado ${autorDto.nome}!`);
                            // window.location.href = '/autores/list';
                        })
                        .catch(reason => {
                            toast.error(`Falha na alteracao do registro da autor ${reason.response.data}`);
                        });
                }
                update();
            }
        }
    }

    function editAssunto(autor) {
        localStorage.setItem("autor", JSON.stringify(autor));
        window.location.href = "/autores/edit";
    }

    // function redirectToUser(){
    //     window.location.href = '/usuario';
    // }

    if (loading) {
        return (
            <div className="loading">
                Carregando autores ...
            </div>
        )
    }
    return (
        <div className="container">
            {(rule === 'list' && error !== '') &&
                <div>
                    <span>Você não possui autores cadastrados...</span><br/>
                    <Link to="/autores/create">Criar autor</Link>
                </div>
            }
            {(rule === 'list' && error === '') &&
                <div className="container-fluid">
                    <Link to="/autores/create" style={{float: 'right'}}>Criar autor</Link>
                    <table className="table table-striped" width={'100%'}>
                        <thead>
                        <tr>
                            <td>Id</td>
                            <td>Autores</td>
                            <td></td>
                        </tr>
                        </thead>
                        <tbody>
                        {autores.toSorted((a, b) => a.nome.localeCompare(b.nome)).map(autor =>
                            <tr key={autor.id}>
                                <td width={'5%'}>{autor.id}</td>
                                <td width={'94%'}>{autor.nome}</td>
                                <td width={'1%'}>
                                    <button onClick={() => editAssunto(autor)}>Alterar</button>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            }
            {rule !== 'list' &&
                <div className="container-fluid">
                    <h1>Registro de Autores</h1>
                    <Link onClick={() => window.location.href = '/autores/list'}
                          style={{float: 'right'}}>Voltar</Link>
                    <label htmlFor="description">Informe a autor</label>
                    <input type="text" className="form-control" id="nome" name="nome" value={autor}
                           onChange={e => setAutor(e.target.value)}/>
                    <div className="area-buttons">
                        <button onClick={() => salvarAutores()}>Salvar</button>
                    </div>
                </div>
            }
        </div>
    )
}

export default Autores;