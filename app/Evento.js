import React, { useEffect, useState, useRef } from "react"
import APIInvoker from "./utils/APIInvoker"
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa'  
import Noticia from "./Noticia"
import CrearNoticiaa from "./CrearNoticiaa"
import styled, { css } from 'styled-components'
import {format} from 'date-fns';

const CarouselImg = styled.div`
  max-width: 500px;
  width: 100%;
  height: auto;
  opacity: 0;
  transition: 1s;
  &.loaded {
    opacity: 1;
  }
`;

const Evento = (props) => {
    const [evento, setEvento] = useState()
    const [rol, setRol] = useState(props.profile? props.profile.rol.nivel: 0)
    const [modoEdicion, setModoEdicion] = useState(false)
    const [eventos, setEventos] = useState([])
    const [indiceEvento, setIndiceEvento] = useState(0)
    const [loaded, setLoaded] = useState(false)
    const eventosRef = useRef(null)
    const indiceRef = useRef(indiceEvento)

    useEffect(() => {
        indiceRef.current = indiceEvento;
        eventosRef.current = eventos;
      })

      
    useEffect(() => {
        APIInvoker.invokeGET('/icb-api/v1/eventos/', async response => {
            const body = response.body.map((evento) => {
                return {...evento, fechaExp: evento.fecha_de_exp }
            })
            setEventos(body)
            setEvento(body[0])
        },
        error => {
            if (error.status == 401) {
                alert("Debe iniciar sesión para poder entrar aquí")
                window.localStorage.removeItem("token")
                window.localStorage.removeItem("codigo")
                window.location = ('/')
            }
            else {
                document.getElementById("errorField").innerText = "Error: " + error.message
                return
            }
        })
        const interval = setInterval(() => {
            selectNewEvento(indiceRef.current, eventosRef.current);
        }, 15000);
        return () => {
            clearInterval(interval)
        }
        
    }, []);

    const selectNewEvento = (indice, eventos) => {
        if(eventos.length == 0) { return }
        setLoaded(false)
        setTimeout(() => {
            if(indice == eventos.length-1){ // No puedo incrementar el índice, debo volver al principio
                setIndiceEvento(0)
            }
            else{
                setIndiceEvento(indice+1)
            }
        }, 500)
    }

    const cambiarModoEdicion = (e) => {
        setModoEdicion(!modoEdicion);
    }

    const avanzarSiguienteEvento = (e) => {
        if(eventos.length == 0) { return }
        let indiceActual = indiceEvento
        if(indiceActual < eventos.length-1){
            setIndiceEvento(indiceActual+1)
            setEvento(indiceActual+1)
        }
        else{
            setIndiceEvento(0)
        }
        document.getElementById("errorField").innerText = ""
    }

    const retrocederAnteriorEvento = (e) => {
        if(eventos.length == 0) { return }
        let indiceActual = indiceEvento
        if(indiceActual > 0){
            setIndiceEvento(indiceActual - 1)
        }
        else{
            setIndiceEvento(eventos.length-1)
        }
        document.getElementById("errorField").innerText = ""
    }

    const borrarEvento = (e) => {
        if(eventos.length == 0) { return }
        APIInvoker.invokeDELETE('/icb-api/v1/evento/'+eventos[indiceEvento].id, response => {
            setEventos(eventos.filter(evento => evento != eventos[indiceEvento])) // Quito el evento actual ( el que el usuario esta viendo )
            setIndiceEvento(0)
            // Estaría bueno agregar un toast
        }, 
        error => {
            document.getElementById("errorField").innerText = "Error: " + error.message
        })

    }

    return (
        <div className="infoApp container-fluid ">
            <blockquote className="text-center">
                <h6 className="text-white bg-danger rounded" id="errorField"></h6>
            </blockquote>
            <Choose>
                <When condition={modoEdicion} >
                    <CrearNoticiaa tipo={"Evento"} id={eventos[indiceEvento].id} titulo={eventos[indiceEvento].titulo} subtitulo={eventos[indiceEvento].subtitulo} imagenUrl={eventos[indiceEvento].url_imagen}
                        fechaExp={format(new Date(eventos[indiceEvento].fecha_de_exp), 'yyyy-MM-dd')} deleteUrl={eventos[indiceEvento].deleteUrl} piePagina={eventos[indiceEvento].pie_de_pagina} />
                </When>
                <Otherwise>
                    <If condition={evento} >
                    <div className="row justify-content-center m-1">
                    <div className="col-auto align-self-center opacity-50 p-0">
                            <button className="btn btn-dark text-info d-inline pt-2" style={{ opacity: "75%" }} onClick={retrocederAnteriorEvento} >
                                <FaArrowLeft />
                            </button>
                        </div>
                        <div className="col-8 col-md-5 p-2">
                        {/* <CarouselImg src={eventos[indiceEvento].url_imagen}
                                alt="Gentleman"
                                className={loaded ? "loaded" : ""}
                                onLoad={() => setLoaded(true)}
                                > */}
                            <CarouselImg className={loaded ? "loaded" : ""}>
                                <Noticia noticia={eventos[indiceEvento]} onLoad={() => setLoaded(true)} />
                            </CarouselImg>
                        </div>
                        <div className="col-auto align-self-center opacity-50 p-0">
                            <button className="btn btn-dark text-info d-inline pt-2" style={{ opacity: "75%" }} onClick={avanzarSiguienteEvento}  >
                                <FaArrowRight />
                            </button>
                        </div>
                    </div>
                    </If>
                    <div className="row justify-content-center m-1">
                        {(rol > 2) ?
                            <div className="col-10 col-md-5 p-1">
                                <button className="btn btn-primary text-white d-inline p-1 m-1" onClick={cambiarModoEdicion}>
                                    Editar
                                </button>
                                <button className="btn btn-danger text-white d-inline p-1 m-1" onClick={borrarEvento}>
                                    Borrar
                                </button>
                            </div>
                            :
                            <div>...</div>
                        }
                    </div>
                    <div className="row justify-content-center m-1">
                        <div className="col-10 col-md-6">
                            <button className="btn btn-primary text-white d-inline p-1 m-1">
                                Anotarse
                            </button>
                        </div>
                    </div>
                </Otherwise>
            </Choose>
        </div>
    )
}
export default Evento;

