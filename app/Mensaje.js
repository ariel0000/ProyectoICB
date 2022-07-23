import React from "react"

class Mensaje extends React.Component {
    constructor(props){
        super(props)
    }

    isImage(url) {
        return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
    }

    isLink(url){
        return !url.match(/^(https?:\/\/[^\s]+)/g);
    }

    render(){
        let elementoMensaje = React.createElement('span', null, ''+this.props.mensaje);
        if(this.isImage(this.props.mensaje)){
            elementoMensaje = React.createElement('img', {src: this.props.mensaje, 
                className: 'img-thumbnail link-primary'}, null)
        }
        else if(!this.isLink(this.props.mensaje)){
            elementoMensaje = React.createElement('a', 
            {href: this.props.mensaje, className: 'link-primary wrapword'}, this.props.mensaje)
        }
        return(
            <div>
                {elementoMensaje}
            </div>
        )
    }
}
export default Mensaje;