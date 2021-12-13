import React, {useState, useEffect, useRef} from 'react';
import socket from './utils/Socket';
import Socket from './utils/Socket';

    function Chat({nombre}) {
        const [mensaje, setMensaje] = useState("");
        const [mensajes, setMensajes] = useState([]);

        useEffect(() => { //Se ejecuta ni bien termina el renderizado
            socket.emit('conectado', nombre);
        }, [nombre]);  

        useEffect(() => {
            socket.on('mensajes', mensaje => {  //Lo de abajo se puede reemplazar con un 'splice'
                setMensajes([...mensajes, mensaje]);  //El mensaje se añadirá a la última posición del array 'mensajes'
            })                                         //'express operator'

            return() => {socket.off()}
        }, [mensajes]) 

        const submit = (e) => {
            e.preventDefault();
            socket.emit('mensaje', nombre, mensaje)
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

                </div>
            </div>
        )
    }

export default Chat;