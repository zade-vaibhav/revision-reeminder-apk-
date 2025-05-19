import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const Navbar = ({
  title = "Page Title",
  showBack = true,
  style = {},
  textStyle = {},
}) => {
  const navigation = useNavigation();

  return (
    <View style={[styles.navbar, style]}>
      <View style={styles.sideContainer}>
        {showBack && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.centerContainer}>
        <Text style={[styles.title, textStyle]} numberOfLines={1}>
          {title}
        </Text>
      </View>

      <View style={styles.sideContainer}>
        {/* Placeholder to center the title */}
      </View>
    </View>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    justifyContent: "space-between",
  },
  sideContainer: {
    width: 40, // ensures symmetry
    alignItems: "flex-start",
  },
  backButton: {
    padding: 4,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
});
