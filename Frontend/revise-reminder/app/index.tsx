import { StyleSheet, Text, View, Image, StatusBar } from "react-native";
import React, { useEffect } from "react";
import { colour } from "@/constants/theme";
import { useRouter } from "expo-router";

const index = () => {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      router.replace("/welcome");
    }, 2000);
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar animated={true} backgroundColor={colour.primary_background} />
      <Image
        style={styles.image}
        source={require("../assets/images/splash-screen.png")}
      />
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colour.primary_background,
  },
  app_title: {
    color: colour.primary_text,
  },
  image: {
    height: 150,
    width: 150,
    borderRadius: 10,
  },
});
