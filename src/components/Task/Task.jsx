import React, { useState, useContext, useEffect } from "react";
import "./Task.css";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import axios from "axios";
import PlanContext from "../../PlanContext";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
const Task = (props) => {
  const [task, setTask] = useState(props.task);
  const { fetchTaskData, currentUser } = useContext(PlanContext);
  const [taskName, setTaskName] = useState(task.name);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [completedUser, setCompletedUser] = useState();
  const [assignedUser, setAssignUser] = useState();
  const [isLate, setIsLate] = useState(false);
  const updateStatus = async (e) => {
    e.stopPropagation();
    try {
      const data = {
        status: task.status === "Completed" ? "In progress" : "Completed",
        userId: currentUser.userId,
      };
      console.log(data);
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/worktask/status/${task.id}?status=${data.status}&userId=${data.userId}`
      );
      console.log(res.data);
      fetchTaskData();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // console.log(task.completedUserId, task.assignedUserId);
    const fetchCompleteduser = async () => {
      if (task.completedUserId !== null) {
        try {
          const res = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/User/${task.completedUserId}`
          );
          setCompletedUser(res.data);
          // console.log(res);
        } catch (error) {
          console.log(error);
        }
      }
    };

    const fetchAssigneduser = async () => {
      if (task.assignedUserId !== null) {
        try {
          const res = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/User/${task.assignedUserId}`
          );
          setAssignUser(res.data);
          // console.log(res);
        } catch (error) {
          console.log(error);
        }
      }
    };

    const checkIsLate = () => {
      const dueDateCompare = new Date(dueDate);
      const today = new Date();
      if(today > dueDateCompare && task.status !== "Completed") setIsLate(true);
    }
    checkIsLate();
    fetchAssigneduser();
    fetchCompleteduser();
  }, []);
  return (
    <div className="task">
      <div className="task_name">
        <input
          defaultChecked={task.status === "Completed" ? true : false}
          type="checkbox"
          name=""
          id=""
          className="status-box"
          onClick={(e) => updateStatus(e)}
        />
        <p style={{ overflow: "hidden" }} title={taskName}>{taskName}</p>
      </div>
      <div className="due-date">
        <CalendarMonthIcon style={{ width: "16px", marginBottom: "3px" }} />{" "}
        <span className={`${isLate? "late":""}`} style={{fontSize:"14px"}}>Due: {dueDate}</span>
        {assignedUser === undefined && !completedUser && (
          <GroupAddIcon
            style={{
              color: "#2DD7F1",
              width: "20px",
              height: "20px",
              cursor: "pointer",
              marginLeft: "10px",
            }}
          />
        )}
        {assignedUser && !completedUser && (
          <img
            className="assigned-user-img"
            src={`${process.env.REACT_APP_API_URL}/api/file?url=${assignedUser.imgUrl}`}
          />
        )}
      </div>
      {completedUser !== undefined && (
        <div className="completed-message" title={`Completed by ${completedUser.name}`}>
          <img
            style={{ marginLeft: "0" }}
            className="assigned-user-img"
            src={`${process.env.REACT_APP_API_URL}/api/file?url=${completedUser.imgUrl}`}
          />{" "}
          Completed by {completedUser.name}
        </div>
      )}
    </div>
  );
};

export default Task;
