import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import GuestPage from './pages/GuestPage.tsx';
import ChatPage from "./pages/ChatPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";

//import LoginPage from './LoginPage';

function App() {
    // const [token, setToken] = useState(null);

    // if (!token) {
    //   return <LoginPage setToken={setToken}/>
    // }

    return (
        <Router>
            <Routes>
                <Route path="*" element={<Navigate to="/guest" replace />} />
                <Route path="/guest" element={<GuestPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/chat" element={<ChatPage />} />
            </Routes>
        </Router>
    )
}

export default App
