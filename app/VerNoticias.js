import React from "react"
import APIInvoker from './utils/APIInvoker'
import update from 'react-addons-update'
import { browserHistory } from "react-router"
import Noticia from './Noticia'
import {SlideTransition} from './utils/SlideTransition'
import { TransitionGroup } from "react-transition-group"
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa'

class VerNoticias extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            mover: true,
            noticias: [],
            indiceNoticia: 0,
            noticiaInterval: null
        }
    }

    avanzarSiguienteNoticia(){
        //Cada 10 segundos avanzo a la segunda noticia
        console.log("Estoy en la funcion del interval")
        let newState
        let indiceActual = this.state.indiceNoticia
        if(indiceActual < (this.state.noticias.length-1)){ // si size = 8. 7<7 no.
            newState = update(this.state, {indiceNoticia: {$set: indiceActual+1}})
            console.log('Avanzo siguiente noticia')
        }
        else{
            newState = update(this.state, {indiceNoticia: {$set: 0}}) //Empiezo otra vez
        }
        this.setState(newState)
    }

    primerNoticia(){
        //Se llama a esta función cuando el div de la noticia se carga. Debe establecer un setTimeout
        // para ejecutar la función de avanzar a la siguiente noticia
        this.myInterval = setInterval(() => {
            console.log("Estoy en la funcion del interval")
            let newState
            let indiceActual = this.state.indiceNoticia
            if(indiceActual < (this.state.noticias.length-1)){ // si size = 8. 7<7 no.
                newState = update(this.state, {indiceNoticia: {$set: indiceActual+1}})
                console.log('Avanzo siguiente noticia')
            }
            else{
                newState = update(this.state, {indiceNoticia: {$set: 0}}) //Empiezo otra vez
            }
            this.setState(newState)
        }, 15000)
    }

    VolverAnteriorNoticia(e){
        //Debe hacer exactamente lo contrario de la anterior función
        /* 
        **
        ***
        **
        */
    }

    quitarAvanceNoticia(){
        //Se ejecuta cuando interfiero en la ejecución normal del avance de las noticias
        clearInterval(this.myInterval)
    }

    componentDidMount() {
        //Tengo que cargar las noticias y establecer el interval mediante funcion (this.primerNoticia())
        this.primerNoticia()
        let etiqueta = document.getElementById("errorField")
        APIInvoker.invokeGET('/icb-api/v1/noticia', response => {
            let newState = update(this.state, { noticias: { $set: response.body } })
            this.setState(newState)
        },
            error => {
                if (error.status == 401) {
                    alert("Debe iniciar sesión para poder entrar aquí")
                    window.localStorage.removeItem("token")
                    window.localStorage.removeItem("codigo")
                    window.location = ('/')
                }
                etiqueta.innerHtml = error.message
            })
    }

    borrarNoticia(e) {
        let errorField = document.getElementById("errorField")
        errorField.innerHTML = ""
        let div_carousel = document.getElementById('soyElCarousel')
        let elementoActivo = div_carousel.getElementsByClassName('carousel-item active')
        let idNoticia = elementoActivo[0].getAttribute('name')
        let tituloNoticia = elementoActivo[0].title
        console.log("ID Noticia: " + idNoticia)
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

    render() {
        const noticias = this.state.noticias.map((noticia, i) => (
            <SlideTransition key={i} >
                <Noticia noticia={noticia} />
            </SlideTransition>)
        );
        let rol = this.props.profile.rol.nivel
        return (
            <div className="infoApp container-fluid">
                <blockquote className="text-center">
                    <h6 className="text-white bg-danger rounded" id="errorField"></h6>
                </blockquote>
                <div className="row justify-content-center m-1">
                    <div className="col-auto align-self-center opacity-50 p-0">
                        <button className="btn btn-dark text-info" style={{opacity: "75%"}}
                            onClick={this.VolverAnteriorNoticia.bind(this)} >
                            <FaArrowLeft />
                        </button>
                    </div>
                    <div className="col-8 col-md-6 p-1">
                        <TransitionGroup>      
                                {noticias[this.state.indiceNoticia]}
                        </TransitionGroup>
                    </div>
                    <div className="col-auto align-self-center opacity-50 p-0">
                        <button className="btn btn-dark text-info" style={{opacity: "75%"}} 
                            onClick={this.avanzarSiguienteNoticia.bind(this)} >
                            <FaArrowRight />
                        </button>
                    </div>
                </div>
                {(rol > 2) ?
                    <div className="row justify-content-center">
                        <div className="col-9 col-md-7">
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
        gdas: [{}],  //Lista vacía
        rol: {
            id: 0,  //Usuario sin loguearse por defecto
            nivel: 0
        }
    }
}
export default VerNoticias