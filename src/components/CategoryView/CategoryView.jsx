import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { Collapse } from "antd";
import Task from "../Task/Task";
import TaskView from "../TaskView/TaskView";
import PlanContext from "../../PlanContext";
const CategoryView = (props) => {
  const category = props.category;
  // const fetchCategoryData = props.fetchCategoryData;
  // const fetchTaskData = props.fetchTaskData;
  const {fetchCategoryData, fetchTaskData,currentUser, taskList} = useContext(PlanContext);
  // const taskList = props.taskList;
  const planId = category.planID;
  const [categoryName, setCategoryName] = useState("");
  const [openAddTask, setOpenAddTask] = useState(false);
  const [categoryId, setCategoryId] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [notCompletedTask, setNotCompletedTask] = useState([]);
  const [completedTask, setComPletedTask] = useState([]);
  let blurFlag = true;

  const showAddTask = (categoryId) => {
    setOpenAddTask(true);
    if (categoryId) setCategoryId(categoryId);
  };

  const hideAddTask = () => {
    setOpenAddTask(false);
    setSelectedTask([]);
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

  const updateCategory = async (e) => {
    if (e.key === "Enter" && e.target.value != null) {
      try {
        const data = {
          id: category.id,
          name: e.target.value,
          planId: planId,
        };
        const res = await axios.put(
          `${process.env.REACT_APP_API_URL}/api/Category`,
          data
        );
        blurFlag = false;
        e.target.blur();
        fetchCategoryData();
        // console.log(res);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchTaskCategoryData = async () => {
    const notCompletedTasks = taskList.filter((x) => x.status !== "Completed" && x.categoryId === category.id);
    const completedTasks = taskList.filter((x) => x.status === "Completed" && x.categoryId === category.id);
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
          {completedTask
          .map((task) => (
            <div
              key={task.modifiedDate}
              onClick={() => {
                setSelectedTask(task);
                showAddTask(categoryId);
              }}
              className="task-list"
            >
              <Task task={task} key={task.id} fetchTaskData={fetchTaskData}/>
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
            onBlur={(e) => {
              if (blurFlag) e.target.value = category.name;
            }}
            onKeyDown={(e) => updateCategory(e)}
            defaultValue={category.name}
            readOnly={currentUser?.role === "Member"}
            title={category.name}
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
