import React from "react";
import "./Task.css";
const Task = () => {
  return (
    <div className="task">
      <div className="task-name">
        <input type="checkbox" name="" id="" className="status-box" />
        <p style={{overflow:"hidden"}}>Hien thi ten hoat dong</p>
      </div>
      <div className="due-date">
        Due date: 11/11/2023
      </div>

    </div>
  );
};

export default Task;
