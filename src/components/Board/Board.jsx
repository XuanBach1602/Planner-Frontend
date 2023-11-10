import React, { useEffect, useState } from "react";
import "./Board.css";
import axios from "axios";
import Task from "../Task/Task";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import TaskView from "../TaskView/TaskView";
import { useOutletContext } from "react-router-dom";
const Board = () => {
  const [planId,categoryList,taskList, fetchCategoryData, fetchTaskData] = useOutletContext();
  const [categoryName, setCategoryName] = useState("");
  const [openAddTask, setOpenAddTask] = useState(false);
  // const [categoryList, setCategoryList] = useState([]);
  // const [taskList, setTaskList] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [isTaskUpdate, setIsTaskUpdate] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const showAddTask = (categoryId) => {
    setOpenAddTask(true);
    setCategoryId(categoryId);
  };

  const hideAddTask = () => {
    setOpenAddTask(false);
    setSelectedTask([]);
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
        fetchCategoryData();
        // console.log(res);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const deleteCategory = async (id) => {
    try {
      const res = await axios.delete(
        `https://localhost:44302/api/Category?id=${id}`
      );
      // console.log(res);
      fetchCategoryData();
    } catch (error) {
      // console.log(error);
    }
  };

  const updateCategory = async (id) => {
    if (categoryName != null) {
      try {
        const data = {
          id: id,
          name: categoryName,
          planId: planId,
        };
        const res = await axios.put(
          "https://localhost:44302/api/Category",
          data
        );
        fetchCategoryData();
        // console.log(res);
      } catch (error) {
        console.log(error);
      }
    }
  };

  // const fetchCategoryData = async () => {
  //   try {
  //     const res = await axios.get(
  //       `https://localhost:44302/api/Category/GetByPlanID/${planId}`
  //     );
  //     setCategoryList(res.data);
  //     // console.log(res.data);
  //   } catch (error) {
  //     console.log("category", error);
  //   }
  // };

  const setCategoryInput = (e, categoryId) => {
    if (e.key === "Enter") {
      if (categoryId != null) updateCategory(categoryId);
      else addNewCategory();

      setCategoryName("");
      e.currentTarget.blur();
    }
  };

  // const fetchTaskData = async () => {
  //   try {
  //     const promises = categoryList.map(async (category, index) => {
  //       // console.log("categoryid", category.id);
  //       const res = await axios.get(
  //         `https://localhost:44302/api/worktask/GetByCategoryID/${category.id}`
  //       );
  //       // console.log(res.data);
  //       return res.data;
  //     });

  //     const taskResults = await Promise.all(promises);
  //     const filteredTaskResults = taskResults
  //       .filter((data) => data !== null)
  //       .flatMap((data) => data);
  //     // console.log(filteredTaskResults);

  //     setTaskList(filteredTaskResults);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   fetchCategoryData();
  // }, [planId]);

  // useEffect(() => {
  //   if (categoryList.length > 0) {
  //     fetchTaskData();
  //     setIsTaskUpdate(false);
  //     setSelectedTask(null);
  //   }
  // }, [categoryList, isTaskUpdate]);

  return (
    <div className="board-container" id="board-container">
      {categoryList !== null &&
        categoryList.map((category) => (
          <div className="category-box" key={category.id}>
            <div className="board">
              <div className="board-item ">
                <input
                  type="text"
                  className="category-input"
                  placeholder="Fill category name"
                  onChange={(e) => setCategoryName(e.target.value)}
                  onKeyDown={(e) => setCategoryInput(e, category.id)}
                  defaultValue={category.name}
                />
                <DeleteOutlined
                  id="delete-category-icon"
                  onClick={() => deleteCategory(category.id)}
                />
              </div>
            </div>
            <div
              className="add-task-btn"
              onClick={() => {
                showAddTask(category.id);
                setSelectedTask(null);
              }}
            >
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
              .filter((x) => x.categoryId === category.id)
              .map((task, taskListIndex) => (
                <div
                  key={task.modifiedDate}
                  onClick={() => {
                    setSelectedTask(task);
                    showAddTask(category.id);
                  }}
                >
                  <Task
                    name={task.name}
                    dueDate={task.dueDate}
                    // key={`${category.id}-${taskListIndex}`}
                    key={task.id}
                  />
                </div>
              ))}
          </div>
        ))}

      <div className="category-box">
        <div className="board">
          <div className="board-item">
            <input
              type="text"
              className="category-input"
              placeholder="Add new category"
              onChange={(e) => {
                setCategoryName(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setCategoryInput(e);
                  e.target.value = "";
                }
              }}
            />
          </div>
        </div>
      </div>
      {openAddTask && (
        <TaskView
          showModal={openAddTask}
          hideModal={hideAddTask}
          categoryId={categoryId}
          // setIsTaskUpdate={setIsTaskUpdate}
          selectedTask={selectedTask}
          planId={planId}
          fetchTaskData = {fetchTaskData}
        />
      )}
    </div>
  );
};

export default Board;
