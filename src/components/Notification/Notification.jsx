import React, { useEffect, useState } from "react";
import "./Notification.css";
import { Button } from "antd";
import axios from "axios";

const Notification = (props) => {
  const [notification, setNotification] = useState(props.notification);
  const fetchNotificationData = props.fetchNotificationData;
  var imgUrl = `${process.env.REACT_APP_API_URL}/api/File?url=${notification.imgUrl}`;
  const updateStatus = async (status) => {
    console.log("ok");
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/Notification/Status/${notification.id}`,
        null,
        { params: { status } }
      );
      console.log(res);
      fetchNotificationData();
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

  useEffect(() => {
    setNotification(props.notification)
  },[props.notification])

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
  return (
    <div className= {`notification-container hover-box ${notification.isSeen ? '' : 'not-seen'}`} onMouseEnter={() => updateIsSeen()}>
      <img src={imgUrl} alt="" className="sended-user-img" />
      {notification.title === "Invitation" && (
        <div className=" notification-main">
          <title>Invitation</title>
          <div className="notification-content">
            <span className="bold-letter">{notification.sendedUserName}</span>{" "}
            invited you to &nbsp;
            <span className="bold-letter">{notification.planName} &nbsp;</span>
            at {convertTime(notification.createdTime)}
          </div>
          {notification.status === "Not responsed" && (
            <div className="notification-verify" onClick={(e) => e.stopPropagation()}>
              <Button type="primary" onClick={() => updateStatus("Accepted")}>
                Accept
              </Button>
              <Button onClick={() => updateStatus("Declined")}>Decline</Button>
            </div>
          )}
          {notification.status !== "Not responsed" && (
            <div >
              <div style={{ backgroundColor: "none" }}>
                You have {notification.status.toLowerCase()} this invitation
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notification;
