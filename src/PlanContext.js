// PlanContext.js
import { createContext } from 'react';

const PlanContext = createContext({
    id: '',
    categoryList: [],
    taskList: [],
    fetchCategoryData: () => {},
    fetchTaskData: () => {},
    currentUser: null,
    userList: [],
    leader: null,
  });

export default PlanContext;
