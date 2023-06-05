const {Server} = require("socket.io");
const getKey = require("./getKey");
const genKey = require("./genKey");

module.exports = function(server){
    const io = new Server(server, {
        cors: {
            origin: true
        }
    });

    io.on('connection', (socket) => {
        console.log("a user connected");
        socket.on('chat', (data) => {
            if (data.token) {
                const token = getKey(data.token).split("-");
                const recipient = getKey(data.recipient).split("-")[1];
                const chat = atob(data.chat);
                var res = "";
                for (let i = 0; i < chat.length; i++) {
                    res += String.fromCharCode(chat.charCodeAt(i) - parseInt(token[1][i % 10]) + parseInt(recipient[(recipient.length - i) % 10]));
                }
                const rec_address = genKey({plain: `priv-${recipient}-priv`});
                io.emit(rec_address, {chat: btoa(res), from: token[2], token: data.token});
            } else {
                console.log('unauthorized');
            }
        });
        socket.on("disconnect", ()=>{
            console.log("a user disconnected");
        })
    });
}