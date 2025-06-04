import React from "react";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {useAuthStore} from "../../../stores/authStore.ts";
import api from "../../../api/axios.ts";

const Exit: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await api.post("/auth/api/logout");
        } catch (e) {
            console.error("Logout error:", e);
        } finally {
            useAuthStore.getState().clearAuth();
            navigate("/login");
        }
    };

    return (
        <div
            className="flex items-center gap-3 px-4 cursor-pointer"
            onClick={handleLogout}
        >
            <FiLogOut className="w-16 h-16 text-blue-base " />
            <span className="text-2xl font-semibold">Exit</span>
        </div>
    );
};

export default Exit;
