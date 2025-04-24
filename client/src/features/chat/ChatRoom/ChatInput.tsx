import {FaPaperPlane} from "react-icons/fa";

const ChatInput = () => {
    return (
        <div className="flex items-center bg-blue-base px-4 py-2">
            <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 bg-transparent outline-none placeholder-white"
                //className="flex-1 bg-transparent outline-none"
            />
            <button type="button" className="hover:opacity-80 transition">
                <FaPaperPlane className="w-8 h-8"/>
            </button>
        </div>
    );
};

export default ChatInput;