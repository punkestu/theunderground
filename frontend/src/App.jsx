import {useEffect, useState} from "react";
import {io} from 'socket.io-client';
import {KeyForm} from "./components/KeyForm.jsx";
import {RecipientForm} from "./components/RecipientForm.jsx";
import {RegisterForm} from "./components/RegisterForm.jsx";
import {UserProfile} from "./components/UserProfile.jsx";
import {BodyChat} from "./components/BodyChat.jsx";

function App() {
    const URL = 'http://localhost:3000';
    const [token, setToken] = useState(undefined);
    const [recipient, setRecipient] = useState("");
    const [message, setMessage] = useState("");
    useEffect(() => {
        if (token) {
            io(URL);
        }
    });
    return (
        <div className="h-screen">
            {!token && <RegisterForm/>}
            <div
                className={`${token ? "h-10" : "h-[calc(100%-3.5rem)]"} flex items-center ${token ? "justify-between" : "justify-center"} px-4 py-8 bg-black`}>
                {!token ?
                    <KeyForm setToken={setToken}/>
                    :
                    <>
                        <RecipientForm setRecipient={setRecipient}/>
                        <UserProfile username={token.username} token={token.publictoken}/>
                    </>
                }
            </div>
            {token &&
                <>
                    <BodyChat/>
                    <form className={"h-12 bg-black flex items-center gap-4 p-4"}>
                        <input type="text" value={message} onChange={(e) => {
                            setMessage(e.target.value)
                        }} className={"flex-grow p-2 rounded-xl"}/>
                        <button className={"px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded-xl"}>Kirim
                        </button>
                    </form>
                </>
            }
        </div>
    );
}

export default App;
