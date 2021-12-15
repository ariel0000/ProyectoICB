import io from 'socket.io-client'

let socket = io("//192.168.0.251:3000");

export default socket;