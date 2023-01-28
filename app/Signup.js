import React from 'react'
import update from 'react-addons-update'
import APIInvoker from './utils/APIInvoker'
import { FiDroplet, FiUser } from 'react-icons/fi'
import { BsCalendar } from 'react-icons/bs'
import { RiLockPasswordLine } from 'react-icons/ri'
import { browserHistory } from 'react-router'
import { MdEmail } from 'react-icons/md'
import { IoManSharp, IoWomanSharp } from "react-icons/io5";
import { FaRestroom } from "react-icons/fa"

class Signup extends React.Component {

    constructor() {
        super(...arguments)
        this.state = {
            idPersona: "",
            nombre: "",
            apellido: "",
            mail: "",
            fecha_nacimiento: "",
            bautismo: false,
            password: "",
            codigo: "",
            sexo: ""
            // userOk: false,
            // license: false
        }
    }

    registrarUsuario() {
        //Se registra el usuario - Se utiliza RegistroDTO (contiene PersonaDTO y UsuarioDTO)
        let params = {
            "persona": {
                "nombre": this.state.nombre,
                "apellido": this.state.apellido,
                "fecha_nacimiento": this.state.fecha_nacimiento,
                "bautismo": this.state.bautismo,
                "direccion": "",
                "sexo": this.state.sexo,

                "rol": {  //Rol por defecto -- Sería rol de usuario
                    "id": "1"  //Si no proporciono el id le estoy diciendo al api que cree un nuevo rol. En camio el rol id 1 ya existe.
                }
            },
            "usuario": {
                "mail": this.state.mail,
                "password": this.state.password,
                "codigo": this.state.codigo
            }
        }
        //Prosedo al registro y aviso al usuario del código que habrá de recibir

        APIInvoker.invokePOST('/icb-api/v1/signup', params, response => {
            alert("El administrador revisará la solicitud y enviará un mail con el código para inscribirse en el Sistema: " + response.body)
            document.getElementById("errorField").innerText = "Solicitud enviada con éxito. Revise su mail periodicamente para obtener el código"
            browserHistory.push('/MainApp/comoFunciona')
        }, error => {
            document.getElementById("errorField").innerText = error.message
        })
    }

    marcarCasillasIncorrectas() {

        let campo_fecha = document.getElementById("fecha_nac")
        let campo_nombre = document.getElementById("fname")
        let campo_email = document.getElementById("fmail")
        let campo_apellido = document.getElementById("fsurname")
        let button_masculino_class = document.getElementById("smasculino").className
        let button_femenino_class = document.getElementById("sfemenino").className

        if (campo_fecha.value === "") {  //Es el único campo que se pone inválido solo desde acá
            document.getElementById("fecha_nac").className = "form-control is-invalid"
        }
        if (campo_nombre.value === "") {  //No verifico si el nombre está repetido, porque si hay nombre ya lo verificó 'onBLur'
            document.getElementById("fname").className = "form-control is-invalid"
        }
        if (campo_email.value === "") {                          //No verifico si el mail está repetido o mal escrito,
            document.getElementById("fmail").className = "form-control is-invalid"   // porque si hay mail ya lo verificó 'onBLur'
        }
        if(campo_apellido === ""){
            document.getElementById("fsurname").className = "form-control is-invalid"
        }
        if(this.state.sexo == ""){
            document.getElementById('smasculino').className = button_masculino_class + " form-control is-invalid"
            document.getElementById('sfemenino').className = button_femenino_class + " form-control is-invalid"
        }
    }

    handleClickRegistro(e) {
        //En el handleChange se corrobora el mail y se actualiza el estado. Acá se comprueba si hay nombre, fecha y email.
        // para poder guardar los datos
        let campo_fecha = document.getElementById("fecha_nac")
        let campo_nombre = document.getElementById("fname")
        let campo_email = document.getElementById("fmail")
        let campo_apellido = document.getElementById("fsurname")
        
        if(campo_nombre.className.includes("is-invalid") || campo_email.className.includes("is-invalid") || campo_fecha.value == ""
            || campo_nombre.value == "" || campo_email.value == "" || campo_apellido.className.includes("is-invalid") || this.state.sexo == "") {
            //Aviso en algún lado del html que verifique los datos
            alert("Error en los datos, verifique las casillas marcadas")
            this.marcarCasillasIncorrectas()
        }
        else {
            this.registrarUsuario()
        //La función 'nombreDisponible...' se encarga de remarcar el error en el documento
        }
    }

    isValidEmailAddress(address) {
        return !!address.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        //Expresion regular: Explicado en archivo dentro de 'Librerías y características de React' dentro de ReactProjects
    }

    isValidPassword(password) {
        return password.match(/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{6,}$/) //Al menos 6 caracteres con letras y números
    }

    handleChange(e) {
        //Solo se limita a actualizar el "value" del input con el valor y acomodar los classname
        if(e.target.name){

            let field = e.target.name
            let value = e.target.value
            let type = e.target.type
            console.log("Campos: "+field+' '+value+' '+type);

            if (type === 'checkbox') {  //Actualiza el estado de bautismo
                this.setState(update(this.state, { [field]: { $set: e.target.checked } }))
            }
            else {       //Actualiza el estado de Nombre, fecha, email, password y sexo
                this.setState(update(this.state, { [field]: { $set: value } }))
                if(field != "sexo"){ // No se debe modificar el button para elegir el sexo
                    e.target.className = "form-control"  //Cualquier input que se acomoda se le va el "is-invalid" o el "is-valid"
                }
            }
        }
    }

    nombreDisponible(target) {
        let nombre = this.state.nombre.trim()  //Quito espacios del final y del principio
        let apellido = this.state.apellido.trim()
        nombre = nombre + " "+apellido
        nombre = nombre.replace(/\s+/gi, ' ') //Quita los espacios extra intermedios
        nombre = nombre.toLowerCase()
        APIInvoker.invokeGET('/icb-api/v1/nombreDisponible/' + nombre, response => {
            console.log("Respuesta: "+response.body)
                target.className = "form-control is-valid"
                document.getElementById("fsurname").className = "form-control is-valid"
           
        }, error => {
            this.invalidarErrorMessage(error.message)
            target.className = "form-control is-invalid"
            document.getElementById("fsurname").className = "form-control is-invalid"
            console.log("Respuesta: "+error.ok)
        })
    }

    handleBlur(e) {
        let field = e.target.name
        let value = e.target.value

        if (field === 'nombre') {  //Verificar si el nombre está disponible
            if (value === "") {
                e.target.className = "form-control is-invalid"
                
            }
            else{
                this.nombreDisponible(document.getElementById("fname"))
            }
        }
        else if (field === "mail") {
            if (this.isValidEmailAddress(value)) {
                //Podría consultar si está repetido acá pero mejor lo dejo para después
                e.target.className = "form-control is-valid"
            }
            else {
                e.target.className = "form-control is-invalid"
                this.invalidarErrorMessage("el mail no es válido")
            }
        }
        else if (field === "apellido"){
            if(value === ""){
                e.target.className = "form-control is-invalid"
            }
            else{
              //  e.target.className = "form-control is-valid"
                this.nombreDisponible(document.getElementById("fname"))
            }
        }
        else {           //Solo queda el campo password, más adelante se pueden agregar más y esto deberá ser un "else if"
            if (this.isValidPassword(value)) {
                e.target.classname = "form-control is-valid"
            }
            else {
                e.target.className = "form-control is-invalid"
                this.invalidarErrorMessage("La contraseña debe ser de al menos 6 dígitos, con una combinación de letras y números")
            }
        }
    }

    handlePassFocus(e) {  //En principio se usa para el password y el apellido. Dsps de reportar el error se borra mediante el PassFocus
        let value = e.target.value
        let field = e.target.name  //Por ahora no necesito esto

        document.getElementById('errorField').innerText = ""
    }

    // Cambia el estado del bloque de mensaje de normal a error
    invalidarErrorMessage(mensaje){
        document.getElementById("errorField").innerText = mensaje
        document.getElementById("errorField").className = 'shake animated bg-danger text-white'
    }

    render() {
        let handleClickRegistro = this.handleClickRegistro
        let Blur = this.handleBlur
        let sexo = this.state.sexo == "" ? false: true
        return (
            <div className="container-fluid mt-3">
                <div className="row justify-content-md-center justify-content-start mb-2">
                    <blockquote className="text-center">
                        <h6 className="text-white" id="errorField">Envíe primero la solicitud al administrador para recibir su código en el correo
                        </h6>
                    </blockquote>
                    <div className="col-md-1 col-auto gx-2">
                        <span className="btn btn-success s-boton"><FiUser /></span>
                    </div>
                    <div className="col-md-6 col-10 gx-1">
                        <input id="fname" name="nombre" type="text" placeholder="Ingrese su nombre" className="form-control"
                            value={this.state.nombre} onChange={this.handleChange.bind(this)} required={true} onBlur={Blur.bind(this)}
                            onFocus={this.handlePassFocus.bind(this)} />
                    </div>
                </div>
                <div className="row justify-content-md-center justify-content-start mb-2">
                    <div className="col-md-1 col-auto gx-2">
                        <span className="btn btn-danger s-boton"><FiUser /></span>
                    </div>
                    <div className="col-md-6 col-10 gx-1">
                        <input id="fsurname" name="apellido" type="text" placeholder="Ingrese su apellido" className="form-control"
                            value={this.state.apellido} onChange={this.handleChange.bind(this)} required={true} onBlur={Blur.bind(this)}
                            onFocus={this.handlePassFocus.bind(this)} />
                    </div>     
                </div>
                <div className="row justify-content-md-center justify-content-start mb-2">
                    <div className="col-md-1 col-auto gx-2">
                        <span className="btn btn-danger s-boton"><MdEmail /></span>
                    </div>
                    <div className="col-md-6 col-10 gx-1">
                        <input id="fmail" name="mail" type="email" placeholder="mail" className="form-control"
                            value={this.state.username} onChange={this.handleChange.bind(this)} onBlur={Blur.bind(this)} />
                    </div>
                </div>
                <div className="row justify-content-md-center justify-content-start mb-2">
                    <div className="col-md-1 col-auto gx-2">
                        <span className="btn btn-danger s-boton"><RiLockPasswordLine /></span>
                    </div>
                    <div className="col-md-6 col-10 gx-1">
                        <input id="fpassword" name="password" type="password" placeholder="ingrese una contraseña" className="form-control"
                            value={this.state.username} required={true} onChange={this.handleChange.bind(this)} onBlur={Blur.bind(this)}
                            onFocus={this.handlePassFocus.bind(this)} />
                    </div>
                </div>
                <div className="row justify-content-md-center justify-content-start align-items-end mb-2 ">
                    <div className="col-md-1 col-auto gx-2">
                        <span className="btn btn-info text-white"><BsCalendar /></span>
                    </div>
                    <div className="col-md-6 col-10 gx-1 ">
                        <label htmlFor="fecha_nac" className="text-white">Fecha de Nacimiento:</label>
                        <input id="fecha_nac" name="fecha_nacimiento" type="date" className="form-control"
                            value={this.state.fecha_nac} onChange={this.handleChange.bind(this)} />
                    </div>
                </div>
                <div className="row justify-content-md-center justify-content-start align-items-end mb-2 ">
                    <div id="fsexo" className="col-md-1 col-auto gx-2">
                        <span className="btn btn-info text-white fs-5"><FaRestroom /></span>
                    </div>
                    <Choose>
                        <When condition={sexo}>
                        <div className="col-md-6 col-10 gx-4 mt-1">
                    
                            <button id='smasculino' className={this.state.sexo == 'masculino'? "btn btn-info w-25 text-white fs-5 p-2 me-2" : 
                            "btn btn-info w-25 text-white p-2 me-2"} name="sexo" value='masculino' onClick={this.handleChange.bind(this)}>
                                <IoManSharp />
                            </button>
                            <button id='sfemenino' className={this.state.sexo == 'femenino'? "btn btn-info w-25 text-white fs-5 p-2 me-2" : 
                            "btn btn-info w-25 text-white p-2 me-2"} name="sexo" value='femenino' onClick={this.handleChange.bind(this)}>
                                <IoWomanSharp  />
                            </button>
                    
                        </div>
                        </When>
                        <Otherwise>
                        <div className="col-md-6 col-10 gx-1 ">
                            <button id='smasculino' className="btn btn-info w-25 text-white fs-5 p-2 me-2" name="sexo" value='masculino' onClick={this.handleChange.bind(this)}>
                                <IoManSharp />
                            </button>
                            <button id='sfemenino' className="btn btn-info w-25 text-white fs-5 p-2 me-2" name="sexo" value='femenino' onClick={this.handleChange.bind(this)}>
                                <IoWomanSharp />
                            </button>
                        </div>
                        </Otherwise> 
                    </Choose>
                </div>
                <div className="row justify-content-md-center justify-content-start align-items-center mb-0">
                    <div className="col-md-1 col-auto gx-2">
                        <span className="btn btn-danger s-boton"><FiDroplet /></span>
                    </div>
                    <div className="col-md-6 col-10 gx-4">
                        <div className="form-check">
                            <label className="form-check-label text-white" htmlFor="flexRadioDefault1">
                                Realicé Bautismo &nbsp;
                            </label>
                            <input className="form-check-input" type="checkbox" name="bautismo" id="flexRadioDefault1"
                                value={this.state.bautismo} onChange={this.handleChange.bind(this)} />
                        </div>
                    </div>
                </div>
                <div className="row justify-content-md-center justify-content-start align-items-center mb-1">
                    <blockquote className="text-center text-white">
                        <p>
                            No marcar si el bautismo fue por Iglesia Católica y a corta edad
                        </p>
                    </blockquote>
                </div>
                <div className="row justify-content-md-center justify-content-center align-items-center mb-1">
                    <div className="col-md-1 col-auto gx-2">
                        <p id="para que quede ordenado"></p>
                    </div>
                    <div className="col-md-6 col-10 text-center">
                        <button className="btn btn-primary" onClick={handleClickRegistro.bind(this)}>Continuar</button>
                    </div>
                </div>
            </div>
        )
    }
}
export default Signup;