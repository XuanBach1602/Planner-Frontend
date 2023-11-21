import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

const ChartComponent = () => {
  ChartJS.register(ArcElement, Tooltip, Legend);
  const data = {
    labels: ["Not started: 12", "In progress: 9", "Late: 3", "Completed: 5"],
    datasets: [
      {
        // label: '# of Votes',
        data: [12, 19, 3, 5],
        backgroundColor: ["#9A9A9A", "#53D344", "#61A7F7", "#FC2A2A"],
        borderWidth: 1,
        hoverOffset: 4,
        width: 400,
        height: 400,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "right", // Đặt vị trí của legend bên phải
      },
    },
  };

  return (
    <div
      style={{
        width: "300px",
        height: "300px",
        textAlign: "center",
        transform: "translate(30%, -20%)",
      }}
    >
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default ChartComponent;
