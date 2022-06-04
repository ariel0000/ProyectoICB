import React from "react"
import APIInvoker from './utils/APIInvoker'
import update from 'react-addons-update'
import { browserHistory } from "react-router"

class VerNoticias extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            mover: true,
            noticias: []
        }
    }

    componentDidMount(){
        //Tengo que cargar las noticias
        let etiqueta = document.getElementById("errorField")
        APIInvoker.invokeGET('/icb-api/v1/noticia', response => {
            let newState = update(this.state, {noticias: {$set: response.body}})
            this.setState(newState)
        }, 
        error => {
            if(error.status == 401){
                alert("Debe iniciar sesión para poder entrar aquí")
                window.localStorage.removeItem("token")
                window.localStorage.removeItem("codigo")
                window.location = ('/')
            }
            etiqueta.innerHtml = error.message
        })
    }

    componentDidUpdate(prevProps, prevState){
        //Se ejecuta después del render(). Recibe el estado anterior, las propiedades anteriores y un snapshot
        let div_carousel = document.getElementById('soyElCarousel')
        if(!this.state.noticias.length < 1){
            if(this.state.noticias != prevState.noticas){
                //Tengo que ponerle "active" al primer elemento de la lista de imágenes
                div_carousel.firstChild.className = 'carousel-item active'
            }
        
        }
    }

    borrarNoticia(e) {
        let errorField = document.getElementById("errorField")
        errorField.innerHTML = ""
        let div_carousel = document.getElementById('soyElCarousel')
        let elementoActivo = div_carousel.getElementsByClassName('carousel-item active')
        let idNoticia = elementoActivo[0].getAttribute('name')
        let tituloNoticia = elementoActivo[0].title
        console.log("ID Noticia: "+idNoticia)
        var r = confirm("¿Está seguro de borrar la noticia: '" + tituloNoticia + "'")
        if (r === true) {
            APIInvoker.invokeDELETE('/icb-api/v1/noticia/' + idNoticia, response => {
                browserHistory.push('/MainApp/noticias')
            },
            error => {
                let errorField = document.getElementById("errorField")
                if (error.status == 401) {
                    alert("Debe iniciar sesión para poder entrar aquí")
                    window.localStorage.removeItem("token")
                    window.localStorage.removeItem("codigo")
                    window.location = ('/')
                }
                errorField.innerHTML = error.message
            })
        }
    }

    render(){
        let noticias = this.state.noticias
        let rol = this.props.profile.rol.nivel
        return(
        <div className="infoApp container-fluid">
            <blockquote className="text-center">
                <h6 className="text-white bg-danger rounded" id="errorField"></h6>
                </blockquote>
                <div className="row justify-content-center mb-1">
                    <div className="col-9 col-md-7 me-md-5">
                        <div id="carouselExampleControls" className="carousel slide carousel-fade" data-bs-ride="carousel">
                            <div className="carousel-inner" id="soyElCarousel">
                                {noticias.map((noticia, i) =>
                                <div key={i} name={noticia.id} title={noticia.titulo} className="carousel-item" data-bs-interval="15000">
                                    <h4>{noticia.titulo}</h4>
                                    <h6 className="mt-1">{noticia.subtitulo}</h6>
                                    <img src={noticia.url_imagen} className="d-block w-100 mt-1 mb-2 loading" />
                                    <h6 className="mt-1">{noticia.pie_de_pagina}</h6>
                                </div>
                                )}
                            </div>
                            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                                <span className="carousel-control-prev-icon bg-dark" aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                                <span className="carousel-control-next-icon bg-dark" aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>
                </div>
                {(rol > 2)?
                <div className="row justify-content-center">
                    <div className="col-9 col-md-7 me-md-5">
                        <button className="btn btn-danger text-white" onClick={this.borrarNoticia.bind(this)}>
                            Borrar
                        </button> 
                    </div>
                </div>
                :
                <span className="nada"></span>
                }
            </div>
        )
    }
}
VerNoticias.defaultProps = {
    profile: {
        gdas: [{ }],  //Lista vacía
        rol: {
            id: 0,  //Usuario sin loguearse por defecto
            nivel: 0    
        }
    }
}
export default VerNoticias