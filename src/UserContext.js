// UserContext.js
import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const defaultUser = {
    "id": "148b6e06-0356-4f58-b54a-823dd08403d0",
    "name": "nguyen xuan bach",
    "email": "xuanbach15@gmail.com",
    "phoneNumber": "4545345435",
    "imageUrl": "Avatar.jpg",
    "gender": "Male",
    "dateOfBirth": "2023-10-10"
  };
  const [user, setUser] = useState(defaultUser);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  return (
    <UserContext.Provider value={{ user, setUser, isAuthenticated, setIsAuthenticated }}>
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
