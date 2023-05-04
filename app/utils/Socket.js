import io from 'socket.io-client'

    let socket = io("//localhost:3000", 
    {
        autoConnect: false,
        withCredentials: true,
        extraHeaders: {
            'my-custom-header': 'soy_un_chat'
        }
    });
export default socket;