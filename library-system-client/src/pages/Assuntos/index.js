import {React, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {toast} from "react-toastify";
import librarysystem_api from "../../services/librarysystem_api"
import "./assuntos.css"


function Assuntos() {
    const {rule} = useParams();
    const [assuntos, setAssuntos] = useState([]);
    const [id, setId] = useState(0);
    const [assunto, setAssunto] = useState("");
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
                librarysystem_api.get("/api/v1/assuntos")
                    .then(response => {
                        if (JSON.stringify(assuntos) !== JSON.stringify(response.data)) {
                            setAssuntos(response.data);
                            localStorage.setItem("@assuntos", JSON.stringify(response.data))
                        }
                    }).catch(reason => {
                        setError(reason.response.data);
                        toast.error(`Falha na alteracao do registro da autor ${reason.response.data}`);
                    });
                break;
            case 'edit':
                const assuntoEdit = localStorage.getItem("assunto");
                if (assuntoEdit !== undefined && assuntoEdit !== '') {
                    let assuntoEditAsObject = JSON.parse(assuntoEdit);
                    setId(assuntoEditAsObject.id);
                    setAssunto(assuntoEditAsObject.description)
                }
                setLoading(false);
                break;
            default : break;
        }
        setLoading(false);
    }, [rule, assuntos]);

    function salvarAssunto() {
        if (assunto === undefined || assunto === '') {
            toast.warn('Informe da assunto');
            document.getElementById('descricao').focus();
        } else {
            let assuntoDto = {
                id: id,
                descricao: assunto
            }
            if (id === 0) {
                assuntoDto.id = null;
                async function create() {
                    await librarysystem_api.post("/api/v1/assuntos", JSON.stringify(assuntoDto))
                        .then(response => {
                            toast.info(`Registro criado ${assuntoDto.descricao}!`);
                        })
                        .catch(reason => {
                            toast.error(`Falha no registro da assunto ${reason.response.data}`);
                        });
                }
                create();
            } else {
                async function update() {
                    await librarysystem_api.put("/api/v1/assuntos", JSON.stringify(assuntoDto))
                        .then(response => {
                            toast.info(`Registro alterado ${assuntoDto.descricao}!`);
                        })
                        .catch(reason => {
                            toast.error(`Falha na alteracao do registro da assunto ${reason.response.data}`);
                        });
                }
                update();
            }
        }
    }

    function editAssunto(assunto) {
        localStorage.setItem("assunto", JSON.stringify(assunto));
        window.location.href = "/assuntos/edit";
    }

    // function redirectToUser(){
    //     window.location.href = '/usuario';
    // }

    if (loading) {
        return (
            <div className="loading">
                Carregando assuntos ...
            </div>
        )
    }
    return (
        <div className="container">
            {rule === 'list' && error !== '' &&
                <div>
                    <span>Você não possui assuntos cadastrados...</span><br/>
                    <Link to="/assuntos/create">Criar assunto</Link>
                </div>
            }
            {rule === 'list' && error === '' && assuntos.length > 0 &&
                <div className="container-fluid">
                    <Link to="/assuntos/create" style={{float: 'right'}}>Criar assunto</Link>
                    <table className="table table-striped" width={'100%'}>
                        <thead>
                        <tr>
                            <td>Id</td>
                            <td>Assunto</td>
                            <td></td>
                        </tr>
                        </thead>
                        <tbody>
                        {assuntos.toSorted((a, b) => a.descricao.localeCompare(b.descricao)).map(assunto =>
                            <tr key={assunto.id}>
                                <td width={'5%'}>{assunto.id}</td>
                                <td width={'94%'}>{assunto.descricao}</td>
                                <td width={'1%'}>
                                    <button onClick={() => editAssunto(assunto)}>Alterar</button>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            }
            {rule !== 'list' &&
                <div className="container-fluid">
                    <h1>Registro de Assuntos</h1>
                    <Link onClick={() => window.location.href = '/assuntos/list'}
                          style={{float: 'right'}}>Voltar</Link>
                    <label htmlFor="description">Informe a assunto</label>
                    <input type="text" className="form-control" id="descricao" name="descricao" value={assunto}
                           onChange={e => setAssunto(e.target.value)}/>
                    <div className="area-buttons">
                        <button onClick={() => salvarAssunto()}>Salvar</button>
                    </div>
                </div>
            }
        </div>
    )
}

export default Assuntos;