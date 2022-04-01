import React from 'react'
import { browserHistory } from "react-router"

class Bienvenido extends React.Component{

    verNoticias(){ //
        browserHistory.push("/MainApp/noticias");
    }

    render(){
        return(
            <div className="infoApp">
              
                <h3>Bienvenido/a</h3>
                <br/>
                <p>Puedes empezar a utilizar nuestra app y ver todas las opciones disponibles desde el Menú desplegable</p>
                <button className="btn btn-info text-white mt-2" onClick={this.verNoticias.bind(this)}>Ok!</button>
            </div>
        )
    }

}
export default Bienvenido