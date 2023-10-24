import React, { useState } from "react";
import "./Plan.css";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space, Button } from "antd";
import Board from "../Board/Board";
import { PlusOutlined } from "@ant-design/icons";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Plan({children}) {
  const [activeId, setActiveId] = useState(0);
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

  return (
    <div className="plan-page">
        <div className="nav-bar">
      <div className="">
        <img className="plan-avatar" src="https://antimatter.vn/wp-content/uploads/2023/01/hinh-anh-avatar-dep-cute-ngau.jpg" alt="" />
      </div>
      <div className="Title">Learn Dot Net</div>
      <div className="features">
        {/* <div className="grid feature">Grid</div>
        <div className="Board feature">Board</div>
        <div className="Charts feature">Charts</div>
        <div className="Schedule feature">Schedule</div> */}
        {features.map((feature) => (
          <div key={feature.id} className= {`feature ${feature.id == activeId? 'active': ''}`} onClick={() => {
            handleFeatureClick(feature.id);
            navigate(`/plan/${feature.name}`)
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
      <div>Nguyễn Xuân Bách 20204714</div>
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
        <Outlet/>
    </div>
    </div>
  );
}

export default Plan;
