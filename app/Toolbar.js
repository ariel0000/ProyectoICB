import React from 'react';
import { FaBell, FaBellSlash, FaBars, FaHome} from 'react-icons/fa'
//import {GrLogin} from 'react-icons/gr'
import { browserHistory } from 'react-router'
import { IconContext } from "react-icons";
import update from 'react-addons-update'
import socket from './utils/Socket';
import APIInvoker from './utils/APIInvoker'
import {saveNotification} from './utils/metodosAPI'
/* Podría definir un css e importarlo como lo hice en Index.js */

class Toolbar extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            letNotification: true,
            notificaciones: [],
            mapaDeUrls: new Map([
                ['gda', '/MainApp/verGDAsEdit/'],
                ['evento', '/MainApp/verEvento/'],
                ['noticia', '/MainApp/verNoticia/'],
                ['newgda', '/MainApp/verGDAs']
            ])
            /* 
            let userRoles = new Map([
    [john, 'admin'],
    [lily, 'editor'],
    [peter, 'subscriber']
]); */
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.perfil != this.props.perfil){
            //Hago esta comparación acá porque en DidMount el prop es nulo
            this.prepararSocket()
        }
     }

    componentDidMount(){
     //   this.prepararSocket() - Lo saco de acá y lo paso a componentDidUpdate
        socket.on('msg_notificacion', (mensaje) => { //mensaje es un objeto --> Ver GDA línea 117
            this.agregarMsjNotificacion(mensaje)
            //mensaje en la función de arriba representa al body
        })
        socket.on('disconnect', () => {
            window.location = ('/') //Solo desde la recarga completa puedo volver a conectar correctamente a las rooms
        })
        socket.on('add_persona', (mensaje) => {
            this.agregarNotificacion('add', mensaje); //Debe redefinirse como el de arriba (agregarMsjNot...)
        })
        socket.on('add_option_mi_gda', (mensaje) => {
            this.agregarNotificacion('new', mensaje); //Debe redefinirse ....
        })
        
        let newState
        if(Notification.permission === "granted"){
            //dejo el true en letNotification
        }
        else{
            newState = update(this.state, {letNotification: {$set: false}})
        }
        this.cargarNotificaciones()
        this.setState(newState)
    }

    cargarNotificaciones(){
        //Se encarga de comprobar que notificaciones no vio el usuario y de cargarlas en la lista (state.notificaciones)

    }

    guardarNotificacion(preTipo, textoUrl, notificacion){ //
        //Tengo que chequear si soy el que creó el 'evento-mensaje' y proceder a guardarlo. Sino a mostrarlo
        if(mensaje.persona.id == this.props.perfil.id){ //Si yo mandé el msj me encargo de guardarlo
            this.nuevaNotificacion(preTipo+mensaje.tipo, textoUrl, notificacion) 
            //preTipo+mensaje.tipo = Ej: 'msj+gda1' , textoUrl: /MainApp/verGdasEdit/1, 'Nuevos mensajes en...'
        }
    }

    agregarMsjNotificacion(mensaje){
        //Agrego como notificacion el mensaje al estado y la muestro (Función general para Msj)
        let textoUrl = this.state.mapaDeUrls.get(mensaje.tipo.replace(/[^a-z]/gi, '')); //Quito el/los n° del mensaje.tipo
        //Obtengo el url de la notificación por medio del mapa que esta en state
        let id = mensaje.tipo.replace(/\D/g, "");  //obtengo el id que se adjunta al url
       
        if(mensaje.persona.id != this.props.perfil.id){
            this.agregarNotificacion('msj',textoUrl+id, mensaje) //Agrego la notificación porque soy parte de los receptores
        }
        else{ //Soy el emisor de la notificación
            this.guardarNotificacion('msj', textoUrl+id,  mensaje.notificacion) //Solo el creador guarda la notif.
        }
    }

    //Próximo a 
    agregarNotificacion(preTipo, url, mensaje){ //Agrego como notificación el mensaje al estado y lo muestro

            const repetido = () => {
                for(let i = 0; i < this.state.notificaciones.length; i++){ 
                    //Determina si el tipo de notificación es repetido con uno anterior (gda3 = gda3)
                    if(this.state.notificaciones[i].tipo == preTipo+mensaje.tipo){ //mensaje.tipo = gda2 (Ej)
                        return true
                    }
                    return false
                }
            }
            if(!repetido()){ //Si no es true --> tengo que agregar la nueva notificación (tipoMsg, url, mensaje)
                let notificacion = {
                    tipo: preTipo+mensaje.tipo,  // gda2, evento3, ...
                    url: url,
                    mensaje: mensaje.notificacion,
                    fecha: new Date() //Ya nace con el timeZone que declara el navegador (UTC-3 para mí)
                }
                let newState = update(this.state, {notificaciones: {$splice: [[0, 0, notificacion]]}})
                this.setState(newState)
            }
        } 

    /* //No se usa más. El tipo de notificacion viene incluído en el mensaje
    obtenerTipoNotif(mensaje){ //Obtengo el tipo de notificación (gda, evento, privateMsg, ...)
        if(mensaje.gda != undefined){
            return "gda"+mensaje.gda.id
        }
        else if(mensaje.evento != undefined){
            return "evento"+mensaje.evento.id
        }
        else if(mensaje.noticia != undefined){
            return "nose"+mensaje.noticia.id
        }
    } */

    prepararSocket(){
        //Inicializa el socket y me uno a las rooms correspondientes
        this.inicializarNotificaciones()
    }

    inicializarNotificaciones(){
        // Verifico si hay usuario logueado y recién dsps inicializo
        if(this.props.perfil != undefined){
            let rooms = this.obtenerIdRooms()
            for(let i = 0; i <= rooms.length-1; i++){
                socket.emit('conectado', rooms[i])
            }
            if(this.props.perfil.rol.nivel > 2){ //Solo adm
                socket.emit('conectado', 'adm1');
            }
        }
    }

    obtenerIdRooms(){
        //Obtengo las rooms de los gda, los eventos, los otros, etc...
        // let tipoDeRooms = []  //gda, evento, otros, ....
        let rooms = []
        let gdas = this.props.perfil.gdas
        rooms.push(this.agregarRooms(gdas, "gda"))
        return rooms;
    }
    
    agregarRooms(arrayRooms, tipo){ //tipo = "gda" | "evento" | "private_chat"
        let rooms = []
        //Dsps tendría que recorrer el array de los tipos de rooms con el siguiente 'for' dentro
        for(let i = 0; i <= arrayRooms.length-1; i++){
            rooms.push(tipo+""+arrayRooms[i].id) //tomo el id del gda, evento, o lo que sea
        }
        return rooms
    }

    notify(e){  //Todavía no anduvo para Chrome de cierta versión, ver mi celular
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

    nuevaNotificacion(tipoMsg, textoUrl, mensaje){
        //Creo una nueva notificación según corresponda.
        if(this.props.perfil == undefined){
            //Para que no muestre notificación si no estoy registrado
            return
        }
        saveNotification(tipoMsg, textoUrl, mensaje)
    }

    mostrarNotificacion(mensaje){
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

/*    guardarNotificacion(body, mensaje, callBackMostrarNotificacion){
        //Guarda la notificacion en la base de datos. O actualiza la del mismo tipo.
        let tipoMsg = this.obtenerTipoNotif(body) //body es el objeto mensaje tal cuál llega del socket
        let params = {
            tipo: tipoMsg,
            url: ''
        }
        APIInvoker.invokePOST('/icb-api/v1/notificacion', params, response => {

        },
        error => {

        })
    } */

    irAUrl(e){
        //Voy  a la url del target
        e.preventDefault()
        let url = e.target.title
        if(url != this.props.pathname){ //Solo redirigo si es distinto
            browserHistory.push(url)
        }
    }


    clickEnHome(e){
        //Lo que hay que hacer cuando hago click en el ícono Home
        browserHistory.push('/MainApp/')
        e.preventDefault()
    }

    setearVisto(e){
        // Tengo que poner todas las notificaciones en visto y actualizar el últimaVezQueVioNotificacion
        // de la Base de Datos
        e.preventDefault()
        let notif = this.state.notificaciones
        let params = {
            "sesion": {
                "id": this.props.perfil.sesion.id,
                "persona": this.props.perfil.sesion.persona,
                "vio_notificacion": new Date()
            }
        }
        this.actualizarVioNotificacion();
        for(let i = 0; i < notif.length; i++){
            notif[i].visto = true
        }
        let newState = update(this.state, {notificaciones: {$set: notif}})
        this.setState(newState)
    }

    actualizarVioNotificacion(){
        APIInvoker.invokePUT('/icb-api/v1/sesion/vio_notificacion/'+this.props.perfil.id, null, response => {
            //Por medio de un Provider del Context tendría que actualizar la sesion pasada como prop
            let fechaVioNotif = new Date(response.body.vio_notificacion)
            let estado = response.body
            estado.vio_notificacion = new Date(fechaVioNotif.getTime())
            this.props.actualizarEstado('sesion', estado)
          //  console.log('Hora del response: '+valor.vio_notificacion) Funcionó bien
        },
        error=> {
           // document.getElementById("errorField").innerText = "Error: "+error.message
            if(error.status == 401){
                alert("Debe iniciar sesión para realizar estas operaciones")
                window.location = ('/')
            }
            //document.getElementById("errorField").innerText = "Error: "+error.message
        })
    }

    render() {
        let notificaciones = this.state.notificaciones
        let notifNoVistas = 0
        for(let i = 0; i < this.state.notificaciones.length; i++){
            if(!this.state.notificaciones[i].visto){  //Si es false cuenta 1 notif no vista
                notifNoVistas++;
            }
        }
    return (
        <IconContext.Provider value={{size: "15px"}}>
        <div className="row toolbar sticky-top">
            <div className="col-xs-12 col-sm-12 col-md-12 sticky-top">
                <div className="d-flex justify-content-end text-primary bg-white align-items-center">
                    <div className="me-auto p-1 bd-highlight order-1 order-sm-0 order-md-0 dropdown" >
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
                            <button type="button" className="btn btn-white text-primary m-1 position-relative"
                                id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false"
                                 onClick={this.setearVisto.bind(this)}>
                                <FaBars />
                                {notifNoVistas > 0?
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    {notifNoVistas}
                                <span className="visually-hidden">unread messages</span>
                                </span>
                                :
                                <span/>
                                }
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                {notificaciones.map((e, i) => 
                                <li key={i}><span className="dropdown-item" title={e.url} onClick={this.irAUrl.bind(this)}>
                                    {e.mensaje}
                                </span>
                                </li>
                                )}
                            </ul>
                            <button type="button" className="btn btn-white text-primary m-1 position-relative"
                                id="homeButton" onClick={this.clickEnHome.bind(this)} >
                                <FaHome />
                            </button>
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