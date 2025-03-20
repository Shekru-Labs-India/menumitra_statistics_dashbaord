// Simple function to return hardcoded FCM token
const getHardcodedToken = () => {
  return "2111111111";
};

// Function to request notification permission and get FCM token
export const requestNotificationPermission = async () => {
  // For now, just return the hardcoded token
  console.log("Using hardcoded FCM token");
  return getHardcodedToken();
};

// Function to handle incoming messages when app is in foreground
export const onMessageListener = () => {
  return new Promise((resolve) => {
    console.log("Mock message listener");
    resolve(null);
  });
};

export default null; 