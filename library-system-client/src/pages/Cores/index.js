import {React, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {toast} from "react-toastify";
import carsystem_api from "../../services/carsystem_api"
import "./cores.css"


function Cores() {
    const {rule} = useParams();
    const [cores, setCores] = useState([]);
    const [id, setId] = useState(0);
    const [cor, setCor] = useState("");
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
                    await carsystem_api.get("/api/v1/color")
                        .then(response => {
                            setCores(response.data);
                            setLoading(false);

                            localStorage.setItem("@cores", JSON.stringify(cores))
                        })
                        .catch(reason => {
                            toast.error(`Falha na abertura das cores, erro ${reason.error}`)
                        });
                }
                recuperarCategorias();
                break;
            case 'create':
                setLoading(false)
                break;
            case 'edit':
                const corEdit = localStorage.getItem("cor");
                if (corEdit !== undefined && corEdit !== '') {
                    let corEditAsObject = JSON.parse(corEdit);
                    setId(corEditAsObject.id);
                    setCor(corEditAsObject.description)
                }
                setLoading(false);
                break;
            default :
                break;
        }
    }, [cores, rule]);

    function salvarCor() {
        if (cor === undefined || cor === '') {
            toast.warn('Informe da cor');
            document.getElementById('name').focus();
        } else {
            let corDto = {
                id: id,
                description: cor
            }
            if (id === 0) {
                corDto.id = null;
                console.log(corDto);

                async function create() {
                    await carsystem_api.post("/api/v1/color", JSON.stringify(corDto))
                        .then(response => {
                            toast.info(`Registro criado ${corDto.description}!`);
                            window.location.href = '/cores/list';
                        })
                        .catch(reason => {
                            toast.error(`Falha no registro da cor ${corDto.description}`);
                        });
                }

                create();
            } else {
                async function update() {
                    await carsystem_api.put("/api/v1/color", JSON.stringify(corDto))
                        .then(response => {
                            toast.info(`Registro alterado ${corDto.description}!`);
                            window.location.href = '/cores/list';
                        })
                        .catch(reason => {
                            toast.error(`Falha na alteracao do registro da cor ${corDto.description}`);
                        });
                }

                update();
            }
        }
    }

    function editMarca(cor) {
        localStorage.setItem("cor", JSON.stringify(cor));
        window.location.href = "/cores/edit";
    }

    // function redirectToUser(){
    //     window.location.href = '/usuario';
    // }

    if (loading) {
        return (
            <div className="loading">
                Carregando cores ...
            </div>
        )
    }
    return (
        <div className="container">
            {rule === 'list' &&
                cores.length === 0 &&
                <div>
                    <span>Você não possui cores cadastradas...</span><br/>
                    <Link to="/cores/create">Criar cor</Link>
                </div>
            }
            {rule === 'list' && cores.length > 0 &&
                <div className="container-fluid">
                    <Link to="/cores/create" style={{float: 'right'}}>Criar cor</Link>
                    <table className="table table-striped" width={'100%'}>
                        <thead>
                        <tr>
                            <td>Id</td>
                            <td>Cor</td>
                            <td></td>
                        </tr>
                        </thead>
                        <tbody>
                        {cores.toSorted((a, b) => a.description.localeCompare(b.description)).map(cor =>
                            <tr key={cor.id}>
                                <td width={'5%'}>{cor.id}</td>
                                <td width={'94%'}>{cor.description}</td>
                                <td width={'1%'}>
                                    <button onClick={() => editMarca(cor)}>Alterar</button>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            }
            {rule !== 'list' &&
                <div className="container-fluid">
                    <h1>Registro de Cores</h1>
                    <Link onClick={() => window.location.href = '/cores/list'}
                          style={{float: 'right'}}>Voltar</Link>
                    <label htmlFor="description">Informe a cor</label>
                    <input type="text" className="form-control" id="name" name="name" value={cor}
                           onChange={e => setCor(e.target.value)}/>
                    <div className="area-buttons">
                        <button onClick={() => salvarCor()}>Salvar</button>
                    </div>
                </div>
            }
        </div>
    )
}

export default Cores;