import React, { useState } from "react";
import "./Task.css";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import axios from "axios";
const Task = (props) => {
  const [task, setTask] = useState(props.task);
  const fetchTaskData = props.fetchTaskData;
  const [taskName, setTaskName] = useState(task.name);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const updateStatus = async(e) => {
    e.stopPropagation();
    try {
      const data = task.status === "Completed"? "In progress" : "Completed";
 
      const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/worktask/status/${task.id}`,`"${data}"`,
      {
        headers: {
          "Content-Type": "application/json", // Đặt Content-Type là application/json
        },
      })
      console.log(res.data);
      fetchTaskData();
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="task">
      <div className="task_name">
        <input defaultChecked={task.status === "Completed" ? true : false} type="checkbox" name="" id="" className="status-box" onClick={(e) => updateStatus(e)}/>
        <p style={{overflow:"hidden"}}>{taskName}</p>
      </div>
      <div className="due-date">
       <CalendarMonthIcon style={{width:"16px", marginBottom:"3px"}} /> Due: {dueDate}
      </div>     
    </div>
  );
};

export default Task;
