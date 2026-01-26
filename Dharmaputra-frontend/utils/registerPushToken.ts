import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import api from "@/utils/api";

export const registerPushToken = async () => {
  if (!Device.isDevice) {
    console.log("Must use physical device for push notifications");
    return;
  }

  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } =
      await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Push notification permission denied");
    return;
  }

  const tokenData = await Notifications.getExpoPushTokenAsync();
  const pushToken = tokenData.data;

  // 🔥 Save token in backend
  await api.post("/user/push-token", {
    pushToken,
  });

  console.log("Expo push token registered:", pushToken);
};
