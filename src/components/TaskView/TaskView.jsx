import React, { useEffect, useState } from "react";
import "./TaskView.css";
import axios from "axios";
import { Dropdown, Modal, Button, Form, Input } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { DatePicker } from "antd";
import { UserAddOutlined, DeleteOutlined } from "@ant-design/icons";
import { Select, Space } from "antd";
dayjs.extend(customParseFormat);

const TaskView = (props) => {

  const ShowModal = props.ShowModal;
  const HideModal = props.HideModal;

  const [taskName, setTaskName] = useState("Dang thu");
  const [progress, setProgress] = useState("In progress");
  const [priority, setPriority] = useState("Medium");
  const [startDate, setStartDate] = useState("2023-10-03");
  const [dueDate, setDueDate] = useState("2023-10-03");
  const [description, setDescription] = useState("Oke e den day di");
  const [files, setFiles] = useState([]);
  const [isValidInput, setIsValidInput] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { TextArea } = Input;

  const handleProgressChange = (value) => {
    setProgress(value);
  };

  const handlePriorityChange = (value) => {
    setPriority(value);
  };

  const checkValid = () => {
    var isValid = taskName.trim() !== "";
    setIsValidInput(isValid);
  };

  const addFile = (e) => {
    const newFile = e.target.files[0];
    const fileDoesNotExist = files.every((file) => file.name !== newFile.name);
    if (fileDoesNotExist) {
      setFiles([...files, newFile]);
      console.log("Add file");
    }
  };

  const removeFile = (fileName) => {
    const updatedFiles = files.filter((file) => file.name !== fileName);
    setFiles(updatedFiles);
    console.log("remove file");
  };

  const dateFormat = "YYYY-MM-DD";

  const addNewTask = async () => {
    if (isValidInput) {
      try {
        const data = {
          name: taskName,
          description: description,
          status: progress,
          priority: priority,
          startDate: startDate,
          dueDate: dueDate,
          categoryID: 1,
          createdUserID: "9b6f1133-b512-4155-931b-e32d90b4e823",
          assignedUserID: "9b6f1133-b512-4155-931b-e32d90b4e823",
        };
        console.log(data);
        const res = await axios.post(
          "https://localhost:44302/api/worktask",
          data
        );
        console.log(res);
        setErrorMessage("");
        HideModal();
      } catch (error) {
        console.log(error);
        setErrorMessage("Refill the form");
        HideModal();
      }
    } else {
      setErrorMessage("Please fill the form");
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
      open={ShowModal}
      onOk={() => addNewTask()}
      onCancel={() => HideModal()}
      okText="Add new task"
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
              <div className="" key={index}>
                <li>
                  {file.name} &nbsp;
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
    </Modal>
  );
};

export default TaskView;
