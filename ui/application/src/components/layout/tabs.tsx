import { useState, ReactNode } from "react";

interface Tab {
    label: string;
    content: ReactNode;
}

interface TabsProps {
    tabs: Tab[];
    defaultTabIndex?: number;
}

const Tabs = ({ tabs, defaultTabIndex = 0 }: TabsProps) => {
    const [activeTab, setActiveTab] = useState(defaultTabIndex);

    return (
        <div className="mt-6">
            {/* Tab Buttons */}
            <div className="flex border-b border-gray-700">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        className={`py-2 px-4 transition-all duration-200 ${
                            activeTab === index
                                ? "border-b-2 border-white text-white"
                                : "text-gray-500 hover:text-gray-300"
                        }`}
                        onClick={() => setActiveTab(index)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="mt-4 p-4 bg-gray-900 border border-gray-700 rounded-lg">
                {tabs[activeTab].content}
            </div>
        </div>
    );
};

export default Tabs;
