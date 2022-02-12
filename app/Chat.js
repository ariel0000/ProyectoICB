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
        let newState;
        socket.connect()
        socket.emit('conectado', this.props.nombre, this.props.id);
        socket.on('mensajes', (mensaje) => {  //Se ejecuta cada vez que llega la orden de 'mensajes'
            /*newState = update(this.state, {mensajes: {$push: [mensaje]}})
            this.setState(newState)*/
            this.props.addMsg(mensaje)
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
        socket.close()  //decía socket.off()
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
        socket.emit('mensaje', this.props.nombre, this.state.mensaje)
        this.setState(newState)
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if(prevState.mensajes != nextProps.mensajes)
        return {
            mensajes: nextProps.mensajes
        }
        return null
    }

    ifDisconnected() {  
        console.log("state.conectado: "+this.state.conectado)
        if(!this.state.conectado){  //Si no está conectado --> recargo la página
            this.recargar()
        }
    }

    recargar(){
        this.props.reload()
    }

    static getDerivedStateFromProps(nextProps, state){
        if(nextProps.mensajes != state.mensajes){
            return{
                mensajes: nextProps.mensajes
            }
        }
        return null
    }

    render() {
        const onBlur = () => {
            console.log('Me jui')
        }

        let mensajes = this.state.mensajes
        return (
            <div className="infoApp container-fluid">
                <div className="row mt-4">
                    <div className='col-12 bg-white text-dark'>
                        {mensajes.map((e, i) => <div key={i}>{e.mensaje} </div>)}
                    </div>
                    <form className='form-control' onSubmit={this.submit.bind(this)}>
                        <div className="col-sm-6">
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