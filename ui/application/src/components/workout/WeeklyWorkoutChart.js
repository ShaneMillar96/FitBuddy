"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_chartjs_2_1 = require("react-chartjs-2");
var chart_js_1 = require("chart.js");
require("chartjs-adapter-date-fns");
chart_js_1.Chart.register(chart_js_1.LineElement, chart_js_1.PointElement, chart_js_1.LinearScale, chart_js_1.TimeScale, chart_js_1.Title, chart_js_1.Tooltip, chart_js_1.Legend);
var WeeklyWorkoutChart = function (_a) {
    var weeklyCounts = _a.weeklyCounts;
    var chartRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        return function () {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, []);
    var data = {
        labels: weeklyCounts.map(function (wc) { return new Date(wc.date).toISOString(); }),
        datasets: [
            {
                label: "Workouts",
                data: weeklyCounts.map(function (wc) { return wc.count; }),
                borderColor: "#2DD4BF", // Teal for line
                backgroundColor: "rgba(45, 212, 191, 0.1)", // Light teal fill
                fill: true,
                tension: 0.4,
                pointBackgroundColor: "#2DD4BF",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "#2DD4BF",
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    };
    var options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0,
                    color: "#6B7280", // Gray-600 for ticks
                    font: { size: 12 },
                },
                grid: {
                    color: "rgba(0, 0, 0, 0.05)", // Very light grid lines
                },
            },
            x: {
                type: "time",
                time: { unit: "day" },
                ticks: {
                    color: "#6B7280", // Gray-600 for ticks
                    font: { size: 12 },
                },
                grid: {
                    color: "rgba(0, 0, 0, 0.05)", // Very light grid lines
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: "rgba(17, 24, 39, 0.9)", // Dark background for contrast
                titleColor: "#fff",
                bodyColor: "#D1D5DB", // Gray-300
                borderColor: "rgba(45, 212, 191, 0.5)", // Teal border
                borderWidth: 1,
                cornerRadius: 8,
            },
        },
    };
    return (<div className="h-80 w-full">
            <react_chartjs_2_1.Line ref={chartRef} data={data} options={options}/>
        </div>);
};
exports.default = WeeklyWorkoutChart;
