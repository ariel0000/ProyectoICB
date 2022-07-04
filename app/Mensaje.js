import React from "react"

class Mensaje extends React.component {
    constructor(props){
        super(props)
    }

    isImage(url) {
        return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
    }

    render(){
        const elementoMensaje = React.createElement('div', {className: "text-white"}, this.props.mensaje);
        if(this.isImage(this.props.mensaje)){
            elementoMensaje = React.createElement('img', {src: this.props.mensaje}, "")
        }
        return(
            {elementoMensaje}
        )
    }
}