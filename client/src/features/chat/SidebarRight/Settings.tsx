import { MdOutlineSettings } from "react-icons/md";

const Settings = () => {
    return (
        <div className="flex items-center gap-3 px-4">
            <MdOutlineSettings  className="w-16 h-16 text-blue-base"/>
            <span className="text-2xl font-semibold">Settings</span>
        </div>
    );
};

export default Settings;