import React from 'react'
import Toolbar from './Toolbar'
import Menu from './Menu'
import APIInvoker from  './utils/APIInvoker'
import update from 'react-addons-update'
import { browserHistory } from 'react-router'

class IcbApp extends React.Component {

    constructor() {
        super(...arguments)
        this.state = {
            profile: null
        }
    }

    componentDidMount(){   //En el libro se usa el componentWillMount()
        // Aquí hay que comprobar el login (token y codigo, Con la ayuda de algún servicio del API)
        //Si es valida la sesión --> se tiene que configurar el estado con los datos que necesitaremos de la persona
        // Por el contrario, el 'profile: null' será suficiente para que Menú sepa que no se ha inicia sesión
        let token = window.localStorage.getItem("token")
        let codigo = window.localStorage.getItem("codigo")
        if(token == null){
            //No ha iniciado sesión --> Nose, xD. No redirigo a Iniciar Sesión, pero podría redirigir a la explicación
            browserHistory.push('/MainApp/comoFunciona')
        }
        else{  //Si el token no es nulo --> Consulto el API para ver si el token y el código son válidos
            APIInvoker.invokeGET('/icb-api/v1/relogin', response => {
                window.localStorage.setItem("token", response.body.token) //El nuevo token
                window.localStorage.setItem("codigo", response.body.codigo)
                APIInvoker.invokeGET('/icb-api/v1/usuario/'+codigo, response => {  //APIInvooker anidado :O
                    this.setState(update(this.state, { profile: { $set: response.body } }))
                    browserHistory.push('/MainApp/bienvenido')
                },
                error => {
                    alert("Error al consultar usuario"+error.message);  //Error al consultar "obtenerDatosPorCódigo"
                })  
             },
            error => {  //Cuando el token es inválido
                window.localStorage.removeItem("token")
                browserHistory.push('/MainApp/comoFunciona')
            })
        }
    }

    render() {
     //   let menu = this.state.menu
        let childs = this.props.children && React.cloneElement(this.props.children, {profile: this.state.profile})
        let esCelu = false
        if (window.innerWidth < 577) {
            esCelu = true
        }
        return (
            <div className="container-fluid px-2 div-principal">
                <Toolbar perfil={this.state.profile}/>

                <div className="row gx-0">  {/* En la misma 'row' tengo al Menú y al MainApp */}
                    <Menu esCelu={esCelu} perfil={this.state.profile} />
                    {childs}  {/* Esta incluído MainApp */}
                </div>
                <div id="dialog" className="row">
                    <div className="container">
                        <br />
                        <br />
                        <p>¿Donde estoy aquí?</p>
                    </div>
                </div>
            </div>
        )
    }
}
export default IcbApp;