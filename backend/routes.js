const fs = require("fs");
const route = require("express").Router();
const genKey = require("./machine/genKey");
const getKey = require("./machine/getKey");

const multer = require("multer");
const upload = multer({dest: 'tmp/key/'});

route.post("/public", upload.single("recipient"), function (req, res) {
    if (req.file && req.file.mimetype === "application/vnd.apple.keynote") {
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

route.post("/login", upload.single("key"), (req, res) => {
    if (req.file && req.file.mimetype === "application/vnd.apple.keynote") {
        const readableStream = fs.createReadStream(req.file.destination + req.file.filename, "utf8");
        readableStream.on('error', function (error) {
            console.log(`error: ${error.message}`);
        });
        readableStream.on('data', (chunk) => {
            try {
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
            } catch (e){
                return res.sendStatus(400);
            }
        });
    } else {
        return res.sendStatus(400);
    }
});

route.get("/register", function (req, res) {
    const token = genKey({
        plain: `bimakeren-${(new Date().getTime() * 111 - 270803).toString()}-${req.query.username}-bimaganteng`
    });
    res.send(token);
});

module.exports = route;