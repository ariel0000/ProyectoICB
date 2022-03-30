import React from 'react'
import update from 'react-addons-update'
import APIInvoker from './utils/APIInvoker'
import { Link } from 'react-router' 

class Login extends React.Component{

    constructor(){
        super(...arguments)
        this.state = {
            username: "",
            password: ""
        }
    }

    handleInput(e){
        let field = e.target.name
        let value = e.target.value
        if(field === 'username'){
            value = value.replace(' ','').replace('@', '').substring(0, 15)
            this.setState(update(this.state, {[field] : {$set: value}
            }))
        }
        this.refs.submitBtnLabel.innerHTML = ""  //Quito los errores marcados porque ya escribí de nuevo
        this.setState(update(this.state, {
            [field] : {$set: value}
        }))
    }

    login(e){
        e.preventDefault()
        let request = {
            "codigo": this.state.username,
            "password": this.state.password
        }

        APIInvoker.invokePUT('/icb-api/v1/login', request, response => {
            window.localStorage.setItem("token", response.body.token)
            window.localStorage.setItem("codigo", response.body.codigo)
            window.location = ('/')

        }, error => {
            this.refs.submitBtnLabel.innerHTML = error.message
            this.refs.submitBtnLabel.className = 'shake animated bg-danger text-white'
            console.log("Error en la autenticación")
        })
    }

    render() {
        return (
            <div id="signup" className="container infoApp">
                <blockquote>
                    <h6>Ingrese su Código y su contraseña</h6>
                </blockquote>
                <br />
                <blockquote>
                    <h6 className="text-white" ref="submitBtnLabel"></h6>
                </blockquote>
                <div className="row justify-content-center align-items-center gx-2" >
                    <div className="col-sm-8 col-12 signup-form infoApp">
                        <form onSubmit={this.login.bind(this)} className="">
                            <h3>Iniciar sesión</h3>
                            <input type="text" value={this.state.username}
                                placeholder="usuario o código" name="username" id="username"
                                onChange={this.handleInput.bind(this)} className="form-control" />
                            <label ref="usernameLabel" id="usernameLabel"
                                htmlFor="username"></label>

                            <input type="password" value={this.state.password} className="form-control mb-3"
                                placeholder="contraseña" name="password" id="password"
                                onChange={this.handleInput.bind(this)} />
                            <label ref="passwordLabel" htmlFor="passwordLabel"></label>

                            <button className="btn btn-primary btn-lg form-control mb-2" id="submitBtn"
                                onClick={this.login.bind(this)}>Iniciar Sesión</button>
                          {/* }  <label ref="submitBtnLabel" id="submitBtnLabel" htmlFor="submitBtn"
                                className="shake animated hidden mb-2"></label>
                            <p className="bg-danger user-test">
                                Crea un usuario o usa el usuario
                                <strong> juan/1234</strong>
                            </p> */ }
                            <p className="text-light">¿No tienes una cuenta? <Link itemProp="url" to="/MainApp/signup" className="text-white">
                                Registrarse
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}
export default Login