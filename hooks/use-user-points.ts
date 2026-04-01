'use client';

import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/context/auth-provider';

export function useUserPoints() {
  const { user } = useAuth();
  const [points, setPoints] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid || !db) {
      setLoading(false);
      return;
    }

    const userRef = doc(db, 'users', user.uid);
    
    // Use onSnapshot for real-time updates when points change
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPoints(data.rewardPoints || 0);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching user points:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  return { points, loading };
}
