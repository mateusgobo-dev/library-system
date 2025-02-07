import {React, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {toast} from "react-toastify";
import carsystem_api from "../../services/carsystem_api"
import "./assuntos.css"


function Assuntos() {
    const {rule} = useParams();
    const [assuntos, setAssuntos] = useState([]);
    const [id, setId] = useState(0);
    const [assunto, setAssunto] = useState("");
    const [loading, setLoading] = useState(true);
    // const profile = localStorage.getItem("@profile")
    // if(profile === null){
    //     toast.warn("Realize seu cadastro ou efetue o login para acessar as áreas do sistema...");
    //     setTimeout(redirectToUser, 3000);
    // }

    useEffect(() => {
        switch (rule) {
            case 'list':
                async function recuperarAssuntos() {
                    await carsystem_api.get("/api/v1/assuntos")
                        .then(response => {
                            setAssuntos(response.data);
                            setLoading(false);

                            localStorage.setItem("@assuntos", JSON.stringify(assuntos))
                        })
                        .catch(reason => {
                            toast.error(`Falha na abertura das assuntos, erro ${reason.error}`)
                        });
                }
                recuperarAssuntos();
                break;
            case 'create':
                setLoading(false)
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
            default :
                break;
        }
    }, [assuntos, rule]);

    function salvarAssunto() {
        if (assunto === undefined || assunto === '') {
            toast.warn('Informe da assunto');
            document.getElementById('name').focus();
        } else {
            let assuntoDto = {
                id: id,
                description: assunto
            }
            if (id === 0) {
                assuntoDto.id = null;
                console.log(assuntoDto);

                async function create() {
                    await carsystem_api.post("/api/v1/assuntos", JSON.stringify(assuntoDto))
                        .then(response => {
                            toast.info(`Registro criado ${assuntoDto.description}!`);
                            window.location.href = '/assuntos/list';
                        })
                        .catch(reason => {
                            toast.error(`Falha no registro da assunto ${assuntoDto.description}`);
                        });
                }

                create();
            } else {
                async function update() {
                    await carsystem_api.put("/api/v1/assuntos", JSON.stringify(assuntoDto))
                        .then(response => {
                            toast.info(`Registro alterado ${assuntoDto.description}!`);
                            window.location.href = '/assuntos/list';
                        })
                        .catch(reason => {
                            toast.error(`Falha na alteracao do registro da assunto ${assuntoDto.description}`);
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
            {rule === 'list' &&
                assuntos.length === 0 &&
                <div>
                    <span>Você não possui assuntos cadastradas...</span><br/>
                    <Link to="/assuntos/create">Criar assunto</Link>
                </div>
            }
            {rule === 'list' && assuntos.length > 0 &&
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
                        {assuntos.toSorted((a, b) => a.description.localeCompare(b.description)).map(assunto =>
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
                    <input type="text" className="form-control" id="name" name="name" value={assunto}
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