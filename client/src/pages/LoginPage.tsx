import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { login } from "../api/auth";
import Button from '../components/ui/Button';
import Input from "../components/ui/Input";
import ErrorMessage from "../components/ui/ErrorMessage";
import { logger } from "../utils/logger";

function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const successMessage = location.state?.successMessage;
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null)
    
    useEffect(() => {
        if (successMessage) {
            setSuccess(successMessage);
        }
    }, [successMessage]);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim() || !password.trim()) {
            logger.warn('Username or password missing');
            setError('Please enter both username and password');
            return;
        }
        try {
            logger.info('Attempting login with:', username);
            setError(null);
            const credentials = { username, password };
            await login(credentials);
            logger.info('Login successful');
            navigate('/chat');
        } catch (err) {
            logger.error('Login failed', err);
            setError("Invalid credentials")
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-3">
            <h1 className="text-3xl font-bold mb-6">Login to NReaxChat</h1>
            <form onSubmit={submit} className="bg-[#0F172A]/50 rounded-22 shadow-chat p-6 w-full max-w-sm space-y-6">
                <div className="flex flex-col space-y-1">
                    <Input
                        id="username"
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholderKey="username"
                        variant="login"
                        placeholderAnimated={true}
                    />
                </div>

                <div className="flex flex-col space-y-1">
                    <Input
                        id="password"
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholderKey="password"
                        variant="login"
                        placeholderAnimated={true}
                    />
                </div>

                <ErrorMessage message={error} variant="toast" onClose={() => setError(null)} />
                <ErrorMessage message={success} variant="nonError" onClose={() => setSuccess(null)} />
                <Button type="submit" value="Login" className="bg-chat-active" />
            </form>
        </div>
    );
}

export default LoginPage;