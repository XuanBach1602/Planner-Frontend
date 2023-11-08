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
  const selectedTask = props.selectedTask;
  const categoryId = props.categoryId;
  const showModal = props.showModal;
  const hideModal = props.hideModal;
  const setIsTaskUpdate = props.setIsTaskUpdate;

  const [files, setFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const { TextArea } = Input;
  const { user } = useUser();
  const [taskName, setTaskName] = useState("Dang thu");
  const [progress, setProgress] = useState("In progress");
  const [priority, setPriority] = useState("Medium");
  const [startDate, setStartDate] = useState("2023-10-03");
  const [dueDate, setDueDate] = useState("2023-10-03");
  const [description, setDescription] = useState("Oke ");
  const [isValidInput, setIsValidInput] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);

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
              `https://localhost:44302/api/File?url=${file.url}`,
              {
                responseType: "blob", // Chỉ định kiểu dữ liệu nhận về là dạng blob (binary large object)
              }
            );
            const blobData = response.data;
            setUploadFiles((prevUploadFiles) => [
              ...prevUploadFiles,
              createAndSetFileName(blobData, file.name)
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
    }
  else {
    clearData();
  }
   
  }, [selectedTask]);

  const handleProgressChange = (value) => {
    setProgress(value);
  };

  const createAndSetFileName = (blobData, fileName) => {
    const blob = new Blob([blobData],{type:"application/octet-stream"});
    const file = new File([blob],fileName);
    return file;
  }

  const clearData = () => {
    setTaskName("Dang thu");
    setDescription("oke");
    setProgress("In progress");
    setPriority("Medium");
    setDueDate("2023-10-03");
    setStartDate("2023-10-03");
    setFiles([]);
    setUploadFiles([]);
    setIsValidInput(false);
    setErrorMessage("");
    // set
  };

  const handlePriorityChange = (value) => {
    setPriority(value);
  };

  const checkValid = () => {
    // var isValid = taskName.trim() !== "";
    var isValid = taskName !== "";

    setIsValidInput(isValid);
  };

  const addFile = (e) => {
    const newFile = e.target.files[0];
      const url = window.URL.createObjectURL(newFile);

      setFiles([...files, { name: newFile.name, url: url }]);
      console.log("newFile:", newFile);
      setUploadFiles([...uploadFiles,newFile]);
      console.log(uploadFiles);
    // }
  };

  const removeFile = (fileName) => {
    const updatedFiles = files.filter((file) => file.name !== fileName);
    const updatedUploadFiles = uploadFiles.filter((file) => file.name !== fileName);
    setFiles(updatedFiles);
    setUploadFiles(updatedUploadFiles);
  };

  const dateFormat = "YYYY-MM-DD";

  const addNewTask = async () => {
    if (isValidInput) {
      try {
        const formData = new FormData();
        formData.append("name", taskName);
        formData.append("description", description);
        formData.append("status", progress);
        formData.append("priority", priority);
        formData.append("startDate", startDate);
        formData.append("dueDate", dueDate);
        formData.append("categoryID", categoryId);
        formData.append("createdUserID", user.id);
        formData.append("assignedUserID", user.id);
        if (uploadFiles && uploadFiles.length > 0) {
          for (let i = 0; i < uploadFiles.length; i++) {
            formData.append("attachedFiles", uploadFiles[i]);
          }
        }

        // console.log(data);
        const res = await axios.post(
          "https://localhost:44302/api/worktask",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(res);
        setErrorMessage("");
        setIsTaskUpdate(true);
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
    // console.log(selectedTask);
    if (isValidInput) {
      try {
        const formData = new FormData();
        formData.append("id", selectedTask.id);
        formData.append("name", taskName);
        formData.append("description", description);
        formData.append("status", progress);
        formData.append("priority", priority);
        formData.append("startDate", startDate);
        formData.append("dueDate", dueDate);
        formData.append("categoryID", selectedTask.categoryId);
        formData.append("createdUserID", user.id);
        formData.append("assignedUserID", user.id);
        if (uploadFiles && uploadFiles.length > 0) {
          for (let i = 0; i < uploadFiles.length; i++) {
            formData.append("attachedFiles", uploadFiles[i]);
          }
        }

        // console.log(data);
        const res = await axios.put(
          "https://localhost:44302/api/worktask",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(res);
        setErrorMessage("");
        setIsTaskUpdate(true);

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
    try {
      const res = await axios.delete(
        `https://localhost:44302/api/worktask?id=${selectedTask.id}`
      );
      setIsTaskUpdate(true);
      setErrorMessage("");
      setIsTaskUpdate(true);
      hideModal();
    } catch (error) {
      console(error);
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

  useEffect(() => checkValid(), [taskName]);

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
          value={taskName}
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
            value={dayjs(startDate, "YYYY-MM-DD")}
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
            value={dayjs(dueDate, "YYYY-MM-DD")}
            onChange={(value) => {
              if (value) {
                const formattedValue = value.format("YYYY-MM-DD");
                setDueDate(formattedValue);
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
            defaultValue="In progress"
            style={{
              width: 120,
            }}
            onChange={(e) => handleProgressChange(e)}
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
          value={description}
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
              <div className=""key={index}>
                <li >
                  <a href= {file.url} target="_blank" download={file.name} key={index}  >
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
