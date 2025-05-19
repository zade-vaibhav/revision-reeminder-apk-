import React, { useEffect, useState } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { buttonColour, colour, textColour } from "@/constants/theme";
import Button from "@/constants/elements/Button";

const LoginRegister = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Load saved email from AsyncStorage
  useEffect(() => {
    const loadEmail = async () => {
      const savedEmail = await AsyncStorage.getItem("email");
      if (savedEmail) setEmail(savedEmail);
    };
    loadEmail();
  }, []);

  //debounce email autosave
  useEffect(() => {
    let timer = setTimeout(async () => {
      await AsyncStorage.setItem("email", email);
    }, 500);

    return () => clearTimeout(timer);
  }, [email]);

  //handle login/register
  async function handleAuthrized() {
    console.log("clicked");
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
          secureTextEntry
        />
        <Button
          label="login/register"
          onPress={() => handleAuthrized()}
          containerStyle={{ backgroundColor: buttonColour.primary }}
          textStyle={{ text: textColour.primary }}
          disabled={!email || !password}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default LoginRegister;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  input: {
    height: 50,
    margin: 12,
    borderWidth: 0.5,
    borderRadius: 6,
    paddingHorizontal: 10,
  },
  button: {
    height: 40,
    width: 100,
    backgroundColor: buttonColour.primary,
  },
});
