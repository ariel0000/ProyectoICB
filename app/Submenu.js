import React from 'react'
import {browserHistory} from 'react-router'

const {v4:uuid} = require('uuid');

class Submenu extends React.Component{

    constructor(props){
        super(props)
    }

    abrirComponente(e){
        e.preventDefault()
        this.props.cerrarMenu(e)
        browserHistory.push(this.props.enlace)
    }

    render(){
      //  let randomId = uuid();
      //  console.log('el uuid: '+randomId);
        return(
                <ul className="submenu">
                    <li className={this.props.active ? "" : "d-none"}>
                        <a className="nav-link active" aria-current="page" onClick={this.abrirComponente.bind(this)} href="#">{this.props.item}</a>
                    </li>
                </ul>
        )
    }
}
export default Submenu;