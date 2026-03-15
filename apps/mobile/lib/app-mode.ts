export type AppMode = "demo" | "live";

const configuredMode = process.env.EXPO_PUBLIC_APP_MODE?.trim().toLowerCase();

export const appMode: AppMode = configuredMode === "live" ? "live" : "demo";
export const isDemoApp = appMode === "demo";
export const isLiveApp = appMode === "live";
