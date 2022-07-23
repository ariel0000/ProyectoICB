import React from 'react'

class Noticia extends React.Component{
    constructor(props){
        super(props)
    }

    componentDidMount(){

    }

    render(){
        return(
            <div className='noticia'>
                <h4>{this.props.noticia.titulo}</h4>
                <h6 className="mt-1">{this.props.noticia.subtitulo}</h6>
                <img src={this.props.noticia.url_imagen} className="d-block w-100 mt-1 mb-2 loading" />
                <h6 className="mt-1">{this.props.noticia.pie_de_pagina}</h6>
            </div>
        )
    }

} export default Noticia