import { useNavigate } from "react-router-dom";
import logo from "../assets/nreax.svg";
import Button from '../components/ui/Button';
import { GrLanguage } from "react-icons/gr";

function GuestPage() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <Button
                type="submit"
                onClick={() => alert('Settings clicked')}
                className="absolute top-4 right-4 rounded-full text-white transition"
                value={<GrLanguage size={24} />}
            />
            <div className="bg-[#0F172A]/50 rounded-22 shadow-chat p-6 w-full max-w-sm space-y-6 text-center">
                <div className="flex items-center justify-center gap-1">
                    <img src={logo} alt="NReaxChat logo" className="w-20 h-20 rounded-22" />
                    <h1 className="text-3xl md:text-4xl font-bold">Welcome to NReaxChat</h1>
                </div>

                <p className="text-center text-lg max-w-md">
                    Secure and fast messaging. Connect with people easily.
                </p>

                <div className="flex justify-center gap-4">
                    <Button type="submit" onClick={() => navigate('/login')} value="Login" />
                    <Button type="submit" onClick={() => navigate('/register')} value="Sign Up" />
                </div>

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