import React from 'react';
import { FaBell, FaBellSlash, FaBars} from 'react-icons/fa'
//import {GrLogin} from 'react-icons/gr'
import { browserHistory } from 'react-router'
import { IconContext } from "react-icons";
import update from 'react-addons-update'
import socket from './utils/Socket';
/* Podría definir un css e importarlo como lo hice en Index.js */

class Toolbar extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            letNotification: true,
            notificaciones: []
        }
    }

    componentDidMount(){
        this.prepararSocket
        socket.on('notificacion', (mensaje) => {
                this.nuevaNotificacion("Nuevo mensaje en el gda de: "+mensaje.gda.lider.nombre)
        })
        let newState
        if(Notification.permission === "granted"){
            //dejo el true en letNotification
        }
        else{
            newState = update(this.state, {letNotification: {$set: false}})
        }
        this.setState(newState)
        
    }

    redirigir(e){
        e.preventDefault()
        browserHistory.push('/login')
    }

    prepararSocket(){
        //Inicializa el socket y me uno a las rooms correspondientes
        this.inicializarNotificaciones()
    }

    inicializarNotificaciones(){
        // Verifico si hay usuario logueado y recién dsps inicializo
        socket.connect()
        if(this.props.perfil != undefined){
            let rooms = this.obtenerIdRooms()
            socket.emit('conectado', [rooms])
        }
    }

    obtenerIdRooms(){
        //Obtengo las rooms de los gda, los eventos, los aleatorios, etc...
        // let tipoDeRooms = []  //gda, evento, especial, ....
        let rooms = []
        let gdas = this.props.perfil.gdas
        rooms.push(this.agregarRooms(gdas, "gda"))
    }
    
    agregarRooms(arrayRooms, tipo){ //tipo = "gda" | "evento" | "private_chat"
        let rooms = []
        //Dsps tendría que recorrer el array de los tipos de rooms con el siguiente 'for' dentro
        for(let i = 0; i <= arrayRooms.length-1; i++){
            rooms.push(tipo+""+arrayRooms[i].id) //tomo el id del gda, evento, o lo que sea
        }
        return rooms
    }

    notify(e){
        e.preventDefault()
        let newState
        function checkNotificationPromise() { //Para las vers. que no son compatibles con el Promise
            try {
              Notification.requestPermission().then();
            } catch(e) {
              return false;
            }
            return true;
        }

        if(!("Notification" in window)){
            alert("Tu navegador no soporta notificaciones");
        }
        else if(checkNotificationPromise()){
            Notification.requestPermission().then((result) => {
            newState = update(this.state, {letNotification: {$set: !this.state.letNotification}})
            this.setState(newState)
            
        })
        }
        else{
            Notification.requestPermission(function(){
                newState = update(this.state, {letNotification: {$set: !this.state.letNotification}})
                this.setState(newState)
            })
        }
        
    }

    nuevaNotificacion(mensaje){
        //Creo una nueva notificación según corresponda.
        const options = {
            style:{
                main: {
                    background: "#31d2f2",
                    color: "white",
                    position: 'fixed', 
                    left: '0px',
                    right: '0px',
                    bottom: '0px'
                }
            },
            settings: {
                duration: 5000
            }
        }
        iqwerty.toast.toast(mensaje, options);
    }

    render() {
        
    return (
        <IconContext.Provider value={{size: "15px"}}>
        <div className="row toolbar">
            <div className="col-xs-12 col-sm-12 col-md-12">
                <div className="d-flex justify-content-end text-primary bg-white align-items-center">
                    <div className="me-auto p-1 bd-highlight order-1 order-sm-0 order-md-0" >
                        <Choose>
                            <When condition={this.props.perfil != undefined}>  {/* Hay usuario logeado */}
                            <label htmlFor={"notificador"} className="btn btn-white text-primary">
                                {this.state.letNotification ?
                                    <FaBell />
                                    :
                                    <FaBellSlash style={{ maxWidth: 100 + 'px' }} />
                                }
                            </label>
                            <input href="#" className="d-none" accept=".gif, .jpg, .png, .bmp" type="button"
                            id={"notificador"} onClick={this.notify.bind(this)}></input>
                            <label htmlFor={"barrasNotif"} className="btn btn-white text-primary m-1">
                                <FaBars />
                            </label>
                            <input href="#" className="d-none" accept=".gif, .jpg, .png, .bmp" type="button"
                                id={"barrasNotif"}></input>

                            </When>
                        <Otherwise>
                            {/* No hay usuario logueado */}
                            <span className='text-primary' >Bienvenido</span>
                        </Otherwise>
                        </Choose>
                    </div>
                    <div className="me-auto p-1 order-sm-1 order-2 order-md-1" >
                        <img src="/img/IcbBanner.png" alt="Banner" style={{ maxHeight: 45 + 'px' }} />
                    </div>
                    <div className="p-1 bd-highlight order-3 order-sm-2 order-md-2">
                        <Choose>
                            <When condition={this.props.perfil != undefined}>
                                <span>
                                    Hola {this.props.perfil.nombre} !
                                </span>
                            </When>
                            <Otherwise>
                                <span>
                                    Sin Logearse
                                </span>
                            </Otherwise>
                        </Choose>
                        {/*<label htmlFor={"perfil"} className="btn btn-light ">
                            <GrLogin />
                            <input href="#" className="d-none" type="button" 
                            id={"login"} onClick={this.redirigir.bind(this)}></input>
                        </label> */}
                    </div>
                </div>
            </div>
        </div>
        </IconContext.Provider>
        )
    }

}
export default Toolbar;