const express = require('express');
const app = express();
const http = require('http');
const cors = require("cors");
const server = http.createServer(app);
const socket = require("./machine/socket");
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

app.use(routes);
socket(server);

server.listen(3000, () => {
    console.log('listening on *:3000');
});