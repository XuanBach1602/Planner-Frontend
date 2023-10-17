import React from "react";
import { useState } from "react";
import "./layout.css";
import SettingsIcon from "@mui/icons-material/Settings";
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
import { Collapse } from "antd";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { Modal } from "antd";
import { Input, Form } from "antd";
import { Select } from "antd";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function MainLayout({ children }) {
  const [open, setOpen] = useState(false);
  const [shouldCloseModal, setShouldCloseModal] = useState(false);

  const [planName, setPLanName] = useState(" ");
  const [privacy, setPrivacy] = useState("Private");


  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };


  const Create = () => {
    console.log(planName);
    if (planName !== undefined && planName.trim() !== "") {
      setShouldCloseModal(true);
      console.log("Tạo thành công");
    } else {
      // Nếu planName rỗng, không đóng Modal
      setShouldCloseModal(false);
      console.log("Vui lòng điền tên kế hoạch.");
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
      children: <p>{text}</p>,
    },
    {
      key: "2",
      label: "All",
      children: <p>{text}</p>,
    },
  ];

  const accounts = [
    {
      key: "1",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.antgroup.com"
        >
          1st menu item
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.aliyun.com"
        >
          2nd menu item
        </a>
      ),
    },
    {
      key: "3",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.luohanacademy.com"
        >
          3rd menu item
        </a>
      ),
    },
  ];



  return (
    <div>
      <div className="main">
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
                style={{backgroundColor:"none"}}
              >
                <img src="https://antimatter.vn/wp-content/uploads/2023/01/hinh-anh-avatar-dep-cute-ngau.jpg" alt="" srcSet="" style={{
                  width:"30px",
                  height: "30px",
                  borderRadius:"100%"
                }}/>
              </div>
              <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                <li style={{marginLeft:"15px"}}>
                     Nguyễn Xuân Bách
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Account infomation
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Change password
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
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
          <button className="slide-button" onClick={toggleMenu}>☰</button>
          <div className="menu-item" onClick={() => setOpen(true)}>
            <AddIcon /> New plan
          </div>

          {/* Modal */}
          <Modal
            title="New plan"
            centered
            open={open}
            onOk={() => {
              Create(); // Gọi hàm Create
              if (shouldCloseModal) {
                setOpen(false); // Nếu shouldCloseModal là true, đóng Modal
              }
            }}
            onCancel={() => setOpen(false)}
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
                      placeholder="Fill your plan name"
                      onChange={(e) => setPLanName(e.target.value)}
                    />
                  </Form.Item>
                </Form>
                <Select
                  defaultValue="Private"
                  style={{
                    marginTop: 30,
                    width: 200,
                  }}
                  onChange={setPrivacy}
                  options={[
                    {
                      label: "Privacy",
                      options: [
                        {
                          label: "Private",
                          value: "Private",
                        },
                        {
                          label: "Public",
                          value: "Public",
                        },
                      ],
                    },
                  ]}
                />
              </div>
            </div>
          </Modal>


          <div className="menu-item">
            <HomeIcon /> Hub
          </div>
          <div className="menu-item">
            <PersonOutlineIcon /> Assigned to me
          </div>
          <Collapse
            items={items}
            defaultActiveKey={["0"]}
            style={{ border: "none", backgroundColor: "white" }}
          />
        </div>
        <div style={{ height: "580px", borderLeft: "1px solid black" }}></div>
        <div className="content">
          {children}
          </div>
      </div>
    </div>
    </div>
  );
}

export default MainLayout;
