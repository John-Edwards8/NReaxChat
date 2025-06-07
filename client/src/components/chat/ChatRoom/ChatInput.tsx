import { useEffect } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { FiEdit } from 'react-icons/fi';
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import { useI18n } from "../../../i18n/I18nContext";

type HandleInputProps = {
    message: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    sendMessage: () => void;
    editingId: string | null;
    cancelEdit: () => void;
};


const ChatInput = ({ message, setMessage, sendMessage, editingId, cancelEdit }: HandleInputProps) => {
    const { t } = useI18n();
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          sendMessage();
        }
      };

    useEffect(() => {
        const handleGlobalKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && editingId) {
                cancelEdit();
            }
        };
        window.addEventListener('keydown', handleGlobalKey);
        return () => window.removeEventListener('keydown', handleGlobalKey);
    }, [editingId, cancelEdit]);

    return (
        <div className="flex flex-col">
            <div className={`"transition-all duration-300 ease-in-out overflow-hidden
                ${editingId 
                    ? "max-h-16 opacity-100 translate-y-0" 
                    : "max-h-0 opacity-0 -translate-y-4 pointer-events-none"}`}>
                <div className="flex items-center justify-between px-4 py-2 bg-chat-active rounded-t-[22px]">
                    <div className="flex items-center gap-2 font-medium">
                        <FiEdit className="w-4 h-4"/>
                        <span>{t("editingMess")}</span>
                    </div>
                    <Button
                        type="xbutton"
                        onClick={cancelEdit}
                        value="X"
                    />
                </div>
            </div>
            <div className="flex items-center bg-panel px-4 py-2">
                <Input
                    id="chat-message"
                    value={message}
                    placeholder={t("typeMess")}
                    onKeyDown={handleKeyDown}
                    wrapperClassName="flex-1"
                    onChange={(e) => setMessage(e.target.value)}
                    variant="chat"
                />
                <button
                    type="button"
                    className="hover:opacity-80 transition"
                    onClick={sendMessage}
                >
                    <FaPaperPlane className="w-8 h-8 color-icon"/>
                </button>
            </div>
        </div>
    );
};

export default ChatInput;