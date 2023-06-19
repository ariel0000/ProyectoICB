import React, { useEffect, useState } from "react"
import APIInvoker from './utils/APIInvoker'

const CrearNoticiaa = (props) => {
    const [noticia, setNoticia] = useState({
        titulo: "",
        subtitulo: "",
        imagen: "",
        preview: "",
        imagenUrl: "",
        deleteUrl: "",
        fechaExp: "",
        piePagina: ""
    })
    const [vistaPrevia, setVistaPrevia] = useState(false)
    const [urlRedireccion, setUrlRedireccion] = useState(props.urlRedireccion)

    useEffect(() => {
        // Hay que chequear si existe algún prop para saber si voy a editar y cargar los otros valores
        if(props.tipo){
            let noticia = {
                titulo: props.titulo,
                subtitulo: props.subtitulo,
                imagen: "",
                preview: "",
                imagenUrl: props.imagenUrl,
                deleteUrl: props.deleteUrl,
                fechaExp: props.fechaExp,
                piePagina: props.piePagina
            }
            // Se podría cargar el preview de alguna manera
            setNoticia(noticia)
        }
        
    }, [])

    const verVistaPrevia = (e) => {
        //Función que se encarga de subir la imagen (si hay) a ImgBB y desplegar la vista previa de la noticia
        let etiqueta = document.getElementById("errorField")
        etiqueta.innerHTML = "";
        consultarPorValidezToken(); //Si tira error 401 vuelve a '/'

    /*    borrarImagenAnterior() //Chequea el deleteUrl y borra la imagen en caso de ser  necesario
        //** TODO : código en desuso - era para utilizar el API de imgBB
        let oldState = noticia;
        var formData = new FormData()
        formData.append('image', noticia.image);
        fetch('https://api.imgbb.com/1/upload?&key=2130771d0b2d02b719fc0734533ca7d5', {
            method: 'POST',
            body: formData
        }) 
            .then(res => res.json())
            .then(json => {
                let urlImagen = json.data.url
                setNoticia({...noticia, imagenUrl: urlImagen, deleteUrl: json.data.delete_url })
             })
            .catch(err => {
                setNoticia({...oldState})  //Si hay error tengo que volver el estado al modo 'no VIsta Previa'
                console.log("Error al cargar imagen: ", err.message);
            }) */
            
            APIInvoker.invokeUploadImg(noticia.image,             
            response => {
                let urlImagen = "/img/"+response.body.fileName
                setNoticia({...noticia, imagenUrl: urlImagen })
                setVistaPrevia(true)
            },
            error=> {
                if (error.status == 401){
                    alert("Debe iniciar sesión para poder entrar aquí")
                    window.localStorage.removeItem("token")
                    window.localStorage.removeItem("codigo")
                    window.location = ('/')
                }
                else if(error.status = 404){
                    let etiqueta = document.getElementById("errorField")
                    etiqueta.innerHtml = error.message
                }
                console.log('Error: '+error.message)
            })

    }

    const publicarNoticia = (e) => {
        //Solo disponible desde la vista previa
        let etiqueta = document.getElementById("errorField")
        if(noticia.titulo.length < 2 || noticia.subtitulo.length < 2 || noticia.fechaExp == ""
            || noticia.imagenUrl == ""){
            etiqueta.innerHTML = "Faltan datos. Complete los campos requeridos (*) y la imagen de la noticia";
        }
        else{
            let params = {
                "titulo": noticia.titulo,
                "subtitulo": noticia.subtitulo,
                "url_imagen": noticia.imagenUrl,
                "pie_de_pagina": noticia.piePagina,
                "fecha_de_exp": noticia.fechaExp
            }
            APIInvoker.invokePOST('/icb-api/v1/noticia', params, response => {
                //Tendría que redirigir a una especia de noticias publicadas ¿?
                etiqueta.className = 'text-white bg-success'
                etiqueta.innerHTML="Noticia Publicada"
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
    }

    const salirVistaPrevia = (e) => {
        //Función para volver a poner 'vistaPrevia' en false
        //Hará que se recarga el componente y se vea tal cuál estaba antes
        let etiqueta = document.getElementById("errorField")
        etiqueta.innerHTML = "";
        etiqueta.className = "text-white bg-danger"
        setVistaPrevia(false)
    }

    const imageSelect = (e) => {
        e.preventDefault();
        let preview = document.getElementById("imgNews")
        let reader = new FileReader();
        let file = e.target.files[0];
        let tipo = file.type
        
        if (file.size > 3720000) {
            alert('La imagen supera el máximo de 3MB')
            return
        }
        if (!(tipo == 'image/jpeg' || tipo == 'image/png' || tipo == 'image/jpg')) {
            console.log("El formato no es admitido: " + tipo)
            return
        }
        reader.onloadend = () => { //
            const result = reader.result
            setNoticia({...noticia, image: file, preview: result})
        }
        reader.readAsDataURL(file)
    }

    const onChangeTarget = (e) => {
        //Método que se encarga de actualizar los valores del estado según cambian en los inputs
        let field = e.target.name
        let value = e.target.value
        //  let type = e.target.type   

        setNoticia({...noticia, [field]: value})
        //Actualiza título, subtítulo, fechaExp e información al pie de página
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

    return(
        <div className="infoApp container-fluid">
            <Choose>
                <When condition={!vistaPrevia} >
                    <h4>Para crear la noticia necesita completar los campos obligatorios.
                        Los mismos estan indicados con un *
                    </h4>
                    <blockquote className="text-center">
                        <h6 className="text-white bg-danger" id="errorField"></h6>
                    </blockquote>
                    <div className="row justify-content-center mb-1">
                        <div className="col-md-7 col-9" >
                            <input name="titulo" className="form-control" placeholder="Ingrese Título de la Noticia *"
                                onChange={onChangeTarget} value={noticia.titulo} />
                        </div>
                    </div>
                    <div className="row justify-content-center mb-1">
                        <div className="col-md-7 col-9" >
                            <input name="subtitulo" className="form-control" placeholder="Ingrese Subtítulo de la Noticia *" 
                                onChange={onChangeTarget} value={noticia.subtitulo} />
                        </div>
                    </div>
                    <div className="row justify-content-center mb-1">
                        <div className="col-md-7 col-9 mt-1" >
                            <label htmlFor="imgNoticia" className="btn btn-info text-white">Imagen Noticia</label>
                            <input type="file" name="imagen" id="imgNoticia" style={{ display: "none" }} accept=".gif,.jpg,.jpeg,.png"
                                onChange={imageSelect} value={noticia.imagen} />
                        </div>
                    </div>
                    <div className="row justify-content-center mb-1">
                        <div className={noticia.preview == ''? "visually-hidden" :"col-9 col-md-7 p-1"} id="imgNews">
                            <img className = {noticia.vistaPrevia ? 'visually-hidden' :
                            'img-thumbnails imagen-noticia'} 
                            src={vistaPrevia ? '' : noticia.preview}/>
                        </div>
                    </div>
                    <div className="row justify-content-center mb-1">
                        <div className="col-md-7 col-9 mt-1" >
                            <label htmlFor="fechaExp" className="input-group-text">Fecha de Expiración *</label>
                            <input id="fechaExp" name="fechaExp" className="form-control" type="date"
                                onChange={onChangeTarget} value={noticia.fechaExp} />
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
                                Publicar Noticia
                            </button>
                        </div>
                    </div>
                </When>
                <Otherwise>
                    <h4>{noticia.titulo}</h4>
                    <blockquote className="text-center">
                        <h6 className="text-white bg-danger" id="errorField"></h6>
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
                                    Publicar&nbsp; {props.tipo}
                            </button>
                        </div>
                    </div>
                </Otherwise>
            </Choose>
        </div>
    )

}
export default CrearNoticiaa;