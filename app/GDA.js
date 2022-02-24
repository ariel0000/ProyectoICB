import React from 'react'
import Chat from './Chat'
import APIInvoker from './utils/APIInvoker'
import update from 'react-addons-update'    

class GDA extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            idGda: this.props.params.gda,
            GDA: null,
            mensajes:[]
        }
    }

    componentDidMount(){
        this.consultarMensajes()
        this.cargarGDA()
    }

    reload = ()=>{
        console.log('La Locación:'+window.location)
        const current = window.location.pathname; 
        this.props.router.replace('/reload')
  
        setTimeout(() => {
            this.props.router.replace(current)
        }, 0);
    }

    cargarGDA(){
        //Carga el estado GDA de este componente con el GDA correspondiente
        let newState
        APIInvoker.invokeGET('/icb-api/v1/gda/'+this.state.idGda, response => {
            newState = update(this.state, {GDA: {$set: response.body}})
            this.setState(newState)
        },
        error => {
            console.log('Error: '+error.message)
        })
    }

    consultarMensajes(){
        //tengo que cargar los mensajes que corresponden a este GDA. 
        // El componente CHAT se encargará de consultar esta función pasada como prop
        let newState
        APIInvoker.invokeGET('/icb-api/v1/gda/mensajes/'+this.props.params.gda+'/?pageNumber=0&pageSize=5',
            response=> {
                newState = update(this.state, {mensajes: {$set: response.body}})
                this.setState(newState)
        },
            error=> {
                console.log('Error: '+error.message)
        })
    }

    agregarMensaje(mensaje){
        //Acá tendría que guardar el mensaje --> Luego el response con el mensaje guardado se carga en el estado
        let newState
        let params = {
            "mensaje": mensaje.mensaje,  //También tengo el idper pero eso no me sirve acá
            "persona": {
                "id": this.props.profile.id,
                "rol": {
                    "id": this.props.profile.rol.id
                }
            },
            "gda": {
                "id": this.state.GDA.id,
                "lider": {
                    "id": this.state.GDA.lider.id,
                    "rol": {
                        "id": this.state.GDA.lider.rol.id
                    }
                }
            }
        }
        APIInvoker.invokePOST('/icb-api/v1/gda/mensaje/', params, 
        response => {
            newState = update(this.state, {mensajes: {$splice: [[0, 0, response.body]]}})
            this.setState(newState) 
        },
        error => {
            console.log('Error: '+error.message)
        })
    }

    render() {
        return(
            <div className="infoApp">
                <blockquote className="text-center">
                    <h6 className="text-white">Chat del GDA</h6>
                </blockquote>
                <div className="container-fluid">
        {/*    <div className="row justify-content-center align-items-center mt-2"> //Por ahora no le encuentro sentido
                        <div className="col-3 gx-2"><button className="btn btn-primary text-white">Editar GDA</button></div>
                        <div className="col-3 gx-2"><button className="btn btn-info text-white">Editar Participantes</button></div>
                </div> --> */}
                    <div className="row justify-content-center align-items-center mt-2">
                        <div className="col-12 gx-2">
                            <Chat idpersona={this.props.profile.id} 
                                id={this.props.params.gda+'gda'} reload={this.reload.bind(this)} 
                                getMensajes={this.consultarMensajes.bind(this)} mensajes={this.state.mensajes}
                                addMsg={this.agregarMensaje.bind(this)} />
                        </div>
                    </div>
                    <div className="row justify-content-center align-items-center mt-2">
                        <div className="col-12 gx-1">Integrantes</div>
                    </div>
                </div>
            </div>
        )
    }
}
export default GDA;