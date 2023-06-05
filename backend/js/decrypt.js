function decrypt({chat, sw}) {
    chat = atob(chat);
    let res = "";
    for (let i = 0; i < chat.length; i++){
        res += String.fromCharCode(chat.charCodeAt(i)-parseInt(sw[(sw.length-i)%10]));
    }
    console.log("decrypt", chat.length, res.length);
    return res;
}