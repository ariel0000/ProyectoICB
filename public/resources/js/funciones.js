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
      let rooms = [];
      socket.sendBuffer = [];
      socket.on('conectado', (idChats) => {

        rooms = idChats;
        socket.join(rooms);
      });
      socket.on('mensaje', (idper, mensaje, idChat) => {
        io.to(idChat).emit('mensajes', { idper, mensaje });
      });
      socket.on('msgToAnother', (mensaje, info, idChat) => {
        socket.to(idChat).emit('msgBroadcast', mensaje); //Incluye todos los roms (editar)
        socket.broadcast.emit('msg_notificacion', mensaje, info);
        //   metodosAPI.guardarNotificacion(mensaje, info);
      });
      socket.on('addPersona', (mensaje) => {
        socket.broadcast.emit('add_persona', mensaje);
      });
      socket.on('addNoticia', (mensaje) => {
        socket.broadcast.emit('add_noticia', mensaje);
      });
      socket.on('disconnect', () => {
        //io.to(id).emit('mensajes', {servidor: "Servidor", mensaje: `${nombre} ha abandonado la sala` });
      });
    });
    return servidor;
  }
}