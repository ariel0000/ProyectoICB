var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var path = require('path');
var webpack = require('webpack');
var config = require('./webpack.config');
var compiler = webpack(config);
const http = require('http');
const servidor = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(servidor);

io.on('connection', socket => {
  let nombre
  socket.on('conectado', (nomb) => {
    nombre = nomb
    socket.broadcast.emit('mensajes', {nombre: nombre, mensajes: `${nombre} ha entrado en la sala del chat` })
  })

  socket.on('mensaje', (nombre, mensaje) => {
    io.emit('mensajes', {nombre, mensaje});
  })

  socket.on('disconnect', () => {
    io.emit('mensajes', {servidor: "Servidor", mensaje: `${nombre} ha abandonado la sala` });
  })
})

servidor.listen(3000, () => console.log("Servidor inicializado"))

app.use(express.static(path.join(__dirname, "./public")));

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

