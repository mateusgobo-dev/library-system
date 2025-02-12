import {React, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
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

    useEffect(() => {
        switch (rule) {
            case 'list':
                const recuperarAtores = async () => {
                    try {
                        const response = await librarysystem_api.get("/api/v1/autores");
                        if (response.status === 200) {
                            if (JSON.stringify(autores) !== JSON.stringify(response.data)) {
                                setAutores(response.data);
                                localStorage.setItem("@autores", JSON.stringify(response.data));
                            }
                        } else if (response.status === 400 || response.status === 404) {
                            response.data.map((d) => toast.error(d.message));
                            setError("Erro na leitura dos autores");
                        }
                    } catch (error) {
                        console.error('Error reading autores:', error);
                        toast.error('Erro ao carregar autores');
                        setError("Erro na leitura dos autores");
                    }
                };
                recuperarAtores();
                setLoading(false);
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
            default :
                break;
        }
        setLoading(false);
    }, [autores, rule]);

    function salvarAutores() {
        let autorDto = {
            id: id === 0 ? null : id,
            nome: autor
        }
        if (rule === 'create') {
            const saveAtores = async () => {
                try {
                    const response = await librarysystem_api.post("/api/v1/autores", JSON.stringify(autorDto));
                    if (response.status === 201) {
                        toast.info(response.data);
                        document.getElementById('nome').value = '';
                    } else if (response.status === 400) {
                        response.data.map((d) => toast.error(d.message));
                    }
                } catch (error) {
                    console.error('Error creating atores:', error);
                    toast.error('Erro ao criar atores');
                }
            }
            saveAtores();
        } else {
            const atualizarAtores = async () => {
                try {
                    const response = await librarysystem_api.put("/api/v1/autores", JSON.stringify(autorDto));
                    console.log(rule)
                    if (response.status === 202) {
                        toast.info(response.data);
                    } else if (response.status === 400) {
                        response.data.map((d) => toast.error(d.message));
                    }
                } catch (error) {
                    console.error('Error updating atores:', error);
                    toast.error('Erro ao atualizar atores');
                }
            }
            atualizarAtores();
        }
    }

    function editAutor(autor) {
        localStorage.setItem("autor", JSON.stringify(autor));
        window.location.href = "/autores/edit";
    }

    function removerAutor(autorId) {
        const removeAutor = async () => {
            try {
                const response = await librarysystem_api.delete("/api/v1/autores/" + autorId);
                console.log('Response Status:', response.status);
                if (response.status === 301) {
                    toast.info(response.data);
                    const autoresStorage = JSON.parse(localStorage.getItem("@autores"));
                    const autoresCollection = [];
                    autoresStorage.map(autor => {
                        if (autor.id !== autorId) autoresCollection.push(autor);
                    });
                    localStorage.removeItem("@autores");
                    localStorage.setItem("@autores", autoresCollection);

                    window.location.href = '/autores/list';
                } else if (response.status === 400 || response.status === 404) {
                    response.data.map((d) => toast.error(d.message));
                }
                return;
            } catch (error) {
                console.error('Error remove assunto:', error);
                toast.error('Erro ao remover assunto');
            }
        };
        removeAutor();
    }

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
                    <div className="div-table">
                        <div className="div-table-id">#</div>
                        <div className="div-table-data">Autores registrados</div>
                        <div className="div-table-link"></div>
                    </div>
                    <div className="all-tables-size">
                        <table className="table table-striped" width={'100%'}>
                            <tbody>
                            {autores.toSorted((a, b) => a.nome.localeCompare(b.nome)).map(autor =>
                                <tr key={autor.id}>
                                    <td width={'5%'}>{autor.id}</td>
                                    <td width={'94%'} align={'left'}>{autor.nome}</td>
                                    <td width={'1%'}>
                                        <button className="btn btn-primary"
                                                style={{width: 90 + "px", marginBottom: 10 + "px"}}
                                                onClick={() => editAutor(autor)}>Alterar
                                        </button>
                                        <br/>
                                        <button className="btn btn-danger" style={{width: 90 + "px"}}
                                                onClick={() => removerAutor(autor.id)}>Remover
                                        </button>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                    <div className="container div-table-rodape">
                        Total {autores.length} assuntos registrados
                    </div>
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