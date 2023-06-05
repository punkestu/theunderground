import {useState} from "react";
import axios from "axios";

function resolveAndDownloadBlob(response) {
    let filename = 'credential.key';
    filename = decodeURI(filename);
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    link.remove();
}

export function RegisterForm() {
    const [username, setUsername] = useState("");
    const register = (e) => {
        e.preventDefault();
        if (username.length > 0) {
            axios(`http://localhost:3000/register?username=${username}`, {
                responseType: 'blob'
            }).then(res => {
                resolveAndDownloadBlob(res);
                setUsername("");
            });
        }else{
            alert("Username harus diisi");
        }
    }
    return <form onSubmit={register} className={"h-14 px-4 py-2 flex justify-end gap-2"}>
        <input type="text" name="username" id="username" className={"border-2 rounded-xl p-2"}
               placeholder={"Username"} value={username} onChange={(e) => {
            setUsername(e.target.value)
        }}/>
        <button type={"submit"}
                className={"px-4 py-2 bg-blue-950 text-white rounded-xl flex items-end gap-1"}>Register <span
            className={"material-icons"}>download</span></button>
    </form>
}