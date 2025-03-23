import { useState } from 'react';
import './App.css'
import ChatBlock from './Chat/ChatBlock'
import ChatRoom from './Chat/ChatRoom'
import Login from './Login';

function App() {
  const [token, setToken] = useState(null);
  
  if (!token) {
    return <Login setToken={setToken}/>
  }

  return (
    <>
      <ChatBlock />
      <ChatRoom />
    </>
  )
}

export default App
