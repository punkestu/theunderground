const {Server} = require("socket.io");
const getKey = require("./getKey");
const genKey = require("./genKey");
const {genWatermarked, extractPlainWatermarked} = require("../lib/watermark");

module.exports = function (server) {
    const io = new Server(server, {
        cors: {
            origin: true
        }
    });

    io.on('connection', (socket) => {
        console.log("a user connected");
        socket.on('chat', (data) => {
            if (data.token) {
                const token = extractPlainWatermarked({
                    watermarked: getKey(data.token)
                }).res.split("-");
                const recipient = extractPlainWatermarked({
                    watermarked: getKey(data.recipient)
                }).res.split("-");
                const chat = atob(data.chat);
                var res = "";
                for (let i = 0; i < chat.length; i++) {
                    res += String.fromCharCode((256 + (chat.charCodeAt(i) - parseInt(token[0][i % 10])) + parseInt(recipient[0][(recipient[0].length - i) % 10]))%256);
                }
                const rec_address = genKey({
                    plain: genWatermarked({
                        plain: recipient[0],
                        watermark: ["priv", "priv"]
                    })
                });
                io.emit(rec_address, {chat: btoa(res), from: token[1], token: data.token});
            } else {
                console.log('unauthorized');
            }
        });
        socket.on("disconnect", () => {
            console.log("a user disconnected");
        })
    });
}