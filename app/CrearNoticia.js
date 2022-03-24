import React from "react"
import APIInvoker from './utils/APIInvoker'
import update from 'react-addons-update'

class CrearNoticia extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            titulo: "",
            subtitulo: "",
            image: "",
            imagenUrl: "",
            deleteUrl: "",
            fechaExp: "",
            piePagina: "",
            vistaPrevia: false
        }   
    }

    imageSelect(e){
        e.preventDefault();
            let preview = document.getElementById("imgNews")
            let reader = new FileReader();
            let file = e.target.files[0];
            let tipo = file.type
            const img = new Image(150, 100)
            if(file.size > 3720000){
                alert('La imagen supera el máximo de 3MB')
                return 
            }
            if(!(tipo == 'image/jpeg' || tipo == 'image/png' || tipo == 'image/jpg' )){
                console.log("El formato no es admitido: "+tipo)
                return
            }
        reader.onloadend = () => { //
            const result = reader.result
            img.src = result
            img.className = 'img-thumbnails imagen-noticia';
            preview.innerHTML = '';
            preview.append(img)

            let newState = update(this.state,{
            image: {$set: file}
        })
            this.setState(newState)
        }
        reader.readAsDataURL(file)   
    }

    onChangeTarget(e){
        //Método que se encarga de actualizar los valores del estado según cambian en los inputs
        let field = e.target.name
        let value = e.target.value
      //  let type = e.target.type   
        this.setState(update(this.state,{ [field]: {$set: value}})) 
        //Actualiza título, subtítulo, fechaExp e información al pie de página
    }

    verVistaPrevia(e){
        //Función que se encarga de subir la imagen (si hay) a ImgBB y desplegar la vista previa de la noticia
       // var reqBody = "--location --request --form"+this.state.imagen
        var formData = new FormData()
        formData.append('image', this.state.image);
        fetch('https://api.imgbb.com/1/upload?&key=2130771d0b2d02b719fc0734533ca7d5', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(json => {
            let urlImagen = json.data.url
            let newState = update(this.state, {imagenUrl: {$set: urlImagen}, vistaPrevia: {$set: true},
            deleteUrl: {$set: json.data.deleteUrl}})
            this.setState(newState)
        })
        .catch(err => {
            console.log("Error al cargar imagen: ", err.message);
        })
    }

    render(){
        return(
            
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
                        onChange={this.onChangeTarget.bind(this)} value={this.state.titulo}/>
                    </div>
                </div>
                <div className="row justify-content-center mb-1">
                    <div className="col-md-7 col-9" >
                        <input className="form-control" placeholder="Ingrese Subtítulo de la Noticia" />
                    </div>
                </div>
                <div className="row justify-content-center mb-1">
                    <div className="col-md-7 col-9 mt-1" >
                        <label htmlFor="imgNoticia" className="btn btn-info text-white">Imagen Noticia</label>
                        <input type="file" name="imagen" id="imgNoticia" style={{display:"none"}} accept=".gif,.jpg,.jpeg,.png" 
                        onChange={this.imageSelect.bind(this)} value={this.state.imagen}/>
                    </div>
                </div>
                <div className="row justify-content-center mb-1">
                    <div className="col-9 col-md-7 p-1" id="imgNews"></div>
                </div>
                <div className="row justify-content-center mb-1">
                    <div className="col-md-7 col-9 mt-1" >
                        <label htmlFor="fechaExp" className="input-group-text">Fecha de Expiración</label>
                        <input id="fechaExp" name="fechaExp" className="form-control" type="date" 
                        onChange={this.onChangeTarget.bind(this)} value={this.state.fechaExp}/>
                    </div>
                </div>
                <div className="row justify-content-center mb-1">
                    <div className="col-md-7 col-9" >
                        <input type="text" name="piePagina" className="form-control" placeholder="Información al pie de página" 
                        onChange={this.onChangeTarget.bind(this)} value={this.state.piePagina}/>
                    </div>
                </div>
                <div className="row justify-content-center mt-2">
                    <div className="col-md-7 col-9">
                        <button className="btn btn-primary" onClick={this.verVistaPrevia.bind(this)}>Ver Vista Previa</button>
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
                </Otherwise>
                </Choose>
            </div>
        )
    }
} export default CrearNoticia