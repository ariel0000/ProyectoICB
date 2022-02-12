import React from 'react'
import Chat from './Chat'
import APIInvoker from './utils/APIInvoker'
import update from 'react-addons-update'    

class GDA extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            idGda: this.props.params.gda,
            mensajes:[]
        }
    }

    componentDidMount(){
        this.consultarMensajes()
    }

    reload = ()=>{
        console.log('La Locación:'+window.location)
        const current = window.location.pathname; 
        this.props.router.replace('/reload')
  
        setTimeout(() => {
            this.props.router.replace(current)
        }, 0);
    }

    consultarMensajes = () => {
        //tengo que cargar los mensajes que corresponden a este GDA. 
        // El componente CHAT se encargará de consultar esta función pasada como prop
        let newState
        APIInvoker.invokeGET('/icb-api/v1/gda/mensajes/'+this.props.params.gda+'/?pageNumber=0&pageSize=5',
            response=> {
                newState = update(this.state, {mensajes: {$push: response.body}})
                this.setState(newState)
        },
            error=> {
                console.log('Error: '+error.message)
        })
    }

    agregarMensaje(mensaje){
        let newState = update(this.state, {mensajes: {$splice: [[0, 0, mensaje]]}})
        this.setState(newState)
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
                            <Chat nombre={this.props.profile.nombre+' '+this.props.profile.apellido} 
                                id={this.props.params.gda+'gda'} reload={this.reload.bind(this)} 
                                getMensajes={this.consultarMensajes.bind(this)} mensajes={this.state.mensajes}
                                addMsg={this.agregarMensaje.bind(this)}/>
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