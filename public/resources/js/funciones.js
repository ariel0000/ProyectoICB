module.exports = {
    servicio: function(app, http, socketio){
        const servidor = http.createServer(app);
        const options = {reconnection: false}
        io = socketio(servidor, options)
        io.on('connection', socket => {
            let nombre, id
            socket.on('conectado', (nomb, idChat) => {
              id = idChat
              nombre = nomb
              socket.join(id)
            })
            socket.on('mensaje', (nombre, mensaje) => {
              io.to(id).emit('mensajes', {nombre, mensaje});
            })  
          
            socket.on('disconnect', () => {
              io.to(id).emit('mensajes', {servidor: "Servidor", mensaje: `${nombre} ha abandonado la sala` });
            })
          })
        return servidor
    }
  };