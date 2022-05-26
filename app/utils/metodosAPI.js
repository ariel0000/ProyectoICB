// Archivo js para consultar el API por medio de las funciones que se necesiten
export const saveNotification = (tipoMsg, textoUrl, info, callbackF) => {
    //const fetch = require('node-fetch');
    console.log("TipoMsg: "+tipoMsg+" Info: "+info+" Url: "+textoUrl)
/*    let mapaDeUrls = new Map([
        ['gda', '/MainApp/verGDAsEdit/'],
        ['evento', '/MainApp/verEvento/'],
        ['noticia', '/MainApp/verNoticia/']
    ]);

    function obtenerTipoNotif(mensaje) {
        if (mensaje.gda != undefined) {
            return "gda" + mensaje.gda.id;
        }
        else if (mensaje.evento != undefined) {
            return "evento" + mensaje.evento.id;
        }
        else if (mensaje.noticia != undefined) {
            return "nose" + mensaje.nose.id;
        }
    }
    let tipoMsg = obtenerTipoNotif(mensaje);
    let textoUrl = mapaDeUrls.get(tipoMsg.replace(/[^a-z]/gi, ''));
    */
    let params = {
        "tipo": tipoMsg,
        "url": textoUrl,
        "mensaje": info
    };

    fetch('http://192.168.1.150:8080' + '/icb-api/v1/notificacion', {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json',
            authorization: 'Bearer ' + window.localStorage.getItem("token")
        }
    })
        .then(res => res.json())
        .then(json => {
            console.log("Se guardo la nueva notificacion: '" + json.body.mensaje + "'");
            callbackF(info)
        })
        .catch(err => {
            console.log('ERROR AL GUARDAR NUEVA NOTIFICACION: ' + err.message);
        });
}

export const otraFuncion = (valor) => {
    alert("Soy una función importada");
}