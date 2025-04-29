// import React, { useState } from "react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/*
type Credentials = {
    username: string,
    password: string,
};
 */

/*
interface Props {
    setToken: (token: string) => void;
}
 */

/*
async function loginUser(credentials:Credentials) {
    return fetch('http://localhost:8081/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    })
    .then(data => data.json())
}
*/

const words = ["Type your username...", "Start chatting instantly!", "Enter your nickname..."];

// function LoginPage({ setToken }: Props) {
function LoginPage() {
    //          СТАРА ЛОГІКА
    // const [username, setUsername] = useState('');
    // const [password, setPassword] = useState('');
    //
    // const submit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     const token = await loginUser({ username, password });
    //     setToken(token);
    // }

    // Навігація
    const navigate = useNavigate();

    // Анімація placeholder
    const [placeholder, setPlaceholder] = useState('');
    const [currentWord, setCurrentWord] = useState(0);
    const [currentLetter, setCurrentLetter] = useState(0);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/chat');
    }

    useEffect(() => {
        const interval = setInterval(() => {
            const word = words[currentWord];

            if (currentLetter < word.length) {
                setPlaceholder(word.slice(0, currentLetter + 1));
                setCurrentLetter((prev) => prev + 1);
            } else {
                // Переходимо до наступного слова через маленьку паузу
                setTimeout(() => {
                    setCurrentWord((prev) => (prev + 1) % words.length);
                    setCurrentLetter(0);
                    setPlaceholder('');
                }, 1000); // 1 секунда пауза після завершення слова
                clearInterval(interval); // Зупинити інтервал тимчасово
            }
        }, 150);

        return () => clearInterval(interval);
    }, [currentLetter, currentWord]);


    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-3">
            <h1 className="text-3xl font-bold mb-6">Login to NReaxChat</h1>

            <form onSubmit={submit} className="bg-[#0F172A]/50 rounded-22 shadow-chat p-6 w-full max-w-sm space-y-6">
                {/* Username */}
                <div className="flex flex-col space-y-1">
                    <label htmlFor="username" className="font-medium">
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        // required
                        // placeholder="Type your username..."
                        placeholder={placeholder}
                        className="w-full bg-blue-base rounded-22 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-chat-active placeholder-white"
                        //onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                {/* Password */}
                <div className="flex flex-col space-y-1">
                    <label htmlFor="password" className="font-medium">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        // required
                        placeholder="Type your password..."
                        className="w-full bg-blue-base rounded-22 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-chat-active placeholder-white"
                        //onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="bg-chat-active hover-scale w-full py-2 rounded-22 font-semibold"
                >
                    Login
                </button>
            </form>
        </div>
    );

    // return (
    //     <div className="login-card">
    //         <div className="card-header">
    //             <div className="log">LoginPage</div>
    //         </div>
    //         <form onSubmit={submit} >
    //             <div className="form-group">
    //                 <label htmlFor="username">Username:</label>
    //                 <input required name="username" id="username" type="text" onChange={e => setUsername(e.target.value)}/>
    //             </div>
    //             <div className="form-group">
    //                 <label htmlFor="password">Password:</label>
    //                 <input required name="password" id="password" type="password" onChange={e => setPassword(e.target.value)}/>
    //             </div>
    //             <div className="form-group">
    //                 <input value="LoginPage" type="submit" />
    //             </div>
    //         </form>
    //     </div>
    // );
}

export default LoginPage;