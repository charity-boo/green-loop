'use client';

import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  QuerySnapshot,
  DocumentData,
  doc,
  updateDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { CollectorTask } from '@/types';

/**
 * Hook to fetch and sync waste collection tasks assigned to a specific collector.
 * Uses real-time snapshots with offline support and sync status tracking.
 * 
 * @param uid The unique identifier of the collector.
 * @returns An object containing tasks, loading state, error, and sync metadata.
 */
export function useCollectorTasks(uid: string | undefined) {
  const [tasks, setTasks] = useState<CollectorTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [hasPendingWrites, setHasPendingWrites] = useState(false);

  useEffect(() => {
    if (!uid) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      // Per USER_REQUEST: collection is 'waste_schedules' and field is 'collectorId'
      const q = query(
        collection(db, 'waste_schedules'),
        where('collectorId', '==', uid),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(
        q,
        { includeMetadataChanges: true },
        (snapshot: QuerySnapshot<DocumentData>) => {
          const tasksData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            hasPendingWrites: doc.metadata.hasPendingWrites,
          })) as unknown as (CollectorTask & { hasPendingWrites: boolean })[];

          setTasks(tasksData);
          setLoading(false);
          setIsOffline(snapshot.metadata.fromCache);
          setHasPendingWrites(snapshot.metadata.hasPendingWrites);
        },
        (err) => {
          console.error('Error in useCollectorTasks snapshot:', err);
          setError(err.message);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up useCollectorTasks listener:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  }, [uid]);

  /**
   * Helper to update task status or fields directly.
   */
  const updateTask = async (taskId: string, updatedFields: Partial<CollectorTask>) => {
    if (!db) return;
    const taskRef = doc(db, 'waste_schedules', taskId);
    return updateDoc(taskRef, {
      ...updatedFields,
      updatedAt: new Date().toISOString()
    });
  };

  return { tasks, loading, error, isOffline, hasPendingWrites, updateTask };
}