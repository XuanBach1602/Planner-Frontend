import { React, useEffect, useState } from "react";
import "./Group.css";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import CloseIcon from "@mui/icons-material/Close";
import { Dropdown, Space, Input, Form } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import { useUser } from "../../UserContext";
import { useNavigate } from "react-router-dom";

const Group = (props) => {
  const { user } = useUser();
  const plan = props.plan;
  const fetchUserData = props.fetchUserData;
  const currentUser = props.currentUser;
  const userList = props.userList;
  const setIsGroupShow = props.setIsGroupShow;
  const connectionRef = props.connectionRef;
  const fetchPlanList = props.fetchPlanList;
  const [searchedUser, setSearchUser] = useState(null);
  const [searchInputError, setSearchInputError] = useState();
  const navigate = useNavigate();

  const inviteToGroup = async (receivedUserId) => {
    try {
      const data = {
        title: "Invitation",
        receivedUserId: receivedUserId,
        sendedUserId: user.id,
        status: "Not responsed",
        isSeen: false,
        planId: plan.id,
      };
      console.log(data);
      // const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/Notification`,data);
      connectionRef
        .invoke("SendNotificationToUser", receivedUserId, data)
        .catch((error) => {
          console.error("Cannot send notification:", error);
        });
      // console.log(res);
    } catch (error) {
      console.log(error);
    }
    toast.info("Invited", {
      autoClose: 1000,
    });
  };

  const validateEmail = (email) => {
    // Biểu thức chính quy để kiểm tra định dạng email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const searchUser = async (email) => {
    if (userList.find((x) => x.email === email) === undefined) {
      setSearchInputError("This member is already in the group");
    }
    if (validateEmail(email)) {
      if (userList.find((x) => x.email === email)) {
        setSearchInputError("This member is already in the group");
      } else {
        try {
          const res = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/user/GetByEmail/${email}`
          );
          console.log(res);
          if (res.status === 200) {
            setSearchUser(res.data);
            setSearchInputError("");
          } else {
            setSearchUser(null);
            setSearchInputError("The email is not found");
          }
        } catch (error) {}
      }
    } else {
      setSearchInputError("Please enter correct email! ");
    }
  };

  const removeMember = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/UserPlan/${id}`);
      fetchUserData();
    } catch (error) {
      console.log(error.message);
    }
  };

  const leaveTheGroup = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/UserPlan/${id}`);
      fetchPlanList();
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };
  const updateRole = async (id, role) => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/UserPlan/${id}`,
        null,
        { params: { role } }
      );
      console.log(res);
      fetchUserData();
    } catch (error) {
      console.log(error.message);
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
          {userList.map((user) => {
            const menuItems = [];

            if (currentUser.role === "Leader" && currentUser.id !== user.id) {
              menuItems.push({
                key: "1",
                label: (
                  <a onClick={() => removeMember(user.id)}>Remove member</a>
                ),
              });
            }

            if (currentUser.role === "Leader" && user.role === "Member") {
              menuItems.push({
                key: "2",
                label: (
                  <a onClick={() => updateRole(user.id, "Deputy Leader")}>
                    Apply to Deputy Leader
                  </a>
                ),
              });
            }

            if (
              currentUser.role === "Leader" &&
              user.role === "Deputy Leader"
            ) {
              menuItems.push({
                key: "3",
                label: (
                  <a onClick={() => updateRole(user.id, "Member")}>
                    Apply to Member
                  </a>
                ),
              });
            }

            if (user.role !== "Leader" && user.userId === currentUser.userId) {
              menuItems.push({
                key: "4",
                label: (
                  <a
                    onClick={() => {
                      leaveTheGroup(user.id)
                    }}
                  >
                    Leave the group
                  </a>
                ),
              });
            }

            return (
              <div className="member-info hover-box" key={user.id}>
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
                  {(currentUser.role === "Leader" ||
                    currentUser.userId === user.userId) &&
                    user.role !== "Leader" && (
                      <Dropdown
                        menu={{
                          items: menuItems,
                        }}
                      >
                        <Space>
                          <MoreHorizIcon />
                        </Space>
                      </Dropdown>
                    )}
                </span>
              </div>
            );
          })}
        </div>
          {/* Add member */}
          {(currentUser.role === "Leader" ||
            currentUser.role === "Deputy Leader") && (
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
                  <div
                    className="member-selection"
                    onClick={() => inviteToGroup(searchedUser.id)}
                  >
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
                <div>{searchInputError}</div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default Group;
