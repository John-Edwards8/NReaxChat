import {useState} from 'react';
import {MdOutlineSettings} from "react-icons/md";
import SettingModal from '../../modals/SettingModal'

const Settings = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="flex items-center gap-3 px-4" onClick={() => setIsOpen(true)}>
                <MdOutlineSettings className="w-16 h-16 text-blue-base"/>
                <span className="text-2xl font-semibold">Settings</span>
            </div>
            <SettingModal isOpen={isOpen} onClose={() => setIsOpen(false)}/>
        </>
    );
};

export default Settings;