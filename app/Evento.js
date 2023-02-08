import React, { useEffect, useState } from "react"
import APIInvoker from "./utils/APIInvoker"
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa'  
import Noticia from "./Noticia"

    const Evento = (props) => {
        const [evento, setEvento] = useState(null)
    
        useEffect(() => {
            APIInvoker.invokeGET('/icb-api/v1/eventos/'+[props.params.evento], response => {
                let noticia = {...response.body, fecha_de_exp: response.body.fecha, subtitulo: response.body.descripcion }
                setEvento(noticia)
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

    return (
        <div className="infoApp container-fluid">
                <blockquote className="text-center">
                        <h6 className="text-white bg-danger rounded" id="errorField"></h6>
                </blockquote>
                <div className="row justify-content-center m-1">
                    <div className="col-8 col-md-6 p-2">
                        <Noticia noticia={evento} />
                    </div>
                    <div className="col-2">
                    <button className="btn btn-dark text-info d-inline p-1" style={{opacity: "75%"}}>
                            <FaArrowRight onClick={console.log("Siguiente componente")}/>
                        </button>
                    </div>
                </div>
        </div>
    )
    }
export default Evento;

