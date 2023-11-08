import React, { useState, useEffect } from "react";
import "./Schedule.css";
import TaskView from "../TaskView/TaskView";
import { Badge, Calendar } from "antd";
import moment from "moment/moment";
import { useOutletContext } from "react-router-dom";
import axios from "axios";


const Schedule = () => {
  const [planId] = useOutletContext();
  const [taskList, setTaskList] = useState([]);
  const [categoryList, setCategoryList] = useState();
  const [openAddTask, setOpenAddTask] = useState(false);
  const [isTaskUpdate, setIsTaskUpdate] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const now = moment();
  const showAddTask = () => {
    setOpenAddTask(true);
    // console.log(openAddTask);
  };

  const hideAddTask = () => {
    setOpenAddTask(false);
  };

  useEffect(() => {
    fetchTaskData();
    setIsTaskUpdate(false);
  }, [categoryList, isTaskUpdate]);

  useEffect(() => {
    fetchCategoryData();
  }, []);

  const fetchCategoryData = async () => {
    try {
      const res = await axios.get(
        `https://localhost:44302/api/Category/GetByPlanID/${planId}`
      );
      setCategoryList(res.data);
      // console.log(res.data);
    } catch (error) {
      console.log("category", error);
    }
  };

  const fetchTaskData = async () => {
    try {
      if(categoryList != null){
        const promises = categoryList.map(async (category) => {
          // console.log("categoryid", category.id);
          const res = await axios.get(
            `https://localhost:44302/api/worktask/GetByCategoryID/${category.id}`
          );
          // console.log(res.data);
          return res.data;
        });
  
        const taskResults = await Promise.all(promises);
        const filteredTaskResults = taskResults
          .filter((data) => data !== null)
          .flatMap((data) => data);
        // console.log(filteredTaskResults);
  
        setTaskList(filteredTaskResults);
      }
    } catch (error) {
      console.log(error);
    }
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
          if (taskdueDate > now) {
            status = "error";
          } else if (taskdueDate > now.clone().subtract(7, "days")) {
            status = "warning";
          }

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
      <TaskView
        showModal={openAddTask}
        hideModal={hideAddTask}
        setIsTaskUpdate={setIsTaskUpdate}
        selectedTask={selectedTask}
      />
    </>
  );
};

export default Schedule;
