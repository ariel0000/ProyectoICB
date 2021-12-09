import React from 'react';


function enviarTexto(e){
    console.log("Función para Enviar Texto")
}

function Chat() {
    return (
        <div className="infoApp container-fluid">
            <div className="row mt-4">
                <div className="col-sm-6">
                    <label className="form-label">Mensajes del servidor</label>
                    <textarea id="mensajes" rows="10" cols="10" className="form-control"></textarea>
                </div>
                <div className="col-sm-5">
                    <form onSubmit={enviarTexto.bind(this)}>
                        <label className="form-label">Texto a enviar</label>
                        <input type="text" id="texto" name="texto" className="form-control" />
                        <button type="submit" id="enviar" className="btn btn-primary mt-2">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Chat;