const HandleInput = ({message, setMessage} : {message:any, setMessage:any}) => {
  return(
    <input
        type="text"
        value={message}
        className="message-input"
        placeholder="Type your message here"
        onChange={(e) => setMessage(e.target.value)} />
  )
}

export default HandleInput