import { useRef } from 'react';
import { useTabIndicator } from '../../../hooks/useTabIndicator';
import { ChatTab, ChatTabProps } from '../../../types/ChatTabs';

const ChatSectionHeader = ({ activeTab, setActiveTab}: ChatTabProps) => {
    const tabs: {key: ChatTab, label: string}[] = [
        { key: 'all', label: 'All Chats' },
        { key: 'groups', label: 'Groups' }
    ];

    const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
    const indicatorStyle = useTabIndicator(activeTab, tabRefs);

    return (
        <div className="text-center m-1">
            <div className="text-xl font-semibold mb-1">Message</div>
            <div className="flex justify-center">
                <div className="relative bg-blue-base rounded-full inline-flex p-1 space-x-1">
                    <div
                        className="absolute top-1 bottom-1 bg-black rounded-full transition-all duration-300 ease-in-out z-0"
                        style={{
                            ...indicatorStyle,
                        }}
                    />

                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            ref={(el) => { tabRefs.current[tab.key] = el; }}
                            onClick={() => setActiveTab(tab.key)}
                            className={`rounded-full px-4 p-1 text-sm font-medium transition z-10 ${
                                activeTab === tab.key ? 'text-white' : 'text-black'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ChatSectionHeader;