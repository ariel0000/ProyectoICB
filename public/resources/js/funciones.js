module.exports = {
    servicio: function(app, http, socketio){
        const servidor = http.createServer(app);
        const options = 
          { reconnection: false,
            cors: {
              origin: ['http://localhost:8181', 'http://192.168.1.150:8181'],
              allowedHeaders: ['my-custom-header'],
              credentials: true,
            }
          }
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
            socket.on('msgToAnother', () => {
              socket.broadcast.emit('msgBroadcast')
            })
            socket.on('disconnect', () => {
              //io.to(id).emit('mensajes', {servidor: "Servidor", mensaje: `${nombre} ha abandonado la sala` });
            })  
          })
        return servidor
    }
  };