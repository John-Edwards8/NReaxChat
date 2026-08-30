import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GuestPage from './pages/GuestPage';
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import RegisterPage from './pages/RegisterPage';

function App() {    
    return (
        <Router>
            <Routes>
                <Route path="*" element={<Navigate to="/guest" replace />} />
                <Route path="/guest" element={<GuestPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/chat" element={<ChatPage />} />
                </Route>
            </Routes>
        </Router>
    )
}

export default App