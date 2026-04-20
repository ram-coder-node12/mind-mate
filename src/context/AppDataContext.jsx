import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { subscribeToTasks } from '../services/taskService';
import { subscribeToCheckins } from '../services/checkinService';

const AppDataContext = createContext();

export const useAppData = () => useContext(AppDataContext);

export const AppDataProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setTasks([]);
      setCheckins([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Track which subscriptions have fired at least once
    let tasksReady = false;
    let checkinsReady = false;

    const trySetLoaded = () => {
      if (tasksReady && checkinsReady) {
        clearTimeout(safetyTimer);
        setLoading(false);
      }
    };

    // Safety net — if Firestore subscriptions don't fire within 10s, clear loading
    const safetyTimer = setTimeout(() => {
      console.warn('Firestore subscriptions timed out — showing empty state. Check Firestore rules and DB setup.');
      setLoading(false);
    }, 10000);

    const handleError = (error) => {
      console.error('AppDataContext Sync Error:', error);
      clearTimeout(safetyTimer);
      setLoading(false);
    };

    const unsubscribeTasks = subscribeToTasks(currentUser.uid, (data) => {
      setTasks(data);
      tasksReady = true;
      trySetLoaded();
    }, handleError);

    const unsubscribeCheckins = subscribeToCheckins(currentUser.uid, (data) => {
      setCheckins(data);
      checkinsReady = true;
      trySetLoaded();
    }, handleError);

    return () => {
      clearTimeout(safetyTimer);
      unsubscribeTasks();
      unsubscribeCheckins();
    };
  }, [currentUser]);

  const value = {
    tasks,
    checkins,
    loading
  };

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
};
