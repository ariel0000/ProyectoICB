import React from 'react'
import APIInvoker from './utils/APIInvoker'
import { browserHistory } from 'react-router'
import update from 'react-addons-update'

class VerGDAs extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            gdas: [],
            gdaSeleccionado: null  //Esto no me permitió cargar el 'gdaSeleccionado' como child ya que siempre se pasa a null
                                 // al momento de redirigir
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

    componentDidMount() {
        //Consultar el API para traer a todos los líderes. 
        document.addEventListener('mousedown', this.handleClickOutside);                                                            
        APIInvoker.invokeGET('/icb-api/v1/gda', response => {
            this.setState(update(this.state, { gdas: { $set: response.body } }))
        },
            error => {
                if (error.status == 401) {
                    alert("Debe iniciar sesión para poder entrar aquí")
                    window.localStorage.removeItem("token")
                    window.localStorage.removeItem("codigo")
                    browserHistory.push("/MainApp")
                    console.log('Error, no hay usuario autenticado')
                }
                else {
                    document.getElementById("errorField").innerText = "Error: " + error.message
                }
            })
    }

    componentWillUnmount() {
        console.log("Desmontando")
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    /**
     * Alert if clicked on outside of element
     */
    handleClickOutside(event) {
        let newState = update(this.state, {gdaSeleccionado: { $set: null } })
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.setState(newState)
        }
        console.log('click outside')
    }

    handleClickGDA(e) {
        document.getElementById('errorField').innerText = ""
        let gdaId = e.target.parentElement.title
        function getByValue(gdas, value) {
            for (var i = 0, iLen = gdas.length; i < iLen; i++) {
                if (gdas[i].id == value) return gdas[i];
            }
        }

        let gdaSelect = getByValue(this.state.gdas, gdaId)  //Obtengo el gda seleccionado
        let newState = update(this.state, { gdaSeleccionado: { $set: gdaSelect } })
        this.setState(newState)
    }

    handleVerInfo(e) {
        //Redirige a "VerGDA"
        e.stopPropagation();
        document.removeEventListener('mousedown', this.handleClickOutside);
        console.log('child');
        let idGda = e.target.parentElement.parentElement.title
        console.log('GDA ID: ' + idGda)
        browserHistory.push('/MainApp/VerGDAs/' + idGda)
    }

    encontrarGdaEnArray(idGda){
        let indice, index = 0
        let size = this.state.gdas.length
        while(index < size){
            
            if(this.state.gdas[index].id == idGda){
                indice = index
                break;
            }
            index++;
        }
        return indice;
    }

    handleBorrarGDA(e) {
        e.stopPropagation();
        
        let idGda = e.target.parentElement.parentElement.title
        let indice = this.encontrarGdaEnArray(idGda)
        console.log('Indice: '+indice+" idGda: "+idGda)
        let gda = this.state.gdas[indice]
        var r = confirm("¿Desea borrar el GDA de "+gda.lider.nombre+" ?")
        if(r === true){
            if(gda.participantes.length > 0) {  //No se puede borrar un gda con participantes
                document.getElementById('errorField').innerText = 'El GDA tiene participantes y no se puede borrar. Entre en \'Ver Info\' para quitarlos'
            }
            else{  //El GDA no tiene participantes -> Se puede borrar
                APIInvoker.invokeDELETE('/icb-api/v1/gda/'+idGda, response => {
                    let newState = update(this.state, {gdas: {$splice: [[indice, 1]]}}) //Borro el elemento
                    this.setState(newState)
                },
                error => {
                    document.getElelemtById('errorField').innerText = 'Error:'+error.message;
                })
            }
        }
    }

    render() {
        let gdas = this.state.gdas
        let GDAClick = this.handleClickGDA
        let handleVerInfo = this.handleVerInfo
        let handleBorrarGDA = this.handleBorrarGDA
        //   let childs = this.props.children && React.cloneElement(this.props.children, {gda: this.state.gdaSeleccionado});
        //No se usa porque el estado this.gdaSeleccionado cambia en la recarga
        if(this.props.children != null){
            //Si es distinto de null es porque "VerGda" está instanciado --> hay que quitar el listenner
            document.removeEventListener('mousedown', this.handleClickOutside);
            //Funcionó
        }

        return (
            <div className="infoApp container-fluid px-2" >
                <Choose>
                    <When condition={this.props.children == null} >
                        <blockquote className="text-center">
                            <h6 className="text-white">
                                Los distintos grupos de GDA están representados por sus líderes. Haga click en el Líder para ver información detallada.
                            </h6>
                        </blockquote>
                        <br/>
                        <blockquote className="text-center">
                            <h6 className="text-white" id="errorField"></h6>
                        </blockquote>
                        <div className="row justify-content-center m-1" >
                            <For each="gda" index="index" of={gdas} >
                                <Choose>
                                    <When condition={this.state.gdaSeleccionado != null} >

                                        <div className="col-auto mt-2 p-2" title={gda.id} key={gda.id} >
                                            {/* Si hay gda selec --> Cargo todos pero marco el seleccionado*/}
                                            <Choose>
                                                <When condition={this.state.gdaSeleccionado.id == gda.id} >
                                                    <div className={gda.sexo == "Masculino" ? "parent lider-edit hombre " :
                                                        "parent lider-edit mujer"} onClick={GDAClick.bind(this)} ref={this.setWrapperRef.bind(this)} >
                                                        <div className="secondary p-2" title='info' onClick={handleVerInfo.bind(this)}>Ver Info</div>
                                                        <div className="warning text-red p-2" title='borrar' onClick={handleBorrarGDA.bind(this)}>Borrar</div>
                                                    </div>
                                                </When>
                                                <Otherwise>
                                                    <div className={gda.sexo == "Masculino" ? "parent lider hombre " : "parent lider mujer "}
                                                        onClick={GDAClick.bind(this)} >
                                                        {gda.lider.nombre}
                                                    </div>
                                                </Otherwise>
                                            </Choose>
                                        </div>

                                    </When>
                                    <Otherwise>
                                        <div className="col-auto mt-2 p-2" title={gda.id} key={gda.id} >
                                            {/* Si no hay gda Seleccionado --> cargo todos los gda sin modificaciones */}
                                            <div className={gda.sexo == "Masculino" ? "parent lider hombre " : "parent lider mujer "}
                                                onClick={GDAClick.bind(this)} >
                                                {gda.lider.nombre}
                                            </div>
                                        </div>
                                    </Otherwise>
                                </Choose>
                            </For>
                        </div>
                    </When>
                    <Otherwise>
                        {this.props.children}
                    </Otherwise>
                </Choose>
            </div>
        )
    }
}
export default VerGDAs;