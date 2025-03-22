const Messages = ({messages} : {messages:string[]}) => {
    return(
        <ul className="message-list">
            {messages.map((msg, index) => (
            <li key={index}>{msg}</li>
            ))}
        </ul>
    )
  }
  
  export default Messages
          