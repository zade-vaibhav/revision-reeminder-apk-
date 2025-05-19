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

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Load saved data from AsyncStorage
  useEffect(() => {
    const loadRegisterData = async () => {
      try {
        const stored = await AsyncStorage.getItem("register");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.email) setEmail(parsed.email);
          if (parsed.name) setName(parsed.name);
        }
      } catch (error) {
        console.error("Failed to load register data:", error);
      }
    };

    loadRegisterData();
  }, []);

  // Debounce save
  useEffect(() => {
    const timer = setTimeout(() => {
      const saveData = async () => {
        try {
          const registerData = { email, name };
          await AsyncStorage.setItem("register", JSON.stringify(registerData));
          console.log("Saved to AsyncStorage:", registerData);
        } catch (err) {
          console.error("Error saving to AsyncStorage:", err);
        }
      };
      saveData();
    }, 500);

    return () => clearTimeout(timer);
  }, [email, name]);

  const handleAuthorized = async () => {
    console.log("clicked");
    // router.push("/(home)/home");

    const response = await fetch(
      "https://revision-reeminder.onrender.com/api/auth/register",
      {
        body: JSON.stringify({ name, email, password }),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    console.log(data);
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
            textProps={{}}
            fontWeight="600"
            styles={styles.headerText}
            color={textColour.primary}
          >
            Create Account ✨
          </Typo>

          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Username"
            autoCapitalize="words"
          />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
          />

          <Button
            label="Register"
            onPress={handleAuthorized}
            containerStyle={styles.button}
            textStyle={{ color: "#fff" }}
            disabled={!email || !password || !name}
          />

          <View style={styles.footerContainer}>
            <Typo
              size={12}
              fontWeight="400"
              textProps={{}}
              styles={{}}
              color={textColour.secondary}
            >
              Already have an account?
            </Typo>
            <Pressable onPress={() => router.push("/(auth)/login")}>
              <Typo
                size={12}
                fontWeight="600"
                textProps={{}}
                styles={{ marginLeft: 6 }}
                color={textColour.primary}
              >
                Sign In
              </Typo>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Register;

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
