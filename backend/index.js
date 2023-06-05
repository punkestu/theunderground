const express = require('express');
const app = express();
const http = require('http');
const cors = require("cors");
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: true
    }
});
const multer = require("multer");
const upload = multer({dest: 'tmp/key/'});
const fs = require("fs");
const routes = require("./routes");
const getKey = require("./machine/getKey");
const genKey = require("./machine/genKey");

require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/js", express.static(__dirname + "/js"));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/fe/index.html');
});
app.post("/", upload.single("key"), (req, res) => {
    if (req.file && req.file.mimetype === "application/vnd.apple.keynote") {
        const readableStream = fs.createReadStream(req.file.destination + req.file.filename, "utf8");
        readableStream.on('error', function (error) {
            console.log(`error: ${error.message}`);
        });
        readableStream.on('data', (chunk) => {
            const key = getKey(chunk).split("-");
            if (key[0] === "bimakeren" && key[3] === "bimaganteng\x00") {
                const privatetoken = genKey({plain: `priv-${key[1]}-priv`});
                const publictoken = genKey({plain: `pub-${key[1]}-${key[2]}-pub`});
                const switcher = key[1];
                const username = key[2];
                fs.unlinkSync(req.file.destination + req.file.filename);
                return res.send({
                    privatetoken,
                    publictoken,
                    switcher,
                    username
                });
            } else {
                return res.sendStatus(400);
            }
        });
    } else {
        return res.sendStatus(400);
    }
});

app.use(routes);

io.on('connection', (socket) => {
    console.log("a user connected");
    socket.on('chat', (data) => {
        if (data.token) {
            const token = getKey(data.token).split("-")[1];
            const recipient = getKey(data.recipient).split("-")[1];
            const chat = atob(data.chat);
            var res = "";
            for (let i = 0; i < chat.length; i++) {
                res += String.fromCharCode(chat.charCodeAt(i) - parseInt(token[i % 10]) + parseInt(recipient[(recipient.length - i) % 10]));
            }
            const rec_address = genKey({plain: `priv-${recipient}-priv`});
            io.emit(rec_address, {chat: btoa(res)});
        } else {
            console.log('unauthorized');
        }
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});