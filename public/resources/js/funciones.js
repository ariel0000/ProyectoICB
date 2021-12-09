function enviarTexto(event){event.preventDefault();
    var campo=event.target.texto;
    doSend(campo.value);
    campo.value="";
}

function init() {
    wsConnect();
}

function wsConnect() {
    websocket= new WebSocket("ws://localhost:3000");

    websocket.onopen = function (evt) {
        onOpen(evt)
    };websocket.onclose = function (evt) {
        onClose(evt)
    };websocket.onmessage = function (evt) {
        onMessage(evt)
    };websocket.onerror = function (evt) {
        onError(evt)
    };
}

function onOpen(evt) {
    document.getElementById("dialog").disabled= false;
    doSend("Hola");
}

function onClose(evt) {

    document.getElementById("enviar").disabled= true;

    setTimeout(function () {
        wsConnect()
    }, 2000);
}

function onMessage(evt) {
    var area=document.getElementById("mensajes")
    area.innerHTML+=evt.data+ "\n";
}

function onError(evt) {console.log("ERROR: " +evt.data);
}

function doSend(message) {console.log("Enviando: " +message);
    websocket.send(message);
}

window.addEventListener("load",init, false);