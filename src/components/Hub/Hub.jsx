import React, { useEffect, useState } from "react";
import { useUser } from "../../UserContext";
import { PieChart } from "@mui/x-charts/PieChart";
import "./Hub.css";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
const Hub = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [planList, setPlanList] = useState([]);
  const [statisticalDataList, setStatisticalDataList] = useState([]);

  const convertToShortName = (planName) => {
    return planName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
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
                <PieChart

                  series={[
                    {
                      data: [
                        {
                          id: 0,
                          value:  plan.data.notStartedTasksCount,
                          // label: `Not started`, 
                          label:`Not started: ${plan.data.notStartedTasksCount}`,
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
                  height={350}
                  width={350}
                  margin={{ right: 100 }}
                  getLabel={(datum) => `${datum.label}`}
                  arcLabel={(item) => `${item.label}`} // Tùy chỉnh nội dung label khi hover
                />
                
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Hub;
