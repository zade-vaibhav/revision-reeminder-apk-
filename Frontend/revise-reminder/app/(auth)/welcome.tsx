import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Button,
} from "react-native";
import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { buttonColour, colour } from "@/constants/theme";

const welcome = () => {
  const router = useRouter();
  function handleClick() {
    router.push("/login_register");
  }
  return (
    <View>
      <StatusBar animated={true} backgroundColor={colour.primary_background} />
      <Text>welcome</Text>
      <Button onPress={handleClick} title="LOGIN/REGISTER" color={buttonColour.primary} />
    </View>
  );
};

export default welcome;

const styles = StyleSheet.create({});
