type HandleInputProps = {
    message: string;
    setMessage: (value: string) => void;
}

const HandleInput = ({message, setMessage} : HandleInputProps) => {
  return(
    <input
        type="text"
        value={message}
        className="message-input"
        placeholder="Type your message here"
        onChange={(e) => setMessage(e.target.value)}
    />
  )
}

export default HandleInput