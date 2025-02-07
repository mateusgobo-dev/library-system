import {React, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {toast} from "react-toastify";
import carsystem_api from "../../services/carsystem_api"
import "./marcas.css"


function Marcas() {
    const {rule} = useParams();
    const [marcas, setMarcas] = useState([]);
    const [id, setId] = useState(0);
    const [marca, setMarca] = useState("");
    const [loading, setLoading] = useState(true);

    // const profile = localStorage.getItem("@profile")
    // if(profile === null){
    //     toast.warn("Realize seu cadastro ou efetue o login para acessar as áreas do sistema...");
    //     setTimeout(redirectToUser, 3000);
    // }

    useEffect(() => {
        switch (rule) {
            case 'list':
                async function recuperarMarcas() {
                    await carsystem_api.get("/api/v1/brand")
                        .then(response => {
                            setMarcas(response.data);
                            setLoading(false);

                            localStorage.setItem("@marcas", JSON.stringify(marcas))
                        })
                        .catch(reason => {
                            toast.error(`Falha na abertura das marcas, erro ${reason.error}`)
                        });
                }

                recuperarMarcas();
                break;
            case 'create':
                setLoading(false)
                break;
            case 'edit':
                const marcaEdit = localStorage.getItem("marca");
                if (marcaEdit !== undefined && marcaEdit !== '') {
                    let marcaEditAsObject = JSON.parse(marcaEdit);
                    setId(marcaEditAsObject.id);
                    setMarca(marcaEditAsObject.name)
                }
                setLoading(false)
                break;
            default :
                break;
        }
    }, [marcas, rule]);

    function salvarMarca() {
        if (marca === undefined || marca === '') {
            toast.warn('Informe da marca');
            document.getElementById('name').focus();
        } else {
            let marcaDto = {
                id: id,
                name: marca
            }
            if (id === 0) {
                marcaDto.id = null;

                async function create() {
                    await carsystem_api.post("/api/v1/brand", JSON.stringify(marcaDto))
                        .then(response => {
                            toast.info(`Registro criado ${marcaDto.name}!`);
                            window.location.href = '/marcas/list';
                        })
                        .catch(reason => {
                            toast.error(`Falha no registro da marca ${marcaDto.name}`);
                        });
                }

                create();
            } else {
                async function update() {
                    await carsystem_api.put("/api/v1/brand", JSON.stringify(marcaDto))
                        .then(response => {
                            toast.info(`Registro alterado ${marcaDto.name}!`);
                            window.location.href = '/marcas/list';
                        })
                        .catch(reason => {
                            toast.error(`Falha na alteracao do registro da marca ${marcaDto.name}`);
                        });
                }

                update();
            }
        }
    }

    function editMarca(marca) {
        localStorage.setItem("marca", JSON.stringify(marca));
        window.location.href = "/marcas/edit";
    }

    // function redirectToUser(){
    //     window.location.href = '/usuario';
    // }

    if (loading) {
        return (
            <div className="loading">
                Carregando marcas ...
            </div>
        )
    }
    return (
        <div className="container">
            {rule === 'list' &&
                marcas.length === 0 &&
                <div>
                    <span>Você não possui marcas cadastradas...</span><br/>
                    <Link to="/marcas/create">Criar marca</Link>
                </div>
            }
            {rule === 'list' && marcas.length > 0 &&
                <div>
                    <Link to="/marcas/create" style={{float: 'right'}}>Criar marca</Link>
                    <table className="table table-striped" width={'100%'}>
                        <thead>
                        <tr>
                            <td>Id</td>
                            <td>Marca</td>
                            <td></td>
                        </tr>
                        </thead>
                        <tbody>
                        {marcas.toSorted((a, b) => a.name.localeCompare(b.name)).map(marca =>
                            <tr key={marca.id}>
                                <td width={'5%'}>{marca.id}</td>
                                <td width={'94%'}>{marca.name}</td>
                                <td width={'1%'}>
                                    <button onClick={() => editMarca(marca)}>Alterar</button>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            }
            {rule !== 'list' &&
                <div>
                    <h1>Registro de Marcas</h1>
                    <Link onClick={() => window.location.href = '/marcas/list'} style={{float: 'right'}}>Voltar</Link>
                    <label htmlFor="description">Informe a descrição da marca</label>
                    <input type="text" className="form-control" id="name" name="name" value={marca}
                           onChange={e => setMarca(e.target.value)}/>
                    <div className="area-buttons">
                        <button onClick={() => salvarMarca()}>Salvar</button>
                    </div>
                </div>
            }
        </div>
    )
}

export default Marcas;