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
    active: boolean;
    status: string | null;
    aiStats: {
      totalClassified: number;
      totalAiPoints: number;
    };
  }>({
    points: 0,
    tier: 'Bronze',
    nextPickup: null,
    region: null,
    active: false,
    status: null,
    aiStats: {
      totalClassified: 0,
      totalAiPoints: 0
    }
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
        const active = userData.active ?? false;
        const status = userData.status || null;
        let tier = 'Bronze';
        if (points >= 2000) tier = 'Gold';
        else if (points >= 500) tier = 'Silver';

        setData(prev => ({ ...prev, points, tier, region, active, status }));
      }
    });

    // Listen to all user's waste/schedules to count AI usage
    const allWasteRef = collection(db, 'schedules');
    const qAll = query(
      allWasteRef,
      where('userId', '==', user.uid)
    );

    const unsubscribeAiStats = onSnapshot(qAll, (querySnap) => {
      let totalClassified = 0;
      querySnap.docs.forEach(doc => {
        const d = doc.data();
        if (d.classificationStatus === 'classified') {
          totalClassified++;
        }
      });
      setData(prev => ({
        ...prev,
        aiStats: {
          totalClassified,
          totalAiPoints: totalClassified * 10 // 10 bonus points per AI use
        }
      }));
    });

    // Listen to next pending pickup
    const wasteRef = collection(db, 'schedules');
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
      unsubscribeAiStats();
      unsubscribePickups();
    };
  }, [user?.uid]);

  return { ...data, loading };
}
