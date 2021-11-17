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
import Mensajeria from './Mensajeria'
import CerrarSesion from './CerrarSesion'
import CrearGDA from './CrearGDA'
import VerGDAs from './VerGDAs'
import Error404 from './Error404'
import VerGda from './VerGda'
import AgregarNuevaPersona from './AgregarPersona'
import Modal from './Modal'

var createBrowserHistory = require('history/createBrowserHistory')

render((
    <Router history={browserHistory}>
        <div id="dialog" />
        <Route component={IcbApp} path="/">
            <Route path="MainApp" component={MainApp} >  /*Puede reutilizar otros componentes hijos*/
                <IndexRoute component={Bienvenido} tab="bienvenido" />  //Nose que es tab
                <Route path="comoFunciona" component={ComoFunciona} tab="comoFunciona"/>
                <Route path="infoReu" component={InfoReu} tab="infoReu" />
                <Route path="infoGDA" component={InfoGDA} tab="infoGDA" />
                <Route path="infoRedes" component={InfoRedes} tab="infoRedes" />
                <Route path="bienvenido" component={Bienvenido} tab="bienvenido" />
                <Route path="mensajeria" component={Mensajeria} tab="mensajeria" />
                <Route path="cerrarSesion" component={CerrarSesion} tab="cerrarSesion" />
                <Route path="crearGda" component={CrearGDA} tab="crearGda" />
                <Route path="verGDAs"  component={VerGDAs} tab="verGDAs" >
                    <Route path=":gda" component={VerGda} tab="verGDA" >
                        <Route path="addOne" component={(params) => <Modal><AgregarNuevaPersona {...params}/> </Modal>} tab="addOne" />
                    </Route>
                </Route>
                <Route path="signup" component={Signup} />
                <Route path="login" component={Login} />
                <Route path="*" component={Error404} />
            </Route>
        </Route>
    </Router>
), document.getElementById('root'));


