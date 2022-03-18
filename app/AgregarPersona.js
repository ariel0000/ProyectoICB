import React from 'react'
import APIInvoker from './utils/APIInvoker'
import update from 'react-addons-update'
import {browserHistory} from 'react-router'

class AgregarPersona extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            personaSeleccionada: null,
            filtroNombre: "",
            personasFiltradas: []
        }
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    componentDidMount(){
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside(event){
        //Cuando click fuero de la parte del Modal visible
        console.log("Click Juera")
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)){ //Click afuera
            document.removeEventListener('mousedown', this.handleClickOutside);
            document.body.classList.remove('modal-mode');
            browserHistory.goBack(-1)
        }
    }

    handleChange(e){
        //Por ahora solo manejo el valor del input del nombre
        e.preventDefault()
        
        let newState;
        let value = e.target.value
        if(value){  // Se supone que, si el valor no tiene nada el if lo toma como 'false'
            if(value.length > 3){
            APIInvoker.invokeGET('/icb-api/v1/findByNombre/'+value, response => {
                document.getElementById("errorCamp").innerText = ""
                newState = update(this.state, {filtroNombre: {$set: value},
                personasFiltradas: {$set: response.body}});
                this.setState(newState)
            },
            error => {
                if (error.status == 401){
                    alert("Debe iniciar sesión para poder entrar aquí")
                    window.localStorage.removeItem("token")
                    window.localStorage.removeItem("codigo")
                    window.location = ('/')
                }
                document.getElementById("errorCamp").innerText = error.message
            })
            }
            else{
                newState = update(this.state, {filtroNombre: {$set: value}})
                this.setState(newState)
            }
        }
        else{
            document.getElementById("errorCamp").innerText = "Ingrese un valor"
            newState = update(this.state, {filtroNombre: {$set: value}})
            this.setState(newState)
        }
    }

    handleClose(e){
        document.removeEventListener('mousedown', this.handleClickOutside);
        document.body.classList.remove('modal-mode');
        browserHistory.goBack(-1)   //El -1 nosepaqe
    }    

    componentWillUnmount(){
        document.removeEventListener('mousedown', this.handleClickOutside );
    }

    handleSelect(idPer){
        //Función que se encarga de actualizar el estado con la persona seleccionada
        let newState = update(this.state, {personaSeleccionada:{$set: idPer}})
        this.setState(newState);
    }

    render(){
        return(
            <div className="AgregarPersona" >
                <div className="persona-detail infoApp container-fluid" ref={this.setWrapperRef.bind(this)}>
                    <div className="d-block p-2">
                        <blockquote className="text-center">
                            <h6>{this.props.accion}</h6>
                        </blockquote>
                    </div>
                    <div className="row align-items-center justify-content-center">
                        <div className="col-12 col-md-8 mt-2 successLabel">
                            <blockquote className="text-center">
                                <h6>{this.props.successLabel}</h6>
                            </blockquote>
                        </div>
                    </div>
                    <div className="row align-items-center justify-content-center" >
                        <div className="col-12 col-md-8 mt-2 justify-content-center align-items-center">
                            <blockquote className="text-center">
                                <h6 id="errorCamp">{this.props.errorLabel}</h6>
                            </blockquote>
                        </div>
                    </div>
                    <div className="row align-items-center justify-content-center">
                        <div className="col-7 m-2 mb-4">
                            <input type="text" className="form-control" placeholder="Ingrese nombre" onChange={this.handleChange.bind(this)} />
                        </div>
                    </div>
                    <div className="row align-items-center justify-content-center" >
                        <div className="col-auto m-1">
                            <For each="persona" index="index" of={this.state.personasFiltradas}>
                                <button className="btn btn-success me-1" aria-current="true" key={persona.id} 
                                onClick={() => {this.handleSelect(persona.id) }}>
                                    {persona.nombre}&nbsp;{persona.apellido}
                                </button>
                            </For>
                        </div>
                    </div>
                    <div className="row align-items-center justify-content-center" >
                        <div className="col-auto m-2">
                            <button className="btn btn-secondary" onClick={this.handleClose.bind(this)} >
                                Cerrar
                            </button>
                        </div>
                        {this.state.personaSeleccionada?
                        <div className="col-auto m-2">
                            <button className="btn btn-info text-white mb-2" onClick={()=> {this.props.addPer(this.state.personaSeleccionada)}} >
                                Agregar Persona
                            </button>
                        </div>
                        :
                        <span></span>
                        }
                    </div>
                </div>
            </div>
        )
    }
}
AgregarPersona.defaultProps = {
    accion: "Agregar Persona"
}

export default AgregarPersona;