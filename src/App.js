import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import MainLayout from "./layouts/layout";
import Hub from "./components/Hub/Hub";
import Plan from "./components/Plan/Plan.jsx";
import SignUp from "./components/SignUp/SignUp.jsx";
import SignIn from "./components/SignIn/SignIn";

function App() {
  return (
    <Router>
       <Routes>
      <Route path="/signin" Component={SignIn} />
      <Route path="/signup" Component={SignUp} />
      </Routes>
          <Routes>
            <Route path="/" element={ <MainLayout><Hub /></MainLayout>} />
            <Route path="/plan" element={<MainLayout><Plan /></MainLayout>} />
          </Routes>     
    </Router>
  );
}

export default App;