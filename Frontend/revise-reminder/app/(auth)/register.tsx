import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { buttonColour, colour, textColour } from "@/constants/theme";
import Button from "@/constants/elements/Button";
import { router } from "expo-router";
import Typo from "@/components/Typo";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { MaterialIcons } from "@expo/vector-icons";

WebBrowser.maybeCompleteAuthSession(); // required for Expo

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "1083520038454-mhfvi03frd3hgfbjhrc1ruaqvjk380b4.apps.googleusercontent.com",
    webClientId:
      "1083520038454-slq34bl29ale5oiqc05t7t9ko9tivau4.apps.googleusercontent.com",
  });

  useEffect(() => {
    const handleGoogleRegister = async () => {
      if (response?.type === "success") {
        const { authentication } = response;
        console.log(authentication, " hello");

        try {
          const registerResponse = await fetch(
            "https://revision-reeminder.onrender.com/api/auth/googleRegister",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ accessToken: authentication.accessToken }),
            }
          );

          const data = await registerResponse.json();

          if (registerResponse.ok) {
            console.log("register success:", data);
            await AsyncStorage.setItem("uid", data.token);
            router.push("/(home)/home");
          } else {
            setError(data.message);
            console.error("Login failed:", data.message);
            Alert.alert("Login Failed", data.message || "Please try again.");
          }
        } catch (error) {
          console.error("Error during login:", error);
          Alert.alert("Error", "Something went wrong. Please try again.");
        }
      }
    };

    handleGoogleRegister();
  }, [response]);

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
    setLoading(true);
    try {
      const response = await fetch(
        "https://revision-reeminder.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: name, email, password }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        console.log("Registration success:", data);
        // Optionally save token here:
        await AsyncStorage.setItem("uid", data.token);
        // Navigate to home page
        router.push("/(home)/home");
      } else {
        setError(data.message);
        console.error("Registration failed:", data.message);
        Alert.alert("Registration Failed", data.message || "Please try again.");
      }
    } catch (error) {
      setError(error);
      console.error("Error during registration:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
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
              Create Account ✨
            </Typo>

            <Typo
              size={16}
              fontWeight="300"
              styles={styles.headerText}
              color={textColour.secondary}
            >
              Sign up to get started with your personalized revision reminders
              and stay on track with your learning goals.
            </Typo>
          </View>

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
          {error && (
            <View style={styles.errorContainer}>
              <MaterialIcons
                name="warning"
                size={14}
                color={textColour.danger}
                style={styles.icon}
              />
              <Typo
                size={8}
                fontWeight="400"
                textProps={{}}
                styles={{}}
                color={textColour.danger}
              >
                {error}
              </Typo>
            </View>
          )}

          {loading ? (
            <Button
              label={<ActivityIndicator size="small" color="#fff" />}
              onPress={() => {}}
              containerStyle={styles.button}
              textStyle={{ color: colour.primary_text, fontWeight: "700" }}
            />
          ) : (
            <Button
              label="Register"
              onPress={handleAuthorized}
              containerStyle={styles.button}
              textStyle={{ color: "#fff" }}
              disabled={!email || !password || !name}
            />
          )}
          <View style={styles.googlebuttonContainer}>
            <Pressable
              onPress={() => promptAsync()}
              style={styles.googleButton}
            >
              <View style={styles.iconWrapper}>
                <Image
                  source={{
                    uri: "https://image.similarpng.com/file/similarpng/original-picture/2020/06/Logo-google-icon-PNG.png",
                  }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
              <Typo
                size={12}
                fontWeight="400"
                styles={styles.googleText}
                color={textColour.secondary}
              >
                Sign Up with Google
              </Typo>
            </Pressable>
          </View>

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
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    marginRight: 4,
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
    marginTop: 16,
  },
  googlebuttonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  googleButton: {
    maxWidth: 500,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    elevation: 2, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  iconWrapper: {
    marginRight: 12,
  },
  googleText: {
    // You can customize font family or weight here if needed
  },
  image: {
    height: 30,
    width: 30,
  },
});
