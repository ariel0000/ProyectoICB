import React from "react"
import APIInvoker from './utils/APIInvoker'
import update from 'react-addons-update'

class CrearNoticia extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            noticias: []
        }
    }

    componentDidMount(){
        //Tengo que cargar las noticias
        let etiqueta = document.getElementById("errorField")
        APIInvoker.invokeGET('/icb-api/v1/noticia', response => {
            let newState = update(this.state, {noticias: {$set: response.body}})
            this.setState(newState)
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

    render(){
        let noticias = this.state.noticias
        return(
        <div className="infoApp container-fluid">
            <blockquote className="text-center">
                <h6 className="text-white bg-danger" id="errorField"></h6>
            </blockquote>
            <div className="row justify-content-center mb-1">
                <div className="col-9 col-md-7">
                    <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
                        {noticias.map((noticia, i) => 
                            <div key={i} className="carousel-inner">
                                <div className="carousel-item">
                                    <img src={noticia.url_imagen} alt="..." className="d-block w-100" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
        )
    }
}
export default CrearNoticia;