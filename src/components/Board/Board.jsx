import React, { useEffect, useState } from "react";
import "./Board.css";
import axios from "axios";
import Task from "../Task/Task";
import { PlusOutlined } from "@ant-design/icons";
import TaskView from "../TaskView/TaskView";
import { useOutletContext } from "react-router-dom";
const Board = (props) => {
  const [categoryName, setCategoryName] = useState("");
  const [openAddTask, setOpenAddTask] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [taskList, setTaskList] = useState([]);
  const [planId] = useOutletContext();
  const showAddTask = () => {
    setOpenAddTask(true);
    console.log(openAddTask);
  };

  const hideAddTask = () => {
    setOpenAddTask(false);
  };

  const addNewCategory = async () => {
    if (categoryName != null) {
      try {
        console.log(`PlanID : ${planId}`);
        const data = {
          name: categoryName,
          planId: planId,
        };
        const res = await axios.post(
          "https://localhost:44302/api/Category",
          data
        );
        // await fetchCategoryData();
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchCategoryData = async () => {
    try {
      const res = await axios.get(
        `https://localhost:44302/api/Category/GetByPlanID/${planId}`
      );
      console.log("category", res);
      setCategoryList(res.data);
    } catch (error) {
      console.log("category", error);
    }
  };

  // const fetchTaskData = async () => {
  //   try {
  //     const promises = categoryList.map(async (category) => {
  //       console.log("categoryid", category.id);
  //       const res = await axios.get(
  //         `https://localhost:44302/api/worktask/GetByCategoryID/${category.id}`
  //       );
  //       console.log("tasks", res.data);
  //       // return res.data;
  //     });
  //     const taskResults = await Promise.all(promises);
  //     // const updatedTasklist = [...taskList, ...taskResults];
  //     // setTaskList(updatedTasklist);
  //     console.log(taskList);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const taskList = [
  //   {
  //     id: 1,
  //     name: "Make front-end",
  //     dueDate: "2023/11/11",
  //     categoryId: 1,
  //   },
  //   {
  //     id: 2,
  //     name: "Make back-end",
  //     dueDate: "2023/11/11",
  //     categoryId: 1,
  //   },
  //   {
  //     id: 3,
  //     name: "Authentication",
  //     dueDate: "2023/11/11",
  //     categoryId: 2,
  //   },
  //   {
  //     id: 4,
  //     name: "Sign-in UI",
  //     dueDate: "2023/11/11",
  //     categoryId: 2,
  //   },
  // ];

  useEffect(() => {
   fetchCategoryData();
    // await fetchTaskData();
  }, []);

  return (
    <div className="board-container">
      {categoryList !== null &&
        categoryList.map((category, index) => (
          <div className="category-box" key={index}>
            <div className="board">
              <div className="board-item not-started">
                <input
                  type="text"
                  className="category-input"
                  placeholder={category.name}
                />
              </div>
            </div>
            <div className="add-task-btn" onClick={() => showAddTask()}>
              <PlusOutlined
                style={{
                  fontSize: "16px",
                  marginBottom: "5px",
                  marginRight: "5px",
                }}
              />
              Add Task
            </div>
            {taskList
              .filter((x) => x.categoryId == category.id)
              .map((task, index) => (
                <Task name={task.name} dueDate={task.dueDate} key={index} />
              ))}
            <TaskView ShowModal={openAddTask} HideModal={hideAddTask} />
          </div>
        ))}
      <div className="category-box">
        <div className="board">
          <div className="board-item not-started">
            <input
              type="text"
              className="category-input"
              placeholder="Add new category"
              onChange={(e) => setCategoryName(e.target.value)}
              onBlur={() => addNewCategory()}
            />
          </div>
        </div>
        <div className="add-task-btn" onClick={() => showAddTask()}>
          <PlusOutlined
            style={{
              fontSize: "16px",
              marginBottom: "5px",
              marginRight: "5px",
            }}
          />
          Add Task
        </div>

        <TaskView ShowModal={openAddTask} HideModal={hideAddTask} />
      </div>
    </div>
  );
};

export default Board;
