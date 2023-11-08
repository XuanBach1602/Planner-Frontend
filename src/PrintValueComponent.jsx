import React, { useEffect, useState } from 'react';
import { useUser } from './UserContext';

const PrintValueComponent = () => {
  const {isAuthenticated} = useUser();

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log(isAuthenticated);
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

};

export default PrintValueComponent;