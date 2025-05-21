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
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession(); // required for Expo

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "1083520038454-mhfvi03frd3hgfbjhrc1ruaqvjk380b4.apps.googleusercontent.com",
    webClientId:
      "1083520038454-slq34bl29ale5oiqc05t7t9ko9tivau4.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      console.log(authentication, " hello");
      // Exchange token or get user info
      fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${authentication.accessToken}` },
      })
        .then((res) => res.json())
        .then(async (user) => {
          console.log("Google user:", user);

          const userData = {
            name: user.name,
            email: user.email,
            googleId: user.id,
          };

          // Store locally
          await AsyncStorage.setItem("user", JSON.stringify(userData));

          // Navigate to home
          router.push("/(home)/home");
        });
    }
  }, [response]);

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

  const handleAuthorized = async () => {
    console.log("Login clicked");
    const response = await fetch(
      "https://revision-reeminder.onrender.com/api/auth/login",
      {
        body: JSON.stringify({ email, password }),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    await AsyncStorage.setItem("uid", data.token);
    console.log(data);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.inner}
        >
          <View style={styles.headderContainer}>
            <Typo
              size={20}
              fontWeight="600"
              styles={styles.headerText}
              color={textColour.primary}
            >
              Welcome Back 👋
            </Typo>

            <Typo
              size={16}
              fontWeight="300"
              styles={styles.headerText}
              color={textColour.secondary}
            >
              Please login to access your personalized revision reminders.
            </Typo>
          </View>

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
            <Pressable
            onPress={() => promptAsync()}
            // disabled={!request
            style={styles.googleButton}
          >
            <Typo
              size={18}
              fontWeight="300"
              styles={styles.headerText}
              color={textColour.secondary}
            >
              Sign in with Google
            </Typo>
          </Pressable>

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
  headderContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  headerText: {
    marginBottom: 24,
    textAlign: "left",
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
  googleButton: {
    backgroundColor: "#4285F4",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
});
