export function KeyForm({setToken}) {
	const login = (e) => {
		const formData = new FormData();
		formData.append('key', e.target.files[0]);
		const requestOptions = {
			method: 'POST',
			body: formData
		};
		fetch('http://localhost:3000', requestOptions)
			.then(response => {
				if (response.ok) {
					return response.json();
				}
				throw new Error("Key tidak valid");
			})
			.then(data => setToken(data))
			.catch(error => alert(error));
	}
	return (
		<div className={"relative h-full w-full"}>
			<div
				className={"h-full bg-slate-300 rounded-xl border-4 border-dashed border-slate-700 w-full flex items-center justify-center"}>
				<div className={"flex flex-col items-center w-44"}>
					<span className={"material-icons text-3xl"}>upload</span>
					<h1 className={"text-center font-bold text-xl flex items-end"}>upload .key here to login</h1>
				</div>
			</div>
			<input type="file" name="key" onChange={login} id="key"
				   className={"h-full w-full opacity-0 absolute top-0"}/>
		</div>
	);
}