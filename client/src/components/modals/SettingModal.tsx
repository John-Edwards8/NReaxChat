import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { ModalProps } from '../../types/Modal';
import { IoArrowForwardOutline } from "react-icons/io5";
import UpdateDataModal from '../modals/UpdateDataModal';
import ChangeThemeModal from '../modals/ChangeThemeModal';
import { useI18n } from '../../i18n/I18nContext';
import LanguageSelectModal from './LanguageSelectModal';

const SettingModal: React.FC<ModalProps> = (props) => {
    const [modalType, setModalType] = useState<null | 'update' | 'theme' | 'lang'>(null);
    const { t } = useI18n();

    const handleBack = () => setModalType(null);

    if (modalType === 'update') return <UpdateDataModal isOpen={true} onClose={handleBack} />;
    if (modalType === 'theme') return <ChangeThemeModal isOpen={true} onClose={handleBack} />;
    if (modalType === 'lang') return <LanguageSelectModal isOpen={true} onClose={handleBack} />;

    return (
        <Modal {...props} title={t("settings")} onClose={props.onClose} closeText="">
            <div className="flex flex-col items-center gap-3">
                <Button
                    type="context"
                    className="btn-modal-hover w-full justify-between rounded-22"
                    onClick={() => setModalType('update')}
                    value={
                        <span className="flex w-full items-center justify-between">
                        {t("modals.title.upadateData")}
                            <IoArrowForwardOutline/>
                        </span>
                    }
                />
                <Button
                    type="context"
                    className="btn-modal-hover w-full justify-between rounded-22"
                    onClick={() => setModalType('theme')}
                    value={
                        <span className="flex w-full items-center justify-between">
                        {t("changeTheme")}
                            <IoArrowForwardOutline/>
                        </span>
                    }
                />
                <Button
                    type="context"
                    className="btn-modal-hover w-full justify-between rounded-22"
                    onClick={() => setModalType('lang')}
                    value={
                        <span className="flex w-full items-center justify-between">
                        {t("changeLang")}
                            <IoArrowForwardOutline/>
                        </span>
                    }
                />
            </div>
        </Modal>
    );
};

export default SettingModal;