import React from "react"
import APIInvoker from './utils/APIInvoker'
import update from 'react-addons-update'
import { browserHistory } from "react-router"
import Noticia from './Noticia'
import { SlideTransition } from './utils/SlideTransition'
import { TransitionGroup } from "react-transition-group"
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa'
import CrearNoticiaa from "./CrearNoticiaa"
import {format} from 'date-fns';

class VerNoticias extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            mover: true,
            noticias: [],
            indiceNoticia: 0,
            modoEdicion: false
        }
    }

    avanzarSiguienteNoticia() {
        //Cada 10 segundos avanzo a la segunda noticia
        console.log("Estoy en la funcion del interval")
        let newState
        let indiceActual = this.state.indiceNoticia
        if (indiceActual < (this.state.noticias.length - 1)) { // si size = 8. 7<7 no.
            newState = update(this.state, { indiceNoticia: { $set: indiceActual + 1 } })
            console.log('Avanzo siguiente noticia')
        }
        else {
            newState = update(this.state, { indiceNoticia: { $set: 0 } }) //Empiezo otra vez
        }
        this.setState(newState)
    }

    primerNoticia() {
        //Se llama a esta función cuando el div de la noticia se carga. Debe establecer un setTimeout
        // para ejecutar la función de avanzar a la siguiente noticia
        this.myInterval = setInterval(() => {
            console.log("Estoy en la funcion del interval")
            let newState
            let indiceActual = this.state.indiceNoticia
            if (indiceActual < (this.state.noticias.length - 1)) { // si size = 8. 7<7 no.
                newState = update(this.state, { indiceNoticia: { $set: indiceActual + 1 } })
                console.log('Avanzo siguiente noticia')
            }
            else {
                newState = update(this.state, { indiceNoticia: { $set: 0 } }) //Empiezo otra vez
            }
            this.setState(newState)
        }, 15000)
    }

    volverAnteriorNoticia(e) {
        console.log("Estoy en la funcion del interval")
        let newState
        let indiceActual = this.state.indiceNoticia
        if (indiceActual > 0) {
            newState = update(this.state, { indiceNoticia: { $set: indiceActual - 1 } })
            console.log('Retocedo noticia')
        }
        else {
            newState = update(this.state, { indiceNoticia: { $set: this.state.noticias.length - 1 } }) //Empiezo otra vez
        }
        this.setState(newState)
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

    componentWillUnmount() {
        clearInterval(this.myInterval)
    }

    borrarNoticia(noticia) {
        alert('Hay que arreglar esto ') //Antes dependía de Bootstrap js
        var r = confirm("¿Está seguro de borrar la noticia: '" + noticia.titulo + "'")
        if (r === true) {
            APIInvoker.invokeDELETE('/icb-api/v1/noticia/' + noticia.id, response => {
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

    editarNoticia(e) {
        let newState = update(this.state, { modoEdicion: { $set: true } })
        this.setState(newState)
    }

    render() {
        let noticia = this.state.noticias[this.state.indiceNoticia]
        let fechaExp = noticia? format(new Date(noticia.fecha_de_exp), 'yyyy-MM-dd'): new Date()
        let modoEdicion = this.state.modoEdicion
        const noticias = this.state.noticias.map((noticia, i) => (
            <SlideTransition key={i} >
                <Noticia noticia={noticia} key={i} />
            </SlideTransition>)
        );
        let rol = this.props.profile.rol.nivel
        return (
            <div className="infoApp container-fluid">
                <Choose>
                    <When condition={modoEdicion} >
                        <CrearNoticiaa tipo={"Noticia"} id={noticia.id} titulo={noticia.titulo} subtitulo={noticia.subtitulo} imagenUrl={noticia.url_imagen}
                            fechaExp={ fechaExp } deleteUrl={noticia.deleteUrl} piePagina={noticia.pie_de_pagina} />
                    </When>
                    <Otherwise>
                        <blockquote className="text-center">
                            <h6 className="text-white bg-danger rounded" id="errorField"></h6>
                        </blockquote>
                        <div className="row justify-content-center m-1">
                            <div className="col-auto align-self-center opacity-50 p-0">
                                <button className="btn btn-dark text-info" style={{ opacity: "75%" }}
                                    onClick={this.volverAnteriorNoticia.bind(this)} >
                                    <FaArrowLeft />
                                </button>
                            </div>
                            <div className="col-8 col-md-5 p-2">
                                <TransitionGroup>
                                    {noticias[this.state.indiceNoticia]}
                                </TransitionGroup>
                            </div>
                            <div className="col-auto align-self-center opacity-50 p-0">
                                <button className="btn btn-dark text-info" style={{ opacity: "75%" }}
                                    onClick={this.avanzarSiguienteNoticia.bind(this)} >
                                    <FaArrowRight />
                                </button>
                            </div>
                        </div>
                        {(rol > 2) ?
                            <div className="row justify-content-center">
                                <div className="col-9 col-md-1">
                                    <button className="btn btn-danger text-white" onClick={this.borrarNoticia.bind(this, noticia)}>
                                        Borrar
                                    </button>
                                </div>
                                <div className="col-9 col-md-1">
                                    <button className="btn btn-danger text-white" onClick={this.editarNoticia.bind(this)}>
                                        Editar
                                    </button>
                                </div>
                            </div>
                            :
                            <span className="nada"></span>
                        }
                    </Otherwise>
                </Choose>
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