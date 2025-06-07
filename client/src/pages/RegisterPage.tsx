import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/auth";
import Button from '../components/ui/Button';
import Input from "../components/ui/Input";
import { useErrorStore } from "../stores/errorStore";
import ErrorMessage from "../components/ui/ErrorMessage";
import { useI18n } from "../i18n/I18nContext";

function RegisterPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const setError = useErrorStore((state) => state.setError);
    const { t } = useI18n();
    
    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim() && !password.trim()) {
            setError(t("errors.missingFields"), 'inline', 'reg');
            return;
        } else if (!username.trim()) {
            setError(t("errors.missingUsername"), 'inline', 'reg');
            return;
        } else if (!password.trim()) {
            setError(t("errors.missingPassword"), 'inline', 'reg');
            return;
        }
        try {
            const credentials = { username, password };
            await register(credentials);
            setError('', 'inline', 'reg');
            navigate('/login', { state: { successMessage: `${t("successMessage")} ${username}!` } });
        } catch (err) {
            setError(t("errors.register.invalid"), 'inline', 'reg');
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-3">
            <h1 className="text-3xl font-bold mb-6">{t("registerTo")}</h1>
            <form onSubmit={submit} className="bg-container rounded-22 shadow-chat p-6 w-full max-w-sm space-y-6">
                <div className="flex flex-col space-y-1">
                    <Input
                        id="username"
                        label={t("label.username")}
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
                        label={t("label.password")}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholderKey="password"
                        variant="login"
                        placeholderAnimated={true}
                    />
                </div>

                <Button type="submit" value={t("label.register")} className="bg-chat-active" />
                <ErrorMessage field="reg" />
            </form>
        </div>
    );
}

export default RegisterPage;
