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
        name="login_register"
        options={{ title: "Login/Register", headerShown: false }}
      />
    </Stack>
  );
}
