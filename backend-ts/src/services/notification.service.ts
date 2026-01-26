// Notification service
import { firebaseMessaging } from "../config/firebase";

// Send push notification to a device
export const sendPushNotification = async (
  fcmToken: string,
  title: string,
  body: string,
  data?: Record<string, string>
) => {
  if (!fcmToken) return;

  await firebaseMessaging.send({
    token: fcmToken,
    notification: {
      title,
      body,
    },
    data,
  });
};
