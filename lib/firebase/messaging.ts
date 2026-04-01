'use client';

import { useEffect } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { doc, setDoc } from 'firebase/firestore';
import app, { messaging } from '@/lib/firebase/config';
import { db } from '@/lib/firebase/config';

/**
 * Requests notification permission, retrieves the FCM token,
 * and persists it to the user's Firestore document.
 */
export function useFCMToken(userId: string | null) {
  useEffect(() => {
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    if (!userId || !messaging || !vapidKey || !app) {
      if (!vapidKey) console.warn('[FCM] NEXT_PUBLIC_FIREBASE_VAPID_KEY is missing in env');
      return;
    }

    async function registerToken() {
      try {
        // Step 1: Request permission
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.warn('[FCM] Notification permission not granted.');
          return;
        }

        // Step 2: Ensure Service Worker is registered and ready
        const swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        await navigator.serviceWorker.ready;

        // Diagnostic: Check if Installations API is working
        try {
          const { getInstallations, getId } = await import('firebase/installations');
          const installations = getInstallations(app);
          const instId = await getId(installations);
          console.log('[FCM] Installations ID verified:', instId);
        } catch (instError) {
          console.error('[FCM] Installations API failed. This is likely the root cause of the "missing required authentication credential" error. Ensure the Firebase Installations API is enabled in your Google Cloud Console project.', instError);
        }

        // Step 3: Get token
        const token = await getToken(messaging!, {
          vapidKey: vapidKey,
          serviceWorkerRegistration: swRegistration,
        });

        if (token) {
          console.log('[FCM] Token retrieved successfully');
          await setDoc(
            doc(db, 'users', userId!),
            { fcmToken: token },
            { merge: true }
          );
        } else {
          console.warn('[FCM] No token received.');
        }
      } catch (error) {
        console.error('[FCM] Token registration failed:', error);
        
        // Detailed hint for the specific error reported
        if (error instanceof Error && error.message.includes('authentication credential')) {
          console.error('[FCM] Hint: This error often means the API Key used is restricted or the Firebase Installations API is disabled in the Google Cloud Console.');
        }
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
