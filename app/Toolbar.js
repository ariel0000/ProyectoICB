import React from 'react';
import { FaBell, FaBellSlash, FaBars} from 'react-icons/fa'
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
                ['noticia', '/MainApp/verNoticia/']
            ])
            /* 
            let userRoles = new Map([
    [john, 'admin'],
    [lily, 'editor'],
    [peter, 'subscriber']
]); */
        }
    }

    componentDidMount(){
        this.prepararSocket()
        socket.on('msg_notificacion', (mensaje, info) => {
            this.agregarNotificacion('msg', mensaje, info)
            //mensaje en la función de arriba representa al body
        })
        socket.on('disconnect', () => {
            window.location = ('/') //Solo desde la recarga completa puedo volver a conectar correctamente a las rooms
        })
        socket.on('add_persona', (mensaje, info) => {
            this.agregarNotificacion('add', mensaje, info);
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

    agregarNotificacion(preTipo, mensaje, info){ //Agrego como notificación el mensaje al estado
        let tipoMsg = this.obtenerTipoNotif(mensaje) //el tipo define el url tmbn (gda, evento, noticia)
        let newState 
        let repetido = false 
        
        let textoUrl = this.state.mapaDeUrls.get(tipoMsg.replace(/[^a-z]/gi, '')); //Mapa donde estan definidas las Url
       /* this.state.notificaciones.forEach((tipo, url) => { //tipo incluye su id (ej: gda2)
            if(tipo == tipoMsg){ //Si es del mismo tipo tengo que indicarlo para no agregarlo dsps
                repetido = true
            }
        })*/
        for(let i = 0; i < this.state.notificaciones.length; i++){ 
            //Determina si el tipo de notificación es repetido con uno anterior (gda3 = gda3)
            if(this.state.notificaciones[i].tipo == tipoMsg){
                repetido = true
            }
        }
        let id = tipoMsg.replace(/\D/g, "");  //obtengo el numero a través de una expresión regular
        if(!repetido){ //Si no es true --> tengo que agregar la nueva notificación (tipoMsg, url, mensaje)
            let notificacion = {
                tipo: tipoMsg,  // gda2, evento3, ...
                url: textoUrl+id,
                mensaje: info,
                fecha: new Date() //No necesito un formato específico, es solo comparativo
            }
            newState = update(this.state, {notificaciones: {$splice: [[0, 0, notificacion]]}})
            this.setState(newState)
        }
        this.nuevaNotificacion(preTipo+tipoMsg, textoUrl+id, info)
    }

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

    nuevaNotificacion(tipoMsg, textoUrl, info){
        //Creo una nueva notificación según corresponda.
        if(this.props.perfil == undefined){
            //Para que no muestre notificación si no estoy registrado
            return
        }
        saveNotification(tipoMsg, textoUrl, info, mostrarNotificacion)
        function mostrarNotificacion(mensaje){
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
    }

    guardarNotificacion(body, mensaje, callBackMostrarNotificacion){
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
    }

    irAUrl(e){
        //Voy  a la url del target
        e.preventDefault()
        let url = e.target.title
        if(url != this.props.pathname){ //Solo redirigo si es distinto
            browserHistory.push(url)
        }
    }

    setearVisto(e){
        // Tengo que poner todas las notificaciones en visto
        e.preventDefault()
        let notif = this.state.notificaciones
     
        for(let i = 0; i < notif.length; i++){
            notif[i].visto = true
        }
        let newState = update(this.state, {notificaciones: {$set: notif}})
        this.setState(newState)
    }

    render() {
        let notificaciones = this.state.notificaciones
        let notifNoVistas = 0
        for(let i = 0; i < this.state.notificaciones.length; i++){
            if(!this.state.notificaciones[i].visto){  //Si es fale cuenta 1 notif no vista
                notifNoVistas++;
            }
        }
    return (
        <IconContext.Provider value={{size: "15px"}}>
        <div className="row toolbar">
            <div className="col-xs-12 col-sm-12 col-md-12">
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