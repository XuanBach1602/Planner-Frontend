import React, { useEffect, useState } from "react";
import "./TaskView.css";
import axios from "axios";
import { Dropdown, Modal, Input } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { DatePicker } from "antd";
import { UserAddOutlined, DeleteOutlined } from "@ant-design/icons";
import { Select, Space } from "antd";
import { useUser } from "../../UserContext";
dayjs.extend(customParseFormat);

const TaskView = (props) => {
  const { user } = useUser();
  const { TextArea } = Input;
  const selectedTask = props.selectedTask;
  const categoryId = props.categoryId;
  const showModal = props.showModal;
  const hideModal = props.hideModal;
  const fetchTaskData = props.fetchTaskData;
  const fetchTaskCategoryData = props.fetchTaskCategoryData;
  const planId = props.planId;

  const [files, setFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isValidInput, setIsValidInput] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const defaultTask = {
    taskName: "Dang thu",
    progress: "In progress",
    priority: "Medium",
    startDate: "2023-11-03",
    dueDate: "2023-11-03",
    description: "Đây là test task",
  };

  const [task, setTask] = useState(defaultTask);
  const setTaskName = (value) =>
    setTask((prevTask) => ({ ...prevTask, taskName: value }));
  const setProgress = (value) =>
    setTask((prevTask) => ({ ...prevTask, progress: value }));
  const setPriority = (value) =>
    setTask((prevTask) => ({ ...prevTask, priority: value }));
  const setStartDate = (value) =>
    setTask((prevTask) => ({ ...prevTask, startDate: value }));
  const setDueDate = (value) =>
    setTask((prevTask) => ({ ...prevTask, dueDate: value }));
  const setDescription = (value) =>
    setTask((prevTask) => ({ ...prevTask, description: value }));
  
  const setDate = (dueDate) => {
    setDueDate(dueDate);
    if(dueDate < task.startDate) setStartDate(dueDate);
  }
  useEffect(() => {
    if (selectedTask != null) {
      setTaskName(selectedTask?.name);
      setDescription(selectedTask?.description);
      setProgress(selectedTask?.status);
      setPriority(selectedTask?.priority);
      setDueDate(selectedTask?.dueDate);
      setStartDate(selectedTask?.startDate);
      setFiles([]);
      setUploadFiles([]);
      if (selectedTask.files != null && selectedTask.files.length > 0) {
        const filePromises = selectedTask.files.map(async (file) => {
          try {
            const response = await axios.get(
              `${process.env.REACT_APP_API_URL}/api/File?url=${file.url}`,
              {
                responseType: "blob", // Chỉ định kiểu dữ liệu nhận về là dạng blob (binary large object)
              }
            );
            const blobData = response.data;
            setUploadFiles((prevUploadFiles) => [
              // ...prevUploadFiles,
              createAndSetFileName(blobData, file.name),
            ]);

            const url = window.URL.createObjectURL(new Blob([blobData]));
            return { name: file.name, url: url };
          } catch (error) {
            console.error(error);
            return null;
          }
        });

        Promise.all(filePromises)
          .then((Files) => {
            const filteredFiles = Files.filter((file) => file !== null);
            setFiles(filteredFiles);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    } else {
      // clearData();
    }
  }, [selectedTask]);

  const handleProgressChange = (value) => {
    setProgress(value);
  };

  const createAndSetFileName = (blobData, fileName) => {
    const blob = new Blob([blobData], { type: "application/octet-stream" });
    const file = new File([blob], fileName);
    return file;
  };

  const handlePriorityChange = (value) => {
    setPriority(value);
  };

  const checkValid = () => {
    // var isValid = taskName.trim() !== "";
    var isValid = task.taskName !== "";

    setIsValidInput(isValid);
  };

  const addFile = (e) => {
    const newFile = e.target.files[0];
    const url = window.URL.createObjectURL(newFile);

    setFiles([...files, { name: newFile.name, url: url }]);
    console.log("newFile:", newFile);
    setUploadFiles([...uploadFiles, newFile]);
    console.log(uploadFiles);
    // }
  };

  const removeFile = (fileName) => {
    const updatedFiles = files.filter((file) => file.name !== fileName);
    const updatedUploadFiles = uploadFiles.filter(
      (file) => file.name !== fileName
    );
    setFiles(updatedFiles);
    setUploadFiles(updatedUploadFiles);
  };

  const dateFormat = "YYYY-MM-DD";

  const addNewTask = async () => {
    if (isValidInput) {
      try {
        const formData = new FormData();
        formData.append("name", task.taskName);
        formData.append("description", task.description);
        formData.append("status", task.progress);
        formData.append("priority", task.priority);
        formData.append("startDate", task.startDate);
        formData.append("dueDate", task.dueDate);
        formData.append("categoryID", categoryId);
        formData.append("planID", planId);
        formData.append("createdUserID", user.id);
        formData.append("assignedUserID", user.id);
        if (uploadFiles && uploadFiles.length > 0) {
          for (let i = 0; i < uploadFiles.length; i++) {
            formData.append("attachedFiles", uploadFiles[i]);
          }
        }

        // console.log(data);
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/worktask`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(res);
        setErrorMessage("");
        // setIsTaskUpdate(true);
        fetchTaskData();
        fetchTaskCategoryData();
        hideModal();
        // clearData();
      } catch (error) {
        console.log(error);
        setErrorMessage("Refill the form");
        hideModal();
      }
    } else {
      setErrorMessage("Please fill the form");
    }
  };

  const updateTask = async () => {
    console.log(selectedTask);
    if (isValidInput) {
      try {
        const formData = new FormData();
        formData.append("id", selectedTask.id);
        formData.append("name", task.taskName);
        formData.append("description", task.description);
        formData.append("status", task.progress);
        formData.append("priority", task.priority);
        formData.append("startDate", task.startDate);
        formData.append("dueDate", task.dueDate);
        formData.append("categoryID", selectedTask.categoryId);
        formData.append("planID", selectedTask.planId);
        formData.append("createdUserID", user.id);
        formData.append("assignedUserID", user.id);
        console.log(uploadFiles);
        if (uploadFiles && uploadFiles.length > 0) {
          for (let i = 0; i < uploadFiles.length; i++) {
            formData.append("attachedFiles", uploadFiles[i]);
          }
        }

        // console.log(data);
        const res = await axios.put(
          `${process.env.REACT_APP_API_URL}/api/worktask`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(res);
        setErrorMessage("");
        fetchTaskData();
        if(fetchTaskCategoryData) fetchTaskCategoryData();
        // setIsTaskUpdate(true);

        hideModal();
      } catch (error) {
        console.log(error);
        setErrorMessage("Refill the form");
        hideModal();
      }
    } else {
      setErrorMessage("Please fill the form");
    }
  };

  const deleteTask = async () => {
    console.log("remove");
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/worktask?id=${selectedTask.id}`
      );
      setErrorMessage("");
      fetchTaskData();
      if(fetchTaskCategoryData) fetchTaskCategoryData();
      hideModal();
    } catch (error) {
      console.log(error);
    }
  };

  const items = [
    {
      label: <a href="https://www.antgroup.com">1st menu item</a>,
      key: "0",
    },
    {
      label: <a href="https://www.aliyun.com">2nd menu item</a>,
      key: "1",
    },
    {
      type: "divider",
    },
    {
      label: "3rd menu item",
      key: "3",
    },
  ];

  useEffect(() => checkValid(), [task.taskName]);

  useEffect(() => console.log(uploadFiles));

  return (
    <Modal
      className="task-detail"
      centered
      zIndex={2}
      open={showModal}
      onOk={() => (selectedTask === null ? addNewTask() : updateTask())}
      onCancel={() => hideModal()}
      okText={selectedTask === null ? "Add new task" : "Update task"}
    >
      <div className="task-name">
        <Input
          required
          title="Please fill task name"
          placeholder="Fill your task name"
          className="task-name-input"
          value={task.taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
      </div>
      <div className="assign-box">
        <Dropdown
          menu={{
            items,
          }}
          trigger={["click"]}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <UserAddOutlined />
              Assign
            </Space>
          </a>
        </Dropdown>
      </div>
      <div className="selection-row">
        <div className="startDate">
          <label htmlFor="" style={{ marginRight: "10px " }}>
            Start Date{" "}
          </label>
          <DatePicker
            defaultValue={dayjs("2015-01-01", dateFormat)}
            format={dateFormat}
            value={dayjs(task.startDate, "YYYY-MM-DD")}
            onChange={(value) => {
              if (value) {
                const formattedValue = value.format("YYYY-MM-DD");
                setStartDate(formattedValue);
              }
            }}
          />
        </div>
        <div className="dueDate">
          <label htmlFor="" style={{ marginRight: "10px " }}>
            Due Date
          </label>
          <DatePicker
            defaultValue={dayjs("2015-01-01", dateFormat)}
            format={dateFormat}
            value={dayjs(task.dueDate, "YYYY-MM-DD")}
            onChange={(value) => {
              if (value) {
                const formattedValue = value.format("YYYY-MM-DD");
                setDate(formattedValue);
              }
            }}
          />
        </div>
      </div>
      <div className="progress-container">
        <div className="progress-box">
          <span style={{ minWidth: "60px", marginRight: "15px" }}>
            Progress
          </span>
          <Select
            defaultValue={task.progress}
            style={{
              width: 120,
            }}
            onChange={(e) => handleProgressChange(e)}
            value={task.progress}
            options={[
              {
                value: "Not started",
                label: "Not started",
              },
              {
                value: "In progress",
                label: "In progress",
              },
              {
                value: "Completed",
                label: "Completed",
              },
            ]}
          />
        </div>
        <div className="priority-box">
          <span style={{ minWidth: "60px", marginRight: "22px" }}>
            Priority
          </span>
          <Select
            defaultValue="Medium"
            style={{
              width: 120,
            }}
            onChange={(e) => handlePriorityChange(e)}
            options={[
              {
                value: "Urgent",
                label: "Urgent",
              },
              {
                value: "Medium",
                label: "Medium",
              },
              {
                value: "Important",
                label: "Important",
              },
              {
                value: "Low",
                label: "Low",
              },
            ]}
          />
        </div>
      </div>
      <div className="task-description">
        <TextArea
          rows={4}
          placeholder="Description"
          maxLength={100}
          value={task.description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="file-box">
        <label htmlFor="file-upload" className="attachment-label">
          Add attachments
        </label>
        <input
          type="file"
          id="file-upload"
          className="file-input"
          multiple="multiple"
          accept="image/png, image/jpeg, .doc,.docx, .pdf"
          onChange={(e) => addFile(e)}
        />
        <div>
          {files !== null &&
            files.map((file, index) => (
              <div className="" key={index}>
                <li>
                  <a
                    href={file.url}
                    target="_blank"
                    download={file.name}
                    key={index}
                  >
                    {file.name} &nbsp;
                  </a>
                  <DeleteOutlined
                    id="delete-file-icon"
                    onClick={() => removeFile(file.name)}
                  />
                </li>
              </div>
            ))}
        </div>
      </div>

      <span id="error-message" style={{ color: "red" }}>
        {errorMessage}
      </span>
      {selectedTask != null && (
        <div className="delete-task-box">
          <DeleteOutlined
            className="delete-task-icon"
            onClick={() => deleteTask()}
          />
          Delete
        </div>
      )}
    </Modal>
  );
};

export default TaskView;
