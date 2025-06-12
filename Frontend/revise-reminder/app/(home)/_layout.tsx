import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colour } from "@/constants/theme";

const _layout = () => {
  return (
    <Tabs>
      <Tabs.Screen
  name="home"
  options={{
    title: "Home",
    tabBarLabelStyle: { fontSize: 12, color: '#fff' },
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="home" size={size} color={color} />
    ),
    tabBarActiveTintColor: "#1E90FF",  // Active tab color
    tabBarInactiveTintColor: "#888",   // Inactive tab color
    tabBarStyle: {
      backgroundColor: colour.primary_background,      // Tab bar background
      borderTopWidth: 0,
    },
    headerStyle: {
      backgroundColor: colour.primary_background,      // Header background
    },
    headerTitleStyle: {
      color: colour.primary_text,                   // Header text color
    },
  }}
/>

    </Tabs>
  );
};

export default _layout;

const styles = StyleSheet.create({});
