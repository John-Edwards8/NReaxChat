import { useNavigate } from "react-router-dom";
import logo from "../assets/nreax.svg";
import Button from '../components/ui/Button';
import { GrLanguage } from "react-icons/gr";
import { useState } from "react";
import LanguageSelectModal from "../components/modals/LanguageSelectModal";
import { useI18n } from "../i18n/I18nContext";

function GuestPage() {
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const { t } = useI18n();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <Button
                type="submit"
                onClick={() => setModalOpen(true)}
                className="absolute top-4 right-4 rounded-full text-white transition"
                value={<GrLanguage size={24} />}
            />
            <LanguageSelectModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
            />
            <div className="bg-[#0F172A]/50 rounded-22 shadow-chat p-6 w-full max-w-sm space-y-6 text-center">
                <div className="flex items-center justify-center gap-1">
                    <img src={logo} alt="NReaxChat logo" className="w-20 h-20 rounded-22" />
                    <h1 className="text-3xl md:text-4xl font-bold">{t("welcome")}</h1>
                </div>

                <p className="text-center text-lg max-w-md">
                    {t("description")}
                </p>

                <div className="flex justify-center gap-4">
                    <Button type="submit" onClick={() => navigate('/login')} value={t("login")} />
                    <Button type="submit" onClick={() => navigate('/register')} value={t("signup")} />
                </div>

                <div className="space-y-1">
                    <div className="flex items-center gap-1">
                        <span className="text-2xl">🔥</span>
                        <span>{t("features.realtime")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="text-2xl">⚡</span>
                        <span>{t("features.fast")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="text-2xl">🔒</span>
                        <span>{t("features.secure")}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GuestPage;