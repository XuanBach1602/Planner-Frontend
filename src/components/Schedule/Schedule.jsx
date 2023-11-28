import React, { useState, useContext } from "react";
import "./Schedule.css";
import TaskView from "../TaskView/TaskView";
import { Badge, Calendar } from "antd";
import moment from "moment/moment";
import PlanContext from "../../PlanContext";


const Schedule = () => {
  const {
    id:planId,
    categoryList,
    taskList,
    fetchCategoryData,
    fetchTaskData,
    currentUser,
  } = useContext(PlanContext)
  const [openAddTask, setOpenAddTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const now = moment();
  const showAddTask = () => {
    setOpenAddTask(true);
    // console.log(openAddTask);
  };

  const hideAddTask = () => {
    setOpenAddTask(false);
  };

  const dateCellRender = (value) => {
    const currentDate = value.format("YYYY-MM-DD");
    const tasksForDate = taskList.filter(
      (task) => task.dueDate >= currentDate && task.startDate <= currentDate
    );

    return (
      <ul className="events">
        {tasksForDate.map((task) => {
          const taskdueDate = moment(task.dueDate);
          const taskStartDate = moment(task.startDate);
          //
          let status = "success";
          if(task.status === "In progress"){
            if(taskdueDate < now) status = "error ";
            else if(taskdueDate > now.clone().subtract(7, "days")) status = "warning";
            else status = "processing"
          }
          if(task.status === "Not started") status = "default";

          const isStartDate = taskStartDate.isSame(currentDate, "day");
          const isEndDate = taskdueDate.isSame(currentDate, "day");

          const classNames = ["event"];

          if (isStartDate) {
            classNames.push("startDateBadge");
          }
          if (isEndDate) {
            classNames.push("dueDateBadge");
          }

          return (
            <li
              key={task.id}
              onClick={() => {
                showAddTask();
                setSelectedTask(task);
              }}
              className={classNames.join(" ")}
            >
              <Badge className="startDate" status={status} text={task.name} />
            </li>
          );
        })}
      </ul>
    );
  };

  const cellRender = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    return info.originNode;
  };

  return (
    <>
      <Calendar className="calendar-table" cellRender={cellRender}></Calendar>
      {openAddTask && 
      <TaskView
      showModal={openAddTask}
      hideModal={hideAddTask}
      selectedTask={selectedTask}
      planId={planId}
      fetchTaskData={fetchTaskData}
    />}
    </>
  );
};

export default Schedule;
