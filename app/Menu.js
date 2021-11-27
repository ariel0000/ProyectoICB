import React from 'react'
import Submenu from './Submenu'
import update from 'react-addons-update'
import {FaBars} from 'react-icons/fa'
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { IconContext } from "react-icons";

class Menu extends React.Component{

    constructor(props){
        super(props)   //Utilizando el prop 'perfil' nos tocará verificar si hay usuario registrado para luego mostrar ciertos submenues
        this.state = {
            reuniones: false,  //Por defecto no se desplega el menú de Reuniones. Ni ningún otro
            gda : false,
            redesSociales: false,
            cursos: false,
            noticias: false,
            mostrarMenu: false,  //Por defecto es false
            salas: false,
            sesion: false
        }
    }

    desplegarReuniones(e){
        e.preventDefault()
        let newState = null
        if(this.state.reuniones){  //Si estaba abierto, se va a cerrar y teoricamente no habría otro menu desplegado
            newState = update(this.state, {reuniones: {$set: !this.state.reuniones}})
        }
        else{
            newState = update(this.state, {reuniones: {$set: !this.state.reuniones},
            gda: {$set: false}, redesSociales: {$set: false}, cursos: {$set: false}, noticias: {$set: false}, salas: {$set: false},
            sesion: {$set: false}})
        }
        this.setState(newState)
    }

    desplegarGda(e){
        e.preventDefault()
        let newState = null
        if(this.state.gda){  //Si estaba abierto, se va a cerrar y teoricamente no habría otro menu desplegado
            newState = update(this.state, {gda: {$set: !this.state.gda}})
        }
        else{
            newState = update(this.state, {gda: {$set: !this.state.gda},
            reuniones: {$set: false}, redesSociales: {$set: false}, cursos: {$set: false}, noticias: {$set: false}, salas: {$set: false}, 
            sesion: {$set: false}})
        }
        
        this.setState(newState)
    }

    desplegarRedes(e){
        e.preventDefault()
        let newState = null
        if(this.state.redesSociales){  //Si estaba abierto, se va a cerrar y teoricamente no habría otro menu desplegado
            newState = update(this.state, {redesSociales: {$set: !this.state.redesSociales}})
        }
        else{
            newState = update(this.state, {redesSociales: {$set: !this.state.redesSociales},
            gda: {$set: false}, reuniones: {$set: false}, cursos: {$set: false}, noticias: {$set: false}, salas: {$set: false}, 
            sesion: {$set: false}})
        }
        
        this.setState(newState)
    }

    desplegarCursos(e){
        e.preventDefault()
        let newState = null
        if(this.state.cursos){  //Si estaba abierto, se va a cerrar y teoricamente no habría otro menu desplegado
            newState = update(this.state, {cursos: {$set: !this.state.cursos}})
        }
        else{
            newState = update(this.state, {cursos: {$set: !this.state.cursos},
            gda: {$set: false}, reuniones: {$set: false}, redesSociales: {$set: false}, noticias: {$set: false}, salas: {$set: false},
            sesion: {$set: false}})
        }
        
        this.setState(newState)
    }

    desplegarNoticias(e){
        e.preventDefault()
        let newState = null
        if(this.state.noticias){  //Si estaba abierto, se va a cerrar y teoricamente no habría otro menu desplegado
            newState = update(this.state, {noticias: {$set: !this.state.noticias}})
        }
        else{
            newState = update(this.state, {noticias: {$set: !this.state.noticias},
            gda: {$set: false}, reuniones: {$set: false}, cursos: {$set: false}, redesSociales: {$set: false}, salas: {$set: false},
            sesion: {$set: false}})
        }
        
        this.setState(newState)
    }

    desplegarSesion(e){
        e.preventDefault()
        let newState = null
        if(this.state.sesion){  //Si estaba abierto, se va a cerrar y teoricamente no habría otro menu desplegado
            newState = update(this.state, {sesion: {$set: !this.state.sesion}})
        }
        else{
            newState = update(this.state, {sesion: {$set: !this.state.sesion},
            gda: {$set: false}, reuniones: {$set: false}, cursos: {$set: false}, redesSociales: {$set: false}, salas: {$set: false},
            noticias: {$set:false} })
        }
        
        this.setState(newState)
    }

    desplegarMenu(e){
        e.preventDefault()
        let newState = update(this.state, {mostrarMenu: {$set: !this.state.mostrarMenu}, gda: {$set: false}, reuniones: {$set: false}, 
            cursos: {$set: false}, redesSociales: {$set: false}, noticias: {$set: false}, salas: {$set: false}, sesion: {$set: false}})
        this.setState(newState)
    }

    desplegarSalas(e){
        e.preventDefault()
        let newState = null
        if(this.state.salas){
            newState = update(this.state, {salas: {$set: !this.state.salas}})
        }
        else{
            newState = update(this.state, {salas: {$set: !this.state.noticias},
            gda: {$set: false}, reuniones: {$set: false}, cursos: {$set: false}, redesSociales: {$set: false}, noticias: {$set: false}})
        }
        this.setState(newState)
    }

    cerrarMenu(e){  //Función prop pasada a cada submenú.
        e.preventDefault()
        let newState = null
        if(window.innerWidth < 577){  //Si es un celular no mostramos el menú
            newState = update(this.state, {mostrarMenu: {$set: false}})
            this.setState(newState)
        }
    }

    render(){
        const rol = this.props.perfil.rol.nivel
        const gda = this.props.perfil.gda
        const nombre = this.props.perfil.nombre
        return(
            <IconContext.Provider value={{size: "1.5em"}} >
            <div className={this.state.mostrarMenu ? "col-xs-12 col-sm-3 col-md-3 menu" : "col-xs-12 col-sm-2 col-md-2 magia menu"} >

                <div className="nav flex-column">
                    <li>
                        <a className="btn btn-info nav-link" href="#" onClick={this.desplegarMenu.bind(this)}>
                            {(this.state.mostrarMenu) ?
                                <MdExpandLess />
                                :
                                <MdExpandMore />
                            }
                            Menú&nbsp;
                            <FaBars />   
                        </a>
                    </li>
                    <li className={this.state.mostrarMenu ? "" : "pato"}>
                        <a className="nav-link active" href="#" onClick={this.desplegarSesion.bind(this)} 
                        aria-disabled="true">Cuenta</a>
                        {(rol < 1)? // Si no estoy logueado incluyo la posibilidad de Registrarse
                            <Submenu item="Registrarse" active={this.state.sesion} cerrarMenu={this.cerrarMenu.bind(this)}
                            enlace="/MainApp/signup" />
                        :
                        <div></div>
                        }
                        {(rol < 1)? //Si no estoy logueado doy posibilidad de Iniciar Sesión
                            <Submenu item="Iniciar Sesión" active={this.state.sesion} cerrarMenu={this.cerrarMenu.bind(this)}
                            enlace="/MainApp/login" />
                        :
                            <Submenu item="Cerrar Sesión" active={this.state.sesion} cerrarMenu={this.cerrarMenu.bind(this)}
                            enlace="/MainApp/cerrarSesion" />
                        }
                        {(rol > 0) ?  //Es usuario logueado
                        <Submenu item="Mi Perfil" active={this.state.sesion} cerrarMenu={this.cerrarMenu.bind(this)}/>
                        :
                        <div></div>
                        }
                        <Submenu item="Términos y Condiciones" active={this.state.sesion} cerrarMenu={this.cerrarMenu.bind(this)}/>
                       
                    </li>

                    <li className={this.state.mostrarMenu ? "" : "pato"}> 
                        {/* el classname pato hace desaparecer el menu */}
                        <a className="nav-link active" href="#" onClick={this.desplegarNoticias.bind(this)} 
                        aria-disabled="true">Noticias</a>
                        {(rol > 1)?  //Es usuario nivel 2 o más
                        <Submenu item="Registrar Noticia" active={this.state.noticias} cerrarMenu={this.cerrarMenu.bind(this)}/>
                        :
                        <div></div> }
                        <Submenu item="Ver Noticias" active={this.state.noticias} cerrarMenu={this.cerrarMenu.bind(this)}/>
                        
                        <Submenu item="Información" active={this.state.noticias} cerrarMenu={this.cerrarMenu.bind(this)}/>
                    </li>

                    <li className={this.state.mostrarMenu ? "" : "pato"}>
                        <a className="nav-link" href="#" onClick={this.desplegarReuniones.bind(this)}>Reuniones</a>
                        <Submenu item="En vivo" active={this.state.reuniones} cerrarMenu={this.cerrarMenu.bind(this)} />
                        <Submenu item="Reservas" active={this.state.reuniones} cerrarMenu={this.cerrarMenu.bind(this)} />
                        <Submenu item="Información" active={this.state.reuniones} cerrarMenu={this.cerrarMenu.bind(this)} 
                        enlace="/MainApp/infoReu" />
                    </li>

                    {(rol > 0)? //Si estoy logueado
                        <li className={this.state.mostrarMenu ? "" : "pato"}>
                            <a className="nav-link" href="#" onClick={this.desplegarGda.bind(this)}>GDA</a>
                            {(rol > 2)?  //Administrador. Solo un Admin puede estar en Crear GDA
                                <Submenu item="Crear GDA" active={this.state.gda} cerrarMenu={this.cerrarMenu.bind(this)}
                                enlace="/MainApp/crearGda" />
                                :
                                <div>
                                </div>
                            }
                            {(rol > 2)?  //Está logueado pero - Solo un administrador puede estar en VerGDA's
                            <Submenu item="Ver GDA's" active={this.state.gda} cerrarMenu={this.cerrarMenu.bind(this)}
                            enlace="/MainApp/verGDAs" />
                            :
                            <div></div>
                            }
                            {(gda)?  //Tiene gda asignado. Sino, no se muestra el submenu
                                <Submenu item="Mi GDA" active={this.state.gda} cerrarMenu={this.cerrarMenu.bind(this)}
                                enlace={"/MainApp/MiGda/"+gda.id} />
                                :
                                <div></div>
                            }
                            <Submenu item="Información" active={this.state.gda} cerrarMenu={this.cerrarMenu.bind(this)}
                            enlace="/MainApp/infoGDA" />
                        </li>

                    : <div></div>
                    }
                    <li className={this.state.mostrarMenu ? "" : "pato"}>                                    
                            <a className="nav-link" href="#" aria-disabled="true" onClick={this.desplegarRedes.bind(this)}>Redes Sociales</a>
                            <Submenu item="Youtube" active={this.state.redesSociales} cerrarMenu={this.cerrarMenu.bind(this)} />
                            <Submenu item="Facebook" active={this.state.redesSociales} cerrarMenu={this.cerrarMenu.bind(this)} />
                            <Submenu item="Información" active={this.state.redesSociales} cerrarMenu={this.cerrarMenu.bind(this)}
                            enlace="/MainApp/infoRedes" />
                    </li>

                    <li className={this.state.mostrarMenu ? "" : "pato"}>
                        <a className="nav-link" href="#" aria-disabled="true" onClick={this.desplegarSalas.bind(this)}>Eventos</a>
                        <Submenu item="Ver Eventos" active={this.state.salas} cerrarMenu={this.cerrarMenu.bind(this)} 
                        enlace="/MainApp/misSalas" />
                    {(rol > 1)?
                        <Submenu item="Crear Evento" active={this.state.salas} cerrarMenu={this.cerrarMenu.bind(this)} 
                        enlace="/MainApp/infoSalas" />
                    : <div></div>
                    }
                    </li>

                    <li className={this.state.mostrarMenu ? "" : "pato"}>
                        <a className="nav-link disabled" href="#" tabIndex="-1" aria-disabled="true" 
                        onClick={this.desplegarCursos.bind(this)}>Cursos ICB</a>
                        <Submenu item="Ver Cursos" active={this.state.cursos} cerrarMenu={this.cerrarMenu.bind(this)} />
                        <Submenu item="Cursos Realizados" active={this.state.cursos} cerrarMenu={this.cerrarMenu.bind(this)} />
                        <Submenu item="Información" active={this.state.cursos} cerrarMenu={this.cerrarMenu.bind(this)} />
                    </li>
                </div>
            </div>
        </IconContext.Provider>
        )
    }
}

Menu.propTypes = {
    //perfil.nombre: PropTypes.string.isRequired  //No lo necesitamos (es para vender humo)
}

Menu.defaultProps = {
    perfil: {
        gda: {
            id: 0
        },
        rol: {
            id: 0,  //Usuario sin loguearse por defecto
            nivel: 0    
        }
    }
}

export default Menu;