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

const CHECKINS_COLLECTION = 'checkins';

export const subscribeToCheckins = (userId, callback, onError) => {
  const q = query(
    collection(db, CHECKINS_COLLECTION),
    where('userId', '==', userId),
    orderBy('date', 'desc')
  );

  return onSnapshot(q, 
    (snapshot) => {
      const checkins = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(checkins);
    },
    (error) => {
      console.error('Checkin Subscription Error:', error);
      if (onError) onError(error);
    }
  );
};

export const addCheckin = async (userId, checkinData) => {
  return await addDoc(collection(db, CHECKINS_COLLECTION), {
    ...checkinData,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

export const updateCheckin = async (checkinId, updates) => {
  const checkinRef = doc(db, CHECKINS_COLLECTION, checkinId);
  return await updateDoc(checkinRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
};

export const deleteCheckin = async (checkinId) => {
  const checkinRef = doc(db, CHECKINS_COLLECTION, checkinId);
  return await deleteDoc(checkinRef);
};
