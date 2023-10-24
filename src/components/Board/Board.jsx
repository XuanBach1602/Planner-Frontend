import React, { useState } from "react";
import "./Board.css";
import Task from "../Task/Task";
import { PlusOutlined } from "@ant-design/icons";
import TaskView from "../TaskView/TaskView";
const Board = () => {
  const [categoryName, setCategoryName] = useState("");
  const [openAddTask, setOpenAddTask] = useState(false);
  const showAddTask = () => {
    setOpenAddTask(true);
    console.log(openAddTask);
  };

  const hideAddTask = () => {
    setOpenAddTask(false);
  };

  const categoryList = [
    {
      id: 1,
      name: "Category 1",
    },
    {
      id: 2,
      name: "Category 2",
    },
  ];

  const taskList = [
    {
      id: 1,
      name: "Make front-end",
      dueDate: "2023/11/11",
      categoryId: 1,
    },
    {
      id: 2,
      name: "Make back-end",
      dueDate: "2023/11/11",
      categoryId: 1,
    },
    {
      id: 3,
      name: "Authentication",
      dueDate: "2023/11/11",
      categoryId: 2,
    },
    {
      id: 4,
      name: "Sign-in UI",
      dueDate: "2023/11/11",
      categoryId: 2,
    },
  ];

  return (
    <div className="board-container">
      {categoryList !== null &&
        categoryList.map((category, index) => (
          <div className="category-box">
            <div className="board">
              <div className="board-item not-started">
                <input
                  type="text"
                  className="category-input"
                  placeholder="Add new category"
                  value={category.name}
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
              .map((task) => (
                <Task name={task.name} dueDate={task.dueDate} />
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
