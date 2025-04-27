import {FaPaperPlane} from "react-icons/fa";

type HandleInputProps = {
    message: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    sendMessage: () => void;
};


const ChatInput = ({ message, setMessage, sendMessage }: HandleInputProps) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          sendMessage();
        }
      };
    return (
        <div className="flex items-center bg-blue-base px-4 py-2">
            <input
                type="text"
                value={message}
                className="flex-1 bg-transparent outline-none placeholder-white"
                placeholder="Type a message..."
                onKeyDown={handleKeyDown}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button
                type="button"
                className="hover:opacity-80 transition"
                onClick={sendMessage}
            >
                <FaPaperPlane className="w-8 h-8"/>
            </button>
        </div>
    );
};

export default ChatInput;