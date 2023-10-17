import React from "react";
import "./Board.css";
import Task from "../Task/Task";
const Board = () => {
    return(
        <div className="board">
            <div className="board-item not-started">
                <h4>Not started</h4>
                <Task></Task>
            </div>
            <div className="board-item in-progress">
                <h4>In Progress</h4>
            </div>
            <div className="board-item completed">
                <h4>Completed</h4>
            </div>
            <div className="board-item outdate">
                <h4>Out Of Date</h4>
            </div>
        </div>
    )
}

export default Board;