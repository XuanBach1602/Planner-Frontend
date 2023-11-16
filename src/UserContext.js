// UserContext.js
import axios from 'axios';
import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const token = localStorage.getItem("token");
  const userInfo = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState(userInfo !== null? userInfo : null);
  const [isAuthenticated, setIsAuthenticated] = useState(token? true: false);

  const fetchUserData = async() => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/${user.id}`);
      console.log(res);
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    }
    catch(err){
      console.log(err.message);
    }
  }

  return (
    <UserContext.Provider value={{ user, setUser, isAuthenticated, setIsAuthenticated, fetchUserData }}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export { UserProvider, useUser };
