import AsyncStorage from "@react-native-async-storage/async-storage";

export const launchSeenKey = "motocargo:launch-seen:v1";

export async function hasSeenLaunch() {
  try {
    const value = await AsyncStorage.getItem(launchSeenKey);
    return value === "1";
  } catch {
    return false;
  }
}

export async function markLaunchSeen() {
  try {
    await AsyncStorage.setItem(launchSeenKey, "1");
  } catch {
    // Ignore storage failures and continue.
  }
}
