import React from "react";
import Participante from './Participante'

class Participantes extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div className="infoApp row justify-content-center mt-2">
                {this.props.participantes.map((e, i) => 
                <div key={e.nombre+e.apellido+e.id} className="col">
                    <Participante participante={e} />
                </div>
                )}
            </div>
        )
    }
}
export default Participantes;