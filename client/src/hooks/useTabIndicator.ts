import {useEffect, useState, RefObject} from 'react';
import {ChatTab} from '../types/ChatTabs';

export const useTabIndicator =
    (activeTab: ChatTab, tabRefs: RefObject<Record<string, HTMLButtonElement | null>>) => {
    const [indicatorStyle, setIndicatorStyle] = useState({width: '0px', left: '0px'});

    useEffect(() => {
        const activeButton = tabRefs.current[activeTab];
        if (activeButton) {
            const rect = activeButton.getBoundingClientRect();
            const parentRect = activeButton.parentElement?.getBoundingClientRect();
            if (parentRect) {
                setIndicatorStyle({
                    width: `${rect.width}px`,
                    left: `${rect.left - parentRect.left}px`,
                });
            }
        }
    }, [activeTab, tabRefs]);

    return indicatorStyle;
};