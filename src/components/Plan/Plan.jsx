import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import "./Plan.css";
import axios from "axios";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space, Button } from "antd";
import { useParams } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../UserContext";
import { DeleteOutlined } from "@ant-design/icons";

function Plan() {
  const { user } = useUser();
  const { id } = useParams();
  const [activeId, setActiveId] = useState(0);
  const [plan, setPlan] = useState({});
  const [planName, setPLanName] = useState(plan.name);
  const navigate = useNavigate();
  const [setIsPlanUpdate] = useOutletContext();
  // List of members
  const items = [
    {
      label: <div>Nguyen Xuan Bach</div>,
      key: "0",
    },
  ];


  const features = [
    { id: 1, name: "Grid" },
    { id: 2, name: "Board" },
    { id: 3, name: "Charts" },
    { id: 4, name: "Schedule" },
  ];

  const handleFeatureClick = (id) => {
    setActiveId(id);
  };

  const fetchPlanData = async () => {
    try {
      const res = await axios.get(`https://localhost:44302/api/plan/${id}`);
      setPlan(res.data);
      // console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const deletePlan = async() => {
    try {
      const res = await axios.delete(`https://localhost:44302/api/plan?id=${id}`);
      console.log(res);
      setIsPlanUpdate(true);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }

  const updatePlan = async () => {
    if (planName != null) {
      try {
        const data = {
          id: id,
          name: planName,
          isPrivacy: plan.isPrivacy,
          createdUserId: plan.createdUserId,
        };
        const res = await axios.put("https://localhost:44302/api/plan", data);
        fetchPlanData();
        setIsPlanUpdate(true);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const setPlanInput = (e) => {
    if (e.key === "Enter") {
      updatePlan(id);
      e.currentTarget.blur();
    }
  };

  useEffect(() => {
    fetchPlanData();
  }, [id]);

  return (
    <div className="plan-page">
      <div className="nav-bar">
        <div className="">
          <div className="plan-avatar">
            {plan.name == null ? "" : plan.name[0]}
          </div>
        </div>
        {/* <div className="title">{plan.name}</div> */}
        <div className="title">
          <input
            type="text"
            defaultValue={plan.name}
            id="plan-name-input"
            onChange={(e) => setPLanName(e.target.value)}
            onKeyDown={(e) => setPlanInput(e)}
          />
        </div>
        <div className="features">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={`feature ${feature.id == activeId ? "active" : ""}`}
              onClick={() => {
                handleFeatureClick(feature.id);
                navigate(`/plan/${id}/${feature.name}`);
              }}
            >
              {feature.name}
            </div>
          ))}
        </div>

        <img
          className="avatars"
          src="https://i0.wp.com/thatnhucuocsong.com.vn/wp-content/uploads/2022/09/avatar-doremon-1.jpg?ssl=1"
          alt=""
        />
        <div>{user.name}</div>
        <div className="Members member-dropdown">
          <Dropdown
            menu={{
              items,
            }}
            trigger={["click"]}
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space style={{ color: "black" }}>
                Members
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </div>
        <div className="Filters">Filter</div>

       <div className="m-3 delete-plan-icon" onClick={() => deletePlan()}> <DeleteOutlined /></div>
        
      </div>
      <hr style={{ margin: 0 }} />
      <div className="switch-page">
        {/* <Board /> */}
        <Outlet context={[id]} />
      </div>
    </div>
  );
}

export default Plan;
