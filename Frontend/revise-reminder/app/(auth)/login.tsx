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
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

WebBrowser.maybeCompleteAuthSession(); // required for Expo

const Login = () => {
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
            "https://revision-reeminder.onrender.com/api/auth/googleLogin",
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
            console.log("login success:", data);
            await AsyncStorage.setItem("uid", data.token);
            router.push("/(home)/home");
          } else {
            setError(data.message);
            console.error("Login failed:", data.message);
            Alert.alert("Login Failed", data.message || "Please try again.");
          }
        } catch (error) {
          setError(error);
          console.error("Error during login:", error);
          Alert.alert("Error", "Something went wrong. Please try again.");
        }
      }
    };

    handleGoogleRegister();
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
    setLoading(true);
    try {
      const response = await fetch(
        "https://revision-reeminder.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setLoading(false);
        await AsyncStorage.setItem("uid", data.token);
        console.log("Login success:", data);
        router.push("/(home)/home");
      } else {
        setLoading(false);
        setError(data.message);
        console.error("Login failed:", data.message);
        Alert.alert(
          "Login Failed",
          data.message || "Please check your credentials."
        );
      }
    } catch (error) {
      setError(error)
      console.error("Error during login:", error);
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

          {error && (
            <View style={styles.errorContainer}>
              <MaterialIcons
                name="warning"
                size={14}
                color={textColour.danger}
                style={styles.icon}
              />
              <Typo
                size={10}
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
              label="Login"
              onPress={handleAuthorized}
              containerStyle={styles.button}
              textStyle={{ color: "#fff" }}
              disabled={!email || !password}
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
                Sign in with Google
              </Typo>
            </Pressable>
          </View>

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
