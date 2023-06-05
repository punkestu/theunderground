export function UserProfile({token, username}) {
    return (
        <div className={"flex items-center gap-4"}>
            <h1 className={"font-bold text-white"}>User : "{username}"</h1>
            <a href={`data:application/vnd.apple.keynote;charset=utf-8,${token}`} download={"pub.key"} className={"px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded-xl"}>Your ID</a>
        </div>
    );
}