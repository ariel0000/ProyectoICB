import React, {useState, useEffect, useRef} from 'react';
import socket from './utils/Socket';
import WindowFocusHandler from './WindowsFocusHandler';

    function Chat({nombre, id}) {  //Estos atributos son pasados como props 
        const [mensaje, setMensaje] = useState("");
        const [mensajes, setMensajes] = useState([]);
        
        useEffect(() => { //Se ejecuta ni bien termina el renderizado
            socket.emit('conectado', nombre, id);
        }, [nombre], [id]);  

        useEffect(() => {
            socket.on('mensajes', mensaje => {  //Se ejecuta cada vez que llega la orden de 'mensajes'
                setMensajes([...mensajes, mensaje]);  //El mensaje se añadirá a la última posición del array 'mensajes'
            })                                         //'express operator'

            return() => {socket.off()}
        }, [mensajes]) 

        const submit = (e) => {
            e.preventDefault();  
            socket.emit('mensaje', nombre, mensaje)
        }

        const connect = () => {
            socket.connect();
        }

        const disconnect = () => {
            socket.disconnect
        }

        return (
            <div className="infoApp container-fluid">
                <div className="row mt-4">
                    <div className='col-12 bg-white text-dark'>
                        {mensajes.map((e, i) =><div key={i}>{e.mensaje} </div>)}
                    </div>
                    <form className='form-control' onSubmit={submit}>
                        <div className="col-sm-6">
                            <label className="form-label">Mensajes del servidor</label>
                            <textarea id="mensaje" rows="1" cols="1" className="form-control"
                                value={mensaje} onChange={e => setMensaje(e.target.value)} />
                        </div>
                        <button type="submit" id="enviar" className="btn btn-primary mt-2">Enviar</button>
                    </form>
                    <WindowFocusHandler funcion1 = {connect} funcion2={disconnect} />
                </div>
            </div>
        )
    }

export default Chat;