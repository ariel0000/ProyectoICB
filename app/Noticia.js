import React, { useEffect, useState } from 'react'

    const Noticia = (props) => {
        const [publicacion, setPublicacion] = useState(null)

        useEffect(() => {
            setPublicacion(props.noticia)
        }, [props.noticia])

 
    return(
        <div className='noticia mh-50'>
            <If condition={publicacion!= null}>
                <h4>{publicacion.titulo}</h4>
                <h6 className="mt-1">{publicacion.subtitulo}</h6>
                <img src={publicacion.url_imagen} className="d-block w-100 max-height mt-1 mb-2 loading rounded" onLoad={props.onLoad} />
                <h6 className="mt-1">{publicacion.pie_de_pagina}</h6>
            </If>
        </div>
    )
}
 export default Noticia;