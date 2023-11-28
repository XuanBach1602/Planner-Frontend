import React, { useEffect, useState } from "react";
import { useUser } from "../../UserContext";
import { PieChart } from "@mui/x-charts/PieChart";
import "./Hub.css";
import axios from "axios";
import { styled } from "@mui/material/styles";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { Navigate, useNavigate } from "react-router-dom";
const Hub = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [planList, setPlanList] = useState([]);
  const [statisticalDataList, setStatisticalDataList] = useState([]);

  const convertToShortName = (planName) => {
    return planName.trim(" ")[0].toUpperCase();

    // .map((word) => word[0])
    // .join("")
    // .toUpperCase();
  };

  const checkEmptyPlan = (data) => {
    const values = Object.values(data);
    const total = values.reduce((acc, currentValue) => {
      return acc + currentValue;
    }, 0);
    return total !== 0;
  };
  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/plan/GetByUserID/${user.id}`
        );
        setPlanList(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPlanData();
  }, []);

  useEffect(() => {
    const fetchPlanStatiticData = () => {
      if (planList != null) {
        // console.log(planList);
        const data = planList.map(async (plan) => {
          try {
            const res = await axios.get(
              `${process.env.REACT_APP_API_URL}/api/worktask/GetCountOfFilteredTask/${plan.id}`
            );
            return {
              data: res.data,
              name: plan.name,
              id: plan.id,
              isEmpty: checkEmptyPlan(res.data),
            };
          } catch (error) {
            return null;
          }
        });
        Promise.all(data).then((data) => {
          const filterdData = data.filter((x) => x != null);
          // console.log(filterdData);
          setStatisticalDataList(filterdData);
        });
      }
    };
    fetchPlanStatiticData();
  }, [planList]);

  const StyledText = styled("text")(({ theme }) => ({
    fill: theme.palette.text.primary,
    textAnchor: "middle",
    dominantBaseline: "central",
    fontSize: 20,
  }));

  function PieCenterLabel({ children }) {
    const { width, height, left, top } = useDrawingArea();
    return (
      <StyledText x={left + width / 2 - 30} y={top + height / 2}>
        {children}
      </StyledText>
    );
  }
  return (
    <div className="hub-container">
      <h1 style={{ fontSize: "30px", fontWeight: "400" }}>
        Welcome {user.name}
      </h1>
      <h3 style={{ fontSize: "24px", fontWeight: "400" }}>All</h3>
      <div className="plan-list-display">
        {statisticalDataList != null &&
          statisticalDataList.map((plan, index) => (
            <div
              className="plan-item-statistical"
              key={index}
              onClick={() => navigate(`plan/${plan.id}`)}
            >
              <div className="d-flex align-items-center">
                <div className="plan-avatar-hub">
                  {convertToShortName(plan.name)}
                </div>
                <span>{plan.name}</span>
              </div>

              <div className="statistical-table d-flex" style={{}}>
                {checkEmptyPlan(plan.data) ? (
                  <PieChart
                    series={[
                      {
                        data: [
                          {
                            id: 0,
                            value: plan.data.notStartedTasksCount,
                            // label: `Not started`,
                            label: `Not started: ${plan.data.notStartedTasksCount}`,
                            color: "#9A9A9A",
                          },
                          {
                            id: 1,
                            value: plan.data.inProgressTasksCount,
                            label: `In progress: ${plan.data.inProgressTasksCount}`,
                            // label: `In progress:`,
                            color: "#53D344",
                          },
                          {
                            id: 2,
                            value: plan.data.completedTasksCount,
                            label: `Completed: ${plan.data.completedTasksCount}`,
                            // label: `Completed`,
                            color: "#61A7F7",
                          },
                          {
                            id: 3,
                            value: plan.data.lateTasksCount,
                            label: `Late: ${plan.data.lateTasksCount}`,
                            // label:"Late:",
                            color: "#FC2A2A",
                          },
                        ],
                        // arcLabel :(item) => `${item.label}`,
                        innerRadius: 81,
                        outerRadius: 100,
                        paddingAngle: 0,
                        cornerRadius: 6,
                        startAngle: 0,
                        endAngle: 360,
                        cx: 95,
                        cy: 95,
                      },
                    ]}
                    slotProps={{
                      legend: {
                        direction: "column",
                        position: { vertical: "top", horizontal: "right" },
                        padding: { top: 25, left: 20 },
                      },
                    }}
                    height={200}
                    width={350}
                    margin={{ right: 100 }}
                    getLabel={(datum) => `${datum.label}`}
                  >
                    <PieCenterLabel>
                      {plan.data.taskLeft} <br />
                      Tasks Left
                    </PieCenterLabel>
                  </PieChart>
                ) : (
                  // <div className="empty-data-circle"></div>
                  <PieChart
                    series={[
                      {
                        data: [
                          {
                            id: 0,
                            value: 0.00001,
                            // label: `Not started`,
                            label: `Not started: ${plan.data.notStartedTasksCount}`,
                            color: "#9A9A9A",
                          },
                          {
                            id: 1,
                            value: plan.data.inProgressTasksCount,
                            label: `In progress: ${plan.data.inProgressTasksCount}`,
                            // label: `In progress:`,
                            color: "#53D344",
                          },
                          {
                            id: 2,
                            value: plan.data.completedTasksCount,
                            label: `Completed: ${plan.data.completedTasksCount}`,
                            // label: `Completed`,
                            color: "#61A7F7",
                          },
                          {
                            id: 3,
                            value: plan.data.lateTasksCount,
                            label: `Late: ${plan.data.lateTasksCount}`,
                            // label:"Late:",
                            color: "#FC2A2A",
                          },
                        ],
                        // arcLabel :(item) => `${item.label}`,
                        innerRadius: 81,
                        outerRadius: 100,
                        paddingAngle: 0,
                        cornerRadius: 6,
                        startAngle: 0,
                        endAngle: 360,
                        cx: 95,
                        cy: 95,
                      },
                    ]}
                    slotProps={{
                      legend: {
                        direction: "column",
                        position: { vertical: "top", horizontal: "right" },
                        padding: { top: 25, left: 20 },
                      },
                    }}
                    height={200}
                    width={350}
                    margin={{ right: 100 }}
                    getLabel={(datum) => `${datum.label}`}
                  >
                    <PieCenterLabel>
                      {plan.data.taskLeft} <br />
                      Tasks Left
                    </PieCenterLabel>
                  </PieChart>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Hub;
