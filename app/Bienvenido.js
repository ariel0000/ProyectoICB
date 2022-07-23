import React from 'react'
import { browserHistory } from "react-router"
import { FaBell } from 'react-icons/fa'

class Bienvenido extends React.Component{
    constructor(props){
        super(props)
    }
    verNoticias(){ //
        browserHistory.push("/MainApp/noticias");
    }

    render(){
        return(
            <div className="infoApp">
                <h3>Bienvenido/a</h3>
                <br/>
                <p>Puedes empezar a utilizar nuestra app y ver todas las opciones disponibles desde el Menú desplegable</p>
                <p>Elige si quieres recibir notificaciones haciendo click la campanita que esta en la esquina superior 
                    izquierda:&nbsp; &nbsp; 
                    <FaBell />
                </p>
                
                <button className="btn btn-info text-white mt-2" onClick={this.verNoticias.bind(this)}>Ok!</button>
            </div>
        )
    }
}
export default Bienvenido