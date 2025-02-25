import { useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, Chart, LineElement, PointElement, LinearScale, TimeScale, Title, Tooltip, Legend } from "chart.js";
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
                tension: 0.1,
            },
        ],
    };

    const options = {
        responsive: true, 
        maintainAspectRatio: false, 
        scales: {
            y: {
                beginAtZero: true,
                ticks: { precision: 0 },
            },
            x: {
                type: "time",
                time: { unit: "day" },
            },
        },
        plugins: { legend: { display: false } },
    };

    return (
        <div style={{ height: "400px", width: "100%" }}>
            <Line ref={chartRef} data={data} options={options} />
        </div>
    );
};

export default WeeklyWorkoutChart;
