import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./layout.css";
import SettingsIcon from "@mui/icons-material/Settings";
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
import { Collapse } from "antd";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { Outlet } from "react-router-dom";
import { useUser } from "../UserContext";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Dropdown, Space } from "antd";
import Notification from "../components/Notification/Notification";
import AddPlan from "../components/AddPlan/AddPlan";
import { DownOutlined } from "@ant-design/icons";

function MainLayout() {
  const { user, setUser, setIsAuthenticated } = useUser();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [planList, setPlanList] = useState([]);
  const [isPlanUpdate, setIsPlanUpdate] = useState(false);
  const [image, setImage] = useState();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationList, setNotificationList] = useState();
  const [notificationItems, setNotificationItems] = useState([]);
  const [notSeenNotify, setNotSeenNotify] = useState(0);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const signOut = () => {
    setIsAuthenticated(false);
    setUser(null);
    navigate("/signin");
  };

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/File?url=${user.imgUrl}`,
          { headers, responseType: "blob" }
        );
        const blobData = res.data;
        const imageUrl = URL.createObjectURL(blobData);
        setImage(imageUrl);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchAvatar();
  }, [user]);

  const fetchPlanData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/plan/GetByUserID/${user.id}`
      );
      // console.log(res);
      setPlanList(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchNotificationData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/Notification/${user.id}`
      );
      var data = res.data;
      var count = data.filter((x) => x.isSeen === false).length;
      setNotSeenNotify(count);
      setNotificationList(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => fetchNotificationData, [user.id]);

  const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;
  const items = [
    {
      key: "1",
      label: "All",
      children: (
        <div className="">
          {planList.map((plan, index) => (
            <div
              className="plan-box"
              onClick={() => navigate(`/plan/${plan.id}`)}
              key={index}
            >
              <div className="plan-img" style={{ backgroundColor: "#CB20C6" }}>
                {plan.name[0]}
              </div>
              {plan.name}
            </div>
          ))}
        </div>
      ),
    },
    // {
    //   key: "2",
    //   label: "All",
    //   children: <p>{text}</p>,
    // },
  ];

  useEffect(() => {
    if (notificationList !== undefined && notificationList.length > 0) {
      const notifications = notificationList.map((notification) => ({
        key: notification.id,
        label: 
          <div onClick={(e) => e.stopPropagation()} key={notification.id} >
            <Notification fetchNotificationData={fetchNotificationData} notification={notification} />
          </div>
        ,
      }));
      setNotificationItems(notifications);
    }
  }, [notificationList]);

  useEffect(() => {
    fetchPlanData();
    setIsPlanUpdate(false);
  }, [isPlanUpdate]);

  const accountItems = [
    {
      label: (
        <a onClick={() => navigate("/account")}>
          <div style={{ marginLeft: "15px" }}>{user.name}</div>
        </a>
      ),
      key: "0",
    },
    {
      label: <a onClick={() => navigate("/account")}>Account infomation</a>,
      key: "1",
    },
    {
      label: <a>Change password</a>,
      key: "2",
    },
    {
      label: <a onClick={() => signOut()}>Sign Out</a>,
      key: "3",
    },
  ];

  return (
    <div
      className="main"
      style={{ width: "100%", height: "calc(100% - 50px)" }}
    >
      {/* Navbar */}
      <header className="nav_bar">
        <div className="title">Planner</div>
        <div className="navbar-right">
          <div className="notification">
            <Dropdown
              menu={{
                items: notificationItems,
              }}
              trigger={["click"]}
              className="notification-dropdown"
              overlayClassName="notification-item"
            >
              <div style={{ cursor: "pointer", position:"relative" }} >
                <Space>
                  <span style={{ position: "absolute", top: "-5px", right:'-5px' }}>
                    {notSeenNotify}
                  </span>
                  <NotificationsIcon style={{color:'#79ECEE'}} />
                </Space>
              </div>
            </Dropdown>
          </div>

          <div className="setting">
            <SettingsIcon />
          </div>
          <div className="account">
            <Dropdown
              menu={{
                items: accountItems,
              }}
              trigger={["click"]}
            >
              <div style={{ cursor: "pointer" }}>
                <Space>
                  {image && (
                    <img
                      src={image}
                      alt="avatar"
                      srcSet=""
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "100%",
                      }}
                    />
                  )}
                  <DownOutlined />
                </Space>
              </div>
            </Dropdown>
          </div>
        </div>
      </header>

      {/* Menu */}
      <div className="container-page">
        <div className={`menu ${menuOpen ? "hidden" : ""}`}>
          <button className="slide-button" onClick={toggleMenu}>
            ☰
          </button>
          <div className="menu-item" onClick={() => setOpen(true)}>
            <AddIcon /> New plan
          </div>

          <div className="menu-item" onClick={() => navigate("/")}>
            <HomeIcon /> Hub
          </div>
          <div className="menu-item">
            <PersonOutlineIcon /> Assigned to me
          </div>
          <Collapse
            items={items}
            defaultActiveKey={["0"]}
            className="plan-list"
          />
        </div>
        {/* <div style={{ height: "580px", borderLeft: "1px solid black" }}></div> */}
        <div className="content">
          <Outlet context={[setIsPlanUpdate]} />
        </div>
      </div>

      {/* Add plan */}
      {open && (
        <AddPlan fetchPlanData={fetchPlanData} setOpen={setOpen} open={open} />
      )}
    </div>
  );
}

export default MainLayout;
