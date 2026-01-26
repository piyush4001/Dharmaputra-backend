import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const isWeb = Platform.OS === "web";

export const setToken = async (token: string) => {
  if (isWeb) {
    localStorage.setItem("token", token);
  } else {
    await SecureStore.setItemAsync("token", token);
  }
};

export const getToken = async (): Promise<string | null> => {
  if (isWeb) {
    return localStorage.getItem("token");
  } else {
    return await SecureStore.getItemAsync("token");
  }
};

export const removeToken = async () => {
  if (isWeb) {
    localStorage.removeItem("token");
  } else {
    await SecureStore.deleteItemAsync("token");
  }
};
