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
                borderColor: "#60A5FA",
                backgroundColor: "rgba(96, 165, 250, 0.2)",
                fill: true,
                tension: 0.4,
                pointBackgroundColor: "#60A5FA",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "#60A5FA",
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
                    color: "#A0A0A0",
                    font: { size: 12 },
                },
                grid: {
                    color: "rgba(255, 255, 255, 0.05)",
                },
            },
            x: {
                type: "time",
                time: { unit: "day" },
                ticks: {
                    color: "#A0A0A0",
                    font: { size: 12 },
                },
                grid: {
                    color: "rgba(255, 255, 255, 0.05)",
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: "rgba(17, 24, 39, 0.9)", // Dark background
                titleColor: "#fff",
                bodyColor: "#A0A0A0",
                borderColor: "rgba(96, 165, 250, 0.5)",
                borderWidth: 1,
                cornerRadius: 8,
            },
        },
    };

    return (
        <div className="h-96 w-full">
            <Line ref={chartRef} data={data} options={options} />
        </div>
    );
};

export default WeeklyWorkoutChart;