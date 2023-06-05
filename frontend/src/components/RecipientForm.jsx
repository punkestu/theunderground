import {useState} from "react";

export function RecipientForm({setRecipient}) {
	const [username, setUsername] = useState("");
	const handleRecepient = (e) => {
		const formData = new FormData();
		formData.append('recipient', e.target.files[0]);
		const requestOptions = {
			method: 'POST',
			body: formData
		};
		fetch('http://localhost:3000/public', requestOptions)
			.then(response => {
				if (response.ok) {
					return response.json();
				}
				throw new Error("Recipient tidak valid");
			})
			.then(data => {
				setRecipient(data);
				setUsername(data.username);
			})
			.catch(error => alert(error));
	}
	return (
		<div
			className={"h-10 px-4 rounded-xl bg-white hover:bg-slate-100 relative flex items-center justify-center hover:cursor-pointer"}>
			<span>{username ? `To : "${username}"` : "Upload recipient"}</span>
			<input type="file" name="key" id="key" className={"absolute top-0 opacity-0 h-full w-full bg-white"}
				   onChange={handleRecepient}/>
		</div>
	)
}