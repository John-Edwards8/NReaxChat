import './ChatRoom.css'

function ChatRoom() {
  return (
    <>
      <div className="card">
        <div className="chat-header">Chat</div>
        <div className="chat-window">
          <ul className="message-list" />
        </div>
        <div className="chat-input">
          <input type="text" className="message-input" placeholder="Type your message here" />
          <button className="send-button">Send</button>
        </div>
      </div>
    </>
  )
}

export default ChatRoom
