"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tabs = function (_a) {
    var tabs = _a.tabs, activeTab = _a.activeTab, setActiveTab = _a.setActiveTab;
    var activeTabIndex = tabs.findIndex(function (tab) { return tab.label === activeTab; });
    return (<div className="mt-6">
            {/* Tab Buttons */}
            <div className="flex border-b border-gray-200">
                {tabs.map(function (tab, index) { return (<button key={index} className={"py-2 px-4 transition-all duration-200 text-sm font-medium ".concat(activeTabIndex === index
                ? "border-b-2 border-teal-400 text-teal-400"
                : "text-gray-500 hover:text-gray-700")} onClick={function () { return setActiveTab(tab.label); }}>
                        {tab.label}
                    </button>); })}
            </div>

            {/* Tab Content */}
            <div className="mt-4 bg-white rounded-lg border border-gray-200 p-4">
                {tabs[activeTabIndex].content}
            </div>
        </div>);
};
exports.default = Tabs;
