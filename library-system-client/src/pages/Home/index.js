import {React, useEffect, useState} from "react";
import carsystem_api from "../../services/carsystem_api";
import {Link, useParams} from "react-router-dom";
import "./home.css"
import {toast} from "react-toastify";

function recuperarMarcas() {
    async function recuperarMarcasPromisse() {
        await carsystem_api.get("/api/v1/brand")
            .then(response => {
                const marcas = response.data
                localStorage.removeItem("@marcas")
                localStorage.setItem("@marcas", JSON.stringify(marcas));
            }).catch(reason => {
                toast.error(`Falha ao recuperar marcas, erro => ${reason.error}`)
            });
    }

    recuperarMarcasPromisse();
}

function recuperarCategorias() {
    async function recuperarCategoriasPromisse() {
        await carsystem_api.get("/api/v1/category")
            .then(response => {
                const categorias = response.data;
                localStorage.removeItem("@categorias")
                localStorage.setItem("@categorias", JSON.stringify(categorias));
            }).catch(reason => {
                toast.error(`Falha ao recuperar categorias, erro => ${reason.error}`)
            });
    }

    recuperarCategoriasPromisse();
}

function recuperarCores() {
    async function recuperarCoresPromisse() {
        await carsystem_api.get("/api/v1/color")
            .then(response => {
                const cores = response.data;

                localStorage.removeItem("@cores")
                localStorage.setItem("@cores", JSON.stringify(cores));
            }).catch(reason => {
                toast.error(`Falha ao recuperar cores, erro => ${reason.error}`)
            });
    }

    recuperarCoresPromisse();
}

function validarPreenchimentoFormulario(veiculo, potencia) {
    let isValid = true;
    if (veiculo === undefined || veiculo === '') {
        toast.warn("Informe o veículo");
        document.getElementById('veiculo').focus();
        isValid = false;
    } else if (potencia === undefined || potencia === '') {
        toast.warn("Informe a potencia");
        document.getElementById('potencia').focus();
        isValid = false;
    }
    return isValid;
}

function Home() {
    recuperarCores();
    recuperarCategorias();
    recuperarMarcas();

    const {rule} = useParams();
    const [id, setId] = useState(0);
    const [carros, setCarros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [colors] = useState(JSON.parse(localStorage.getItem("@cores")));
    const [brands] = useState(JSON.parse(localStorage.getItem("@marcas")));
    const [categories] = useState(JSON.parse(localStorage.getItem("@categorias")));
    const [potencia, setPotencia] = useState("");
    const [veiculo, setVeiculo] = useState("");
    const [cor, setCor] = useState(0);
    const [marca, setMarca] = useState(0);
    const [categoria, setCategoria] = useState(0);
    const [exibirNovoCarro, setExibirNovoCarro] = useState(true);

    useEffect(() => {
        console.log(rule)
        if (rule === undefined || rule === 'list' || rule === '/') {
            async function loadCarros() {
                const response = await carsystem_api.get("/api/v1/car");
                setCarros(response.data)
                setLoading(false);
            }

            loadCarros();
            if (colors !== null && colors.length > 0) {
                setCor(parseInt(JSON.stringify(colors[0].id)));
            }
            if (marca !== null && brands.length > 0) {
                setMarca(parseInt(JSON.stringify(brands[0].id)));
            }
            if (categories !== null && categories.length > 0) {
                setCategoria(parseInt(JSON.stringify(categories[0].id)));
            }
            setExibirNovoCarro((colors !== null && colors.length > 0) && (brands !== null && brands.length > 0) && (categories !== null && categories.length > 0));
        } else if (rule === 'create') {
            setLoading(false)
        } else if (rule === 'edit') {
            const carEdit = localStorage.getItem("@car");
            if (carEdit !== undefined && carEdit !== '') {
                let carEditAsObject = JSON.parse(carEdit);
                setId(carEditAsObject.id);
                setPotencia(carEditAsObject.potency);
                setVeiculo(carEditAsObject.vehicle);
                setCor(carEditAsObject.color.id)
                setMarca(carEditAsObject.brandCategory.brand.id)
                setCategoria(carEditAsObject.brandCategory.category.id);
            }
            setLoading(false);
        }
    }, [rule, brands, categories, colors, marca, cor, categoria]);

    function editCarro(carro) {
        localStorage.setItem("@car", JSON.stringify(carro));
        window.location.href = '/edit';
    }

    function salvarCarro() {
        let validarFormulario = validarPreenchimentoFormulario(veiculo, potencia);
        if (validarFormulario) {
            const carDto = {
                id: rule === 'edit' ? id : null,
                vehicle: veiculo,
                potency: potencia,
                colorId: cor,
                brandId: marca,
                categoryId: categoria
            }

            async function saveCar() {
                if(rule === 'create') {
                    await carsystem_api.post("/api/v1/car", JSON.stringify(carDto))
                        .then(response => {
                            if (response.status === 201) {
                                toast.info(`Veículo ${veiculo} criado com sucesso`);
                            } else {
                                toast.error(`Erro ao salvar veículo ${veiculo}, erro => ${response.status} - ${response.statusText}`);
                            }
                        })
                        .catch(reason => {
                            toast.error(`Erro ao salvar veículo ${veiculo}, erro => ${reason.error}`);
                        });
                }else{
                    await carsystem_api.put("/api/v1/car", JSON.stringify(carDto))
                        .then(response => {
                            if (response.status === 202) {
                                toast.info(`Veículo ${veiculo} alterado com sucesso`);
                            } else {
                                toast.error(`Erro ao alterar veículo ${veiculo}, erro => ${response.status} - ${response.statusText}`);
                            }
                        })
                        .catch(reason => {
                            toast.error(`Erro ao alterar veículo ${veiculo}, erro => ${reason.error}`);
                        });
                }
                window.location.href = '/list';
            }
            saveCar();
        }
    }

    if (loading) {
        return (
            <div className="loading">
                Carregando lista de carros ...
            </div>
        )
    }
    return (
        <div className="container">
            <div className="lista-carros">
                {(rule === 'list' || rule === undefined) &&
                    carros.length === 0 &&
                    <div>
                        <span>Você não possui carros cadastrados...</span><br/>
                        {exibirNovoCarro ? <Link to="/create">Criar carro</Link> :
                            <span>Crie os registros de Cores, Marcas e Categoria para incluir um novo carro!</span>}
                    </div>
                }
                {(rule === 'list' || rule === undefined) && carros.length > 0 &&
                    <div>
                        <Link to="/create" style={{float: 'right'}}>Criar carro</Link>
                        <table className="table table-striped" width={'100%'}>
                            <thead>
                            <tr>
                                <td>Id</td>
                                <td>Veículo</td>
                                <td></td>
                            </tr>
                            </thead>
                            <tbody>
                            {carros.toSorted((a, b) => a.vehicle.localeCompare(b.vehicle)).map(carro =>
                                <tr key={carro.id}>
                                    <td width={'5%'}>{carro.id}</td>
                                    <td width={'94%'}>{carro.vehicle}<br/>{carro.potency}<br/>{carro.brandCategory.brand.name}<br/>{carro.brandCategory.category.name}<br/>
                                        {carro.color.description}
                                    </td>
                                    <td width={'1%'}>
                                        <button onClick={() => editCarro(carro)}>Alterar</button>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                }
                {(rule !== undefined && rule !== 'list') &&
                    <div className="container">
                        <h1>Registro de Carros</h1>
                        <Link onClick={() => window.location.href = '/list'} style={{float: 'right'}}>Voltar</Link><br/>
                        <div className="row row-cols-12">
                            <div className="col-md-4">
                                <label htmlFor="corOption" className="form-label">Selecione a cor</label><br/>
                                <select name="corOption" id="cor" className="form-control"
                                        onChange={(e) => setCor(e.target.value)}>
                                    {colors.map((cor) => {
                                        return (
                                            <option key={cor.id} value={cor.id}>{cor.description}</option>
                                        )
                                    })}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="marcaOption" className="form-label">Selecione a marca</label><br/>
                                <select name="marcaOption" id="marca" className="form-control"
                                        onChange={(e) => setMarca(e.target.value)}>
                                    {brands.map((marca) => {
                                        return (
                                            <option key={marca.id} value={marca.id}>{marca.name}</option>
                                        )
                                    })}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="categoriaOption" className="form-label">Selecione a
                                    categoria</label><br/>
                                <select name="categoriaOption" id="categoria" className="form-control"
                                        onChange={(e) => setCategoria(e.target.value)}>
                                    {categories.map((categoria) => {
                                        return (
                                            <option key={categoria.id}
                                                    value={categoria.id}>{categoria.name}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="row row-cols-12">
                            <div className="col-md-8">
                                <label htmlFor="veiculo" className="form-label">Veículo</label>
                                <input type="text" className="form-control" id="veiculo" value={veiculo}
                                       onChange={(e) => setVeiculo(e.target.value)}/>
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="potencia" className="form-label">Potência</label>
                                <input type="text" className="form-control" id="potencia" value={potencia}
                                       onChange={(e) => setPotencia(e.target.value)}/>
                            </div>
                        </div>
                        <div className="container-fluid" style={{marginTop: "20px"}}>
                            <button onClick={() => salvarCarro()}>Salvar</button>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Home;