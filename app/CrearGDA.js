import React from 'react'
import update from 'react-addons-update'
import APIInvoker from './utils/APIInvoker'
import { browserHistory } from 'react-router'


function LiderList(props){
    //Retornar el html con todas las opciones <option> ...  //El estado con los líderes ya está establecido
     const listado = props.lideres.map((lider) =>
         <option key={lider.id} value={lider.nombre} ></option>
     );
     return listado
 }

class CrearGDA extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            agregado: false,
            lideres: [],
            filtrados: [],
            fdia: "",
            fhora: "",
            fsexo: "",
            fedad: "",
            idGda: null
        }
    }

    handleChange(e){  //Es para las listas y no para el input. (Los input usan 'onChange')
        e.preventDefault()
        let value = e.target.title  //Obtengo la nueva opción elegida
        let id = e.target.parentElement.parentElement.title //Obtengo el id del input a escribir. El mismo lo pongo en el <ul> como el atributo "title"
        console.log(id)
      //  console.log("El value: "+e.target.id)  //Ej: opLunes
        document.getElementById(id).value = value
        this.setState(update(this.state, {[id]: {$set: value}}))  //Se supone que actualiza el estado correcto 
        document.getElementById("errorField").innerText = ""  //Quito cualquier mensaje de error  
    }

    handleHourChange(e){
        let id = e.target.id  //fhora
        let value = e.target.value
        this.setState(update(this.state, {[id]: {$set: value}}))  //Se supone que actualiza el estado correcto 
        document.getElementById("errorField").innerText = ""  //Quito cualquier mensaje de error  
    }

  /*  onChange(e){
        e.preventDefault()
        let field = e.target.id
        let value = e.target.value
        let newState = update(this.state, { [field]: {$set: value} })
        this.setState(newState)
    } /*

    /*
    handleChange2(e){
        e.preventDefault()
        let id = e.target.title
      //  console.log("El value: "+e.target.id)  //Ej: opLunes
        document.getElementById('fhora').value = id.substring(2)
    }
    */

    AmPm(e){
        let newState
        newState = update(this.state, {pm: {$set: !this.state.pm}})
        this.setState(newState)
    }

    buscarLideres(e){
        let value = e.target.value  //Tengo el texto tipeado --> tengo que filtrar entre los líderes esto
        //Lo correcto no sería consultar el API cada vez que escribo, sino tener los líderes de antemano
                                    // y filtrar según el nombre que ya tengo 'value'
        
        this.setState(update(this.state, {filtrados: {$set: this.state.lideres.filter( //Establezco en el estado los filtrados
            lider => lider.nombre.includes(value))}}))
        
        document.getElementById("errorField").innerText = "" //Quito los posibles errores
    }

    CrearGDA(e) {
        e.preventDefault()

        if (this.state.fdia == "" || this.state.fedad == "" || this.state.fhora == "" || this.state.fsexo == "") {
            document.getElementById("errorField").innerText = "Error, verifique que los datos estén completos"
        }
        else if (this.state.filtrados.length != 1) { //No tengo un líder seleccionado
            document.getElementById("errorField").innerText = "Error, no hay líder seleccionado"
        }
        else {          
            let request = {
                "dia": this.state.fdia,
                "edad": this.state.fedad,
                "horario": this.state.fhora,
                "sexo": this.state.fsexo,
                "lider": this.state.filtrados[0],
                "participantes": []  //Solo el líder
            }
            APIInvoker.invokePOST('/icb-api/v1/crearGDA', request, response => {
                //Transición de redirigiendo a "Ver GDA's"
                console.log("GDA Creado. Id: "+response.body.id+" Día: "+response.body.dia+" Líder: "+response.body.lider.nombre)
                let newState = update(this.state, {idGda: {$set: response.body.id}, agregado: {$set: true}})
                //El nuevo estado implica una nueva vista
                let persona = this.state.filtrados[0]
              
                let params= {
                    "persona": {
                        "id": persona.id,
                        "nombre": persona.nombre,
                        "apellido": persona.apellido,
                        "direccion": persona.direccion,
                        "bautismo": persona.bautismo,
                        "fecha_nacimiento": persona.fecha_nacimiento,
                        "rol": persona.rol,
                    },
                    "gda": {
                        "id": response.body.id  //id del GDA recién creado
                    }
                }

                APIInvoker.invokePOST('/icb-api/v1/gda/participante', params, response => {
                    // El líder ahora es participante también
                },
                error => {
                    document.getElementById("errorField").innerText = "Error: "+error.message
                })
                this.setState(newState)
                //mando al socket para que se actualize el menú. Necesito el id del chat
                let idChat = "adm1"  //Los administradores son los que pueden recibir este mensaje
                let mensaje = {
                    notificacion: "Nuevo GDA creado. Líder: "+response.body.lider.nombre,
                    persona: response.body.lider,
                    tipo: 'gda'+response.body.id,
                    mensaje: null //
                }
                this.props.socket.emit('addOptionMiGda', mensaje, idChat)
            },
            error=> {
                document.getElementById("errorField").innerText = "Error: "+error.message
                if(error.status == 401){
                    alert("Debe iniciar sesión para realizar estas operaciones")
                    window.location = ('/')
                }
                document.getElementById("errorField").innerText = "Error: "+error.message
            })
        }
    }

    componentDidMount(){
        //Consultar el API para traer a todos los líderes.
        APIInvoker.invokeGET('/icb-api/v1/findLideres', response => {
            this.setState(update(this.state, { lideres: { $set: response.body },
                filtrados: {$set: response.body} }))
        },
        error => {
            if(error.status == 401){
                alert("Debe iniciar sesión para realizar estas operaciones")
                window.location = ('/')
            }
            else{
                document.getElementById("errorField").innerText = "Error: "+error.message
            }
        })
    }

    verGda(e){
        e.preventDefault()
        browserHistory.push('/MainApp/verGDAs')  // Próximamente
    }

    resetear(){
        
        let newState;
        newState = update(this.state, {agregado: {$set: false}, pm: {$set: true}, filtrados: {$set: false}, 
            fdia: {$set: ""}, fhora: {$set: ""}, fsexo: {$set: ""}, fedad: {$set: ""}})

        document.getElementById('fhora').value =  ""
        document.getElementById('fdia').value =  ""
        document.getElementById('fedad').value =  ""
        document.getElementById('fsexo').value =  ""
        document.getElementById('liderDatalist').value =  ""

        this.setState(newState)
    }

    borrar(e){
        e.preventDefault()
        APIInvoker.invokeDELETE('/icb-api/v1/borrarGda/'+this.state.idGda, response => {
            alert("GDA Borrado: "+response.ok)
            
            this.resetear() // Se encarga también de que el mensaje en la pantalla sea el correcto
        },
        error => {
            alert("Error: "+error.message)
        })
    }

    render(){
        
        return(
            <div className="infoApp container-fluid">

                <br />
                <h4>{this.state.agregado? "GDA Creado" : "Complete el formulario y luego de click en crear"}</h4>
                <br />
                <blockquote className="text-center">
                    <h6 className="text-white" id="errorField"></h6>
                </blockquote>
                <div className="dropdown row justify-content-center mb-1 mt-3">
                    <div className="col-md-2 col-3 gx-0">
                        <button className="btn btn-light dropdown-toggle boton" type="button" id="dropdownDiaButton" data-bs-toggle="dropdown" aria-expanded="false">
                            Día
                        </button>
                        <ul className="dropdown-menu" title="fdia" aria-labelledby="dropdownDiaButton">
                            <li><span className="dropdown-item" title="Lunes" onClick={this.handleChange.bind(this)} >Lunes</span></li>
                            <li><span className="dropdown-item" title="Martes" onClick={this.handleChange.bind(this)} >Martes</span></li>
                            <li><span className="dropdown-item" title="Miércoles" onClick={this.handleChange.bind(this)} >Miercoles</span></li>
                            <li><span className="dropdown-item" title="Jueves" onClick={this.handleChange.bind(this)} >Jueves</span></li>
                            <li><span className="dropdown-item" title="Viernes" onClick={this.handleChange.bind(this)} >Viernes</span></li>
                            <li><span className="dropdown-item" title="Sábado" onClick={this.handleChange.bind(this)} >Sábado</span></li>
                        </ul>
                    </div>
                    <div className="col-md-6 col-9">
                        <input type="text" className="form-control" id="fdia" disabled={true}
                            aria-label="Text input with dropdown button"></input>
                    </div>
                </div>
                <div className="dropdown row justify-content-center mb-1">
                    <div className="col-md-2 col-3 gx-0 boton">
                        <button className="btn btn-light boton" type="button" aria-expanded="false">
                            Hora
                        </button>
                    </div>
                    <div className="col-md-6 col-9">
                        <input type="time" id="fhora" className="form-control" value={this.state.fhora} 
                        onChange={this.handleHourChange.bind(this)} />
                    </div>
                </div>
                <div className="dropdown row justify-content-center mb-1">
                    <div className="col-md-2 col-3 gx-0">
                        <button className="btn btn-light boton dropdown-toggle" type="button" id="dropdownEdadButton" data-bs-toggle="dropdown" aria-expanded="false">
                            Edad
                        </button>
                        <ul className="dropdown-menu" title="fedad" aria-labelledby="dropdownEdadButton">
                            <li><span className="dropdown-item" title="Adolescentes" onClick={this.handleChange.bind(this)} >Adolescentes</span></li>
                            <li><span className="dropdown-item" title="Jóvenes" onClick={this.handleChange.bind(this)} >Jóvenes</span></li>
                            <li><span className="dropdown-item" title="Adultos" onClick={this.handleChange.bind(this)} >Adultos</span></li>
                        </ul> 
                    </div>
                    <div className="col-md-6 col-9">
                        <input type="text" className="form-control" id="fedad" disabled={true}
                            aria-label="Text input with dropdown button"></input>
                    </div>
                </div>
                <div className="dropdown row justify-content-center mb-1">
                    <div className="col-md-2 col-3 gx-0">
                        <button className="btn btn-light boton dropdown-toggle" type="button" id="dropdownSexoButton" data-bs-toggle="dropdown" aria-expanded="false">
                            Sexo
                        </button>
                        <ul className="dropdown-menu" title="fsexo" aria-labelledby="dropdownSexoButton">
                            <li><span className="dropdown-item" title="Masculino" onClick={this.handleChange.bind(this)} >Masculino</span></li>
                            <li><span className="dropdown-item" title="Femenino" onClick={this.handleChange.bind(this)} >Femenino</span></li>
                        </ul> 
                    </div>
                    <div className="col-md-6 col-9">
                        <input type="text" className="form-control" id="fsexo" disabled={true}
                            aria-label="Text input with dropdown button"></input>
                    </div>
                </div>
                <div className="drowdown row justify-content-center mb-1">
                    <div className="col-md-2 col-3 gx-0">
                        <button className="btn btn-light boton" type="button" aria-expanded="false">
                            Líder
                        </button>
                    </div>
                    <div className="col-md-6 col-9" title="flider">
                        {/* <label htmlFor="exampleDataList" className="form-label">Datalist example</label> */}
                        <input className="form-control" list="datalistOptions" id="liderDatalist" placeholder="Type to search..."
                            onChange={this.buscarLideres.bind(this)} />
                        <datalist id="datalistOptions" >
                            <LiderList lideres={this.state.lideres} />
                        </datalist>
                    </div>
                </div>
                {!this.state.agregado?
                <div className="dropdown row justify-content-center mb-1">
                    <div className="col-md-6 col-6 gx-0 mt-3">
                        <button className="btn btn-primary" type="button" onClick={this.CrearGDA.bind(this)}>
                            Crear GDA
                        </button>
                    </div>
                </div>
                :  
                <div className="row justify-content-center">
                    <br />
                    
                    <div className="col-md-7 col-7 mt-3">
                        <button className="btn btn-primary mb-2 me-1" type="button" onClick={this.verGda.bind(this)}>
                            Ver GDA's
                        </button>
                    
                        <br />
                        <button className="btn btn-success mb-2 me-1" type="button" onClick={this.resetear.bind(this)}>
                            Crear Nuevo
                        </button>
                        <button className="btn btn-primary mb-2 me-1" type="button" onClick={this.borrar.bind(this)}>
                            Borrar
                        </button>
                    </div>
                </div>  
                }
            </div>
        )
    }

}
export default CrearGDA;