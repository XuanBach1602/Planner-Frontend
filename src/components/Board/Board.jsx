import React, { useEffect, useState } from "react";
import "./Board.css";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import CategoryView from "../CategoryView/CategoryView";

const Board = () => {
  const [planId, categoryList, taskList, fetchCategoryData, fetchTaskData] =
    useOutletContext();
  const [categoryName, setCategoryName] = useState("");

  const filterTasksByCategoryID = (categoryId) => {
    const filteredTaskList = taskList.filter(x => x.categoryId === categoryId);
    return filteredTaskList;
  }

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
        // console.log(res);
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

  return (
    <div className="board-page" >
      {categoryList !== null && taskList !== null &&
        categoryList.map((category) => (
          <CategoryView taskList = {filterTasksByCategoryID(category.id)} category={category} fetchTaskData={fetchTaskData} key={category.id} fetchCategoryData={fetchCategoryData}/>
        ))}
      <div className="category-box">
        <div className="board">
          <div className="board-item">
            <input
              type="text"
              className="category-input"
              placeholder="Add new category"
              onChange={(e) => {
                setCategoryName(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setCategoryInput(e);
                  e.target.value = "";
                }
              }}
            />
          </div>
        </div>
      </div>
      {/* {openAddTask && (
        <TaskView
          showModal={openAddTask}
          hideModal={hideAddTask}
          categoryId={categoryId}
          selectedTask={selectedTask}
          planId={planId}
          fetchTaskData={fetchTaskData}
        />
      )} */}
    </div>
  );
};

export default Board;
