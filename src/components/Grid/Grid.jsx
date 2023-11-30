import React, { useEffect, useContext } from "react";
import "./Grid.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useState } from "react";
import axios from "axios";
import TaskView from "../TaskView/TaskView";
import PlanContext from "../../PlanContext";

const Grid = () => {
  const {
    id: planId,
    taskList,
    fetchTaskData,
    currentUser,
    userList,
  } = useContext(PlanContext);

  const [openAddTask, setOpenAddTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  let isCheckBoxClicked = true;
  const showAddTask = () => {
setOpenAddTask(true);
    // console.log(openAddTask);
  };

  useEffect(() => {
    setTasks(taskList);
    // console.log("oke",taskList);
  }, [taskList]);

  // useEffect(() => setTasks([]),[]);
  const hideAddTask = () => {
    setOpenAddTask(false);
  };

  const updateStatus = async (e, id, status) => {
    console.log(isCheckBoxClicked);
    e.stopPropagation();
    try {
      const data = {
        status: status === "Completed" ? "In progress" : "Completed",
        userId: currentUser.userId,
      };
      console.log(data);
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/worktask/status/${id}?status=${data.status}&userId=${data.userId}`
      );
      // console.log(res.data);
      fetchTaskData();
      isCheckBoxClicked = false;
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="chart-container">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="caption table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell align="left">Title</TableCell>
              <TableCell align="left">Assignment</TableCell>
              <TableCell align="left">Start Date</TableCell>
              <TableCell align="left">Due Date</TableCell>
              <TableCell align="left">Category</TableCell>
              <TableCell align="left">Status</TableCell>
              <TableCell align="left">Priority</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow
                style={{ cursor: "pointer" }}
                key={task.id}
                onClick={(e) => {
                  showAddTask();
                  setSelectedTask(task);
                }}
              >
                <TableCell component="th" scope="row">
                  <div onClick={(e) => e.stopPropagation()}>
                    <input
                    type="checkbox"
                    checked={task.status === "Completed"}
                    onChange={(e) => {
                      updateStatus(e, task.id, task.status);
                    }}
                  />
                  </div>
                </TableCell>
                <TableCell align="left">{task.name}</TableCell>
                <TableCell align="left">
                  {(() => {
                    const assignedUser = userList.find(
                      (x) => x.userId === task.assignedUserId
                    );
                    if (assignedUser) {
                      return (
                        <div className="hover-box">
                          <img
                            className="avatars"
                            src={`${process.env.REACT_APP_API_URL}/api/file?url=${assignedUser.imgUrl}`}
                            alt=""
                          />
                          <span>{assignedUser.userName}</span>
                        </div>
                      );
                    }
                    return null; // Handling case where assignedUser is not found
                  })()}
                </TableCell>

                <TableCell align="left">{task.startDate}</TableCell>
                <TableCell align="left">{task.dueDate}</TableCell>
                <TableCell align="left">{task.categoryName}</TableCell>
                <TableCell align="left">{task.status}</TableCell>
                <TableCell align="left">{task.priority}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {openAddTask && (
        <TaskView
          showModal={openAddTask}
          hideModal={hideAddTask}
          selectedTask={selectedTask}
          planId={planId}
          fetchTaskData={fetchTaskData}
        />
      )}
    </div>
  );
};

export default Grid;
