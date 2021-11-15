import React from 'react'

class InfoReu extends React.Component{

    constructor(props){
        super(props)
    }

    render(){
        return(
            <div className="infoApp ms-2">
                <h3>Información de Reuniones</h3>
                <p>Las reuniones se realizan los días Miércoles 20:30hs y Domingos 10:00hs</p>
                <br></br>
                <p>Es posible reservar lugar para uno o más integrantes. Ver submenú de "Reservas" dentro de "Reuniones"</p>
            </div>
        )
    }
}

export default InfoReu