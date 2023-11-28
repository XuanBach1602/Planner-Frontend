import React, { useEffect, useState, useContext, useRef } from "react";
import { Dropdown, Modal, Input } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { DatePicker } from "antd";
import { UserAddOutlined, DeleteOutlined } from "@ant-design/icons";
import { Select, Space } from "antd";
import axios from "axios";
dayjs.extend(customParseFormat);

const PreviewTask = (props) => {
  const dateFormat = "YYYY-MM-DD";
    const { TextArea } = Input;
  const selectedTask = props.selectedTask;
  const showModal = props.showModal;
  const hideModal = props.hideModal;
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [completedUserId, setCompletedUserId] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");
  const [createdUserId, setCreatedUserId] = useState();
  const [completedUser, setCompletedUser] = useState();
  const [userList, setUserList] = useState([]);
  const defaultTask = {
    taskName: "Dang thu",
    progress: "In progress",
    priority: "Medium",
    startDate: "2023-11-03",
    dueDate: "2023-11-03",
    description: "Đây là test task",
    isPrivate: false,
    isApproved: false
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
  const setIsPrivate = (value) =>
    setTask((prevTask) => ({ ...prevTask, isPrivate: value }));
  const setIsApproved = (value) => 
  setTask((prevTask) => ({...prevTask, isApproved: value})) ;
  useEffect(() => {
    if (selectedTask != null) {
      setTaskName(selectedTask?.name);
      setDescription(selectedTask?.description);
      setProgress(selectedTask?.status);
      setPriority(selectedTask?.priority);
      setDueDate(selectedTask?.dueDate);
      setStartDate(selectedTask?.startDate);
      setIsPrivate(selectedTask.isPrivate);
      setAssignedUserId(selectedTask.assignedUserId);
      setCompletedUserId(selectedTask.completedUserId);
      setIsApproved(selectedTask.isApproved);
      setCreatedUserId(selectedTask.createdUserId);
      setFiles([]);
      setUploadFiles([]);
      const completedUser = userList.find(x => x.userId == selectedTask.completedUserId);
      setCompletedUser(completedUser);
      const tmp = [];
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
            tmp.push(createAndSetFileName(blobData, file.name));

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
            setUploadFiles(tmp);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    } else {
      // clearData();
    }
  }, [userList]);
  const createAndSetFileName = (blobData, fileName) => {
    const blob = new Blob([blobData], { type: "application/octet-stream" });
    const file = new File([blob], fileName);
    return file;
  };

  const items = [
    { label: "Select an option", value: "" }, // Lựa chọn trống
    ...userList.map((user) => ({
      label: (
        <div key={user.id} className="hover-box">
          <img
            className="avatars"
            src={`${process.env.REACT_APP_API_URL}/api/file?url=${user.imgUrl}`}
            alt=""
          />
          <span>{user.userName}</span>
        </div>
      ),
      value: user.userId,
    })),
  ];

  useEffect(() => {
    const fetchUserList = async() => {
      console.log(selectedTask);
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/UserPlan/PlanId/${selectedTask.planId}`
        );
        setUserList(res.data);
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchUserList();
  },[selectedTask])
  return (
    <Modal
      className={`task-detail readonly-input`}
      centered
      maskClosable={false}
      open={showModal}
      onOk={() => hideModal()}
      onCancel={() => hideModal()}
      okButtonProps={{
        style: { display:  "none"  },
      }}
    >
      <div className="task-name">
        <Input
          required
          title="Please fill task name"
          placeholder="Fill your task name"
          className="task-name-input"
          value={task.taskName}
        />
      </div>
      <div className="assign-box">
        <label htmlFor="selectTrigger">
          <a>
            <UserAddOutlined /> Assign to
          </a>
        </label>{" "}<Select
          id="selectTrigger"
          style={{width: 200,}}
          // suffixIcon={false}
          bordered={false}
          options={items}
          value={assignedUserId}
          placeholder="Choose any member"
        />
      </div>
      {completedUser!== undefined && <div style={{marginTop:"15px"}}>
        <img
            className="assigned-user-img"
            src={`${process.env.REACT_APP_API_URL}/api/file?url=${completedUser.imgUrl}`}
          /> Completed by {completedUser.userName} at {selectedTask.completedTime}
        </div>}
      <div className="selection-row">
        <div className="startDate">
          <label htmlFor="" style={{ marginRight: "10px " }}>
            Start Date{" "}
          </label>
          <DatePicker
            defaultValue={dayjs("2015-01-01", dateFormat)}
            format={dateFormat}
            value={dayjs(task.startDate, "YYYY-MM-DD")}
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
          />
        </div>
      </div>
      <div className="select-container">
        <div className="progress-box">
          <span style={{ minWidth: "70px", display: "inline-block" }}>
            Progress
          </span>
          <Select
            className="task-selection-item"
            defaultValue={task.progress}
            style={{
              width: 120,
            }}
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
          <span style={{ minWidth: "70px", display: "inline-block" }}>
            Priority
          </span>
          <Select
            className=" task-selection-item"
            defaultValue={task.priority}
            style={{
              width: 120,
            }}
            value={task.priority}
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
        <div className="private-box">
          <span style={{ minWidth: "70px", display: "inline-block" }}>
            Privacy
          </span>
          <Select
            className="task-selection-item"
            defaultValue={task.isPrivate}
            style={{
              width: 120,
            }}
            value={task.isPrivate}
            options={[
              {
                value: false,
                label: "Public",
              },
              {
                value: true,
                label: "Private",
              },
            ]}
          />
        </div>
        <div className="approved-box">
          <span style={{ minWidth: "70px", display: "inline-block" }}>
            Approve
          </span>
          <Select
            className="task-selection-item"
            defaultValue={task.isApproved}
            style={{
              width: 120,
            }}
            value={task.isApproved}
            options={[
              {
                value: false,
                label: "No",
              },
              {
                value: true,
                label: "Yes",
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
                </li>
              </div>
            ))}
        </div>
      </div>
      {selectedTask != null  && (
        <div className="delete-task-box">
          <DeleteOutlined
            className="delete-task-icon"
          />
          Delete
        </div>
      )}
    </Modal>
  );
}

export default PreviewTask;