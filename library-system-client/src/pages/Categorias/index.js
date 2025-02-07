import {React, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {toast} from "react-toastify";
import carsystem_api from "../../services/carsystem_api"
import "./categorias.css"


function Categorias() {
    const {rule} = useParams();
    const [categorias, setCategorias] = useState([]);
    const [id, setId] = useState(0);
    const [categoria, setCategoria] = useState("");
    const [loading, setLoading] = useState(true);
    // const profile = localStorage.getItem("@profile")
    // if(profile === null){
    //     toast.warn("Realize seu cadastro ou efetue o login para acessar as áreas do sistema...");
    //     setTimeout(redirectToUser, 3000);
    // }

    useEffect(() => {
        switch (rule) {
            case 'list':
                async function recuperarCategorias() {
                    await carsystem_api.get("/api/v1/category")
                        .then(response => {
                            setCategorias(response.data);
                            setLoading(false);

                            localStorage.setItem("@categorias", JSON.stringify(categorias))
                        })
                        .catch(reason => {
                            toast.error(`Falha na abertura das categorias, erro ${reason.error}`)
                        });
                }
                recuperarCategorias();
                break;
            case 'create':
                setLoading(false)
                break;
            case 'edit':
                const categoriaEdit = localStorage.getItem("categoria");
                if (categoriaEdit !== undefined && categoriaEdit !== '') {
                    let categoriaEditAsObject = JSON.parse(categoriaEdit);
                    setId(categoriaEditAsObject.id);
                    setCategoria(categoriaEditAsObject.name)
                }
                setLoading(false);
                break;
            default :
                break;
        }
    }, [rule, categorias, setCategorias]);

    function salvarCategoria() {
        if (categoria === undefined || categoria === '') {
            toast.warn('Informe da categoria');
            document.getElementById('name').focus();
        } else {
            let categoriaDto = {
                id: id,
                name: categoria
            }
            if (id === 0) {
                categoriaDto.id = null;

                async function create() {
                    await carsystem_api.post("/api/v1/category", JSON.stringify(categoriaDto))
                        .then(response => {
                            toast.info(`Registro criado ${categoriaDto.name}!`);
                            window.location.href = '/categorias/list';
                        })
                        .catch(reason => {
                            toast.error(`Falha no registro da categoria ${categoriaDto.name}`);
                        });
                }

                create();
            } else {
                async function update() {
                    await carsystem_api.put("/api/v1/category", JSON.stringify(categoriaDto))
                        .then(response => {
                            toast.info(`Registro alterado ${categoriaDto.name}!`);
                            window.location.href = '/categorias/list';
                        })
                        .catch(reason => {
                            toast.error(`Falha na alteracao do registro da categoria ${categoriaDto.name}`);
                        });
                }

                update();
            }
        }
    }

    function editMarca(categoria) {
        localStorage.setItem("categoria", JSON.stringify(categoria));
        window.location.href = "/categorias/edit";
    }

    // function redirectToUser(){
    //     window.location.href = '/usuario';
    // }

    if (loading) {
        return (
            <div className="loading">
                Carregando categorias ...
            </div>
        )
    }
    return (
        <div className="container">
            {rule === 'list' &&
                categorias.length === 0 &&
                <div>
                    <span>Você não possui categorias cadastradas...</span><br/>
                    <Link to="/categorias/create">Criar categoria</Link>
                </div>
            }
            {rule === 'list' && categorias.length > 0 &&
                <div>
                    <Link to="/categorias/create" style={{float: 'right'}}>Criar categoria</Link>
                    <table className="table table-striped" width={'100%'}>
                        <thead>
                        <tr>
                            <td>Id</td>
                            <td>Categoria</td>
                            <td></td>
                        </tr>
                        </thead>
                        <tbody>
                        {categorias.toSorted((a, b) => a.name.localeCompare(b.name)).map(categoria =>
                            <tr key={categoria.id}>
                                <td width={'5%'}>{categoria.id}</td>
                                <td width={'94%'}>{categoria.name}</td>
                                <td width={'1%'}>
                                    <button onClick={() => editMarca(categoria)}>Alterar</button>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            }
            {rule !== 'list' &&
                <div>
                    <h1>Registro de Categorias</h1>
                    <Link onClick={() => window.location.href = '/categorias/list'}
                          style={{float: 'right'}}>Voltar</Link>
                    <label htmlFor="description">Informe a descrição da categoria</label>
                    <input type="text" className="form-control" id="name" name="name" value={categoria}
                           onChange={e => setCategoria(e.target.value)}/>
                    <div className="area-buttons">
                        <button onClick={() => salvarCategoria()}>Salvar</button>
                    </div>
                </div>
            }
        </div>
    )
}

export default Categorias;