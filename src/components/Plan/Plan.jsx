import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import "./Plan.css";
import axios from "axios";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space, Select, Button } from "antd";
import { useParams } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";
import Group from "../Group/Group";

function Plan() {
  const { id } = useParams();
  const [activeId, setActiveId] = useState(0);
  const [plan, setPlan] = useState({});
  const navigate = useNavigate();
  const [setIsPlanUpdate] = useOutletContext();
  const [progress, setProgress] = useState("");
  const [due, setDue] = useState("");
  const [priority, setPriority] = useState("");
  const [isGroupShow, setIsGroupShow] = useState(false);
  const [userList, setUserList] = useState([]);
  const [memberList, setMemberList] = useState([]);
  let blurFlag = true;

  // List of members
  useEffect(() => {
    var memberList = userList.map((user) => ({
      label: <div key={user.id}>
        <img className="avatars" src={`${process.env.REACT_APP_API_URL}/api/file?url=${user.imgUrl}`} alt="" /> 
        <span>{user.userName}</span>
      </div>,
      key: user.id,
    }));
    setMemberList(memberList);
  },[userList])
    

  const features = [
    { id: 1, name: "Grid", value: "Grid" },
    { id: 2, name: "Board", value: "" },
    { id: 3, name: "Schedule", value: "Schedule" },
  ];
  const handleFeatureClick = (id) => {
    setActiveId(id);
  };

  const fetchPlanData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/plan/${id}`
      );
      setPlan(res.data);
      // console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchUserData = async() => {
      if(plan.id !== undefined){
        try {
          const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/UserPlan/PlanId/${plan.id}`);
          // console.log(res.data);
          setUserList(res.data);
        } catch (error) {
          console.log(error);
        }
      }
      
    }
    fetchUserData();
  },[plan])

  const deletePlan = async () => {
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/plan?id=${id}`
      );
      console.log(res);
      setIsPlanUpdate(true);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const updatePlan = async (e) => {
    if (e.key === "Enter" && e.target.value != null) {
      try {
        const data = {
          id: id,
          name: e.target.value,
          isPrivacy: plan.isPrivacy,
          createdUserId: plan.createdUserId,
        };
        const res = await axios.put(
          `${process.env.REACT_APP_API_URL}/api/plan`,
          data
        );
        blurFlag = false;
        e.target.blur();
        fetchPlanData();
        setIsPlanUpdate(true);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    }
  };

  //Dang test
  const [categoryList, setCategoryList] = useState([]);
  const [taskList, setTaskList] = useState([]);
  const [isTaskUpdate, setIsTaskUpdate] = useState(false);
  const fetchCategoryData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/Category/GetByPlanID/${id}`
      );
      setCategoryList(res.data);
      // console.log(res.data);
    } catch (error) {
      console.log("category", error);
    }
  };

  const fetchTaskData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/worktask/GetByPlanID/${id}`
      );

      setTaskList(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategoryData();
  }, [id]);

  useEffect(() => {
    if (categoryList.length > 0) {
      fetchTaskData();
      setIsTaskUpdate(false);
    }
  }, [categoryList, isTaskUpdate]);

  useEffect(() => {
    fetchPlanData();
  }, [id]);

  //Filter
  const filter = async () => {
    try {
      const data = {
        due: due,
        priority: priority,
        progress: progress,
      };

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/worktask/GetByPlanID/${id}`,
        { params: data }
      );
      console.log(res.data);
      setTaskList(res.data);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const clearFilter = () => {
    setDue("");
    setPriority("");
    setProgress("");
  };

  const optionsByFilterType = [
    {
      id: 1,
      title: "Due",
      values: [
        { value: "Today", label: "Today" },
        { value: "Tomorrow", label: "Tomorrow" },
        { value: "Late", label: "Late" },
        { value: "Future", label: "Future" },
        { value: "", label: "None" },
      ],
      defaultValue: due,
      handleChange: (value) => setDue(value),
    },
    {
      id: 2,
      title: "Priority",
      values: [
        { value: "Low", label: "Low" },
        { value: "Medium", label: "Medium" },
        { value: "Important", label: "Important" },
        { value: "Urgent", label: "Urgent" },
        { value: "", label: "None" },
      ],
      defaultValue: priority,
      handleChange: (value) => setPriority(value),
    },
    {
      id: 3,
      title: "Progress",
      values: [
        { value: "Not started", label: "Not started" },
        { value: "In progress", label: "In progress" },
        { value: "Completed", label: "Completed" },
        { value: "", label: "None" },
      ],
      defaultValue: progress,
      handleChange: (value) => setProgress(value),
    },
  ];

  const filterItems = [
    {
      label: (
        <div onClick={(e) => e.stopPropagation()}>
          <div
            style={{
              display: "flex",
              height: "25px",
              justifyContent: "space-between",
            }}
          >
            <h4>Filter</h4>
            <span style={{ color: "#83FB3F" }} onClick={() => clearFilter()}>
              Clear
            </span>
          </div>
          {optionsByFilterType.map((option) => (
            <div key={option.id} style={{ marginBottom: "5px" }}>
              <label style={{ minWidth: "60px" }}>{option.title} &nbsp;</label>
              <Select
                onChange={(value) => option.handleChange(value)}
                // defaultValue={option.defaultValue}
                value={option.defaultValue}
                className="filter-item"
                options={option.values}
              />
            </div>
          ))}
          <div className="search-btn">
            <Button type="primary" onClick={() => filter()}>
              Search
            </Button>
          </div>
        </div>
      ),
      key: "0",
    },
  ];

  return (
    <div className="plan-page">
      <div className="nav-bar">
        <div className="">
          <div className="plan-avatar">
            {plan.name == null ? "" : plan?.name[0]}
          </div>
        </div>
        <div className="title">
          <input
            required
            pattern=".{1,}"
            title="Must be at least 1 character"
            type="text"
            defaultValue={plan.name}
            id="plan-name-input"
            onBlur={(e) => {
              if (blurFlag) e.target.value = plan.name;
            }}
            onKeyDown={(e) => updatePlan(e)}
          />
        </div>
        <div className="features">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={`feature ${feature.id == activeId ? "active" : ""}`}
              onClick={() => {
                handleFeatureClick(feature.id);
                navigate(`/plan/${id}/${feature.value}`);
              }}
            >
              {feature.name}
            </div>
          ))}
        </div>

        {/* Member dropdown */}
        <div className="Members member-dropdown hover-box">
          <Dropdown
            menu={{
              items: memberList,
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

        {/* Filter dropdown */}
        <div className="Filters hover-box">
          <Dropdown
            menu={{
              items: filterItems,
            }}
            trigger={["click"]}
            placement="bottom"
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space style={{ color: "black", padding: "5px" }}>
                Filter
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </div>

        {/* Manage group */}
        <div
          className="hover-box"
          style={{ marginLeft: "10px", padding: "5px" }}
          onClick={() => setIsGroupShow(true)}
        >
          Manage group
        </div>

        <div className=" delete-plan-icon" onClick={() => deletePlan()}>
          {" "}
          <DeleteOutlined />
        </div>
      </div>
      <hr style={{ margin: 0 }} />

      {/* Switch page */}
      <div className="switch-page">
        {/* <Board /> */}
        <Outlet
          context={[
            id,
            categoryList,
            taskList,
            fetchCategoryData,
            fetchTaskData,
          ]}
        />

        {/* Group */}
        {isGroupShow && (
          <Group
            className="group-box"
            userList={userList}
            setIsGroupShow={setIsGroupShow}
            plan={plan}
            fetchPlanData={fetchPlanData}
          />
        )}
      </div>
    </div>
  );
}

export default Plan;
