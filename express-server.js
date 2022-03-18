var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var path = require('path');
var webpack = require('webpack');
var config = require('./webpack.config');
var compiler = webpack(config);
const http = require('http');
const socketio = require('socket.io');

var servidor = require('./public/resources/js/funciones.js')

app.use(express.static(path.join(__dirname, "./public")));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({limit: '10mb'}));

app.use('/css_min', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/css', express.static(__dirname + '/public/resources/css'))
app.use('/js', express.static(__dirname + '/public/resources/js'));
app.use('/img', express.static(__dirname + '/public/resources/img'));

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

//se usa en entornos de producción (Si no está definido port toma valor 3000) 
app.set('port', process.env.PORT || 3000) 

let serviceChat = servidor.servicio(app, http, socketio)
serviceChat.listen(app.get('port'), () => console.log("Servidor inicializado"))

