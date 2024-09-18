import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View, Image } from "react-native";

import { images } from "@/constants";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <Image source={images.notFound} style={styles.image} />
        <Text>This screen doesn't exist.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  image: {
    width: 300,
    height: 300,
  },
  linkText: {
    color: "#2e78b7",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
