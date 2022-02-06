import io from 'socket.io-client'

    let socket = io("//192.168.1.150:3000", {autoConnect: false});
export default socket;