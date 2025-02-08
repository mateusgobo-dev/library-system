import {React, useEffect, useState} from "react";
import librarysystem_api from "../../services/librarysystem_api";
import {Link, useParams} from "react-router-dom";
import "./home.css"
import {toast} from "react-toastify";

function validarPreenchimentoFormulario(titulo, editora) {
    let isValid = true;
    if (titulo === undefined || titulo === '') {
        toast.warn("Informe o título");
        document.getElementById('titulo').focus();
        isValid = false;
    } else if (editora === undefined || editora === '') {
        toast.warn("Informe a editora");
        document.getElementById('editora').focus();
        isValid = false;
    }
    return isValid;
}

function Home() {
    const {rule} = useParams();
    const [id, setId] = useState(0);
    const [livros, setLivros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [assuntos, setAssuntos] = useState([]);
    const [autores, setAutores] = useState([]);
    const [editora, setEditora] = useState("");
    const [titulo, setTitulo] = useState("");
    const [assunto, setAssunto] = useState(0);
    const [edicao, setEdicao] = useState(0);
    const [autor, setAutor] = useState(0);
    const [exibirNovoLivro, setExibirNovoLivro] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        librarysystem_api.get("/api/v1/assuntos")
            .then(response => {
                if (JSON.stringify(assuntos) !== JSON.stringify(response.data)) {
                    setAssuntos(response.data);
                    localStorage.setItem("@assuntos", response.data);
                }
            }).catch(reason => {
            toast.error(`${reason.response.data}`);
        });
    }, []);

    useEffect(() => {
        librarysystem_api.get("/api/v1/autores")
            .then(response => {
                if (JSON.stringify(autores) !== JSON.stringify(response.data)) {
                    setAutores(response.data);
                    localStorage.setItem("@autores", response.data);
                }
            }).catch(reason => {
            toast.error(`${reason.response.data}`);
        });
    }, []);

    useEffect(() => {
        librarysystem_api.get("/api/v1/livros")
            .then(response => {
                if (JSON.stringify(livros) !== JSON.stringify(response.data)) {
                    setLivros(response.data);
                    localStorage.setItem("@livros", response.data);
                }
            }).catch(reason => {
                toast.error(`${reason.response.data}`);
                setExibirNovoLivro(true);
                setError(reason.response.data);
            });
        setLoading(false);
    }, []);

    /**
     * const go = (assuntos != null && autores != null) && (assuntos.length > 0 && autores.length > 0)
     *                     if (go) {
     *                         console.log(`Dados: ${JSON.stringify(assuntos)} - ${JSON.stringify(autores)}`);
     *                         if (assuntos !== null && assuntos.length > 0) {
     *                             setAssunto(parseInt(JSON.stringify(assuntos[0].id)));
     *                         }
     *                         if (autores !== null && autores.length > 0) {
     *                             setAutor(parseInt(JSON.stringify(autores[0].id)));
     *                         }
     *                         setExibirNovoLivro((assuntos !== null && assuntos.length > 0) && (autores !== null && autores.length > 0));
     *                         if (rule === 'edit') {
     *                             const livroEdit = localStorage.getItem("@livro");
     *                             if (livroEdit !== undefined && livroEdit !== '') {
     *                                 let livroEditAsObject = JSON.parse(livroEdit);
     *                                 setId(livroEditAsObject.id);
     *                                 setEditora(livroEditAsObject.potency);
     *                                 setTitulo(livroEditAsObject.vehicle);
     *                             }
     *                         }
     *                     }
     *
     * @param livro
     */

    function editLivros(livro) {
        localStorage.setItem("@livro", JSON.stringify(livro));
        window.location.href = '/edit';
    }

    function salvarLivros() {
        let validarFormulario = validarPreenchimentoFormulario(titulo, editora);
        if (validarFormulario) {
            const livroDto = {
                id: rule === 'edit' ? setId(id) : null, titulo: setTitulo(titulo), editora: setEditora(editora), assuntoId: setAssunto(assunto), autorId: setAutor(autor)
            }
            async function saveLivros() {
                if (rule === 'create') {
                    await librarysystem_api.post("/api/v1/livros", JSON.stringify(livroDto))
                        .then(response => {
                            if (response.status === 201) {
                                toast.info(`Livro ${titulo} criado com sucesso`);
                            } else {
                                toast.error(`Erro ao salvar livro ${titulo}, erro => ${response.data}`);
                            }
                        })
                        .catch(reason => {
                            toast.error(`Erro ao salvar livro ${titulo}, erro => ${reason.response.data}`);
                        });
                } else {
                    await librarysystem_api.put("/api/v1/livros", JSON.stringify(livroDto))
                        .then(response => {
                            if (response.status === 202) {
                                toast.info(`Livro ${titulo} alterado com sucesso`);
                                window.location.href = '/list';
                            } else {
                                toast.error(`Erro ao salvar livro ${titulo}, erro => ${response.data}`);
                            }
                        })
                        .catch(reason => {
                            toast.error(`Erro ao salvar livro ${titulo}, erro => ${reason.response.data}`);
                        });
                }
            }
            saveLivros();
        }
    }

    if (loading) {
        return (<div className="loading">
            Carregando lista de livros ...
        </div>)
    }
    return (<div className="container">
        <div className="lista-livros">
            {(rule === undefined || rule === 'list') && error !== '' && <div>
                <span>Você não possui livros cadastrados...</span><br/>
                {exibirNovoLivro ? <Link to="/create">Criar Livro</Link> :
                        <span>Crie os registros de Autores e Assuntos para incluir um novo livro!</span>}
            </div>}
            {rule === 'list' && error === '' && livros.length > 0 && <div>
                <Link to="/create" style={{float: 'right'}}>Criar livro</Link>
                <table className="table table-striped" width={'100%'}>
                    <thead>
                    <tr>
                        <td>Id</td>
                        <td>Livro</td>
                        <td></td>
                    </tr>
                    </thead>
                    <tbody>
                    {livros.toSorted((a, b) => a.titulo.localeCompare(b.titulo)).map(livro => <tr key={livro.id}>
                        <td width={'5%'}>{livro.id}</td>
                        <td width={'94%'}>{livro.titulo}<br/>{livro.editora}<br/>{livro.edicao}</td>
                        <td width={'1%'}>
                            <button onClick={() => editLivros(livro)}>Alterar</button>
                        </td>
                    </tr>)}
                    </tbody>
                </table>
            </div>}
            {(rule !== undefined && rule !== 'list') && <div className="container">
                <h1>Registro de Livros</h1>
                <Link onClick={() => window.location.href = '/list'} style={{float: 'right'}}>Voltar</Link><br/>
                <div className="row row-cols-12">
                    <div className="col-md-4">
                        <label htmlFor=" assuntoOption" className="form-label">Selecione o assunto</label><br/>
                        <select name=" assuntoOption" id=" assunto" className="form-control"
                                onChange={(e) => setAssunto(e.target.value)}>
                            {assuntos.map((assunto) => {
                                return (<option key={assunto.id} value={assunto.id}>{assunto.descricao}</option>)
                            })}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor=" autorOption" className="form-label">Selecione o autor</label><br/>
                        <select name=" autorOption" id=" autor" className="form-control"
                                onChange={(e) => setAutor(e.target.value)}>
                            {autores.map((autor) => {
                                return (<option key={autor.id} value={autor.id}>{autor.nome}</option>)
                            })}
                        </select>
                    </div>
                </div>
                <div className="row row-cols-12">
                    <div className="col-md-8">
                        <label htmlFor="titulo" className="form-label">Título</label>
                        <input type="text" className="form-control" id="titulo" value={titulo}
                               onChange={(e) => setTitulo(e.target.value)}/>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="editora" className="form-label">Editora</label>
                        <input type="text" className="form-control" id="editora" value={editora}
                               onChange={(e) => setEditora(e.target.value)}/>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="edicao" className="form-label">Edição</label>
                        <input type="text" className="form-control" id="edicao" value={edicao}
                               onChange={(e) => setEdicao(e.target.value)}/>
                    </div>
                </div>
                <div className="container-fluid" style={{marginTop: "20px"}}>
                    <button onClick={() => salvarLivros()}>Salvar</button>
                </div>
            </div>}
        </div>
    </div>)
}

export default Home;