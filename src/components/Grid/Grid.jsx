import React, { useEffect } from "react";
import "./Grid.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import TaskView from "../TaskView/TaskView";



const Grid = () => {
  const [planId,categoryList,taskList, fetchCategoryData, fetchTaskData] = useOutletContext();

  const [openAddTask, setOpenAddTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const showAddTask = () => {
    setOpenAddTask(true);
    // console.log(openAddTask);
  };

  const hideAddTask = () => {
    setOpenAddTask(false);
  };

  const updateStatus = async(e,id, status) => {
    e.stopPropagation();
    try {
      const data = status === "Completed"? "In progress" : "Completed";
 
      const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/worktask/status/${id}`,`"${data}"`,
      {
        headers: {
          "Content-Type": "application/json", // Đặt Content-Type là application/json
        },
      })
      console.log(res.data);
      fetchTaskData();
    } catch (error) {
      console.log(error);
    }
  } 
  return (
    <div className="chart-container">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="caption table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell align="right">Title</TableCell>
              <TableCell align="right">Assignment</TableCell>
              <TableCell align="right">Start Date</TableCell>
              <TableCell align="right">Due Date</TableCell>
              <TableCell align="right">Category</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Priority</TableCell>
              
            </TableRow>
          </TableHead>
          <TableBody>
            {taskList.map((task) => (
              <TableRow style={{cursor:"pointer"}} key={task.id} onClick={(e) => {
                showAddTask();
                setSelectedTask(task);
              }}>
                <TableCell component="th" scope="row">
                  <input type="checkbox" defaultChecked={task.status === "Completed"? true: false} onClick={(e) => updateStatus(e,task.id, task.status)}/>
                </TableCell>
                <TableCell align="right">{task.name}</TableCell>
                <TableCell align="right">{task.assignment}</TableCell>
                <TableCell align="right">{task.startDate}</TableCell>
                <TableCell align="right">{task.dueDate}</TableCell>
                <TableCell align="right">{task.categoryName}</TableCell>
                <TableCell align="right">{task.status}</TableCell>
                <TableCell align="right">{task.priority}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {openAddTask && 
      <TaskView
      showModal={openAddTask}
      hideModal={hideAddTask}
      selectedTask={selectedTask}
      planId={planId}
      fetchTaskData={fetchTaskData}
    />}
    </div>

  
  );
};

export default Grid;
