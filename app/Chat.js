import React from 'react'

class Chat extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <div className="infoApp">
                <div className="container-fluid gx-1">
                    <div className="row bg-white">
                        <div className="col-6 justify-content-start ">
                            <p className="bg-dark bg-gradient text-white">Persona 1: Hola</p>
                        </div>
                        <div className="col-6 justify-content-end">
                            <p className="bg-dark bg-gradient text-warning">Persona 2: Hola</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Chat;