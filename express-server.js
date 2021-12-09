var express = require('express');
var app = express();
var bodyParser = require("body-parser")
var path = require('path')
app.use(express.static(path.join(__dirname, '/public')));  //Sacado de Internet
var webpack = require('webpack')
var config = require('./webpack.config')
var compiler = webpack(config)
var cors = require('cors')
var server = require('http').Server(app);
const WebSocketServer = require('websocket').server;

const wsServer = new WebSocketServer({httpServer: server, autoAcceptConnections: false})

app.set("port", 3000);app.use(cors());app.use(express.static(path.join(__dirname, "./public")));

function originIsAllowed(origin){
    if(origin === "http://localhost:8181"){
        return true;
    }
    return false;
}

wsServer.on("request", (request) => {
    if(!originIsAllowed(request.origin)){
        request.reject();console.log((new Date()) + ' Conexion del origen ' +request.origin+' rechazada.');
        return;
    }
    const connection = request.accept(null, request.origin);
    connection.on("message", (message) => {
        console.log("Mensaje recibido: "+message.utf8Data);
        connection.sendUTF("Recibido: "+message.utf8Data);
    });connection.on("close", (reasonCode, description) => {console.log("El cliente se desconecto");
})
});

server.listen(app.get('port'), () =>{console.log('Servidor iniciado en el puerto: ' +app.get('port'))});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({limit: '10mb'}));

app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

app.use(require('webpack-dev-middleware')(compiler, {
    index: true,
    publicPath: config.output.publicPath
}));

app.get('/*', function(req, res){
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(8181, function(){
    console.log('Example app listening on port 8181');
})

