import React from "react"
import APIInvoker from './utils/APIInvoker'
import update from 'react-addons-update'

class CrearNoticia extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            titulo: "",
            subtitulo: "",
            imagen: "",
            fechaExp: "",
            piePagina: ""
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
            image: {$set: result}
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

    render(){
        return(
            <div className="infoApp container-fluid">
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
                        <button className="btn btn-primary">Ver Vista Previa</button>
                    </div>
                </div>
            </div>
        )
    }
} export default CrearNoticia