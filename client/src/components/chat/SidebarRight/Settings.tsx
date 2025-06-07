import {useState} from 'react';
import {MdOutlineSettings} from "react-icons/md";
import SettingModal from '../../modals/SettingModal'
import { useI18n } from '../../../i18n/I18nContext';

const Settings = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useI18n();

    return (
        <>
            <div className="flex items-center gap-3 px-4 cursor-pointer" onClick={() => setIsOpen(true)}>
                <MdOutlineSettings className="w-16 h-16 text-blue-base"/>
                <span className="text-2xl font-semibold">{t("settings")}</span>
            </div>
            <SettingModal isOpen={isOpen} onClose={() => setIsOpen(false)}/>
        </>
    );
};

export default Settings;