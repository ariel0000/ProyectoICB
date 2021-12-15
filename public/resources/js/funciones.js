module.exports = {
    servicio: function(app, http, socketio){
        const servidor = http.createServer(app);
        io = socketio(servidor)
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
        return servidor
    }
  };