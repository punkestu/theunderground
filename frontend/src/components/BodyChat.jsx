export function BodyChat({chats}) {
    return (
        <div className={"h-[calc(100%-7rem)] bg-slate-950 px-6 py-2 overflow-y-scroll"}>
            {
                chats.map((chat, i) => {
                    // console.log(chat);
                    return (
                        <div key={i} className={`flex gap-1 ${chat.to ? "text-blue-300" : "text-white"}`}>
                            &gt;<a href={`data:application/vnd.apple.keynote;charset=utf-8,${chat.publictoken}`} download={"pub.key"}>{chat.from ? `${chat.from} > you` : `you > ${chat.to}`}</a> : {chat.chat}
                        </div>
                    );
                })
            }
        </div>
    )
}