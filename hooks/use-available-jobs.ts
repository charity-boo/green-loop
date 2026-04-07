'use client';

import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy,
  QuerySnapshot,
  DocumentData
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { CollectorTask } from '@/types';

/**
 * Hook to fetch unassigned jobs in the collector's region.
 * These are jobs that are Paid and Pending but have no assignedCollectorId.
 */
export function useAvailableJobs(uid: string | undefined, region: string | undefined) {
  const [availableJobs, setAvailableJobs] = useState<CollectorTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid || !region || !db) {
      setAvailableJobs([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Query for paid pending jobs in the region
    // We filter for unassigned ones in the snapshot listener to avoid complex indexing
    const q = query(
      collection(db, 'schedules'),
      where('status', '==', 'pending'),
      where('paymentStatus', '==', 'Paid'),
      where('region', '==', region),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const jobsData = snapshot.docs
          .map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              type: data.type ?? data.wasteType ?? 'Recyclable',
            };
          })
          .filter((job) => !job.assignedCollectorId && !job.collectorId) as unknown as CollectorTask[];

        setAvailableJobs(jobsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error in useAvailableJobs snapshot:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [uid, region]);

  return { availableJobs, loading, error };
}
