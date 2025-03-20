import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCoPZ3_Ktah8UBBSgh0_OXL5SQwUtL6Wok",
  authDomain: "menumitra-83831.firebaseapp.com",
  projectId: "menumitra-83831",
  storageBucket: "menumitra-83831.firebasestorage.app",
  messagingSenderId: "851450497367",
  appId: "1:851450497367:web:aa62fb5526e04d946a9612",
  measurementId: "G-PYXCL0CMR5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Helper function to wait
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to get FCM token with retries
async function getFCMTokenWithRetry(swRegistration, maxRetries = 3, delayMs = 1000) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Getting FCM token (attempt ${attempt}/${maxRetries})...`);
      
      // First try without VAPID key
      try {
        console.log('Attempting to get token without VAPID key...');
        const token = await getToken(messaging, {
          serviceWorkerRegistration: swRegistration
        });
        if (token) {
          console.log('FCM Token obtained successfully without VAPID key');
          return token;
        }
      } catch (error) {
        console.log('Failed to get token without VAPID key, trying with VAPID key...');
      }

      // Try with VAPID key
      const currentToken = await getToken(messaging, {
        vapidKey: "BPgLxGPXVQxQxGIRYB8_KXxVlwE_CJdOO_-4XQr_0RJxGZYxLAMDVgGMwDmFqXBEwGGO-nO_4YqxQDHqVTv_gZw",
        serviceWorkerRegistration: swRegistration
      });

      if (currentToken) {
        console.log('FCM Token obtained successfully with VAPID key');
        return currentToken;
      }
      
      throw new Error('No token received from FCM');
    } catch (error) {
      console.error(`FCM token attempt ${attempt} failed:`, error);
      lastError = error;
      
      if (attempt < maxRetries) {
        console.log(`Waiting ${delayMs}ms before next attempt...`);
        await wait(delayMs);
        delayMs *= 2; // Exponential backoff
      }
    }
  }
  
  throw lastError;
}

// Function to request notification permission and get FCM token
export const requestNotificationPermission = async () => {
  try {
    // Check if notification permission is already granted
    if (Notification.permission === 'granted') {
      console.log('Notification permission already granted');
    } else {
      console.log('Requesting notification permission...');
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Notification permission denied');
      }
      console.log('Notification permission granted');
    }

    // Check if service worker is available
    if (!('serviceWorker' in navigator)) {
      throw new Error('Service Worker not supported');
    }

    // Wait for any existing service workers to finish
    if (navigator.serviceWorker.controller) {
      console.log('Waiting for existing service worker...');
      await navigator.serviceWorker.ready;
    }

    // Register new service worker
    console.log('Registering service worker...');
    const swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    console.log('Service Worker registered:', swRegistration);

    // Wait for the service worker to be ready
    await navigator.serviceWorker.ready;
    console.log('Service Worker is ready');

    // Get FCM token with retries
    return await getFCMTokenWithRetry(swRegistration);
  } catch (error) {
    console.error('Error in requestNotificationPermission:', error);
    throw error;
  }
};

// Function to handle incoming messages when app is in foreground
export const onMessageListener = () => {
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log('Received foreground message:', payload);
      resolve(payload);
    });
  });
};

export default messaging; 