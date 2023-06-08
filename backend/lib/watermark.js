function genWatermarked({plain, watermark}){
    const len = plain.length;
    var res = "";
    const maxlen = len > watermark[0].length ? (len > watermark[1].length ? len : watermark[1].length): (watermark[0].length > watermark[1].length ? watermark[0].length : watermark[1].length);
    for(let i = 0; i < maxlen; i++){
        res += watermark[0][i] ?? "0";
        res += watermark[1][i] ?? "0";
        res += plain[i] ?? "0";
    }
    return `${len} ${res}`;
}

function extractPlainWatermarked({watermarked}){
    const key = watermarked.split(" ");
    var res = "";
    const watermark = ["", ""];
    for (let i = 0; i < key[1].length; i++) {
        res += key[1][3*i+2] ?? "";
        watermark[0] +=  key[1][3*i] ?? "";
        watermark[1] +=  key[1][3*i+1] ?? "";
    }
    res = res.replace(/0/g, '');
    watermark[0] = watermark[0].replace(/0/g, '');
    watermark[1] = watermark[1].replace(/0/g, '');
    return {res, watermark};
}

// const res = genWatermarked({plain: "10293812093-firdan", watermark: ["bimakeren","bimaganteng"]})
// console.log(res);
// console.log(extractPlainWatermarked({watermarked: res}));
module.exports = {
    extractPlainWatermarked,
    genWatermarked
}