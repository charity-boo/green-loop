'use client';

import { useState, useEffect } from 'react';
import { doc, onSnapshot, collection, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/context/auth-provider';
import { WasteStatus } from '@/types/waste-status';

export function useUserData() {
  const { user } = useAuth();
  const [data, setData] = useState<{
    points: number;
    tier: string;
    nextPickup: string | null;
    region: string | null;
  }>({
    points: 0,
    tier: 'Bronze',
    nextPickup: null,
    region: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid || !db) {
      setLoading(false);
      return;
    }

    // Listen to user doc for points and region
    const userRef = doc(db, 'users', user.uid);
    const unsubscribeUser = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const points = userData.rewardPoints || 0;
        const region = userData.region || null;
        let tier = 'Bronze';
        if (points >= 2000) tier = 'Gold';
        else if (points >= 500) tier = 'Silver';

        setData(prev => ({ ...prev, points, tier, region }));
      }
    });

    // Listen to next pending pickup
    const wasteRef = collection(db, 'waste');
    const q = query(
      wasteRef,
      where('userId', '==', user.uid),
      where('status', '==', WasteStatus.Pending),
      orderBy('pickupDate', 'asc'),
      limit(1)
    );

    const unsubscribePickups = onSnapshot(q, (querySnap) => {
      if (!querySnap.empty) {
        const nextPickupDoc = querySnap.docs[0].data();
        setData(prev => ({ ...prev, nextPickup: nextPickupDoc.pickupDate }));
      } else {
        setData(prev => ({ ...prev, nextPickup: null }));
      }
      setLoading(false);
    });

    return () => {
      unsubscribeUser();
      unsubscribePickups();
    };
  }, [user?.uid]);

  return { ...data, loading };
}
