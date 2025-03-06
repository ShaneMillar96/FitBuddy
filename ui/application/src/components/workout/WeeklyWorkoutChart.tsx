import { useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    TimeScale,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Title, Tooltip, Legend);

const WeeklyWorkoutChart = ({ weeklyCounts }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, []);

    const data = {
        labels: weeklyCounts.map((wc) => new Date(wc.date).toISOString()),
        datasets: [
            {
                label: "Workouts",
                data: weeklyCounts.map((wc) => wc.count),
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

    const options = {
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

    return (
        <div className="h-80 w-full">
            <Line ref={chartRef} data={data} options={options} />
        </div>
    );
};

export default WeeklyWorkoutChart;