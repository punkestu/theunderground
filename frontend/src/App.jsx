import {useEffect, useState} from "react";
import {KeyForm} from "./components/KeyForm.jsx";
import {RecipientForm} from "./components/RecipientForm.jsx";
import {RegisterForm} from "./components/RegisterForm.jsx";
import {UserProfile} from "./components/UserProfile.jsx";
import {BodyChat} from "./components/BodyChat.jsx";
import {ChatField} from "./components/ChatField.jsx";

import {socket} from "./socket.js";

function decrypt({chat, sw}) {
    chat = atob(chat);
    let res = "";
    for (let i = 0; i < chat.length; i++) {
        res += String.fromCharCode(chat.charCodeAt(i) - parseInt(sw[(sw.length - i) % 10]));
    }
    console.log("decrypt", chat.length, res.length);
    return res;
}

function App() {
    const [token, setToken] = useState(undefined);
    const [recipient, setRecipient] = useState("");
    const [chats, setChats] = useState([]);
    useEffect(() => {
        if (token) {
            socket.on(token.privatetoken, (data) => {
                setChats(prevChats => [...prevChats, {
                    from: data.from,
                    chat: decrypt({chat: data.chat, sw: token.switcher}),
                    publictoken: data.token
                }]);
            });
        }
    }, [token]);
    return (
        <div className="h-screen">
            {!token && <RegisterForm/>}
            <div
                className={`${token ? "h-10" : "h-[calc(100%-3.5rem)]"} flex items-center ${token ? "justify-between" : "justify-center"} px-4 py-8 bg-black`}>
                {!token ?
                    <KeyForm setToken={setToken} socket={socket}/>
                    :
                    <>
                        <RecipientForm setRecipient={setRecipient}/>
                        <UserProfile username={token.username} token={token.publictoken}/>
                    </>
                }
            </div>
            {token &&
                <>
                    <BodyChat chats={chats}/>
                    <ChatField setChats={setChats} recipient={recipient} socket={socket} token={token}/>
                </>
            }
        </div>
    );
}

export default App;
