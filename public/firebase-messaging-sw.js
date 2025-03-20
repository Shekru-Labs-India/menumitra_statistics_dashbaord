// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

try {
  firebase.initializeApp({
    apiKey: "AIzaSyCoPZ3_Ktah8UBBSgh0_OXL5SQwUtL6Wok",
    authDomain: "menumitra-83831.firebaseapp.com",
    projectId: "menumitra-83831",
    storageBucket: "menumitra-83831.firebasestorage.app",
    messagingSenderId: "851450497367",
    appId: "1:851450497367:web:aa62fb5526e04d946a9612",
    measurementId: "G-PYXCL0CMR5"
  });

  const messaging = firebase.messaging();

  // Handle background messages
  messaging.onBackgroundMessage(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message:', payload);

    const notificationTitle = payload.notification?.title || 'New Notification';
    const notificationOptions = {
      body: payload.notification?.body || 'You have a new message',
      icon: '/favicon.ico',
      tag: Date.now().toString() // Add unique tag to prevent duplicate notifications
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
  });

  console.log('[firebase-messaging-sw.js] Firebase messaging service worker initialized');
} catch (error) {
  console.error('[firebase-messaging-sw.js] Error initializing Firebase:', error);
}

self.addEventListener('install', (event) => {
  console.log('[firebase-messaging-sw.js] Service Worker installing...');
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  console.log('[firebase-messaging-sw.js] Service Worker activating...');
  event.waitUntil(self.clients.claim());
}); 