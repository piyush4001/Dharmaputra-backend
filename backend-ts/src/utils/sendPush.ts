import fetch from "node-fetch";

export const sendPushNotification = async (
  tokens: string[],
  title: string,
  body: string,
) => {
  if (!tokens.length) return;

  const messages = tokens.map((token) => ({
    to: token,
    sound: "default",
    title,
    body,
    priority: "high",
  }));

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messages),
  });
};
