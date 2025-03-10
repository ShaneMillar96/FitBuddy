import { ReactNode } from "react";

interface Tab {
    label: string;
    content: ReactNode;
}

interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const Tabs = ({ tabs, activeTab, setActiveTab }: TabsProps) => {
    const activeTabIndex = tabs.findIndex((tab) => tab.label === activeTab);

    return (
        <div className="mt-6">
            {/* Tab Buttons */}
            <div className="flex border-b border-gray-200">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        className={`py-2 px-4 transition-all duration-200 text-sm font-medium ${
                            activeTabIndex === index
                                ? "border-b-2 border-teal-400 text-teal-400"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => setActiveTab(tab.label)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="mt-4 bg-white rounded-lg border border-gray-200 p-4">
                {tabs[activeTabIndex].content}
            </div>
        </div>
    );
};

export default Tabs;