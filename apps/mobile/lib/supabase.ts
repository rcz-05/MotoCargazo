import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";
import { NativeModules } from "react-native";
import { isDemoApp } from "./app-mode";

const configuredUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const fallbackSupabaseUrl = "https://motocargo-demo.invalid";
const fallbackAnonKey = "motocargo-demo-anon-key";

function isLocalHost(hostname: string) {
  return hostname === "127.0.0.1" || hostname === "localhost" || hostname === "::1";
}

function getDevMachineHostFromExpo(): string | null {
  const scriptUrl: string | undefined = NativeModules?.SourceCode?.scriptURL;
  if (scriptUrl) {
    try {
      const parsed = new URL(scriptUrl);
      if (parsed.hostname) return parsed.hostname;
    } catch {
      // Ignore parse errors and fallback to other host hints.
    }
  }

  const constants = Constants as unknown as {
    expoConfig?: { hostUri?: string };
    expoGoConfig?: { debuggerHost?: string };
    manifest2?: { extra?: { expoClient?: { hostUri?: string } } };
  };

  const hostUri =
    constants.expoConfig?.hostUri ??
    constants.expoGoConfig?.debuggerHost ??
    constants.manifest2?.extra?.expoClient?.hostUri;

  if (!hostUri) return null;
  return hostUri.split(":")[0] ?? null;
}

function resolveSupabaseUrl(rawUrl: string | undefined): string {
  if (!rawUrl) return "";

  try {
    const parsed = new URL(rawUrl);

    if (!isLocalHost(parsed.hostname)) {
      return parsed.toString().replace(/\/$/, "");
    }

    const devHost = getDevMachineHostFromExpo();
    if (!devHost || isLocalHost(devHost)) {
      return parsed.toString().replace(/\/$/, "");
    }

    parsed.hostname = devHost;
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return rawUrl;
  }
}

export const runtimeSupabaseUrl = resolveSupabaseUrl(configuredUrl) || fallbackSupabaseUrl;
const resolvedAnonKey = anonKey || fallbackAnonKey;

if (!isDemoApp && (!configuredUrl || !anonKey)) {
  console.warn("Supabase env vars are missing. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.");
}

if (__DEV__ && configuredUrl && runtimeSupabaseUrl !== configuredUrl) {
  console.info(`Supabase URL rewritten for device access: ${configuredUrl} -> ${runtimeSupabaseUrl}`);
}

export const supabase = createClient(runtimeSupabaseUrl, resolvedAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});
