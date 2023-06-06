const fs = require("fs");
const route = require("express").Router();
const genKey = require("./machine/genKey");
const getKey = require("./machine/getKey");

const multer = require("multer");
const {genWatermarked, extractPlainWatermarked} = require("./lib/watermark");
const upload = multer({dest: 'tmp/key/'});

route.post("/public", upload.single("recipient"), function (req, res) {
    if (req.file && req.file.mimetype === "application/vnd.apple.keynote") {
        const readableStream = fs.createReadStream(req.file.destination + req.file.filename, "utf8");
        readableStream.on('error', function (error) {
            console.log(`error: ${error.message}`);
        });
        readableStream.on('data', (chunk) => {
            const key = extractPlainWatermarked({watermarked: getKey(chunk)});
            if (key.watermark[0] === "pub\x00" && key.watermark[1] === "pub") {
                const plain = key.res.split(("-"));
                const publictoken = chunk;
                const username = plain[1];
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
                const key = extractPlainWatermarked({watermarked: getKey(chunk)});
                if (key.watermark[0] === "bimakeren\x00" && key.watermark[1] === "bimaganteng") {
                    const plain = key.res.split("-");
                    const privatetoken = genKey({
                        plain: genWatermarked({
                            plain: plain[0],
                            watermark: ["priv", "priv"]
                        })
                    });
                    const publictoken = genKey({
                        plain: genWatermarked({
                            plain: `${plain[0]}-${plain[1]}`,
                            watermark: ["pub", "pub"]
                        })
                    });
                    const switcher = plain[0];
                    const username = plain[1];
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
            } catch (e) {
                return res.sendStatus(400);
            }
        });
    } else {
        return res.sendStatus(400);
    }
});

route.get("/register", function (req, res) {
    const token = genKey({
        plain: genWatermarked({
            plain: `${(new Date().getTime() * 111 - 270803).toString()}-${req.query.username}`,
            watermark: ["bimakeren", "bimaganteng"]
        })
    });
    res.send(token);
});

module.exports = route;