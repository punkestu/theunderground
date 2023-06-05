require('dotenv').config();
const expmod = require("../lib/expmod");
const key = process.env["private"];
const n = process.env["n"];
const l = Math.ceil(Math.log2(n));

module.exports = function (chiperKey) {
    const cipher_byte = atob(chiperKey);
    const cipher_binary = cipher_byte.split("").map((cb, i) => {
        const bit = (cipher_byte.codePointAt(i) >> 0).toString(2);
        return '0'.repeat(8 - bit.length) + bit;
    }).join("");
    var res = "";
    for (let i = 0; i < cipher_binary.length; i += l) {
        const x = parseInt(cipher_binary.slice(i, i + l), 2);
        res += String.fromCharCode(expmod(x, key, n));
    }
    return res;
}