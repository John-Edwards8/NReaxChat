import React, { useState } from "react";
import "../Login.css";

type Credentials = {
    username: string,
    password: string,
};

interface Props {
    setToken: (token: string) => void;
}

async function loginUser(credentials:Credentials) {
    return fetch('http://localhost:8081/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    })
    .then(data => data.json())
}

function LoginPage({ setToken }: Props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = await loginUser({ username, password });
        setToken(token);
    }

    return (
        <div className="login-card">
            <div className="card-header">
                <div className="log">LoginPage</div>
            </div>
            <form onSubmit={submit} >
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input required name="username" id="username" type="text" onChange={e => setUsername(e.target.value)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input required name="password" id="password" type="password" onChange={e => setPassword(e.target.value)}/>
                </div>
                <div className="form-group">
                    <input value="LoginPage" type="submit" />
                </div>
            </form>
        </div>
    );
}

export default LoginPage;