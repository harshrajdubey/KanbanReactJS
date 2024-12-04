import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setTasks } from './redux/tasksSlice';
import { setUsers } from './redux/usersSlice';
import MainComponent from './components/MainComponent'; 
import './index.css';
const App = () => {
  const dispatch = useDispatch();

  const tasks = useSelector((state) => state.tasks.data);
  const users = useSelector((state) => state.users.data);

  useEffect(() => {
    if (tasks.length === 0 || users.length === 0) {
      const fetchData = async () => {
        try {
          const response = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
          const data = await response.json();
          dispatch(setTasks(data.tickets));
          dispatch(setUsers(data.users));
        } catch (e) {
          console.error(e);
        }
      };

      fetchData();
    }
  }, [dispatch,tasks.length, users.length]);

  return (
    <div className="App">
      {tasks!==undefined && (
      <MainComponent />
      )}
    </div>
  );
};

export default App;
