import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import Button from '../components/ui/Button';
import Input from "../components/ui/Input";
import ErrorMessage from "../components/ui/ErrorMessage";

function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim() || !password.trim()) {
            console.log('Please enter both username and password');
            setError('Please enter both username and password');
            return;
        }
        try {
            setError(null);
            const credentials = { username, password };
            await login(credentials);
            navigate('/chat');
        } catch (err) {
            console.log(err);
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
                        required
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
                        //required
                        placeholderKey="password"
                        variant="login"
                        placeholderAnimated={true}
                    />
                </div>

                <ErrorMessage message={error} variant="toast" onClose={() => setError(null)} />

                <Button type="submit" value="Login" className="bg-chat-active" />
            </form>
        </div>
    );
}

export default LoginPage;
