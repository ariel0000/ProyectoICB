import React from 'react'
import update from 'react-addons-update'
import socket from './utils/Socket';  //Empieza estando conectado
import WindowFocusHandler from './WindowsFocusHandler';

// function Chat({nombre, id, pathname}) {  //Estos atributos son pasados como props 
class Chat extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            mensajes: [],
            mensaje: "",
            conectado: true
        }
    }

    componentDidMount() { //Se ejecuta ni bien termina el renderizado
        socket.connect()
        socket.emit('conectado', this.props.id);  //id del chat
        socket.on('mensajes', (mensaje) => {  //Se ejecuta cada vez que llega la orden de 'mensajes'
            if(mensaje.idper == this.props.idpersona){
                this.agregarMensaje(mensaje)

                // this.props.addMsg(mensaje) //Solo se agregar el msj si soy el usuario que lo creo
            //La f tendría que ser pasada como 2-do parámetro para ser llamada como callback
            }
        })

        socket.on('msgBroadcast', (mensaje) => {
            //Este mensaje solo lo reciben los clientes compañeros de alguien que mando un mensaje
            this.props.getMensajes()
        })

        socket.on('connect_error', function() {  //Nunca pasó pero también debería recargar
            console.log('Failed to connect to server');
            this.props.reload()
        });

        socket.on('disconnect', () => {
            let nuevoEstado = update(this.state, {conectado: {$set: false}});
            this.setState(nuevoEstado);
        })
    }

    componentWillUnmount(){
        console.log('Server desconectado')
        socket.off()  //Cancela todos los eventos que pueda tener el socket
    }

    msgToAnother(mensaje){
        //Funcion pasada como callBack en el anterior método. Envía el msg Broadcast dsps de que se guardo
        socket.emit('msgToAnother', mensaje)
    }

    agregarMensaje(mensaje){
        //Usar sync y await para que la segunda función espere a la primera
        this.props.addMsg(mensaje, this.msgToAnother)
        //socket.emit('msgToAnother', mensaje)
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
        socket.emit('mensaje', this.props.idpersona, this.state.mensaje)
        this.setState(newState)
    }

    static getDerivedStateFromProps(props, state){
        if(state.mensajes != props.mensajes){
            console.log('Hay nuevos Props')
            return {
                ...state,
                mensajes: props.mensajes
            }
        }
        return null
    }

    ifDisconnected() {  
        console.log("state.conectado: "+this.state.conectado)
        /*if(!this.state.conectado){  ///Si no está conectado --> recargo la página
            this.recargar()
        } */
        this.recargar()
    }

    recargar(){
        this.props.reload()
    }


    render() {
        const onBlur = () => {
           // socket.disconnect() Esto rompe todo, entender que a veces la pantalla se ve pero esta onBlur (PC)
        }

        let mensajes = this.state.mensajes
        return (
            <div className="infoApp container-fluid">
                <div className="row mt-4">
                    <div className='col-12 bg-white text-dark'>
                        {mensajes.map((e, i) => 
                        <div key={i} className={(this.props.idpersona == e.persona.id)? 
                        'd-flex justify-content-end': 'd-flex justify-content-start'}>
                            <div style={(this.props.idpersona == e.persona.id)? 
                            {textAlign: 'end'}: {textAlign: 'start'}} >
                                <span className='nombreChat'>{e.persona.nombre+' '+e.persona.apellido}</span>
                            <br />
                                {e.mensaje}
                            </div>
                        </div>)}
                    </div>
                    <form className='form-control justify-content-center' onSubmit={this.submit.bind(this)}>
                        <div className="col-sm-12">
                            <label className="form-label">Mensajes del servidor</label>
                            <textarea id="mensaje" rows="1" cols="1" className="form-control"
                                value={this.state.mensaje} onChange={this.setMensaje.bind(this)} />
                        </div>
                        <button type="submit" id="enviar" className="btn btn-primary mt-2">Enviar</button>
                    </form>
                    <WindowFocusHandler beginFocus={this.ifDisconnected.bind(this)} beginBlur={onBlur.bind(this)} />
                </div>
            </div>
        )
    }
}
export default Chat;