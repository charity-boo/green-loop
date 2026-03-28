// Firebase Messaging Service Worker
// Must be at the root of the public directory so Firebase can register it at /firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/12.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.9.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCX0pySK-IZfxCRU_J2Ag5bTrEjBcoGprU',
  authDomain: 'green-loop-26.firebaseapp.com',
  projectId: 'green-loop-26',
  storageBucket: 'green-loop-26.firebasestorage.app',
  messagingSenderId: '873673636223',
  appId: '1:873673636223:web:b1231e431242c1bf77c24a',
});

const messaging = firebase.messaging();

// Handle background messages (app is not in focus)
messaging.onBackgroundMessage((payload) => {
  const { title = 'Green Loop', body = 'You have a new notification.' } = payload.notification ?? {};

  self.registration.showNotification(title, {
    body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: payload.data ?? {},
  });
});
