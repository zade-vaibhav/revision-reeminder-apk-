import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { buttonColour, textColour } from "@/constants/theme";
import Button from "@/constants/elements/Button";
import { router } from "expo-router";
import Typo from "@/components/Typo";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Load saved credentials from AsyncStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        const stored = await AsyncStorage.getItem("login");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.email) setEmail(parsed.email);
          if (parsed.password) setPassword(parsed.password);
        }
      } catch (error) {
        console.error("Error loading saved credentials", error);
      }
    };
    loadData();
  }, []);

  // Debounced save to AsyncStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      const saveData = async () => {
        try {
          await AsyncStorage.setItem(
            "login",
            JSON.stringify({ email, password })
          );
        } catch (error) {
          console.error("Error saving credentials", error);
        }
      };
      saveData();
    }, 500);
    return () => clearTimeout(timer);
  }, [email, password]);

  const handleAuthorized = () => {
    console.log("Login clicked");
    router.push("/(home)/home");
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.inner}
        >
          <Typo
            size={20}
            fontWeight="600"
            styles={styles.headerText}
            color={textColour.primary}
          >
            Welcome Back 👋
          </Typo>

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
            label="Login"
            onPress={handleAuthorized}
            containerStyle={styles.button}
            textStyle={{ color: "#fff" }}
            disabled={!email || !password}
          />

          <View style={styles.footerContainer}>
            <Typo
              size={12}
              fontWeight="400"
              styles={{}}
              textProps={{}}
              color={textColour.secondary}
            >
              New to the app?
            </Typo>
            <Pressable onPress={() => router.push("/(auth)/register")}>
              <Typo
                size={12}
                fontWeight="600"
                styles={{ marginLeft: 6 }}
                color={textColour.primary}
                 textProps={{}}
              >
                Sign Up
              </Typo>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  headerText: {
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: buttonColour.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
});
