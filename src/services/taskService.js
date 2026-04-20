import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot,
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { db } from './firebase';

const TASKS_COLLECTION = 'tasks';

export const subscribeToTasks = (userId, callback, onError) => {
  const q = query(
    collection(db, TASKS_COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, 
    (snapshot) => {
      const tasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(tasks);
    },
    (error) => {
      console.error('Task Subscription Error:', error);
      if (onError) onError(error);
    }
  );
};

export const addTask = async (userId, taskData) => {
  return await addDoc(collection(db, TASKS_COLLECTION), {
    ...taskData,
    userId,
    status: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

export const updateTask = async (taskId, updates) => {
  const taskRef = doc(db, TASKS_COLLECTION, taskId);
  return await updateDoc(taskRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
};

export const deleteTask = async (taskId) => {
  const taskRef = doc(db, TASKS_COLLECTION, taskId);
  return await deleteDoc(taskRef);
};
