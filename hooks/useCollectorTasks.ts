
import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase/client';
import { useAuth } from '@/context/AuthContext';

export interface Task {
  id: string;
  location: string;
  wasteType: string;
  status: 'pending' | 'completed';
  collectorId?: string;
  photoUrl?: string;
  volume?: number;
  createdAt: any;
  completedAt?: any;
}

export const useCollectorTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'tasks'), where('collectorId', '==', user.uid));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksData: Task[] = [];
      querySnapshot.forEach((doc) => {
        tasksData.push({ id: doc.id, ...doc.data() } as Task);
      });
      setTasks(tasksData);
      setLoading(false);
    }, (err) => {
      setError('Failed to fetch tasks.');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const updateTask = async (taskId: string, data: Partial<Task>) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, data);
    } catch (err) {
      setError('Failed to update task.');
    }
  };

  const uploadPhoto = async (taskId: string, file: File) => {
    try {
      const storageRef = ref(storage, `tasks/${taskId}/${file.name}`);
      await uploadBytes(storageRef, file);
      const photoUrl = await getDownloadURL(storageRef);
      await updateTask(taskId, { photoUrl });
      return photoUrl;
    } catch (err) {
      setError('Failed to upload photo.');
      return null;
    }
  };

  return { tasks, loading, error, updateTask, uploadPhoto };
};
