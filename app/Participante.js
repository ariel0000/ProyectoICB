import React from "react";
import update from 'react-addons-update';

class Participante extends React.Component{
    constructor(props){
        super(props)
        this.state={
            info: false,
            personaSelect: false
        }
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

        /**
     * Set the wrapper ref
     */
         setWrapperRef(node) {
            this.wrapperRef = node;
        }

    componentDidMount(){
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount(){
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside(event) {
        let newState = update(this.state, {personaSelect: { $set: null }, info: {$set: false} })
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {   //El único lugar donde se desactiva el info
            this.setState(newState)
        }
        console.log('click outside')
    }

    render() {
        const participante = this.props.participante
        return (
            <div className={participante.sexo == "masculino" ? "parent lider hombre" :
                "parent lider mujer"} ref={this.setWrapperRef.bind(this)} >
                <div className="warning text-wrap text-red p-0 mt-0">
                    {participante.nombre} {participante.apellido}
                </div>
            </div>
        )
    }
}
export default Participante;
