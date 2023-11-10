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
import { Modal } from "antd";
import { Input, Form } from "antd";
import { Select } from "antd";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Outlet } from "react-router-dom";
import { useUser } from "../UserContext";

function MainLayout({ children }) {
  const [open, setOpen] = useState(false);
  const [planName, setPLanName] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [isValidInput, setIsValidInput] = useState(false);
  const [planList, setPlanList] = useState([]);
  const [isPlanUpdate, setIsPlanUpdate] = useState(false);
  const { user, setUser, setIsAuthenticated } = useUser();
  const [image, setImage] = useState();
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const checkValidInput = () => {
    var bool = planName !== "";
    console.log(bool);
    setIsValidInput(bool);
  };

  const signOut = () => {
    setIsAuthenticated(false);
    setUser(null);
    navigate("/signin");
  };

  useEffect(() => checkValidInput(), [planName]);

  const addNewPlan = async () => {
    // console.log(planName, privacy);
    var createUserID = user.id;
    if (isValidInput) {
      const data = {
        name: planName,
        isPrivacy: privacy,
        createdUserID: createUserID,
      };
      try {
        const res = await axios.post("https://localhost:44302/api/plan", data);
        console.log(res);
        setValidationMessage("");
        setPrivacy(true);
        // document.querySelector("planName-input").placeholder.value = "";
        setIsPlanUpdate(true);
        setOpen(false);
      } catch (error) {
        console.log(error);
        setValidationMessage("Please refill in form");
      }
    } else {
      setValidationMessage("Please fill in form");
    }
  };

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const res = await axios.get(
          `https://localhost:44302/api/File?url=${user.imgUrl}`,
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
  }, []);

  const fetchPlanData = async () => {
    try {
      const res = await axios.get(
        `https://localhost:44302/api/plan/GetByUserID/${user.id}`
      );
      // console.log(res);
      setPlanList(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;
  const items = [
    {
      key: "1",
      label: "Pinned",
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
    {
      key: "2",
      label: "All",
      children: <p>{text}</p>,
    },
  ];

  useEffect(() => {
    fetchPlanData();
    setIsPlanUpdate(false);
  }, [isPlanUpdate]);

  return (
    <div className="main" style={{ width: "100%", height: "100%" }}>
      {/* Navbar */}
      <header className="nav_bar">
        <div className="title">Planner</div>
        <div className="navbar-right">
          <div className="setting">
            <SettingsIcon />
          </div>
          <div className="account">
            <div className="dropdown">
              <div
                className="dropdown-toggle"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ backgroundColor: "none" }}
              >
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
              </div>
              <ul
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton1"
              >
                <li style={{ marginLeft: "15px" }}>{user.name}</li>
                <li>
                  <a
                    className="dropdown-item"
                    onClick={() => navigate("/account")}
                  >
                    Account infomation
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Change password
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" onClick={() => signOut()}>
                    Sign Out
                  </a>
                </li>
              </ul>
            </div>
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

      {/* Modal */}
      {open && (
        <Modal
          title="New plan"
          centered
          open={open}
          onOk={(e) => {
            setPLanName("");
            addNewPlan(e);
          }}
          onCancel={() => {
            setPLanName("");
            setOpen(false);
          }}
          width={1100}
          height={600}
          style={{}}
        >
          <div style={{ display: "flex" }}>
            <img
              src="https://res.cdn.office.net/planner/files/plex_prod_20230925.001/create-new-illustration.svg"
              alt=""
            />
            <div className="plan-container">
              <h1>Name your plan</h1>
              <Form>
                <Form.Item
                  name="planName"
                  rules={[
                    {
                      required: true,
                      message: "Please fill your plan name!",
                    },
                  ]}
                >
                  <Input
                    className="planName-input"
                    placeholder="Fill your plan name"
                    onChange={(e) => setPLanName(e.target.value)}
                    onBlur={(e) => (e.target.value = "")}
                  />
                </Form.Item>
                <span
                  className="validation-add-plan"
                  style={{ color: "#FF0F00" }}
                >
                  {validationMessage}
                </span>
              </Form>

              <Select
                defaultValue="Private"
                style={{
                  marginTop: 30,
                  width: 200,
                }}
                onChange={(value) => setPrivacy(value)}
                options={[
                  {
                    label: "Privacy",
                    options: [
                      {
                        label: "Private",
                        value: false,
                      },
                      {
                        label: "Public",
                        value: true,
                      },
                    ],
                  },
                ]}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default MainLayout;
