import React, { useEffect, useState } from "react";
import "./Plan.css";
import axios from "axios";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space, Button } from "antd";
import { useParams } from "react-router-dom";
import Board from "../Board/Board";
import { PlusOutlined } from "@ant-design/icons";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../UserContext";

function Plan({children}) {
  const {user} = useUser();
  const {id} = useParams();
  const [activeId, setActiveId] = useState(0);
  const [plan, setPlan] = useState({});
  const [planName, setPLanName] = useState("");
  const navigate = useNavigate();
  // List of members
  const items = [
    {
      label: <div>Nguyen Xuan Bach</div>,
      key: "0",
    },
    {
      label: <div>Nguyen Xuan Bach</div>,
      key: "1",
    },
    {
      label: "Nguyen Xuan Bach",
      key: "2",
    },
  ];

  const features = [
    { id: 1, name: 'Grid' },
    { id: 2, name: 'Board' },
    { id: 3, name: 'Charts' },
    { id: 4, name: 'Schedule' },
  ];

  const handleFeatureClick = (id) => {
    setActiveId(id);
  }

  const fetchPlanData = async() => {
    try {
      const res = await axios.get(`https://localhost:44302/api/plan/${id}`);
      setPlan(res.data);
      // console.log(res);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchPlanData();
  },[])

  return (
    <div className="plan-page">
        <div className="nav-bar">
      <div className="">
        <div className="plan-avatar">{(plan.name == null)? '': plan.name[0]}</div>
      </div>
      <div className="Title">{plan.name}</div>
      <div className="features">
        {features.map((feature, index) => (
          <div key={feature.id} className= {`feature ${feature.id == activeId? 'active': ''}`} onClick={() => {
            handleFeatureClick(feature.id);
            navigate(`/plan/${id}/${feature.name}`)
          }}>
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
            <Space style={{color:"black"}}>
              Members
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </div>
      <div className="Filters">Filter</div>
    </div>
    <div className="switch-page">
        {/* <Board /> */}
        <Outlet context={[id]} />
    </div>
    </div>
  );
}

export default Plan;
