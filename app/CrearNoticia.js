import React from "react"
import APIInvoker from './utils/APIInvoker'
import update from 'react-addons-update'

class CrearNoticia extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            titulo: "",
            subtitulo: "",
            image: "",
            preview: "",
            imagenUrl: "",
            deleteUrl: "",
            fechaExp: "",
            piePagina: "",
            vistaPrevia: false
        }
    }

    imageSelect(e) {
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

            let newState = update(this.state, {
                image: { $set: file }, preview: {$set: result}
            })
            this.setState(newState)
        }
        reader.readAsDataURL(file)
    }

    onChangeTarget(e) {
        //Método que se encarga de actualizar los valores del estado según cambian en los inputs
        let field = e.target.name
        let value = e.target.value
        //  let type = e.target.type   
        this.setState(update(this.state, { [field]: { $set: value } }))
        //Actualiza título, subtítulo, fechaExp e información al pie de página
    }

    verVistaPrevia(e) {
        //Función que se encarga de subir la imagen (si hay) a ImgBB y desplegar la vista previa de la noticia
        let etiqueta = document.getElementById("errorField")
        etiqueta.innerHTML = "";
        this.consultarPorValidezToken() //Si tira error 401 vuelve a '/'
    //    this.borrarImagenAnterior() //Chequea el deleteUrl y borra la imagen en caso de ser  necesario
        let oldState = this.state
        let newState = update(this.state, {vistaPrevia: {$set: true}})
        this.setState(newState)
        var formData = new FormData()
        formData.append('image', this.state.image);
        fetch('https://api.imgbb.com/1/upload?&key=2130771d0b2d02b719fc0734533ca7d5', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(json => {
                let urlImagen = json.data.url
                let newState = update(this.state, {
                    imagenUrl: { $set: urlImagen }, deleteUrl: { $set: json.data.delete_url }
                })
                this.setState(newState)
            })
            .catch(err => {
                this.setState(oldState)  //Si hay error tengo que volver el estado al modo 'no VIsta Previa'
                console.log("Error al cargar imagen: ", err.message);
            })
    }

    consultarPorValidezToken(){
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

    borrarImagenAnterior(){ //Esto no parece estar implementado por el API. Devuelve una página Web ¿?
        //Comprueba si ya se cargó una imagen por vista previa a ImgBB para borrarla
        if(this.state.deleteUrl != ""){
            fetch(this.state.deleteUrl+'?&key=2130771d0b2d02b719fc0734533ca7d5', {
                method: 'DELETE'
            })
            .then(res => res.json())
            .then(json => {
                console.log('Imagen anterior borrada: '+json.status)
            })
            .catch(err => {
                console.log('Error al borrar imagen: '+err.message)
            })
        }
    }

    salirVistaPrevia(e){
        //Función para volver a poner 'vistaPrevia' en false
        //Hará que se recarga el componente y se vea tal cuál estaba antes
        let etiqueta = document.getElementById("errorField")
        etiqueta.innerHTML = "";
        etiqueta.className = "text-white bg-danger"
        let newState = update(this.state, {vistaPrevia: {$set: false} })
        this.setState(newState)
    }

    publicarNoticia(e){
        //Solo disponible desde la vista previa
        let etiqueta = document.getElementById("errorField")
        if(this.state.titulo.length < 2 || this.state.subtitulo.length < 2 || this.state.fechaExp == ""
            || this.state.imagenUrl == ""){
            etiqueta.innerHTML = "Faltan datos. Complete los campos requeridos (*) y la imagen de la noticia";
        }
        else{
            let params = {
                "titulo": this.state.titulo,
                "subtitulo": this.state.subtitulo,
                "url_imagen": this.state.imagenUrl,
                "pie_de_pagina": this.state.piePagina,
                "fecha_de_exp": this.state.fechaExp
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

    render() {
        return (

            <div className="infoApp container-fluid">
                <Choose>
                    <When condition={!this.state.vistaPrevia} >
                        <h4>Para crear la noticia necesita completar los campos obligatorios.
                            Los mismos estan indicados con un *
                        </h4>
                        <blockquote className="text-center">
                            <h6 className="text-white bg-danger" id="errorField"></h6>
                        </blockquote>
                        <div className="row justify-content-center mb-1">
                            <div className="col-md-7 col-9" >
                                <input name="titulo" className="form-control" placeholder="Ingrese Título de la Noticia *"
                                    onChange={this.onChangeTarget.bind(this)} value={this.state.titulo} />
                            </div>
                        </div>
                        <div className="row justify-content-center mb-1">
                            <div className="col-md-7 col-9" >
                                <input name="subtitulo" className="form-control" placeholder="Ingrese Subtítulo de la Noticia *" 
                                    onChange={this.onChangeTarget.bind(this)} />
                            </div>
                        </div>
                        <div className="row justify-content-center mb-1">
                            <div className="col-md-7 col-9 mt-1" >
                                <label htmlFor="imgNoticia" className="btn btn-info text-white">Imagen Noticia</label>
                                <input type="file" name="imagen" id="imgNoticia" style={{ display: "none" }} accept=".gif,.jpg,.jpeg,.png"
                                    onChange={this.imageSelect.bind(this)} value={this.state.imagen} />
                            </div>
                        </div>
                        <div className="row justify-content-center mb-1">
                            <div className={this.state.preview == ''? "visually-hidden" :"col-9 col-md-7 p-1"} id="imgNews">
                                <img className = {this.state.vistaPrevia ? 'visually-hidden' :
                                'img-thumbnails imagen-noticia'} 
                                src={this.state.vistaPrevia ? '' : this.state.preview}/>
                            </div>
                        </div>
                        <div className="row justify-content-center mb-1">
                            <div className="col-md-7 col-9 mt-1" >
                                <label htmlFor="fechaExp" className="input-group-text">Fecha de Expiración *</label>
                                <input id="fechaExp" name="fechaExp" className="form-control" type="date"
                                    onChange={this.onChangeTarget.bind(this)} value={this.state.fechaExp} />
                            </div>
                        </div>
                        <div className="row justify-content-center mb-1">
                            <div className="col-md-7 col-9" >
                                <input type="text" name="piePagina" className="form-control" placeholder="Información al pie de página"
                                    onChange={this.onChangeTarget.bind(this)} value={this.state.piePagina} />
                            </div>
                        </div>
                        <div className="row justify-content-center mt-2">
                            <div className="col-md-3 col-auto">
                                <button className="btn btn-primary" onClick={this.verVistaPrevia.bind(this)}>Ver Vista Previa</button>
                            </div>
                            <div className="col-md-3 col-auto">
                                <button className="btn btn-primary disabled" onClick={this.publicarNoticia.bind(this)}>
                                    Publicar Noticia
                                </button>
                            </div>
                        </div>
                    </When>
                    <Otherwise>
                        <h4>{this.state.titulo}</h4>
                        <blockquote className="text-center">
                            <h6 className="text-white bg-danger" id="errorField"></h6>
                        </blockquote>
                        <div className="row justify-content-center mb-1">
                            <div className="col-md-7 col-9" >
                                {this.state.subtitulo}
                            </div>
                        </div>
                        <div className="row justify-content-center mb-1">
                            <div className="col-md-7 col-9" >
                                <img className="img-fluid rounded" alt="..." src={this.state.imagenUrl} />
                            </div>
                        </div>
                        <div className="row justify-content-center mb-1">
                            <div className="col-md-7 col-9" >
                                {this.state.piePagina}
                            </div>
                        </div>
                        <div className="row justify-content-center mt-2">
                            <div className="col-md-3 col-auto">
                                <button className="btn btn-primary" onClick={this.salirVistaPrevia.bind(this)}>Salir Vista Previa</button>
                            </div>
                            <div className="col-md-3 col-auto mt-2">
                                <button className="btn btn-primary" onClick={this.publicarNoticia.bind(this)}>
                                        Publicar Noticia
                                </button>
                            </div>
                        </div>
                    </Otherwise>
                </Choose>
            </div>
        )
    }
} export default CrearNoticia