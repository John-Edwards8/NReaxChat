const ChatHeader = () => {
    return (
        <div className="flex items-center gap-3 p-2 bg-blue-base">
            <div className="w-12 h-12 rounded-full bg-blue-avatar flex items-center justify-center font-bold">
                FL
            </div>
            <div className="flex flex-col items-start">
                <div className="font-semibold">Firstname Lastname</div>
                <div className="text-sm">message</div>
            </div>
        </div>
    );
};

export default ChatHeader;