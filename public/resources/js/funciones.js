module.exports = {
  servicio(app, http, socketio) {
    const servidor = http.createServer(app);
    const options = {
      reconnection: false,
      cors: {
        origin: ['http://localhost:8181', 'http://192.168.1.150:8181'],
        allowedHeaders: ['my-custom-header'],
        credentials: true,
      }
    };
    io = socketio(servidor, options);
    io.on('connection', socket => {
      let room;
      socket.sendBuffer = [];
      socket.on('conectado', (idChat) => {

        room = idChat;
        socket.join(room);
        console.log(socket.rooms);
      });
      socket.on('mensaje', (idper, mensaje, idChat) => {
        io.to(idChat).emit('mensajes', { idper, mensaje });
      });
      socket.on('msgToAnother', (mensaje, info, idChat) => {
        socket.to(idChat).emit('msgBroadcast', mensaje);
        console.log("Id Chat actual: "+idChat)
        socket.broadcast.to(idChat).emit('msg_notificacion', mensaje, info);
        //   metodosAPI.guardarNotificacion(mensaje, info);
      });
      socket.on('addPersona', (mensaje, info) => {
        socket.broadcast.emit('add_persona', mensaje, info);
      });
      socket.on('addNoticia', (mensaje, info) => {
        socket.broadcast.emit('add_noticia', mensaje, info);
      });
      socket.on('disconnect', () => {
        //io.to(id).emit('mensajes', {servidor: "Servidor", mensaje: `${nombre} ha abandonado la sala` });
      });
    });
    return servidor;
  }
}