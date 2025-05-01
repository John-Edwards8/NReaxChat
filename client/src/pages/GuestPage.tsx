import { useNavigate } from "react-router-dom";
import logo from "../assets/nreax.svg";

function GuestPage() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="bg-[#0F172A]/50 rounded-22 shadow-chat p-6 w-full max-w-sm space-y-6 text-center">

                {/* Лого + назва */}
                <div className="flex items-center justify-center gap-1">
                    <img src={logo} alt="NReaxChat logo" className="w-20 h-20 rounded-22" />
                    <h1 className="text-3xl md:text-4xl font-bold">Welcome to NReaxChat</h1>
                </div>

                {/* Опис */}
                <p className="text-center text-lg max-w-md">
                    Secure and fast messaging. Connect with people easily.
                </p>

                {/* Кнопки */}
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-blue-base hover-scale rounded-22 px-6 py-3 font-semibold">
                        Log In
                    </button>
                    <button className="bg-blue-base hover-scale rounded-22 px-6 py-3 font-semibold">
                        Sign Up
                    </button>
                </div>

                {/* Переваги */}
                <div className="space-y-1">
                    <div className="flex items-center gap-1">
                        <span className="text-2xl">🔥</span>
                        <span>Real-time instant messaging</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="text-2xl">⚡</span>
                        <span>Lightning-fast and always responsive</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="text-2xl">🔒</span>
                        <span>Secure and private message storage</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GuestPage;