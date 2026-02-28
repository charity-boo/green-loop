'use client';

import { useEffect } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { doc, setDoc } from 'firebase/firestore';
import { messaging } from '@/lib/firebase/config';
import { db } from '@/lib/firebase/config';

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

/**
 * Requests notification permission, retrieves the FCM token,
 * and persists it to the user's Firestore document.
 *
 * Call this hook once the user is authenticated.
 */
export function useFCMToken(userId: string | null) {
  useEffect(() => {
    if (!userId || !messaging || !VAPID_KEY) return;

    async function registerToken() {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return;

        const token = await getToken(messaging!, {
          vapidKey: VAPID_KEY,
          serviceWorkerRegistration: await navigator.serviceWorker.register(
            '/firebase-messaging-sw.js'
          ),
        });

        if (token) {
          await setDoc(
            doc(db, 'users', userId!),
            { fcmToken: token },
            { merge: true }
          );
        }
      } catch (error) {
        console.error('[FCM] Token registration failed:', error);
      }
    }

    registerToken();
  }, [userId]);

  // Forward foreground messages to the browser Notification API
  useEffect(() => {
    if (!messaging) return;

    const unsubscribe = onMessage(messaging, (payload) => {
      const { title = 'Green Loop', body = 'You have a new update.' } =
        payload.notification ?? {};

      if (Notification.permission === 'granted') {
        new Notification(title, { body, icon: '/favicon.ico' });
      }
    });

    return unsubscribe;
  }, []);
}
