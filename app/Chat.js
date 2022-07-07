import React from 'react'
import update from 'react-addons-update'
import WindowFocusHandler from './WindowsFocusHandler';
import Mensaje from './Mensaje'

// function Chat({nombre, id, pathname}) {  //Estos atributos son pasados como props 
class Chat extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            mensajes: [],
            mensaje: "",
            pagina: 0,
            firstTime: true
        }
    }

    componentDidMount() { //Se ejecuta ni bien termina el renderizado
    //    this.props.socket.emit('conectado', [this.props.id]);  //id del chat
        this.props.socket.on('mensajes', (mensaje) => {  //Se ejecuta cada vez que llega la orden de 'mensajes'
            if(mensaje.idper == this.props.idpersona){ //Cuando soy el cliente que envió el mensaje
                this.agregarMensaje(mensaje)
                //En la siguiente función y las subllamadas guardo el mensaje y dsps lo envío a los otros clientes
            }
        })

        this.props.socket.on('msgBroadcast', (mensaje) => {
            //Este mensaje solo lo reciben los clientes compañeros de alguien que mando un mensaje
            this.consultarUltimoMensaje(mensaje)
        })
    }

    
    componentDidUpdate(prevsProps, prevState, snapshot){
        //Utilizo esto solo para asegurarme que se scrolleo hasta el final
        if(this.state.firstTime){ //Entro la primera vez que renderizo. firstTime se actualiza en el scroll a false
            this.scrollearHastaUltimoElemento()
        }
    }

    componentWillUnmount(){
    //    console.log('Server desconectado') 
       // this.props.socket.disconnect()  //Hace que se ejecute el listener del 'disconnect' que redirige a '/'
       this.props.socket.off('mensajes')
       this.props.socket.off('msgBroadcast')
    }

    msgToAnother(mensaje, idChat){
        //Funcion pasada como callBack en el siguiente método. Envía el msg Broadcast dsps de que se guardo
      
        this.props.socket.emit('msgToAnother', mensaje, idChat)
    }

    agregarMensaje(mensaje){
        //Metodo que solo se ejecuta cuando soy yo quíen mando el mensaje
        this.props.addMsg(mensaje, this.msgToAnother.bind(this))
    }

    consultarUltimoMensaje(mensaje){
        //Desde acá consulto los props para recuperar el último mensaje recibido
        this.props.lastMsj(mensaje)
    }

    setMensaje(e){  //Actualiza el mensaje
        let value = e.target.value
        let newState = update(this.state, {mensaje: {$set: value}})
        this.setState(newState)
    }

    submit(e){
        //habría que chequear que el mensaje no sea nulo
        e.preventDefault();
        if(this.state.mensaje == ''){
            return
        }
        let newState = update(this.state, {mensaje: {$set: ''}})
        this.props.socket.emit('mensaje', this.props.idpersona, this.state.mensaje, [this.props.id]) //id del chat
        this.setState(newState)
    }
    /*
    static getDerivedStateFromProps(props, state){
        if(state.mensajes != props.mensajes){
            return {
                ...state,
                mensajes: props.mensajes.reverse() //Los msjs se cargan del último al primero --> reverse
            }
        }
        return null
    }  */
 
    scrollearHastaUltimoElemento(){
        //Se encarga de correr el chat hasta el último elemento
        document.getElementById('caja-chat').scrollIntoView();
    }

    onScroll(e){
        //Tengo que averiguar si el scroll llegó al tope para traer nuevos mensajes.
        //Además actualizo en valor firstTime
        let distanciaAlTope = e.target.scrollTop
        if(distanciaAlTope <= 10){
            this.props.getMensajes(this.state.pagina+1);
            e.target.scrollTop = 300
            let newState = update(this.state, {pagina: {$set: this.state.pagina+1}, firstTime: {$set: false}})
            this.setState(newState)
        }
    }

    ifDisconnected() {  
        console.log("state.conectado: "+this.state.conectado)
        /*if(!this.state.conectado){  ///Si no está conectado --> recargo la página
            this.recargar()
        } */
       // this.recargar()
    }

    recargar(){
        this.props.reload()
    }

    render() {
        const onBlur = () => {
           // socket.disconnect() Esto rompe todo, entender que a veces la pantalla se ve pero esta onBlur (PC)
        }

        let mensajes = this.props.mensajes
        return (
            <div className="infoApp container-fluid" id='ChatComponent'>
                <div className="row mt-1" >
                    <div  className={this.props.esCelu? "col-12 bg-info p-2 caja-chat-celu": "col-12 bg-info p-2 caja-chat"} 
                        onScroll={this.onScroll.bind(this)} >
                        <br/>
                        <br/>
                        <br/>
                        {mensajes.map((e, i) => 
                        <div key={i} className={(this.props.idpersona == e.persona.id)? 
                        'd-flex flex-column ms-auto mensaje mio p-1 mb-1': 'd-flex flex-column me-auto mensaje no-mio p-1 mb-1' }>
                            <div className='text-nowrap nombre-chat'>{e.persona.nombre} {e.persona.apellido}</div>
                            <Mensaje mensaje={e.mensaje} />
                        </div>)} 
                        <div id='caja-chat'></div>{/* Uso este div para scrollear automáticamente*/}
                    </div>
                    <form className='form-control justify-content-center bg-info' onSubmit={this.submit.bind(this)}>
                        <div className="col-sm-12">
                           {/* <label className="form-label">Mensajes del servidor</label> */ }
                            <textarea id="mensaje" rows="1" cols="1" className="form-control"
                                value={this.state.mensaje} onChange={this.setMensaje.bind(this)} />
                            <button type="submit" id="enviar" className="btn btn-primary mt-2">Enviar</button>
                        </div>
                    </form>
                    <WindowFocusHandler beginFocus={this.ifDisconnected.bind(this)} beginBlur={onBlur.bind(this)} />
                </div>
            </div>
        )
    }
}
export default Chat;