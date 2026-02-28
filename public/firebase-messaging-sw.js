// Firebase Messaging Service Worker
// Must be at the root of the public directory so Firebase can register it at /firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCimi6k6bDYZRuqmnxlvFAVBxBWhWe4_S4',
  authDomain: 'green-loop-c9b5f.firebaseapp.com',
  projectId: 'green-loop-c9b5f',
  storageBucket: 'green-loop-c9b5f.firebasestorage.app',
  messagingSenderId: '851316096891',
  appId: '1:851316096891:web:8b351476a180c8d860c7de',
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
