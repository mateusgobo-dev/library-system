import  {Component} from "react";
import {toast} from "react-toastify";
import librarysystem_api from "../../services/librarysystem_api";

class Livro extends Component {
    constructor(props) {
        super(props);

        this.state = {
            titulo: "",
            editora: "",
            edicao: 0,
            assuntoId: 0,
            autorId: 0,
            livros: [],
            loading: true,
            assuntos: [],
            autores: [],
            assunto: "",
            autor: "",
            exibirNovoLivro: true,
            error: "",
            rule: "",
            livroDto: null
        }
        let state = this.state;

        this.setState(state);
        this.salvarLivro = this.salvarLivro.bind(this);
        this.editLivros = this.editLivros.bind(this);
        this.editarLivros = this.editarLivros.bind(this);
    }

    createMainComponent(){
        let state = this.state;
        async function createAssuntos() {
            librarysystem_api.get("/api/v1/assuntos").then(response => {
                if (JSON.stringify(this.state.assuntos) !== JSON.stringify(response.data)) {
                    state.assuntos = response.data;
                    localStorage.removeItem("@assuntos")
                    localStorage.setItem("@assuntos", JSON.stringify(response.data));
                }
            }).catch(error => {
                state.error = error.response.statusCode === 404 ? "Sem registros de assuntos" : "Falha no acesso a area de livros";
            });
        }
        createAssuntos();

        librarysystem_api.get("/api/v1/autores").then(response => {
            if (JSON.stringify(state.autores) !== JSON.stringify(response.data)) {
                state.autores = response.data;
                localStorage.removeItem("@autores")
                localStorage.setItem("@autores", JSON.stringify(response.data));
            }
        }).catch(error => {
            state.error = error.statusCode === 404 ? "Sem registros de autores" : "Falha no acesso a area de livros";
        });
        librarysystem_api.get("/api/v1/livros").then(response => {
            if (JSON.stringify(state.livros) !== JSON.stringify(response.data)) {
                state.livros = response.data
            }
        }).catch(error => {
            state.error = error.response.statusCode === 404 ? "Sem registros de livros" : "Falha no acesso a area de livros";
        });
        console.log(`Dados: ${JSON.stringify(state.assuntos)} - ${JSON.stringify(state.autores)}`);
        if (state.assuntos !== null && state.assuntos.length > 0) {
            state.assunto = parseInt(JSON.stringify(state.assuntos[0].id));
        }
        if (state.autores !== null && state.autores.length > 0) {
            state.autor = parseInt(JSON.stringify(state.autores[0].id));
        }

        if (state.rule === 'create') {
            state.loading = false
        } else if (state.rule === 'edit') {
            const livroEdit = localStorage.getItem("@livro");
            if (livroEdit !== undefined && livroEdit !== '') {
                let livroEditAsObject = JSON.parse(livroEdit);
                state.id = livroEditAsObject.id;
                state.editora = livroEditAsObject.editora;
                state.titulo = livroEditAsObject.titulo;
            }
        }
        state.loading = false
        state.exibirNovoLivro = (state.assuntos !== null && state.assuntos.length > 0) && (state.autores !== null && state.autores.length > 0);
    }

    salvarLivro() {
        let state = this.state;
        if (this.validarFormulario()) {
            const livroDto = {
                id: state.rule === 'edit' ? state.id : null,
                titulo: state.titulo,
                editora: state.editora,
                assuntoId: state.assunto,
                autorId: state.autor
            }
            async function submeterDadosLivro() {
                try {
                    const response = await fetch("http://localhost:8080/api/v1/livros", {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify(livroDto)
                    });
                    if (!response.ok) {
                        const error = await response.json()
                        throw new Error(error.message || "Erro inesperado");
                    }
                    toast.info(`Livro ${state.titulo} criado com sucesso!`);
                    window.location.href = '/list';
                } catch (error) {
                    toast.error(`Erro ao salvar livro ${state.titulo}, erro => ${state.error.status} - ${state.error.message}`);
                }
            }
            submeterDadosLivro();
        }
    }

    editLivros(livro) {
        localStorage.setItem("@livro", JSON.stringify(livro));
        window.location.href = '/edit';
    }

    editarLivros() {
        let state = this.state;
        const livroDto = {
            id: state.rule === 'edit' ? state.id : null,
            titulo: state.titulo,
            editora: state.editora,
            assuntoId: state.assunto,
            autorId: state.autor
        }
        async function submeterEditLivros() {
            await librarysystem_api.put("/api/v1/livros", JSON.stringify(livroDto))
                .then(response => {
                    if (response.status === 202) {
                        toast.info(`Livro ${state.titulo} alterado com sucesso!`);
                        window.location.href = '/list';
                    } else {
                        toast.error(`Erro ao alterar livro ${state.titulo}, erro => ${response.status} - ${response.statusText}`);
                    }
                })
                .catch(reason => {
                    toast.error(`Erro ao alterar livro ${state.titulo}, erro => ${reason.error}`);
                });
        }
        submeterEditLivros();
    }

    validarFormulario() {
        let state = this.state;
        let isValid = true;
        if (state.titulo === undefined || state.titulo === '') {
            toast.warn("Informe o título");
            document.getElementById('titulo').focus();
            isValid = false;
        } else if (state.editora === undefined || state.editora === '') {
            toast.warn("Informe a editora");
            document.getElementById('editora').focus();
            isValid = false;
        }
        return isValid;
    }
}
export default Livro;