import React, { useEffect, useState } from "react"
import APIInvoker from "./utils/APIInvoker"
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa'  
import Noticia from "./Noticia"
import CrearNoticiaa from "./CrearNoticiaa"

    const Evento = (props) => {
        const [evento, setEvento] = useState(null)
        const [rol, setRol] = useState(props.profile.rol.nivel)
        const [modoEdicion, setModoEdicion] = useState(false)
    
        useEffect(() => {
            APIInvoker.invokeGET('/icb-api/v1/eventos/'+[props.params.evento], response => {
                let evento = {...response.body, fecha_de_exp: response.body.fecha }
                setEvento(evento)
            }, 
            error => {
                if (error.status == 401) {
                    alert("Debe iniciar sesión para poder entrar aquí")
                    window.localStorage.removeItem("token")
                    window.localStorage.removeItem("codigo")
                    window.location = ('/')
                }
                else {
                    //document.getElementById("errorField").innerText = "Error: " + error.message
                    console.log("Error: "+error.message)
                }
            })
        }, [props.params.evento]);

        const cambiarModoEdicion = (e) => {
            setModoEdicion(!modoEdicion);
        }

    return (
        <div className="infoApp container-fluid ">
            <blockquote className="text-center">
                    <h6 className="text-white bg-danger rounded" id="errorField"></h6>
            </blockquote>
            <Choose>
            <When condition={modoEdicion} >
                <CrearNoticiaa tipo={"Evento"} id={evento.id} titulo={evento.titulo} subtitulo={evento.subtitulo} imagenUrl={evento.url_imagen}
                fechaExp = {evento.fecha_de_exp} deleteUrl= {evento.deleteUrl} piePagina = {evento.pie_de_pagina} />
            </When>
            <Otherwise>
                <div className="row justify-content-center align-items-center m-1">
                    <div className="col-10 col-md-5 p-2">
                        <Noticia noticia={evento} />
                    </div>
                    <div className="col-1">
                        <button className="btn btn-dark text-info d-inline pt-2" style={{opacity: "75%"}}>
                            <FaArrowRight onClick={console.log("Siguiente componente")}/>
                        </button>
                    </div>
                </div>
                <div className="row justify-content-center m-1">
                {(rol > 2)?
                    <div className="col-10 col-md-5 p-1">
                        <button className="btn btn-primary text-white d-inline p-1 m-1" onClick={cambiarModoEdicion}>
                            Editar
                        </button>
                        <button className="btn btn-danger text-white d-inline p-1 m-1">
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

