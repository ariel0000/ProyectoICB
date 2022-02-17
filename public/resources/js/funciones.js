module.exports = {
    servicio: function(app, http, socketio){
        const servidor = http.createServer(app);
        const options = {reconnection: false}
        io = socketio(servidor, options)
        io.on('connection', socket => {
            let id
            socket.on('conectado', (idChat) => {
              id = idChat
              socket.join(id)
            })
            socket.on('mensaje', (idper, mensaje) => {
              io.to(id).emit('mensajes', {idper, mensaje});
            })  
          
            socket.on('disconnect', () => {
              //io.to(id).emit('mensajes', {servidor: "Servidor", mensaje: `${nombre} ha abandonado la sala` });
              
            })
          })
        return servidor
    }
  };