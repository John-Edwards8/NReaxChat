export type ChatTab = 'all' | 'private' | 'groups';

export interface ChatTabProps {
    activeTab: ChatTab;
    setActiveTab: (tab: ChatTab) => void;
}