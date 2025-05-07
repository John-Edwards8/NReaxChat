import {FaPaperPlane} from "react-icons/fa";
import Input from "../../ui/Input";

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
            <Input
                id="chat-message"
                value={message}
                placeholderKey="message"
                onKeyDown={handleKeyDown}
                wrapperClassName="flex-1"
                onChange={(e) => setMessage(e.target.value)}
                variant="chat"
                placeholderAnimated="onFocus"
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