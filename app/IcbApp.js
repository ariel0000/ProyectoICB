import React from 'react'
import Toolbar from './Toolbar'
import Menu from './Menu'
import APIInvoker from  './utils/APIInvoker'
import update from 'react-addons-update'
import { browserHistory } from 'react-router'
import socket from './utils/Socket';  //Empieza estando conectado

class IcbApp extends React.Component {

    constructor() {
        super(...arguments)
        this.state = {

        }
    }

    componentDidMount(){
        socket.connect() //Inicializo el socket - 
        socket.on('connect_error', function() {  //Nunca pasó pero también debería recargar
            console.log('Failed to connect to server');
            window.location = ('/')
        });
        // todo el resto de componentes se encargarán de registrar sus propios eventos.
      
        // Aquí hay que comprobar el login (token y codigo, Con la ayuda de algún servicio del API)
        //Si es valida la sesión --> se tiene que configurar el estado con los datos que necesitaremos de la persona
        // Por el contrario, el 'profile: null' será suficiente para que Menú sepa que no se ha inicia sesión
        let token = window.localStorage.getItem("token")
        let codigo = window.localStorage.getItem("codigo")
        if(token == null){
            //No ha iniciado sesión --> Nose, xD. No redirigo a Iniciar Sesión, pero podría redirigir a la explicación
            this.setState(update(this.state, {profile: {$set: undefined}}))
            browserHistory.push('/MainApp/comoFunciona')
        }
        else{  //Si el token no es nulo --> Consulto el API para ver si el token y el código son válidos
            APIInvoker.invokeGET('/icb-api/v1/relogin', response => {
                window.localStorage.setItem("token", response.body.token) //El nuevo token
                window.localStorage.setItem("codigo", response.body.codigo)
                APIInvoker.invokeGET('/icb-api/v1/usuario/'+codigo, response => {  //APIInvooker anidado :O
                    let estado = response.body
                    let fechaVioNotif = new Date(response.body.sesion.vio_notificacion)
                    let fechaUltimaVezOnline = new Date(response.body.sesion.ultima_vez_online)
                    estado.sesion.vio_notificacion = new Date(fechaVioNotif.getTime()) //Hora de Argentina
                    estado.sesion.ultima_vez_online = new Date(fechaUltimaVezOnline.getTime())
                    this.setState(update(this.state, { profile: { $set: estado } }))
                    browserHistory.push('/MainApp/bienvenido')
                },
                error => {
                    alert("Error al consultar usuario"+error.message);  //Error al consultar "obtenerDatosPorCódigo"
                })
            },
            error => {  //Cuando el token es inválido
                window.localStorage.removeItem("token")
                this.setState(update(this.state, {profile: {$set: undefined}}))
                window.location = ('/')
            })
        }
    }

    actualizarEstado(target, valor){
        // Función pasada como prop para que permita actualizar el estado (profile) y renderizar los componentes
        let newState = update(this.state, {profile: {[target]: {$set: valor}}})
        this.setState(newState)
    }

    render() {
     //   let menu = this.state.menu
        let esCelu = false
        if (window.innerWidth < 577) {
            esCelu = true
        }
        let childs = this.props.children && React.cloneElement(this.props.children, {profile: this.state.profile, 
            socket: socket, esCelu: esCelu})
        return (
            <div className="container-fluid px-2 div-principal">
                {this.state.profile != null?
                    <Toolbar perfil={this.state.profile} socket={socket} pathname={this.props.location.pathname}
                    actualizarEstado={this.actualizarEstado.bind(this)} />
                :
                    <Toolbar />
                }
                <div className="row gx-0">  {/* En la misma 'row' tengo al Menú y al MainApp */}
                {this.state.profile != null?
                    <Menu esCelu={esCelu} perfil={this.state.profile} socket={socket} />
                    :
                    <Menu esCelu={esCelu} />
                }
                    {childs}  {/* Esta incluído MainApp */}
                </div>
                <div id="dialog" className="row">
                    <div className="container">

                    </div>
                </div>
            </div>
        )
    }
}
export default IcbApp;