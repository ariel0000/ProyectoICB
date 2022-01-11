import React from 'react'
import Chat from './Chat'
import APIInvoker from './utils/APIInvoker'

class GDA extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            idGda: this.props.params.gda
        }
    }

    consultarMensajes(){
        APIInvoker.invokeGET('/icb-api/v1/')
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
                            <Chat nombre={this.props.profile.nombre+' '+this.props.profile.apellido} id={this.props.params.gda+'gda'} />
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