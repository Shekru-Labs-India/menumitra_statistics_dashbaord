// Mock service worker for FCM until Firebase is properly configured
self.addEventListener('install', () => {
  console.log('Mock Firebase Messaging Service Worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  console.log('Mock Firebase Messaging Service Worker activated');
});

// Listen for push events (this will be replaced with real implementation when Firebase is configured)
self.addEventListener('push', (event) => {
  console.log('Mock push event received:', event);
  
  const notificationTitle = 'Mock Notification';
  const notificationOptions = {
    body: 'This is a mock notification until Firebase is properly configured.',
    icon: '/favicon.ico'
  };
  
  event.waitUntil(
    self.registration.showNotification(notificationTitle, notificationOptions)
  );
});

// When Firebase is properly configured, replace this file with the proper implementation using:
/*
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
});

const messaging = firebase.messaging();

// Optional: Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png' // Add your app icon path here
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});
*/ 