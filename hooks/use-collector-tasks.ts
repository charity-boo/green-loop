import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-provider';
import { CollectorTask } from '@/types';
import { db } from '@/lib/firebase/config';
import { collection, query, where, onSnapshot, doc, updateDoc, FirestoreError as _FirestoreError } from 'firebase/firestore';

export const useCollectorTasks = () => {
  const { user, status } = useAuth();
  const [tasks, setTasks] = useState<CollectorTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== 'authenticated' || !user?.uid || !db) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'waste'),
      where('assignedCollectorId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as unknown as CollectorTask[];
      
      setTasks(tasksData);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching tasks:", err);
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, status]);

  const updateTask = async (taskId: string, updatedFields: Partial<CollectorTask>) => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      const taskRef = doc(db, 'waste', taskId);
      await updateDoc(taskRef, {
        ...updatedFields,
        updatedAt: new Date().toISOString()
      });
    } catch (err: _FirestoreError) {
      console.error(`Error updating task ${taskId}:`, err);
      setError(err.message);
    }
  };

  const uploadPhoto = async (taskId: string, _file: File) => {
    // This would typically use Firebase Storage
    // Keeping it as a placeholder but removing the maintenance message
    console.log(`Photo upload requested for task ${taskId}. Implementation pending storage configuration.`);
    return null;
  };

  return { tasks, loading, error, updateTask, uploadPhoto };
};