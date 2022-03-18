import React from 'react';
import { FaBell, FaUserAlt} from 'react-icons/fa'
import {GrLogin} from 'react-icons/gr'
import { browserHistory } from 'react-router'

/* Podría definir un css e importarlo como lo hice en Index.js */

class Toolbar extends React.Component {

    constructor() {
        super(...arguments)
        this.state = {
            notificaciones: []
        }
    }

    redirigir(e){
        e.preventDefault()
        browserHistory.push('/login')
    }

    render() {
        return (
                <div className="row toolbar">
                    <div className="col-xs-12 col-sm-12 col-md-12">  
                    
                        <div className="d-flex justify-content-end text-primary bg-white">
                            <div className="me-auto p-2 bd-highlight order-1 order-sm-0 order-md-0" >
                                <label htmlFor={"notificador"} className="btn btn-info text-white">
                                    <FaBell />
                                </label>
                                <input href="#" className="d-none" accept=".gif, .jpg, .png, .bmp" type="file" 
                                id={"notificador"} ></input>
                            </div>
                            <div className="me-auto p-2 order-sm-1 order-2 order-md-1" >
                                <img src="/img/IcbBanner.png" alt="Banner" style={{maxWidth: 100+'px'}} />
                            </div>
                            <div className="p-2 bd-highlight order-3 order-sm-2 order-md-2">
                            <Choose>
                                <When condition={this.props.perfil != undefined}>
                                    <p>
                                        Hola {this.props.perfil.nombre} !
                                    </p>
                                </When>
                                <Otherwise>
                                    <p>
                                        Sin Logearse
                                    </p>
                                </Otherwise>
                            </Choose>
                                {/*<label htmlFor={"perfil"} className="btn btn-light ">
                                    <GrLogin />
                                    <input href="#" className="d-none" type="button" 
                                    id={"login"} onClick={this.redirigir.bind(this)}></input>
                                </label> */}
                            </div>
                        </div>
                    </div>
                </div>
                )
            }

}
export default Toolbar;