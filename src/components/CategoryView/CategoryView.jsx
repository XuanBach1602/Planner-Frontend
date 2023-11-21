import axios from "axios";
import React, { useEffect, useState } from "react";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { Collapse } from "antd";
import Task from "../Task/Task";
import TaskView from "../TaskView/TaskView";
const CategoryView = (props) => {
  const category = props.category;
  const fetchCategoryData = props.fetchCategoryData;
  const fetchTaskData = props.fetchTaskData;
  const taskList = props.taskList;
  const planId = category.planID;
  const [categoryName, setCategoryName] = useState("");
  const [openAddTask, setOpenAddTask] = useState(false);
  const [categoryId, setCategoryId] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [notCompletedTask, setNotCompletedTask] = useState([]);
  const [completedTask, setComPletedTask] = useState([]);
  const showAddTask = (categoryId) => {
    setOpenAddTask(true);
    if (categoryId) setCategoryId(categoryId);
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
          `${process.env.REACT_APP_API_URL}/api/Category`,
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
        `${process.env.REACT_APP_API_URL}/api/Category?id=${id}`
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
          `${process.env.REACT_APP_API_URL}/api/Category`,
          data
        );
        fetchCategoryData();
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const setCategoryInput = (e, categoryId) => {
    if (e.key === "Enter") {
      if (categoryId != null) updateCategory(categoryId);
      else addNewCategory();

      setCategoryName("");
      e.currentTarget.blur();
    }
  };

  const fetchTaskCategoryData = async () => {
    const notCompletedTasks = taskList.filter((x) => x.status !== "Completed");
    const completedTasks = taskList.filter((x) => x.status === "Completed");
    setNotCompletedTask(notCompletedTasks);
    setComPletedTask(completedTasks);
  };

  useEffect(() => {
    fetchTaskCategoryData();
  }, [taskList]);

  const convertToTaskList = [
    {
      key: "1",
      label: <div>Completed &nbsp; &nbsp; {completedTask.length}</div>,
      children: (
        <div>
          {completedTask.map((task) => (
            <div
              key={task.modifiedDate}
              onClick={() => {
                setSelectedTask(task);
                showAddTask(categoryId);
              }}
            >
              <Task task={task} key={task.id} fetchTaskData={fetchTaskData} />
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
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
      <div style={{ marginLeft: "15px" }}>
        {notCompletedTask
          .filter((x) => x.categoryId === category.id)
          .map((task) => (
            <div
              key={task.modifiedDate}
              onClick={() => {
                setSelectedTask(task);
                showAddTask(category.id);
              }}
            >
              <Task
                fetchTaskData={fetchTaskData}
                // fetchData={fetchData}
                task={task}
                key={task.id}
              />
            </div>
          ))}
      </div>
      {completedTask.length > 0 && (
        <Collapse
          items={convertToTaskList}
          defaultActiveKey={["0"]}
          className="completed-task-list"
        />
      )}
      {openAddTask && (
        <TaskView
          showModal={openAddTask}
          hideModal={hideAddTask}
          categoryId={categoryId}
          selectedTask={selectedTask}
          planId={planId}
          fetchTaskData={fetchTaskData}
          fetchTaskCategoryData={fetchTaskCategoryData}
        />
      )}
    </div>
  );
};

export default CategoryView;
