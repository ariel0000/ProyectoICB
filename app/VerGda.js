import React from 'react'
import { browserHistory } from "react-router"
import APIInvoker from './utils/APIInvoker'
import update from 'react-addons-update'
import {AiOutlinePlusCircle} from "react-icons/ai"
import { IconContext } from "react-icons";

class VerGda extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            idGda: this.props.params.gda,
            gda: null,
            error: ""
        }
    }

    componentDidMount() {
        let newState;
        APIInvoker.invokeGET('/icb-api/v1/gda/' + this.state.idGda, response => {
            newState = update(this.state, { gda: { $set: response.body } })   //En el body está el GDA
            this.setState(newState)
        },
            error => {
                if (error.status == 401) {
                    alert("Debe iniciar sesión para poder entrar aquí")
                    browserHistory.push("/MainApp")
                    console.log('Error, no hay usuario autenticado')
                }
                else {
                    document.getElementById("errorField").innerText = "Error: " + error.message
                }
            })
    }

    VerTodos() {
        // Regirigir a "VerGda's"
        browserHistory.push('/MainApp/verGDAs')
    }

    AgregarPersona(idPer){
        //Esta es la función que se pasa como prop al componente Modal "AgregarPersona"
        let newState
        APIInvoker.invokeGET('/icb-api/v1/findById/'+idPer, response => {
            if(response.body.gda){  //Si es distinto de null --> Tengo que ver si es igual al "gda" que estoy modificando
                if(response.body.gda.id == parseInt(this.state.idGda)){ 
                    //Si tiene el mismo id --> Estoy agregando una persona que ya está en el gda
                    document.getElementById('errorField').innerText = "La persona que intenta agregar ya está en este GDA"
                }
                else{ /* Si la persona tiene gda pero no es igual al que estoy editando tengo que avisarle al usuario */
                    var r = confirm(response.body.nombre+" está en el GDA de: "+response.body.gda.lider.nombre+
                    ", ¿Desea cambiarlo al GDA de "+this.state.gda.lider.nombre)
                    if(r === true){
                        this.actualizarPersonaEnGda(this.state.gda.id, response.body)
                        newState = update(this.state, {gda: {participantes: {$push: [response.body]}}}); //Agrego la persona a participantes
                        this.setState(newState)
                    }
                    else{
                        //No se actualiza la persona
                    }
                }
            }
            else{  /* Si el usuario tiene gda nulo --> puedo asignarlo sin problemas */
                this.actualizarPersonaEnGda(this.state.gda.id, response.body)
                newState = update(this.state, {gda: {participantes: {$push: [response.body]}}}); //Agrego la persona a participantes
                this.setState(newState)
            }
        },
        error => {
            document.getElementById("errorField").innerText = "Error: "+error.message;
        })
    }

    findIndexOfParticipante(idPer){
        //Encuentro el índice del participante en el GDA -- Luego se retorna para la función "splice" de arriba
        let indice = null
        for (let index = 0; index < this.state.gda.participantes.lenght; index++){
            const participante = array[index]
            if(participante.id == idPer){
                break;
            }
            indice = index  //Podría retornar el index también
        }
        return indice
    }

    actualizarPersonaEnGda(idGda, request){
        let params = this.armarParametros(idGda, request)
        APIInvoker.invokePUT('/icb-api/v1/persona', params, response => {
            alert("GDA Actualizado")
            document.getElementById("errorField").innerText = ""
        },
        error => {
            document.getElementById("errorField").innerText = "Error: "+error.message
        })
    }

    armarParametros(idGda, request){
        if(idGda){ //Si es distinto de nulo
            let params= {
                "id": request.id,
                "nombre": request.nombre,
                "apellido": request.apellido,
                "direccion": request.direccion,
                "bautismo": request.bautismo,
                "fecha_nacimiento": request.fecha_nacimiento,
                "rol": request.rol,
                "gda": {
                    "id": idGda
                }
            }
        return params;
        }
        else{
            let params= {
                "id": request.id,
                "nombre": request.nombre,
                "apellido": request.apellido,
                "direccion": request.direccion,
                "bautismo": request.bautismo,
                "fecha_nacimiento": request.fecha_nacimiento,
                "rol": request.rol,
                "gda": null
            }
            return params;
        }
    }

    handleAgregarPersona(e){
        e.preventDefault()
        /* Se encarga de preparar este componente para que muestre el componente Modal "AgregarPersona" en el próximo renderizado
        $( "html" ).addClass( "modal-mode" );  --No Anda porque no tengo jquery en este proyecto (jquery = nobatoide) */
        document.body.classList.add('modal-mode');
        
        browserHistory.push("/MainApp/verGDAs/"+this.state.idGda+"/addOne")
    }   

    handleEditar(e){
        
        e.stopPropagation()
        alert("Estoy en el handle Editar ")
    }

    handleBorrar(e){
        //Borra la persona del GDA, preguntando antes si está seguro
        e.preventDefault()
        let id =  e.target.parentElement.parentElement.parentElement.title
        let value = e.target.title
        let idPer = parseInt(id) //Lo convierto en entero
        let persona = null;
        this.state.gda.participantes.forEach(function(per){
            if(per.id == idPer){
                persona = per
            }
        });
        var r = confirm("¿Está seguro que desea quitar del GDA a: "+value)
        if(r === true & persona != null){
            this.actualizarPersonaEnGda(null, persona)  //Paso el parámetro idGda en null
            let i = this.findIndexOfParticipante(idPer)
            let newState = update(this.state, {gda: {participantes: {$splice: [[i, 1]]}}});  //Borro un elemento a partir del index "i"
            this.setState(newState);
        }
        else{
            //
        }
    }

    render() {
        let handleAddPer = this.handleAgregarPersona
        let gda = this.state.gda
        let letra = 'o'
        let edad
        if(gda != null){
            edad = gda.edad  //Adolescentes, Jóvenes o Adultos
            if(gda.sexo != "Masculino"){
                letra = 'a'
            }
        }

        let childs = this.props.children && React.cloneElement(this.props.children, {addPer: this.AgregarPersona.bind(this),
        accion: "Agregar Persona a GDA"});
        
        return (
            <IconContext.Provider value={{size: "1.5em"}} >
            <div className="infoApp">
                <Choose>
                    <When condition={this.state.gda != null} >
                        <blockquote className="text-center">
                            <h6 className="text-white" id="errorField">{this.state.error}</h6>
                        </blockquote>
                        <div className="row align-items-center justify-content-center gx-4 mb-2">
                            <div className="col-auto col-sm-3 mt-1 gx-0 alineacion"  >
                                <div className={gda.sexo == "Masculino" ? "parent lider hombre " : "parent lider mujer"}>
                                    {gda.lider.nombre}
                                </div>
                                <button className="btn btn-success mt-2" onClick={this.handleEditar.bind(this)}>
                                    Editar
                                </button>
                            </div>
                            <div className="col-auto col-sm-4 p-1 info-verGDA">
                                
                                <p className="">Este GDA se lleva a cabo </p>
                                <p> los días {gda.dia} a las {gda.horario}{gda.pm ? " pm" : " am"} </p>
                                <p> y es para {gda.sexo=="Masculino" ? "Varones" : "Mujeres"} 
                                {gda.edad=="Adultos" ? " Adult"+letra+"s"
                                : " "+edad}</p>
                            </div>
                        </div>
                        <div className="row align-items-center justify-content-center gx-3">
                            <div className="col-12 mt-3">
                                <blockquote className="text-center mb-1">
                                    <h6 className="text-white" id="errorField">Participantes: </h6>
                                </blockquote>
                            </div>
                            <For each="participante" index="index" of={gda.participantes}>
                                <div className="col-auto m-1" key={participante.id} title={participante.id}>
                                    <button type="button" className={gda.sexo=="Masculino"? "btn btn-info text-light dropdown-toggle" : 
                                        "btn btn-info text-light dropdown-toggle"} type="button" data-bs-toggle="dropdown">
                                        {participante.nombre}&nbsp;{participante.apellido}
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li><a className="dropdown-item" href="#">Ver Info</a></li>
                                        <li><a className="dropdown-item" title={participante.nombre} href="#"
                                            onClick={this.handleBorrar.bind(this)}>Borrar</a></li>
                                    </ul>
                                </div>
                            </For>
                            <div className="col-12 m-1" >
                                <button type="button" className="btn btn-success" onClick={handleAddPer.bind(this)}>
                                    {/* Mediante Bootstrap y su js abro la ventana */}
                                    <AiOutlinePlusCircle  />
                                    &nbsp; Agregar Persona
                                </button>
                            </div>
                        </div>
                        <div className="row align-items-center justify-content-center">
                            <div className="col-auto p-2">
                                <div className="div-buttonsVerGda">
                                    <button type="button" className="btn btn-primary m-1" onClick={this.VerTodos.bind(this)}>
                                        Ver Todos
                                    </button>
                                </div>
                            </div>
                        </div>
                    </When>
                    <Otherwise>
                        <div className="row align-items-center justify-content-center">
                            <div className="col-auto">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Cargando...</span>
                                </div>
                            </div>
                        </div>
                    </Otherwise>
                </Choose>
                <div className="infoApp">
                    {childs}
                </div>
            </div>
            </IconContext.Provider>
        )
    }
}

export default VerGda;
