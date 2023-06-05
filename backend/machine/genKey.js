require('dotenv').config();
const n = process.env["n"];
const l = Math.ceil(Math.log2(n));
const e = process.env["public"];
const enc = new TextEncoder();
const expmod = require("../lib/expmod");

module.exports = ({plain}) => {
    const plain_byte = Array.from(enc.encode(plain));
    var cipher_binary = plain_byte.map(pb => {
        pb = expmod(pb, e, n);
        const bit = (pb >> 0).toString(2);
        return '0'.repeat(l - bit.length) + bit;
    }).join("");
    cipher_binary = cipher_binary + '0'.repeat(cipher_binary.length % 8 > 0 ? 8 - cipher_binary.length % 8 : 0)
    var res = "";
    for (let i = 0; i < cipher_binary.length; i += 8) {
        const tmp = parseInt(cipher_binary.slice(i, i + 8), 2);
        res += String.fromCharCode(tmp);
    }

    return btoa(res);
}