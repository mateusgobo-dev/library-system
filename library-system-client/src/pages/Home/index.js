import {React, useEffect, useState} from "react";
import librarysystem_api from "../../services/librarysystem_api";
import {Link, useParams} from "react-router-dom";
import "./home.css"
import {toast} from "react-toastify";

function validarPreenchimentoFormulario(titulo, editora, edicao, anoPublicacao) {
    let isValid = true;
    if (titulo === undefined || titulo === '') {
        toast.warn("Informe o título");
        document.getElementById('titulo').focus();
        isValid = false;
    } else if (editora === undefined || editora === '') {
        toast.warn("Informe a editora");
        document.getElementById('editora').focus();
        isValid = false;
    } else if (edicao === undefined || edicao === '') {
        toast.warn("Informe a edicao");
        document.getElementById('edicao').focus();
        isValid = false;
    } else if (anoPublicacao === undefined || anoPublicacao === '') {
        toast.warn("Informe o ano de publicação");
        document.getElementById('anoPublicacao').focus();
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
    const [edicao, setEdicao] = useState("");
    const [autor, setAutor] = useState(0);
    const [anoPublicacao, setAnoPublicacao] = useState("");
    const [exibirNovoLivro, setExibirNovoLivro] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const recuperarAssuntos = async () => {
            try {
                const response = await librarysystem_api.get("/api/v1/assuntos");
                console.log(JSON.stringify(response));
               if (response.status === 200) {
                    if (JSON.stringify(assuntos) !== JSON.stringify(response.data)) {
                        setAssuntos(response.data);
                        localStorage.setItem("@assuntos", response.data);
                    }
                } else if (response.status === 400 || response.status === 404) {
                   toast.error(response.data);
                }
            } catch (error) {
                console.error('Error reading assuntos:', error);
                toast.error('Erro ao carregar assuntos');
            }
        }
        recuperarAssuntos();
    }, []);

    useEffect(() => {
        const recuperarAutores = async () => {
            try {
                const response = await librarysystem_api.get("/api/v1/autores");
                console.log(response.status);
                if (response.status === 200) {
                    if (JSON.stringify(autores) !== JSON.stringify(response.data)) {
                        setAutores(response.data);
                        localStorage.setItem("@autores", response.data);
                    }
                } else if (response.status === 400 || response.status === 404) {
                    toast.error(response.data);
                }
            } catch (error) {
                console.error('Error reading autores:', error);
                toast.error('Erro ao carregar autores');
            }
        }
        recuperarAutores();
    }, []);

    useEffect(() => {
        const recuperarLivros = async () => {
            try {
                const response = await librarysystem_api.get("/api/v1/livros");
                console.log(response);
                console.log(rule);
                if (response.status === 200) {
                    if (JSON.stringify(livros) !== JSON.stringify(response.data)) {
                        setLivros(response.data);
                        localStorage.setItem("@livros", response.data);
                    }
                } else if (response.status === 400 || response.status === 404) {
                    response.data.map((d) => toast.error(d.message));
                    setError("Sem registros de livros");
                }
            } catch (error) {
                console.error('Error reading livros:', error);
                toast.error('Erro ao carregar livros');
            }
        };
        recuperarLivros();
        setLoading(false);
        setExibirNovoLivro(localStorage.getItem("@autores") !== null && localStorage.getItem("@assuntos") !== null);
    }, []);

    useEffect(() => {
        if (rule === 'edit') {
            const livroEdit = localStorage.getItem("@livro");
            if (livroEdit !== undefined && livroEdit !== '') {
                let livroEditAsObject = JSON.parse(livroEdit);
                setId(livroEditAsObject.id);
                setEditora(livroEditAsObject.editora);
                setTitulo(livroEditAsObject.titulo);
                setEdicao(livroEditAsObject.edicao)
                setAnoPublicacao(livroEditAsObject.anoPublicacao);
            }
        }
    }, [rule]);

    function editLivros(livro) {
        localStorage.setItem("@livro", JSON.stringify(livro));
        window.location.href = '/edit';
    }

    function salvarLivros() {
        const livroDto = {
            id: rule === 'edit' ? setId(id) : null,
            titulo: titulo,
            editora: editora,
            edicao: edicao,
            anoPublicacao: anoPublicacao,
            assuntoId: assunto,
            autorId: autor
        };

        if (rule === 'create') {
            const createLivros = async () => {
                try {
                    const response = await librarysystem_api.post("/api/v1/livros", livroDto);
                    console.log('Response Status:', response.status);
                    if (response.status === 201) {
                        toast.info(response.data.response);

                    } else if (response.status === 400) {
                        response.data.map((d) => toast.error(d.message));
                    }
                } catch (error) {
                    console.error('Error creating livro:', error);
                    toast.error('Erro ao criar livro');
                }
            };
            createLivros();
        } else {
            const updateBooks = async () => {
                try {
                    const response = await librarysystem_api.put("/api/v1/livros", livroDto);
                    if (response.status === 202) {
                        toast.info(response.data.response);
                    } else {
                        toast.error(`Erro ao salvar livro ${titulo}, erro => ${response.data}`);
                    }
                } catch (error) {
                    console.error('Error updating livro:', error);
                    toast.error(`Erro ao salvar livro ${titulo}, erro => ${error.response?.data}`);
                }
            };
            updateBooks();
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
            {(rule === undefined || rule === 'list') && error === '' && livros.length > 0 && <div>
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
                        <td width={'94%'}>Título: {livro.titulo}<br/>Livro: {livro.editora}<br/>Edição: {livro.edicao}
                        </td>
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
                    <div className="col-md-12">
                        <label htmlFor="titulo" className="form-label">Título</label>
                        <input type="text" className="form-control" id="titulo" value={titulo}
                               onChange={(e) => setTitulo(e.target.value)}/>
                    </div>
                </div>
                <div className="row row-cols-12">
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
                    <div className="col-md-4">
                        <label htmlFor="anoPublicacao" className="form-label">Ano Publicação</label>
                        <input type="text" className="form-control" id="anoPublicacao" value={anoPublicacao}
                               onChange={(e) => setAnoPublicacao(e.target.value)}/>
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