const ChatListItem = () => {
    return (
        <div className="flex-1 overflow-y-auto p-2 m-1">
            <ul className="space-y-2">
                {Array.from({length: 9}).map((_, i) => (
                    <li
                        key={i}
                        className={`flex items-start gap-3 p-3 rounded-22
                          ${i === 0 ? 'bg-chat-active' : 'bg-blue-base'} 
                          hover:opacity-90 transition cursor-pointer`}
                    >
                        <div className="w-12 h-12 rounded-full bg-blue-avatar flex items-center justify-center font-bold">
                            FL
                        </div>
                        <div className="flex flex-col items-start">
                            <div className="font-semibold">Firstname Lastname</div>
                            <div className="text-sm">message</div>
                        </div>
                        {/*<div className="flex flex-col items-start" style={{ background: 'red' }}>*/}
                        {/*    <div className="font-semibold">Firstname Lastname</div>*/}
                        {/*    <div className="text-sm" style={{ background: 'green' }}>message</div>*/}
                        {/*</div>*/}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ChatListItem;