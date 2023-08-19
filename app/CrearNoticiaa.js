import React, { useEffect, useState } from "react"
import APIInvoker from './utils/APIInvoker'
import { browserHistory } from "react-router"

const CrearNoticiaa = (props) => {
    let obj = {titulo: "", subtitulo: "", imagen: "", preview: "", imagenUrl: "", deleteUrl: "", piePagina: "" }
    let newObj = obj
    if(props.tipo){
        newObj = {...newObj,                 
            titulo: props.titulo,
            subtitulo: props.subtitulo,
            imagen: "",
            preview: "",
            imagenUrl: props.imagenUrl,
            deleteUrl: props.deleteUrl,
            piePagina: props.piePagina? props.piePagina : ""
        }
    }
    const [noticia, setNoticia] = useState(newObj)
    const [fechaExp, setFechaExpiracion] = useState()
    const [vistaPrevia, setVistaPrevia] = useState(false)
    const [urlRedireccion, setUrlRedireccion] = useState("/MainApp/noticias")
    const [isNoticia, setIsNoticia] = useState(true)
    const [tipo, setTipo] = useState("Noticia")
    const [error, setError] = useState("")
    const [isError, setIsError] = useState(false)
    const [urlPost, setUrlPost] = useState("/icb-api/v1/noticia")
    const [edicion, setEdicion] = useState(false)

    useEffect(() => {
        // Hay que chequear si existe algún prop para saber si voy a editar y cargar los otros valores
        if(props.tipo){
            document.getElementById("fechaExp").value = props.fechaExp? props.fechaExp: ""
            setFechaExpiracion(props.fechaExp? props.fechaExp: null)
            setNoticia({...noticia, preview: obtenerImagen(props.imagenUrl)}) // El props tipo me va a servir para discriminar entre uso desde otro componente y uso desde navegador browser history
            setEdicion(true)
            if(props.tipo == "Evento"){
                setIsNoticia(false)
                setTipo("Evento")
                setUrlPost("/icb-api/v1/evento") 
                setUrlRedireccion("/MainApp/eventos/1") // Dsps cambiar por eventos (cuando este listo el componente verEventos)
            }
        }  // Si no hay props tipo --> props.location.pathname existe porque vengo desde browserHistory
        else{
            setIsNoticia(props.location.pathname == "/MainApp/nuevaNoticia") 
            if(!isNoticia){
                setTipo("Evento")
                setUrlPost("/icb-api/v1/evento") 
                setUrlRedireccion("/MainApp/eventos/1") // Dsps cambiar por eventos (cuando este listo el componente verEventos)
            }
        }
        
    }, [])

    const obtenerImagen = async (imagenUrl) => {
        if(!imagenUrl) return; // Puede pasar aunque no debería
        let reader = new FileReader();
        var file = new File([await (await fetch(imagenUrl)).blob()], imagenUrl)
        
        reader.onloadend = () => { //
            const result = reader.result
            setNoticia({...noticia, image: file, preview: result})
            setError("")
            setIsError(false)
        }

        reader.readAsDataURL(file)
    }

    const verVistaPrevia = (e) => {
        setError("")
        consultarPorValidezToken(); //Si tira error 401 vuelve a '/'
        if(noticia.titulo.length < 2 || noticia.subtitulo.length < 2 || noticia.preview == "" || !fechaExp){
            setError("Faltan datos. Complete los campos requeridos (*) y la imagen de la noticia")
            setIsError(true)
            return
        }
        else{
            if(!noticia.imagenUrl || !estaEnElServer(noticia.imagenUrl)){ // Si es nulo o no está en el server --> cargo la nueva imagen
                APIInvoker.invokeUploadImg(noticia.image,             
                response => {
                    let urlImagen = "/img/"+response.body.fileName
                    setNoticia({...noticia, imagenUrl: urlImagen })
                    setVistaPrevia(true)
                },
                error=> {
                    setError(error.message)
                    setIsError(true)
                })
            }
            else{ // Si no es nulo vengo de edición en la primera vez que aprieto ver vista previa sin cambiar la imagen
                setVistaPrevia(true)
            }
        }
    }

    const estaEnElServer = (urlImagen) => {
        let estaEnElServer = false;
        APIInvoker.invokeGET('/icb-api/v1/uploads/img/'+urlImagen.substring(5), 
        response => {
            estaEnElServer = true;
        },
        error => {
            if(error.status == 401){
                alert("Debe iniciar sesión para poder entrar aquí")
                window.localStorage.removeItem("token")
                window.localStorage.removeItem("codigo")
                window.location = ('/')
            }
            // else: No se agrega el error porque es parte del flujo normal
        })
        return estaEnElServer;
    }

    const publicarNoticia = (e) => {
    //Solo disponible desde la vista previa
        consultarPorValidezToken();
        let params = {
            "id": (props.id)? props.id : null,
            "titulo": noticia.titulo,
            "subtitulo": noticia.subtitulo,
            "url_imagen": noticia.imagenUrl,
            "pie_de_pagina": noticia.piePagina,
            "fecha_de_exp": fechaExp
        }
        APIInvoker.invokePOST(urlPost, params, response => {
            setIsError(false)
            if(isNoticia){ setError(tipo+" publicada") }
            else{ setError(tipo+" publicado") }
            var timer = setInterval( () => {
                browserHistory.push(urlRedireccion)
                clearInterval(timer)
            }, 2000)
        }, 
        error => {
            setError(error.message)
            setIsError(true)
        })
    }

    const salirVistaPrevia = (e) => {
        //Función para volver a poner 'vistaPrevia' en false
        //Hará que se recarga el componente y se vea tal cuál estaba antes
        if(!edicion){
            borrarImagen()
        }
        else if(props.imagenUrl != noticia.imagenUrl){ // Estoy en edición y además cargue una imagen nueva
            borrarImagen()
            setError("");
            setIsError(false)
            setVistaPrevia(false)
        }
        // Estoy en edición y no cargue imagen nueva --> No hago nada
        setVistaPrevia(false)
    }

    const borrarImagen = () => {
        APIInvoker.invokeDELETE('/icb-api/v1/uploads/img/'+noticia.imagenUrl.substring(5), // quito "/img/"
        response => {
            setError(response.message);
            setIsError(false)
        },
        error => {
            setError(error.message);
            setIsError(true)
        })
    }
    const imageSelect = (e) => {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];
        let tipo = file.type
        
        if (file.size > 3720000) {
            alert('La imagen supera el máximo de 3MB')
            return
        }
        if (!(tipo == 'image/jpeg' || tipo == 'image/png' || tipo == 'image/jpg')) {
            setError("El formato no es admitido: " + tipo)
            setIsError(true)
            return
        }
        reader.onloadend = () => { //
            const result = reader.result
            setNoticia({...noticia, image: file, preview: result})
            setError("")
            setIsError(false)
        }
        reader.readAsDataURL(file)
    }

    const onChangeTarget = (e) => {
        setError("")
        setIsError(false)
        //Método que se encarga de actualizar los valores del estado según cambian en los inputs
        let field = e.target.name
        let value = e.target.value
        //  let type = e.target.type   

        setNoticia({...noticia, [field]: value})
        //Actualiza título, subtítulo e información al pie de página
    }

    const edicionFecha = (e) => {
        setFechaExpiracion(e.target.value)
        setError("")
        setIsError(false)
    }

    const consultarPorValidezToken = (e) => {
        APIInvoker.invokeGET('/icb-api/v1/relogin', response => {
            console.log('Token válido: '+response.status)
        },
        error => {
            if (error.status == 401){
                alert("Debe iniciar sesión para poder entrar aquí")
                window.localStorage.removeItem("token")
                window.localStorage.removeItem("codigo")
                window.location = ('/')
            }
            console.log('Error: '+error.message)
        })
    }

    return (
        <div className="infoApp container-fluid">
            <Choose>
                <When condition={!vistaPrevia} >
                    <h4>Para crear {isNoticia ? "la noticia" : "el evento"} necesita completar los campos obligatorios.
                        Los mismos estan indicados con un *
                    </h4>
                    <blockquote className="text-center">
                        <h6 className={isError ? "text-white bg-danger" : "text-white"} id="errorField">
                            {error}
                        </h6>
                    </blockquote>
                    <div className="row justify-content-center mb-1">
                        <div className="col-md-7 col-9" >
                            <input name="titulo" className="form-control" placeholder="Ingrese Título *"
                                onChange={onChangeTarget} value={noticia.titulo} />
                        </div>
                    </div>
                    <div className="row justify-content-center mb-1">
                        <div className="col-md-7 col-9" >
                            <input name="subtitulo" className="form-control" placeholder="Ingrese Subtítulo *"
                                onChange={onChangeTarget} value={noticia.subtitulo} />
                        </div>
                    </div>
                    <div className="row justify-content-center mb-1">
                        <div className="col-md-7 col-9 mt-1" >
                            <label htmlFor="imgNoticia" className="btn btn-info text-white">{isNoticia ? "Imagen Noticia" : "Imagen Evento"}</label>
                            <input type="file" name="imagen" id="imgNoticia" style={{ display: "none" }} accept=".gif,.jpg,.jpeg,.png"
                                onChange={imageSelect} value={noticia.imagen} />
                        </div>
                    </div>
                    <div className="row justify-content-center mb-1">
                        <div className={noticia.preview == '' ? "visually-hidden" : "col-9 col-md-7 p-1"} id="imgNews">
                            <img className={noticia.vistaPrevia ? 'visually-hidden' :
                                'img-thumbnails imagen-noticia'}
                                src={vistaPrevia ? '' : noticia.preview} />
                        </div>
                    </div>
                    <div className="row justify-content-center mb-1">
                        <div className="col-md-7 col-9 mt-1" >
                            <label htmlFor="fechaExp" className="input-group-text">Fecha {isNoticia? "de Expiración *": ""} </label>
                            <input id="fechaExp" name="fechaExp" className="form-control" type="date" onChange={edicionFecha}/>
                        </div>
                    </div>
                    <div className="row justify-content-center mb-1">
                        <div className="col-md-7 col-9" >
                            <input type="text" name="piePagina" className="form-control" placeholder="Información al pie de página"
                                onChange={onChangeTarget} value={noticia.piePagina} />
                        </div>
                    </div>
                    <div className="row justify-content-center mt-2">
                        <div className="col-md-3 col-auto">
                            <button className="btn btn-primary" onClick={verVistaPrevia}>Ver Vista Previa</button>
                        </div>
                        <div className="col-md-3 col-auto">
                            <button className="btn btn-primary disabled" onClick={publicarNoticia}>
                                Publicar &nbsp; {tipo}
                            </button>
                        </div>
                    </div>
                </When>
                <Otherwise>
                    <h4>{noticia.titulo}</h4>
                    <blockquote className="text-center">
                        <h6 className={isError ? "text-white bg-danger" : "text-white"} id="errorField">
                            {error}
                        </h6>
                    </blockquote>
                    <div className="row justify-content-center mb-1">
                        <div className="col-md-7 col-9" >
                            {noticia.subtitulo}
                        </div>
                    </div>
                    <div className="row justify-content-center mb-1">
                        <div className="col-md-6 col-9" >
                            <img className="img-fluid rounded" alt="..." src={noticia.imagenUrl} />
                        </div>
                    </div>
                    <div className="row justify-content-center mb-1">
                        <div className="col-md-7 col-9" >
                            {noticia.piePagina}
                        </div>
                    </div>
                    <div className="row justify-content-center mt-2">
                        <div className="col-md-3 col-auto mt-1">
                            <button className="btn btn-primary" onClick={salirVistaPrevia}>Salir Vista Previa</button>
                        </div>
                        <div className="col-md-3 col-auto mt-1">
                            <button className="btn btn-primary" onClick={publicarNoticia}>
                                Publicar&nbsp; {tipo}
                            </button>
                        </div>
                    </div>
                </Otherwise>
            </Choose>
        </div>
    )

}
export default CrearNoticiaa;