import { Redirect, Stack } from "expo-router";
import { isDemoApp } from "../../lib/app-mode";

export default function ProducerLayout() {
  if (isDemoApp) {
    return <Redirect href="/(restaurant)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
