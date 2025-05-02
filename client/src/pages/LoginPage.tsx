import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import Button from '../components/ui/Button';

const words = ["Type your username...", "Start chatting instantly!", "Enter your nickname..."];

function LoginPage() {
    const navigate = useNavigate();

    const [placeholder, setPlaceholder] = useState('');
    const [currentWord, setCurrentWord] = useState(0);
    const [currentLetter, setCurrentLetter] = useState(0);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState<string | null>(null);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const credentials = { username, password };
            const { role } = await login(credentials);

            localStorage.setItem('role', role);
            console.log(role);
            navigate('/chat');
        } catch (err) {
            console.log(err);
            setError("Invalid credentials")
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            const word = words[currentWord];

            if (currentLetter < word.length) {
                setPlaceholder(word.slice(0, currentLetter + 1));
                setCurrentLetter((prev) => prev + 1);
            } else {
                // Go to the next word after a short pause
                setTimeout(() => {
                    setCurrentWord((prev) => (prev + 1) % words.length);
                    setCurrentLetter(0);
                    setPlaceholder('');
                }, 1000); // 1 second pause after word completion
                clearInterval(interval); // Stop the interval temporarily
            }
        }, 150);

        return () => clearInterval(interval);
    }, [currentLetter, currentWord]);


    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-3">
            <h1 className="text-3xl font-bold mb-6">Login to NReaxChat</h1>

            <form onSubmit={submit} className="bg-[#0F172A]/50 rounded-22 shadow-chat p-6 w-full max-w-sm space-y-6">
                <div className="flex flex-col space-y-1">
                    <label htmlFor="username" className="font-medium">
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        required
                        placeholder={placeholder}
                        className="w-full bg-blue-base rounded-22 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-chat-active placeholder-white"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="flex flex-col space-y-1">
                    <label htmlFor="password" className="font-medium">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        required
                        placeholder="Type your password..."
                        className="w-full bg-blue-base rounded-22 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-chat-active placeholder-white"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {error && (
                    <div className="text-red-500 text-sm text-center">{error}</div>
                )}

                <Button type="submit" value="Login" className="bg-chat-active" />
            </form>
        </div>
    );
}

export default LoginPage;