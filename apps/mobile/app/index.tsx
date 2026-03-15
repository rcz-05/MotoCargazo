import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { useSession } from "../lib/session";
import { isDemoApp } from "../lib/app-mode";
import { colors } from "../lib/theme";
import { hasSeenLaunch } from "../lib/launch-state";

export default function RootGate() {
  const { loading, session, roleSession, isDemoSession } = useSession();
  const [launchLoading, setLaunchLoading] = useState(true);
  const [launchSeen, setLaunchSeen] = useState(false);

  useEffect(() => {
    let mounted = true;

    hasSeenLaunch()
      .then((seen) => {
        if (!mounted) return;
        setLaunchSeen(seen);
      })
      .finally(() => {
        if (mounted) setLaunchLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading || launchLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={colors.brandDark} size="large" />
      </View>
    );
  }

  if (!launchSeen) {
    return <Redirect href="/launch" />;
  }

  if (isDemoApp) {
    return <Redirect href="/(restaurant)" />;
  }

  if (!session && !isDemoSession) {
    return <Redirect href="/(auth)/login" />;
  }

  if (roleSession.role === "producer") {
    return <Redirect href="/(producer)" />;
  }

  if (roleSession.role === "admin") {
    return <Redirect href="/(restaurant)" />;
  }

  return <Redirect href="/(restaurant)" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.bgLight
  }
});
