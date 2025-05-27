export type ChatTab = 'all' | 'groups';

export interface ChatTabProps {
    activeTab: ChatTab;
    setActiveTab: (tab: ChatTab) => void;
}