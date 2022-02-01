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
            mensaje: ""
        }
    }

    componentDidMount() { //Se ejecuta ni bien termina el renderizado
        let newState;
        socket.emit('conectado', this.props.nombre, this.props.id);
        socket.on('mensajes', mensaje => {  //Se ejecuta cada vez que llega la orden de 'mensajes'
            console.log(mensaje)
            newState = update(this.state, {mensajes: {$push: [mensaje]}})
            this.setState(newState)
        })
        socket.on('connect_error', function() {  //Nunca pasó pero también debería recargar
            console.log('Failed to connect to server');
            this.props.reload()
        });
        socket.on('disconnect', function(){ //Entro aquí --> Habrá que recargar desde acá
            console.log('Desconectado')
            this.props.reload()
        });
    }

    componentWillUnmount(){
        socket.off()
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

    recargar(e){
        e.preventDefault()
        this.props.reload()
    }

    render() {
        const onBlur = () => {
            console.log('Me jui')
        }

        const ifDisconnected = () => {
            console.log('ENTRE A LA FUNCIÓN ifDisconnected')
            console.log(socket.OPEN)
            //  if(socket.disconnected){  //No funciona -- Siempre tira false
           // reload()
        }

      /*  const reload = () => {
            const current = this.props.pathname
            this.props.history.replace(`/reload`);
            setTimeout(() => {
                this.props.history.replace(current);
            });
        } */

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
                    <WindowFocusHandler beginFocus={ifDisconnected.bind(this)} beginBlur={onBlur.bind(this)} />
                </div>
                <div className='infoApp'>
                    <button type="button" id="enviar" className="btn btn-primary mt-2" onClick={this.recargar.bind(this)}>
                        Enviar
                    </button>
                </div>
            </div>
        )
    }
}
export default Chat;