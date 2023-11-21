import { React, useEffect, useState } from "react";
import "./Group.css";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import CloseIcon from "@mui/icons-material/Close";
import { SmileOutlined } from "@ant-design/icons";
import { Dropdown, Space, Input, Form } from "antd";
import axios from "axios";
import { toast } from 'react-toastify';
import { useUser } from "../../UserContext";

const Group = (props) => {
  const {user} = useUser();
  const plan = props.plan;
  const userList = props.userList;
  const setIsGroupShow = props.setIsGroupShow;
  const [searchedUser, setSearchUser] = useState(null);
  const [searchInputError, setSearchInputError] = useState();
  const items = [
    {
      key: "1",
      label: <a>Remove member</a>,
    },
    {
      key: "2",
      label: <a>Apply to leader</a>,
      icon: <SmileOutlined />,
    },
    {
      key: "3",
      label: <a>Apply to Deputy Leader</a>,
      icon: <SmileOutlined />,
    },
  ];

  const inviteToGroup = async(receivedUserId) => {
    try {
      const data = {
        "title": "Invitation",
        "receivedUserId":receivedUserId,
        "sendedUserId": user.id,
        "status": "Not responsed",
        "isSeen": false,
        "planId": plan.id,
      }
      console.log(data);
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/Notification`,data);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
    toast.info("Invited", {
      autoClose:1000
    });
  }

  const validateEmail = (email) => {
    // Biểu thức chính quy để kiểm tra định dạng email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const searchUser = async (email) => {
    if(validateEmail(email)){
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/user/GetByEmail/${email}`
        );
        console.log(res);
        if (res.status === 200){
          setSearchUser(res.data);
          setSearchInputError("");
        }
        else {
          setSearchUser(null);
          setSearchInputError("The email is not found")
        }
      } catch (error) {}
    }
    else {
      setSearchInputError("Please enter correct email! ")
    }
  };

  return (
    <div className="group-container">
      <h2 className="groud-title">
        Plan settings{" "}
        <CloseIcon
          onClick={() => setIsGroupShow(false)}
          color="primary"
          style={{ float: "right", cursor: "pointer" }}
        />
      </h2>
      <div className="member-box">

        {/* Member list */}
        <h3>Members</h3>
        <div className="member-list">
          {userList.map((user) => (
            <div className="member-info hover-box " key={user.id}>
              <img
                src={`${process.env.REACT_APP_API_URL}/api/file?url=${user.imgUrl}`}
                alt=""
                className="member-avatar"
              />
              <div className="member-detail">
                <div style={{ fontSize: "16px", fontWeight: "500" }}>
                  {user.userName}
                </div>
                <span>{user.email}</span>
              </div>
              <span className="role-name">
                {user.role}
                <Dropdown
                  menu={{
                    items,
                  }}
                >
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      <MoreHorizIcon />
                    </Space>
                  </a>
                </Dropdown>
              </span>
            </div>
          ))}

          {/* Add member */}
          <div className="add-member-btn">
            <GroupAddIcon color="primary" style={{ marginBottom: "10px" }} />{" "}
            &nbsp; Add Member
            <Input
              placeholder="Enter email to add user to group"
              className="mb-3"
              onChange={(e) => searchUser(e.target.value)}
            />
            <div>
              {searchedUser !== null && searchedUser !== undefined && (
                <div className="member-selection" onClick={() => inviteToGroup(searchedUser.id)}>
                  <img
                    src={`${process.env.REACT_APP_API_URL}/api/file?url=${searchedUser.imgUrl}`}
                    alt=""
                    className="member-avatar"
                  />
                  <div className="member-detail">
                    <div style={{ fontSize: "16px", fontWeight: "500" }}>
                      {searchedUser.name}
                    </div>
                    <span>{searchedUser.email}</span>
                  </div>
                </div>
              )}
              <div>
                {searchInputError}
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Group;
