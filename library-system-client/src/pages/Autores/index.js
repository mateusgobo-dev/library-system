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
                        console.log(rule);
                        if (response.status === 200) {
                            if (JSON.stringify(autores) !== JSON.stringify(response.data)) {
                                setAutores(response.data);
                                localStorage.setItem("@autores", response.data);
                            }
                        } else if (response.status === 400) {
                            response.data.map((d) => toast.error(d.message));
                        }
                    } catch (error) {
                        console.error('Error reading autores:', error);
                        toast.error('Erro ao carregar autores');
                        setError(error.response.data);
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

    function editAssunto(autor) {
        localStorage.setItem("autor", JSON.stringify(autor));
        window.location.href = "/autores/edit";
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