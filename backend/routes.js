const fs = require("fs");
const route = require("express").Router();
const genKey = require("./machine/genKey");
const getKey = require("./machine/getKey");
const multer = require("multer");
const upload = multer({dest: 'tmp/key/'});
route.post("/public", upload.single("recipient"), function (req, res) {
    if (req.file && req.file.mimetype === "application/vnd.apple.keynote") {
        console.log(req.file);
        const readableStream = fs.createReadStream(req.file.destination + req.file.filename, "utf8");
        readableStream.on('error', function (error) {
            console.log(`error: ${error.message}`);
        });
        readableStream.on('data', (chunk) => {
            const key = getKey(chunk).split("-");
            if (key[0] === "pub" && key[3] === "pub\x00") {
                const publictoken = chunk;
                const username = key[2];
                fs.unlinkSync(req.file.destination + req.file.filename);
                return res.send({
                    publictoken,
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

route.get("/register", function (req, res) {
    fs.writeFile(`${__dirname}/keys/token.key`, genKey({
        plain: `bimakeren-${(new Date().getTime() * 111 - 270803).toString()}-${req.query.username}-bimaganteng`
    }), function (err) {
        if (!err) {
            res.download(`${__dirname}/keys/token.key`);
        } else {
            console.log(err);
            res.sendStatus(500);
        }
    });
});

route.get("/chat", function (req, res) {
    res.sendFile(__dirname + "/fe/chat.html");
});

module.exports = route;