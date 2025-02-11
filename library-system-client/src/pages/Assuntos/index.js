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

    useEffect(() => {
        switch (rule) {
            case 'list':
                const recuperarAssuntos = async () => {
                    try {
                        const response = await librarysystem_api.get("/api/v1/assuntos");
                        console.log(response);
                        if (response.status === 200) {
                            if (JSON.stringify(assuntos) !== JSON.stringify(response.data)) {
                                setAssuntos(response.data);
                                localStorage.setItem("@assuntos", JSON.stringify(response.data));
                            }
                        } else if (response.status === 400 || response.status === 404) {
                            response.data.map((d) => toast.error(d.message));
                            setError("falha na leitura dos assuntos");
                        }
                        return;
                    } catch (error) {
                        console.error('Error reading assuntos:', error);
                        toast.error('Erro ao carregar assuntos');
                        setError("falha na leitura dos assuntos");
                    }
                };
                recuperarAssuntos();
                setLoading(false);
                break;
            case 'edit':
                const assuntoEdit = localStorage.getItem("assunto");
                if (assuntoEdit !== undefined && assuntoEdit !== '') {
                    let assuntoEditAsObject = JSON.parse(assuntoEdit);
                    setId(assuntoEditAsObject.id);
                    setAssunto(assuntoEditAsObject.descricao)
                }
                setLoading(false);
                break;
            default :
                break;
        }
        setLoading(false);
    }, [rule, assuntos]);

    function salvarAssunto() {
        let assuntoDto = {
            id: id === 0 ? null : id,
            descricao: assunto
        }
        if (rule === 'create') {
            const createAssuntos = async () => {
                try {
                    const response = await librarysystem_api.post("/api/v1/assuntos", assuntoDto);
                    console.log('Response Status:', response.status);
                    if (response.status === 201) {
                        toast.info(response.data);
                        document.getElementById('descricao').value = '';
                    } else if (response.status === 400) {
                        response.data.map((d) => toast.error(d.message));
                    }
                    return;
                } catch (error) {
                    console.error('Error creating assunto:', error);
                    toast.error('Erro ao criar assunto');
                }
            };
            createAssuntos();
        } else {
            const updateAssuntos = async () => {
                try {
                    const response = await librarysystem_api.put("/api/v1/assuntos", assuntoDto);
                    console.log('Response Status:', response.status);
                    if (response.status === 202) {
                        toast.info(response.data);
                    } else if (response.status === 400 || response.status === 404) {
                        response.data.map((d) => toast.error(d.message));
                    }
                    return;
                } catch (error) {
                    console.error('Error atualizar assunto:', error);
                    toast.error('Erro ao atualizar assunto');
                }
            };
            updateAssuntos();
        }
    }

    function editAssunto(assunto) {
        localStorage.setItem("assunto", JSON.stringify(assunto));
        window.location.href = "/assuntos/edit";
    }

    function removerAssunto(assuntoId) {
        const removeAssunto = async () => {
            try {
                const response = await librarysystem_api.delete("/api/v1/assuntos/"+assuntoId);
                console.log('Response Status:', response.status);
                if (response.status === 301) {
                    toast.info(response.data);
                    const assuntosStorage = JSON.parse(localStorage.getItem("@assuntos"));
                    const assuntosCollection = [];
                    assuntosStorage.map(assunto => {
                        if(assunto.id !== assuntoId)assuntosCollection.push(assunto);
                    });
                    localStorage.removeItem("@assuntos");
                    localStorage.setItem("@assuntos",assuntosCollection);

                    window.location.href = '/assuntos/list';
                } else if (response.status === 400 || response.status === 404) {
                    response.data.map((d) => toast.error(d.message));
                }
                return;
            } catch (error) {
                console.error('Error remove assunto:', error);
                toast.error('Erro ao remover assunto');
            }
        };
        removeAssunto();
    }

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
                                <td width={'94%'} align={'left'}>{assunto.descricao}</td>
                                <td width={'1%'}>
                                    <button onClick={() => editAssunto(assunto)}>Alterar</button><br />
                                    <button onClick={() => removerAssunto(assunto.id)}>Remover</button>
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