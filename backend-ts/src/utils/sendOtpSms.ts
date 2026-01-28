import axios from "axios";

export const sendOtpSms = async (phone: string, otp: string) => {
  const SMS_ENABLED = process.env.SMS_ENABLED === "true";

  if (!SMS_ENABLED) {
    console.log(`📩 [SMS DISABLED] OTP for ${phone}: ${otp}`);
    return { disabled: true };
  }

  try {
    const response = await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        route: "q",
        message: `Your DharmaPutra OTP is ${otp}. It is valid for 5 minutes.`,
        language: "english",
        numbers: phone,
      },
      {
        headers: {
          authorization: process.env.FAST2SMS_API_KEY!,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Fast2SMS response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "SMS sending failed:",
      error?.response?.data || error.message
    );
    throw new Error("Failed to send SMS");
  }
};
