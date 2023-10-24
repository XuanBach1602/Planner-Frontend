import React, { useState } from "react";
import "./Schedule.css";
import TaskView from "../TaskView/TaskView";
import { Badge, Calendar } from "antd";
import moment from "moment/moment";

const taskList = [
  {
    id: 1,
    name: "Task 1",
    dueDate: "2023-10-10",
  },
  {
    id: 2,
    name: "Task 2",
    dueDate: "2023-10-09",
  },
  {
    id: 3,
    name: "Task 3",
    dueDate: "2023-10-20",
  },
  {
    id: 4,
    name: "Task 4",
    dueDate: "2023-12-12",
  },
];

const Schedule = () => {
  const now = moment();
  const [openAddTask, setOpenAddTask] = useState(false);
  const showAddTask = () => {
    setOpenAddTask(true);
    console.log(openAddTask);
  };

  const hideAddTask = () => {
    setOpenAddTask(false);
  };

  const dateCellRender = (value) => {
    const currentDate = value.format("YYYY-MM-DD");
    const tasksForDate = taskList.filter(
      (task) => task.dueDate === currentDate
    );

    return (
      <ul className="events">
        {tasksForDate.map((task) => {
          const taskdueDate = moment(task.dueDate);
          //
          let status = "success";
          if (taskdueDate > now) {
            status = "error";
          } else if (taskdueDate > now.clone().subtract(7, "days")) {
            status = "warning";
          }

          return (
            <li key={task.id} onClick={() => showAddTask()}>
              <Badge status={status} text={task.name} />
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
      <TaskView ShowModal={openAddTask} HideModal={hideAddTask} />
    </>
  );
};

export default Schedule;
