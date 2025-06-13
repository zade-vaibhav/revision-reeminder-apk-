import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = () => {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  async function getUser() {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("uid");
      if (!token) {
        router.replace("/(auth)/login");
        setIsLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:5000/api/user`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", data.message || "Failed to get User.");
        setIsLoading(false);
        return;
      }
      setUser(data);
    } catch (error) {
      console.error("Error getting user:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Top Section: Profile Info */}
      <View style={styles.profileSection}>
        <Image
          source={{
            uri:
              user.avatar ||
              "https://icons.veryicon.com/png/o/miscellaneous/material_icons_for_project/profile-41.png",
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user?.username}</Text>
        <View style={styles.emailRow}>
          <Text style={styles.email}>{user?.email}</Text>
          {user?.email_verified ? (
            <Ionicons
              name="checkmark-circle"
              size={18}
              color="#1E90FF" // blue for verified
              style={styles.verifiedIcon}
            />
          ) : (
            <Ionicons
              name="close-circle"
              size={18}
              color="gray" // or red for unverified
              style={styles.verifiedIcon}
            />
          )}
        </View>
      </View>

      {/* Bottom Section: Menu Buttons */}
      <View style={styles.menuSection}>
        <MenuItem icon="settings" label="Settings" />
        <MenuItem icon="info" label="About" />
        <MenuItem icon="help-circle" label="Help & Support" />
        <MenuItem icon="log-out" label="Logout" color="red" />
      </View>
    </ScrollView>
  );
};

const MenuItem = ({ icon, label, color = "#000" }) => (
  <TouchableOpacity style={styles.menuItem}>
    <Feather name={icon} size={20} color={color} />
    <Text style={[styles.menuLabel, { color }]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#f0f0f0",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  email: {
    fontSize: 14,
    color: "#777",
  },
  menuSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  menuLabel: {
    marginLeft: 15,
    fontSize: 16,
  },
  emailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  verifiedIcon: {
    marginLeft: 5,
  },
});

export default Profile;
