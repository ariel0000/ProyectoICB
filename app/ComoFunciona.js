import React from "react"

class ComoFunciona extends React.Component{
    constructor(){
        super(...arguments)
    }

    render(){
        return(
            <div className="infoApp ms-2">
                <h3>Puedes ver todas las opciones haciendo click en el menu</h3>
                <p>Para acceder a ciertas opciones es necesario Iniciar sesión en el Sistema.</p>
                <br></br>
                <p>En el menú "Cuenta" entra en "Iniciar sesión" para loguearte con tú código de acceso o para solicitar uno</p>
                <p>El código de acceso se obtiene en el correo/mail. 
                    Es proporcionado por un administrador luego de enviar los datos solicitados </p>
            </div>
        )
    }
}    export default ComoFunciona;