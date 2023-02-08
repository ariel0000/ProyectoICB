import React from 'react'
import { render } from 'react-dom'
import IcbApp from './IcbApp'
import Signup from './Signup'
import Login from './Login'
import { Router, Route, browserHistory, IndexRoute } from "react-router"
import MainApp from './MainApp'
import InfoReu from './InfoReu'
import InfoGDA from './InfoGDA'
import InfoRedes from './InfoRedes'
import Bienvenido from './Bienvenido'
import ComoFunciona from './ComoFunciona'
import CerrarSesion from './CerrarSesion'
import CrearGDA from './CrearGDA'
import VerGDAs from './VerGDAs'
import Error404 from './Error404'
import VerGda from './VerGda'
import AgregarNuevaPersona from './AgregarPersona'
import Modal from './Modal'
import GDA from './GDA'
import CrearNoticia from './CrearNoticia'
import VerNoticias from './VerNoticias'
import Evento from './Evento'

var createBrowserHistory = require("history").createBrowserHistory

render((
    <Router history={browserHistory}>
        <div id="dialog" />
       {/* <Route path="/" component={props => <IcbApp {...props} /> } > //Esta modificación creo que fue para el reload */}
        <Route path="/" component={IcbApp} >
            <Route path="MainApp" component={MainApp} >  /*Puede reutilizar otros componentes hijos*/
                <IndexRoute component={Bienvenido} tab="bienvenido" />  //Nose que es tab
                <Route path="/reload" component={null} key="reload" />
                <Route path="comoFunciona" component={ComoFunciona} tab="comoFunciona"/>
                <Route path="infoReu" component={InfoReu} tab="infoReu" />
                <Route path="infoGDA" component={InfoGDA} tab="infoGDA" />
                <Route path="infoRedes" component={InfoRedes} tab="infoRedes" />
                <Route path="bienvenido" component={Bienvenido} tab="bienvenido" />
                <Route path="cerrarSesion" component={CerrarSesion} tab="cerrarSesion" />
                <Route path="crearGda" component={CrearGDA} tab="crearGda" />
                <Route path="nuevaNoticia" component={CrearNoticia} tab="crearNoticia" />
                <Route path="noticias" component={VerNoticias} tab="Noticias" />
                <Route path="verGDAs"  component={VerGDAs} tab="verGDAs" >
                    <Route path=":gda" component={VerGda} tab="verGDA" >
                        <Route path="addOne" component={(params) => <Modal><AgregarNuevaPersona {...params}/> </Modal>} tab="addOne" />
                    </Route>
                </Route>
                <Route path="verGDAsEdit" component={VerGDAs} tab="verGDAsEdit" >
                    <Route path=":gda" component={GDA} tab="MiGDA" />
                </Route>
                <Route path="signup" component={Signup} />
                <Route path="eventos" component={VerGDAs} tab="verEventos" >
                    <Route path=":evento" component={Evento} tab="Evento" />
                </Route>
                <Route path="login" component={Login} />
                <Route path="*" component={Error404} />
            </Route>
        </Route>
    </Router>
), document.getElementById('root'));