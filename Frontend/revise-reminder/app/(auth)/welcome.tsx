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
import { buttonColour, colour, textColour } from "@/constants/theme";
import Navbar from "@/constants/elements/Navigation";
import { scale, verticalScale } from "@/utils/styling";
import Typo from "@/components/Typo";

const welcome = () => {
  const router = useRouter();
  function handleClick() {
    router.push("/login_register");
  }
  return (
    <View>
      <StatusBar animated={true} backgroundColor={colour.primary_background} />
      <Typo size={34} children="Welcome" fontWeight="800" textProps={{}} styles={{}} color={textColour.primary}/>
      <Button onPress={handleClick} title="LOGIN/REGISTER" color={buttonColour.primary} />
    </View>
  );
};

export default welcome;

const styles = StyleSheet.create({});
