function encrypt({chat, sw}) {
    let res = "";
    for (let i = 0; i < chat.length; i++){
        res += String.fromCharCode(chat.charCodeAt(i)+parseInt(sw[i%10]));
    }
    console.log("encrypt", chat.length, res.length);
    return btoa(res);
}