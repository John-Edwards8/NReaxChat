import { useState, useRef, useEffect } from 'react';

const ChatSectionHeader = () => {
    const tabs = [
        { key: 'all', label: 'All Chats' },
        { key: 'groups', label: 'Groups' },
        // якщо потрібно додати ще:
        //{key: 'archived', label: 'Archived' },
    ];

    const [activeTab, setActiveTab] = useState('all');
    const [indicatorStyle, setIndicatorStyle] = useState({ width: '0px', left: '0px' });
    const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

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
    }, [activeTab, tabs.length]);

    return (
        <div className="text-center m-1">
            <div className="text-xl font-semibold mb-1">Message</div>
            <div className="flex justify-center">
                <div className="relative bg-blue-base rounded-full inline-flex p-1 space-x-1">
                    {/* Плаваючий індикатор */}
                    <div
                        className="absolute top-1 bottom-1 bg-black rounded-full transition-all duration-300 ease-in-out z-0"
                        style={{
                            ...indicatorStyle,
                        }}
                    />

                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            // ref={(el) => (tabRefs.current[tab.key] = el)}
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

// =======================================
//             Резервна версія
// =======================================

// import { useState } from 'react';
//
// const ChatSectionHeader = () => {
//     const tabs = [
//         { key: 'all', label: 'All Chats' },
//         { key: 'groups', label: 'Groups' },
//         // якщо потрібно додати ще:
//         //{key: 'archived', label: 'Archived' },
//     ];
//
//     const [activeTab, setActiveTab] = useState('all');
//     const activeIndex = tabs.findIndex(tab => tab.key === activeTab); // Знаходимо індекс активної вкладки
//
//     return (
//         <div className="text-center mt-2">
//             <div className="text-xl font-semibold mb-1">Message</div>
//             <div className="flex justify-center">
//                 <div className="relative bg-blue-base rounded-full inline-flex p-1 space-x-1">
//                     <div
//                         className="absolute inset-0 m-1 bg-black rounded-full transition-transform duration-300 ease-in-out"
//                         style={{
//                             width: calc((100% - 8px) / ${tabs.length}),
//                             transform: translateX(${activeIndex * 100}%),
//                         }}
//                     />
//
//                     {tabs.map((tab) => (
//                         <button
//                             key={tab.key}
//                             onClick={() => setActiveTab(tab.key)}
//                             className={rounded-full px-4 p-1 text-sm font-medium transition z-10 ${
//                                 activeTab === tab.key ? 'text-white' : 'text-black'
//                             }}
//                         >
//                             {tab.label}
//                         </button>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default ChatSectionHeader;