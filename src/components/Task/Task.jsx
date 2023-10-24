import React, { useState } from "react";
import "./Task.css";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Button, Modal } from 'antd';
const Task = (props) => {
  const [taskName, setTaskName] = useState(props.name);
  const [dueDate, setDueDate] = useState(props.dueDate);
  return (
    <div className="task">
      <div className="task_name">
        <input type="checkbox" name="" id="" className="status-box" />
        <p style={{overflow:"hidden"}}>{taskName}</p>
      </div>
      <div className="due-date">
       <CalendarMonthIcon style={{width:"16px", marginBottom:"3px"}} /> Due: {dueDate}
      </div>


      
    </div>
  );
};

export default Task;
