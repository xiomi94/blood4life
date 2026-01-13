import { useTranslation } from 'react-i18next';

export type TabType = 'donors' | 'hospitals' | 'appointments' | 'campaigns';

interface AdminTabsProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export const AdminTabs = ({ activeTab, onTabChange }: AdminTabsProps) => {
    const { t } = useTranslation();

    const tabs: { value: TabType; label: string }[] = [
        { value: 'donors', label: t('dashboard.admin.tabs.donors') },
        { value: 'hospitals', label: t('dashboard.admin.tabs.hospitals') },
        { value: 'appointments', label: t('dashboard.admin.tabs.appointments') },
        { value: 'campaigns', label: t('dashboard.admin.tabs.campaigns') },
    ];

    return (
        <div className="flex space-x-4 mb-6">
            {tabs.map((tab) => (
                <button
                    key={tab.value}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === tab.value
                            ? 'bg-blue-600 text-white'
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                    onClick={() => onTabChange(tab.value)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};
