import React from 'react'
import Chat from './Chat'
import APIInvoker from './utils/APIInvoker'
import update from 'react-addons-update'   

class GDA extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            idGda: this.props.params.gda,
            GDA: null,
            mensajes:[]
        }
    }

    componentDidMount(){
        this.consultarMensajes(0)
        this.cargarGDA()
    }

    reload = ()=>{
        console.log('La Locación:'+window.location)
        const current = window.location.pathname; 
        this.props.router.replace('/reload')
  
        setTimeout(() => {
            this.props.router.replace(current)
        }, 0);
    }

    cargarGDA(){
        //Carga el estado GDA de este componente con el GDA correspondiente
        let newState
        APIInvoker.invokeGET('/icb-api/v1/gda/'+this.state.idGda, response => {
            newState = update(this.state, {GDA: {$set: response.body}})
            this.setState(newState)
        },
        error => {
            console.log('Error: '+error.message)
        })
    }

    consultarMensajes(nPage){
        //tengo que cargar los mensajes que corresponden a este GDA. 
        // El componente CHAT se encargará de consultar esta función pasada como prop
        let newState, newMsjs
        APIInvoker.invokeGET('/icb-api/v1/gda/mensajes/'+this.props.params.gda+'/?pageNumber='+nPage+'&pageSize=18',
            response => {
                if(this.state.mensajes != []){ //Evito hacer reverse() de un array nulo
                    newMsjs = this.state.mensajes.reverse() //Lo doy vuelta porque dsps se vuelve 
                    // a dar vuelta solo
                }
                newMsjs = this.state.mensajes.concat(response.body)
                newState = update(this.state, {mensajes: {$set: newMsjs}})
                this.setState(newState)
            },
            error=> {
                if (error.status == 401){
                    alert("Debe iniciar sesión para poder entrar aquí")
                    window.localStorage.removeItem("token")
                    window.localStorage.removeItem("codigo")
                    window.location = ('/')
                }
                console.log('Error: '+error.message)
            })
    }

    consultarUltimoMensaje(mensaje){
        //En vez de consultar al API por el último mensaje, lo recibo vía Socket y lo agrego al estado
        console.log()
        let newMensajes = this.state.mensajes.concat(mensaje).reverse()
        let newState = update(this.state, {mensajes: {$set: newMensajes}})  //Probablemente se gire
        this.setState(newState)
        /* APIInvoker.invokeGET('/icb-api/v1/gda/mensajes/'+this.props.params.gda+'/?pageNumber='+0+'&pageSize=1',
        response=> {
            callbackF(response.body)
        },
        error=> {
            console.log('Error: '+error.message)
        }) */
    }

    agregarMensaje(mensaje, callbackF){
        //Acá tendría que guardar el mensaje --> Luego el response con el mensaje guardado se carga en el estado
        let params = {
            "mensaje": mensaje.mensaje,  //También tengo el idper pero eso no me sirve acá
            "persona": {
                "id": this.props.profile.id,
                "rol": {
                    "id": this.props.profile.rol.id
                }
            },
            "gda": {
                "id": this.state.GDA.id,
                "lider": {
                    "id": this.state.GDA.lider.id,
                    "rol": {
                        "id": this.state.GDA.lider.rol.id
                    }
                }
            }
        }
        fetch('http://192.168.1.150:8080'+'/icb-api/v1/gda/mensaje', {
            method: 'POST',
            body: JSON.stringify(params),
            headers: {
                'Content-Type': 'application/json',
                authorization: 'Bearer '+window.localStorage.getItem("token")
            }
        })
        .then(res => res.json())
        .then(json => {
            let newMensajes = this.state.mensajes.concat(json.body).reverse()//Siempre se da vuelta. 24
            let newState = update(this.state, {mensajes: {$set: newMensajes}}) //[0, 0, json.body]
            this.setState(newState) //Cambia el orden de los mensajes
            callbackF(json.body, 'Nuevo mensaje en GDA de: '+this.state.GDA.lider.nombre) 
            //el callback incluye el mensaje tal cual es guardado en la BdD
        })
        .catch(err => {
            console.log('ERROR AL GUARDAR NUEVO MENSAJE: '+err.message)
        })
    }

/*    addMsg(mensaje){
        let respuesta = this.agregarMensaje(mensaje) //Retorno un Promise (una Promesa)
        console.log('typeOff: '+typeof(respuesta))
        respuesta
            .then(msgsRta => {
                let newState = update(this.state, {mensajes: {$splice: [[0, 0, msgsRta]]}})
                this.setState(newState) 
            })
            .catch(err => {
                console.log('Error: '+err)
            })
    }*/

    render() {
        return(
            <div className="infoApp cien-por-cien">
                <blockquote className="text-center mb-1 pb-1 mt-0">
                    <h6 className="text-white bg-danger rounded">Chat del GDA</h6>
                </blockquote>
                <div className="container-fluid">
                    <div className="row justify-content-center align-items-center mt-1">
                        <div className="col-sm-9 col-xs-12 gx-2">
                            <Chat idpersona={this.props.profile.id} 
                                id={"gda"+this.props.params.gda} reload={this.reload.bind(this)}
                                getMensajes={this.consultarMensajes.bind(this)} 
                                mensajes={this.state.mensajes} addMsg={this.agregarMensaje.bind(this)} 
                                lastMsj={this.consultarUltimoMensaje.bind(this)} 
                                socket= {this.props.socket} pathname={this.props.location.pathname} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default GDA;