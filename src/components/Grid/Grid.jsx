import React, { useEffect } from "react";
import "./Grid.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useOutletContext } from "react-router-dom";



const Grid = () => {
  const [planId,categoryList,taskList, fetchCategoryData, fetchTaskData] = useOutletContext();
  function createData(id,checkbox, title, assignment, startDate, dueDate, category,progress, priority) {
    return {id, checkbox, title, assignment, startDate, dueDate, category,progress, priority };
  }

  useEffect(() => console.log(rows, taskList),[]);
  
  const rows = taskList.map((task) => createData(task.id,"", task.name, "", task.startDate, task.dueDate,
  task.category, task.status, task.priority))   
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
              <TableCell align="right">Progress</TableCell>
              <TableCell align="right">Priority</TableCell>
              
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  <input type="checkbox" />
                </TableCell>
                <TableCell align="right">{row.title}</TableCell>
                <TableCell align="right">{row.assignment}</TableCell>
                <TableCell align="right">{row.startDate}</TableCell>
                <TableCell align="right">{row.dueDate}</TableCell>
                <TableCell align="right">{row.category}</TableCell>
                <TableCell align="right">{row.progress}</TableCell>
                <TableCell align="right">{row.priority}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Grid;
