import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { login } from "../api/auth";
import Button from '../components/ui/Button';
import Input from "../components/ui/Input";
import { useErrorStore } from "../stores/errorStore";

function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const successMessage = location.state?.successMessage;
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const setError = useErrorStore((state) => state.setError);
    
    useEffect(() => {
        if (successMessage) setError(successMessage, 'nonError');
    }, [successMessage, setError]);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim() || !password.trim()) {
            setError('Please enter both username and password');
            return;
        }
        try {
            const credentials = { username, password };
            await login(credentials);
            navigate('/chat');
        } catch (err) {
            setError("Invalid credentials");
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

                <Button type="submit" value="Login" className="bg-chat-active" />
            </form>
        </div>
    );
}

export default LoginPage;
