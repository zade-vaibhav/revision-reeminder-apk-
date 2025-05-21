import React from "react";
import {
  StatusBar,
  StyleSheet,
  View,
  Image,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { buttonColour, colour, textColour } from "@/constants/theme";
import Button from "@/constants/elements/Button";
import Typo from "@/components/Typo";

const Welcome = () => {
  const router = useRouter();

  function handleClick() {
    router.push("/login");
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar animated backgroundColor={colour.primary_background} barStyle="dark-content" />

      <View style={styles.content}>
      <Image
          source={{ uri: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80" }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={styles.buttonContainer}>
      <Typo
          size={16}
          fontWeight="400"
          styles={styles.subtitle}
          color={textColour.secondary}
        >
          Your personalized revision reminder app to stay organized and on track!
        </Typo>
        <Button
          label="Login / Register"
          onPress={handleClick}
          containerStyle={styles.button}
          textStyle={{ color: "#fff", fontWeight: "700" }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colour.primary_background,
    justifyContent: "space-between",
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 26,
    width: 320,
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 16,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  button: {
    backgroundColor: buttonColour.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
});
