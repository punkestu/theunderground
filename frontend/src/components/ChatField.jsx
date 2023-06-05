import {useState} from "react";

function encrypt({chat, sw}) {
    let res = "";
    for (let i = 0; i < chat.length; i++) {
        res += String.fromCharCode(chat.charCodeAt(i) + parseInt(sw[i % 10]));
    }
    console.log("encrypt", chat.length, res.length);
    return btoa(res);
}

// eslint-disable-next-line react/prop-types
export function ChatField({recipient, token, socket, setChats}) {
    const [message, setMessage] = useState("");
    const sendChat = (e) => {
        e.preventDefault();
        console.log({
            message, recipient, token
        })
        // eslint-disable-next-line react/prop-types
        if (message.length > 0 && recipient.publictoken.length > 0) {
            // eslint-disable-next-line react/prop-types
            socket.emit("chat", {
                chat: encrypt({chat: message, sw: token.switcher}),
                token: token.publictoken,
                recipient: recipient.publictoken
            });
            // eslint-disable-next-line react/prop-types
            setChats(prevChats => [...prevChats, {to: recipient.username, chat: message, publictoken: recipient.publictoken}]);
            setMessage("");
        }
    }
    return (
        <form className={"h-12 bg-black flex items-center gap-4 p-4"} onSubmit={sendChat}>
            <input type="text" value={message} onChange={(e) => {
                setMessage(e.target.value)
            }} className={"flex-grow p-2 rounded-xl"}/>
            <button className={"px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded-xl"}>Kirim
            </button>
        </form>
    )
}