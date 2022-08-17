import React from "react";
import update from 'react-addons-update';
import { render } from "react-dom";

class Participante extends React.Component{
    constructor(props){
        super(props)
    }


render(){
    return(
        <div className={this.props.sexo == "Masculino" ? "parent lider hombre " :
            "parent lider mujer"} ref={this.setWrapperRef.bind(this)}>
            <div className="warning text-wrap text-red p-0 mt-0">
                {this.props.nombre}' '{this.props.apellido}
            </div>
        </div>
    )
}
}
export default Participante;
