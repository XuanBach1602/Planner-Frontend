import React, { useEffect, useState } from "react";
import "./Notification.css";
import { Button } from "antd";
import axios from "axios";

const Notification = (props) => {
  const fetchTaskData =  props.fetchTaskData;
  const showAddTask = props.showAddTask;
  const setPreviewTask = props.setPreviewTask;
  const [notification, setNotification] = useState(props.notification);
  const fetchPlanList = props.fetchPlanList;
  const fetchNotificationData = props.fetchNotificationData;
  const [workTask, setWorkTask] = useState();
  var imgUrl = `${process.env.REACT_APP_API_URL}/api/File?url=${notification.imgUrl}`;
  const updateInvitationStatus = async (status) => {
    console.log("ok");
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/Notification/Status/${notification.id}`,
        null,
        { params: { status } }
      );
      console.log(res);
      fetchNotificationData();
      if (status === "Accepted") fetchPlanList();
    } catch (error) {
      console.log(error);
    }
  };

  const updateIsSeen = async () => {
    if (notification.isSeen === false) {
      try {
        const res = await axios.put(
          `${process.env.REACT_APP_API_URL}/api/Notification/IsSeen/${notification.id}`
        );
        console.log(res);
        fetchNotificationData();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const updateApprovationStatus = async(status) => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/Notification/ApprovedUpdate/${notification.id}`,
        null,
        { params: { status } }
      );
      // console.log(res);
      fetchNotificationData();
      if(fetchTaskData)fetchTaskData();
      // console.log(typeof(fetchTaskData))
      if (status === "Accepted") fetchPlanList();
    } catch (error) {
      console.log(error);
    }
  }



  useEffect(() => {
    setNotification(props.notification);
  }, [props.notification]);

  useEffect(() => {
    const fetchOringinTask = async() => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/worktask/${notification.workTaskId}`);
        setWorkTask(res.data);
        // console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchOringinTask();
    
  },[notification])

  const convertTime = (datetime) => {
    const date = new Date(datetime);
    const twoDigits = (num) => (num < 10 ? `0${num}` : num);

    // Lấy các thông tin về năm, tháng, ngày, giờ và phút từ đối tượng Date
    const year = date.getFullYear();
    const month = twoDigits(date.getMonth() + 1);
    const day = twoDigits(date.getDate());
    const hours = twoDigits(date.getHours());
    const minutes = twoDigits(date.getMinutes());

    // Tạo chuỗi theo định dạng mong muốn
    const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}`;
    return formattedTime;
  };

  const showPreviewTask = () => {
    const fetchTaskData = async() => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/worktask/${notification.workTaskId}`)
        setPreviewTask(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchTaskData();
    showAddTask();
  }
  return (
    <div>
      {notification.title === "Invitation" &&
        <div
        className={`notification-container hover-box ${
          notification.isSeen ? "" : "not-seen"
        }`}
        onMouseEnter={() => updateIsSeen()}
      >
        <img src={imgUrl} alt="" className="sended-user-img" />
          <div className=" notification-main">
            <title>Invitation</title>
            <div className="notification-content">
              <span className="bold-letter">{notification.sendedUserName}</span>{" "}
              invited you to &nbsp;
              <span className="bold-letter">
                {notification.planName} &nbsp;
              </span>
              at {convertTime(notification.createdTime)}
            </div>
            {notification.status === "Not responsed" && (
              <div
                className="notification-verify"
                onClick={(e) => e.stopPropagation()}
              >
                <Button type="primary" onClick={() => updateInvitationStatus("Accepted")}>
                  Accept
                </Button>
                <Button onClick={() => updateInvitationStatus("Declined")}>
                  Decline
                </Button>
              </div>
            )}
            {notification.status !== "Not responsed" && (
              <div>
                <div style={{ backgroundColor: "none" }}>
                  You have {notification.status.toLowerCase()} this invitation
                </div>
              </div>
            )}
          </div>
      </div>
      }
      {notification.title === "Task update request" &&
        <div
        className={`notification-container ${
          notification.isSeen ? "" : "not-seen"
        }`}
        onMouseEnter={() => updateIsSeen()}
      >
        <img src={imgUrl} alt="" className="sended-user-img" />
          <div className=" notification-main">
            {/* <title>Invitation</title> */}
            <div className="notification-content">
              <span className="bold-letter">{notification.sendedUserName}</span>{" "}
              want to update &nbsp;
              <span className="bold-letter">
                {workTask?.originName} &nbsp;
              </span>
              in <span className="bold-letter">
                {notification.planName} &nbsp;
              </span>
            at {convertTime(notification.createdTime)}. {notification.status === "Not responsed" &&<a style={{fontWeight:'500'}} onClick={() => showPreviewTask()}>Preview this task</a>}
            </div>
            {notification.status === "Not responsed" && (
              <div
                className="notification-verify"
                onClick={(e) => e.stopPropagation()}
              >
                <Button type="primary" onClick={() => updateApprovationStatus("Accepted")}>
                  Accept
                </Button>
                <Button onClick={() => updateApprovationStatus("Declined")}>
                  Decline
                </Button>
              </div>
            )}
            {notification.status !== "Not responsed" && (
              <div>
                <div style={{ backgroundColor: "none" }}>
                  You have {notification.status.toLowerCase()} this request
                </div>
              </div>
            )}
          </div>
      </div>
      }
      {notification.title === "Task update notification" &&
        <div
        className={`notification-container ${
          notification.isSeen ? "" : "not-seen"
        }`}
        onMouseEnter={() => updateIsSeen()}
      >
        <img src={imgUrl} alt="" className="sended-user-img" />
          <div className=" notification-main">
            {/* <title>Invitation</title> */}
            <div className="notification-content">
              <span className="bold-letter">{notification.sendedUserName}</span>{" "}
              updated a task
              in <span className="bold-letter">
                {notification.planName} &nbsp;
              </span>
            at {convertTime(notification.createdTime)}.
            </div>
          </div>
      </div>
      }
    </div>
  );
};

export default Notification;
