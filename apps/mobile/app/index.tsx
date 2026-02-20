import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Redirect } from "expo-router";
import { useSession } from "../lib/session";
import { colors } from "../lib/theme";

export default function RootGate() {
  const { loading, session, roleSession, isDemoSession } = useSession();

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={colors.brand} size="large" />
      </View>
    );
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
    backgroundColor: colors.bgDark
  }
});
