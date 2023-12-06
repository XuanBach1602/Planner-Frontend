import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import "./App.css";
import 'react-toastify/dist/ReactToastify.css';
import MainLayout from "./layouts/layout";
import Hub from "./components/Hub/Hub.jsx";
import Plan from "./components/Plan/Plan.jsx";
import SignUp from "./components/SignUp/SignUp.jsx";
import SignIn from "./components/SignIn/SignIn";
import Board from "./components/Board/Board";
import Schedule from "./components/Schedule/Schedule";
import Account from "./components/Account/Account";
import { useUser } from "./UserContext";
import Grid from "./components/Grid/Grid.jsx";
import { ToastContainer } from 'react-toastify';
import Notification from "./components/Notification/Notification.jsx";
import ScheduleCalendar from "./Fullcalendar/Calendar.jsx";
function App() {
  const { isAuthenticated, setIsAuthenticated } = useUser();
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/notification" element={<Notification />} />
        {!isAuthenticated && (
          <Route path="*" element={<Navigate to="/signin" />} />
        )}
        {isAuthenticated && (
          <Route>
            <Route path="/Account" element={<Account />} />
            <Route path="/" element={<MainLayout />}>
              <Route path="/" element={<Hub />} />
              <Route path="/plan/:id" element={<Plan />}>
                <Route path="" index element={<Board />} />
                <Route path="schedule" element={<ScheduleCalendar />} />
                <Route path="grid" element={<Grid />} />
              </Route>
            </Route>
          </Route>
        )}
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
