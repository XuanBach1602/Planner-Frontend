import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import MainLayout from "./layouts/layout";
import Hub from "./components/Hub/Hub";
import Plan from "./components/Plan/Plan.jsx";
import SignUp from "./components/SignUp/SignUp.jsx";
import SignIn from "./components/SignIn/SignIn";
import Board from "./components/Board/Board";
import TaskView from "./components/TaskView/TaskView";
import Schedule from "./components/Schedule/Schedule";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/TaskView" element={<TaskView />} />
        <Route path="/" element={<MainLayout />}>
          <Route path="/" element={<Hub />} />
          <Route path="/plan" element={<Plan />}>
            <Route path="board" element={<Board />} />
            <Route path="schedule" element={<Schedule />} />
          </Route>
        </Route>
      </Routes>
    </Router>
    //   <Router>
    //     <Routes>
    //     <Route path="/signin" element={<SignIn/>} />
    //     <Route path="/signup" element={<SignUp/>} />
    //     </Routes>
    //  <MainLayout>
    //   <Routes>
    //    <Route path="/" element={<Hub />} />
    //    <Route path="/plan" element= {<Plan />} />
    //   </Routes>
    //  </MainLayout>
    //  </Router>
  );
}

export default App;
