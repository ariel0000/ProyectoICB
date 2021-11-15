import React from 'react'

class cerrarSesion extends React.Component{  //Submenú que sirve para preguntar si el usuario está seguro de cerrar sesión
    constructor(){
        super(...arguments)
    }

    handleClick(e){
        e.preventDefault()
        window.localStorage.removeItem("token")
        window.localStorage.removeItem("codigo")
        window.location = ('/')
    }

    handleClickNo(e){
        e.preventDefault()
        window.location = ('/')
    }

    render(){
        return(
            <div className="infoApp menu ms-2">
                <h4>¿Está seguro que desea cerrar sesión? </h4>
                <li>
                    <a className="nav-link active" href="#" onClick={this.handleClick.bind(this)} 
                            aria-disabled="true">Sí</a>
                    <a className="nav-link active" href="#" onClick={this.handleClickNo.bind(this)} 
                        aria-disabled="true">No</a>
                </li>
            </div>
        )
    }
}
export default cerrarSesion