import React from 'react'
import ComoFunciona from './ComoFunciona'

const {v4: uuidv4} = require('uuid');

class MainApp extends React.Component{
    
    constructor(){
        super(...arguments)
        this.state={
            profile: []
        }
    }

    ComponentDidMount(){
        // Acá debería cargar el profile. El componente ya está montado (el dom existe)
    }

    render(){
        let randomId = uuidv4();            
        let childs = this.props.children && React.cloneElement(this.props.children, {profile: this.state.profile, key: randomId});
                                                                        //Este this apunta al contexto IcbApp --> Hay profile

        return(
            <div className="col-sm-9 col-md-9 col-lg-9 mainApp gx-2 gy-2">
               <Choose>
                   <When condition={this.props.children==null}> 
                       <ComoFunciona/>                         
                   </When>
                   <Otherwise>
                        {childs}
                    </Otherwise>
               </Choose>
            </div>
        )
    }
}
export default MainApp;