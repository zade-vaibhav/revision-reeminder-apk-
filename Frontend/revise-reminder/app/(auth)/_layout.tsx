import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <Stack screenOptions={{
      headerShown:false
    }}>
      <Stack.Screen
        name="welcome"
        options={{ title: "welcome", headerShown: false }}
      />
      <Stack.Screen
        name="login"
        options={{ title: "Login", headerShown: false }}
      />
      <Stack.Screen
        name="register"
        options={{ title: "Register", headerShown: false }}
      />
    </Stack>
  );
}
