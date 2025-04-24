import MessageBubble from "./MessageBubble.tsx";

const mockMessages = [
    { text: "Hey, how are you?", sender: "other" },
    { text: "I'm good, thanks! Working on the frontend now.", sender: "me" },
    { text: "Nice! Tailwind or plain CSS?", sender: "other" },
    { text: "Tailwind, of course 😎", sender: "me" },
    { text: "Haha, love it. Btw, don't forget about responsive design.", sender: "other" },
    { text: "Already on it. Using flex and grid like a pro 💪", sender: "me" },
    { text: "Cool! Can I see a preview later?", sender: "other" },
    { text: "Sure. I’ll send a screenshot once it's styled.", sender: "me" },
    { text: "Perfect! Don’t forget rounded corners everywhere 😂", sender: "other" },
    { text: "Haha, already at rounded-22 on everything 🔵", sender: "me" },
    { text: "🔥🔥🔥", sender: "other" },
    { text: "Okay, back to coding now 💻", sender: "me" },
    { text: "Catch you later! 🧠", sender: "other" },
];

const MessagesList = () => {
    return (
        <div className="flex-1 overflow-y-auto p-2 space-y-2 m-1">
            {mockMessages.map((msg, index) => (
                <MessageBubble key={index} text={msg.text} sender={msg.sender as 'me' | 'other'} />
            ))}
        </div>
    );
};

export default MessagesList;
