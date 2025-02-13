import {React, useEffect, useState} from "react";
import librarysystem_api from "../../services/librarysystem_api";
import {Link, useParams} from "react-router-dom";
import {IMaskInput} from "react-imask";
import "./home.css"
import {toast} from "react-toastify";

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
    const [valorLivro, setValorLivro] = useState("");
    const [exibirNovoLivro, setExibirNovoLivro] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (rule !== '/report') {
            const recuperarAssuntos = async () => {
                try {
                    const response = await librarysystem_api.get("/api/v1/assuntos");
                    if (response.status === 200) {
                        if (JSON.stringify(assuntos) !== JSON.stringify(response.data)) {
                            setAssuntos(response.data);
                            localStorage.setItem("@assuntos", JSON.stringify(response.data));
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
        }
    }, [autores]);

    useEffect(() => {
        if (rule !== '/report') {
            const recuperarAutores = async () => {
                try {
                    const response = await librarysystem_api.get("/api/v1/autores");
                    if (response.status === 200) {
                        if (JSON.stringify(autores) !== JSON.stringify(response.data)) {
                            setAutores(response.data);
                            localStorage.setItem("@autores", JSON.stringify(response.data));
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
        }
    }, [assuntos]);

    useEffect(() => {
        if (rule !== '/report') {
            const recuperarLivros = async () => {
                try {
                    const response = await librarysystem_api.get("/api/v1/livros");
                    if (response.status === 200) {
                        if (JSON.stringify(livros) !== JSON.stringify(response.data)) {
                            setLivros(response.data);
                            localStorage.setItem("@livros", JSON.stringify(response.data));
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
        }
    }, []);

    useEffect(() => {
        if (rule === 'edit') {
            const livroEdit = localStorage.getItem("@livro");
            if (livroEdit !== undefined && livroEdit !== '') {
                let livroEditAsObject = JSON.parse(livroEdit);
                setId(livroEditAsObject.id);
                setAutor(livroEditAsObject.autorId);
                setAssunto(livroEditAsObject.assuntoId);
                setEditora(livroEditAsObject.editora);
                setTitulo(livroEditAsObject.titulo);
                setEdicao(livroEditAsObject.edicao);
                setValorLivro(livroEditAsObject.preco);
                setAnoPublicacao(livroEditAsObject.anoPublicacao);
            }
        }
    }, []);

    function editLivros(livro) {
        localStorage.removeItem("@livro")
        localStorage.setItem("@livro", JSON.stringify(livro));
        window.location.href = '/edit';
    }

    function removerLivro(livroDto) {
        const removeLivro = async () => {
            try {
                const response = await librarysystem_api.post("/api/v1/livros/delete", livroDto);
                if (response.status === 301) {
                    toast.info(response.data);
                    const livrosStorage = JSON.parse(localStorage.getItem("@livros"));
                    const livrosCollection = [];
                    livrosStorage.map(livro => {
                        if (livro.id !== livroDto.id) livrosCollection.push(livroDto);
                    });
                    localStorage.removeItem("@livros");
                    localStorage.setItem("@livros", livrosCollection);

                    window.location.href = '/list';
                } else if (response.status === 400 || response.status === 404) {
                    response.data.map((d) => toast.error(d.message));
                }
            } catch (error) {
                console.error('Error remove livro:', error);
                toast.error('Erro ao remover livro');
            }
        };
        removeLivro();
    }

    function loadValueCheckBox(){
        setAssunto(JSON.parse(localStorage.getItem("@assuntos"))[0].id);
        setAutor(JSON.parse(localStorage.getItem("@autores"))[0].id);
    }

    function criarRelatorio() {
        window.open("http://localhost:8080/api/v1/reports/library-books", "Relatório Geral de Livros", "width=600,height=400,scrollbars=yes");
    }

    function salvarLivros() {
        const livroDto = {
            id: rule === 'edit' ? id : null,
            titulo: titulo,
            editora: editora,
            edicao: edicao,
            anoPublicacao: anoPublicacao,
            assuntoId: assunto,
            autorId: autor,
            preco: valorLivro
        };
        if(assunto === 0 || autor === 0){
            toast.warn('Assunto e autor são obrigatórios!');
            return;
        }

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
                <div className="container">
                    <Link to="/create" style={{float: 'right'}} onClick={loadValueCheckBox}>Criar livro</Link>
                    <a href="#" onClick={criarRelatorio} style={{float: 'left'}}>Relatório</a>
                </div>
                <div className="div-table">
                    <div className="div-table-id">#</div>
                    <div className="div-table-data">Livro registrados</div>
                    <div className="div-table-link"></div>
                </div>
                <div className="all-tables-size">
                    <table className="table table-striped" width={'100%'}>
                        <tbody>
                        {livros.toSorted((a, b) => a.autor.localeCompare(b.autor)).map(livro => <tr key={livro.id}>
                            <td width={'5%'}>{livro.id}</td>
                            <td width={'94%'}
                                align={'left'}>Título: {livro.titulo}<br/>Livro: {livro.editora}<br/>Edição: {livro.edicao}<br/>
                                Autor: {livro.autor}<br/>
                                Editora: {livro.editora}<br/>
                                Preço R$: {livro.preco === "0.00" ? "Não informado" : livro.preco}
                            </td>
                            <td width={'1%'}>
                                <button className="btn btn-primary" style={{width: 90 + "px", marginBottom: 10 + "px"}}
                                        onClick={() => editLivros(livro)}>Alterar
                                </button>
                                <br/>
                                <button className="btn btn-danger" style={{width: 90 + "px"}}
                                        onClick={() => removerLivro(livro)}>Remover
                                </button>
                            </td>
                        </tr>)}
                        </tbody>
                    </table>
                </div>
                <div className="container div-table-rodape">
                    Total {livros.length} livros registrados
                </div>
            </div>
            }
            {(rule !== undefined && rule !== 'list') && <div className="container">
                <h1>Registro de Livros</h1>
                <Link onClick={() => window.location.href = '/list'} style={{float: 'right'}}>Voltar</Link><br/>
                <div className="row row-cols-12">
                    <div className="col-md-4">
                        <label htmlFor=" assuntoOption" className="form-label">Selecione o assunto</label><br/>
                        <select name=" assuntoOption" id="assunto" className="form-control" value={assunto}
                                onChange={(e) => setAssunto(e.target.value)}>
                            <option value="0">Selecione...</option>
                            {assuntos.map((assunto) => {
                                return (<option key={assunto.id} value={assunto.id}>{assunto.descricao}</option>)
                            })}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor=" autorOption" className="form-label">Selecione o autor</label><br/>
                        <select name=" autorOption" id="autor" className="form-control" value={autor}
                                onChange={(e) => setAutor(e.target.value)}>
                            <option value="0">Selecione...</option>
                            {autores.map((autor) => {
                                return (<option key={autor.id} value={autor.id}>{autor.nome}</option>)
                            })}
                        </select>
                    </div>
                </div>
                <div className="row row-cols-12">
                    <div className="col-md-12">
                        <label htmlFor="titulo" className="form-label">Título</label>
                        <input type="text" className="form-control" maxLength="40" id="titulo" value={titulo}
                               onChange={(e) => setTitulo(e.target.value)}/>
                    </div>
                </div>
                <div className="row row-cols-12">
                    <div className="col-md-3">
                        <label htmlFor="editora" className="form-label">Editora</label>
                        <input type="text" className="form-control" id="editora" value={editora}
                               onChange={(e) => setEditora(e.target.value)}/>
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="edicao" className="form-label">Edição</label>
                        <IMaskInput mask="0000" value={edicao} className="form-control"
                                    onAccept={(value) => setEdicao(value)}
                                    placeholder="Edição" maxLength="1"/>
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="anoPublicacao" className="form-label">Ano Publicação</label>
                        <IMaskInput mask="0000" value={anoPublicacao} className="form-control"
                                    onAccept={(value) => setAnoPublicacao(value)}
                                    placeholder="AAAA" maxLength="4">
                        </IMaskInput>
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="valorLivro" className="form-label">Valor R$</label>
                        <IMaskInput className="form-control"
                                    mask="num"
                                    blocks={{
                                        num: {mask: Number, thousandsSeparator: ".", radix: ",", scale: 2},
                                    }}
                                    value={valorLivro}
                                    onAccept={(value) => setValorLivro(value)}
                                    placeholder="R$ 0,00"
                        />
                    </div>
                </div>
                <div className="container-fluid" style={{marginTop: "20px"}}>
                    <button onClick={() => salvarLivros()}>Salvar</button>
                </div>
            </div>
            }
        </div>
    </div>)
}

export default Home;