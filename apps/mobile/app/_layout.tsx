import { useEffect } from "react";
import { Stack } from "expo-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "../lib/session";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { queryClient } from "../lib/queryClient";

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontLoadError] = useFonts({
    "PlayfairDisplay-Regular": require("../assets/fonts/PlayfairDisplay-Regular.ttf"),
    "PlayfairDisplay-Bold": require("../assets/fonts/PlayfairDisplay-Bold.ttf"),
    "Manrope-Regular": require("../assets/fonts/Manrope-Regular.ttf"),
    "Manrope-SemiBold": require("../assets/fonts/Manrope-SemiBold.ttf"),
    "Manrope-Bold": require("../assets/fonts/Manrope-Bold.ttf")
  });

  useEffect(() => {
    if (fontsLoaded || fontLoadError) {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [fontsLoaded, fontLoadError]);

  if (!fontsLoaded && !fontLoadError) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }} />
      </SessionProvider>
    </QueryClientProvider>
  );
}
