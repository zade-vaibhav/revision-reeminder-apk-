import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Image,
  StatusBar,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { colour, fontSize, textColour } from "@/constants/theme";
import { Url } from "@/utils/baseUrls";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState({ createError: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditionId] = useState();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showMenuIndex, setShowMenuIndex] = useState(null);
  const [form, setForm] = useState({
    title: "",
    discription: "",
    date: new Date(),
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleAddTask = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("uid");

      if (!token) {
        router.replace("/(auth)/login");
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${Url}/api/reminders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.title,
          datetime: form.date,
          discription: form.discription, // consider fixing typo: "description"
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError({ createError: data.message });
        return;
      }

      // Success
      setForm({ title: "", date: new Date(), discription: "" });
      getReminders();
      setShowModal(false);
    } catch (error) {
      console.error("Error adding reminder:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelTask = () => {
    setForm({ title: "", date: new Date() });
    setError({});
    setIsEditing(false);
    setShowModal(false);
    setShowMenuIndex(null);
  };

  // const pickImage = async () => {
  //   const result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     quality: 1,
  //   });

  //   if (!result.canceled) {
  //     setForm({ ...form, image: result.assets[0].uri });
  //   }
  // };

  const getReminders = async () => {
    const token = await AsyncStorage.getItem("uid");
    if (!token) {
      router.replace("/(auth)/login");
      return;
    }
    try {
      const response = await fetch(`${Url}/api/reminders`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setTasks(data);
      } else {
        Alert.alert(data.message);
      }
    } catch (error) {
      console.error("Error getting reminder :", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    getReminders();
  }, []);

  const handleDelete = async (id) => {
    setIsDeleting(true);
    try {
      const token = await AsyncStorage.getItem("uid");

      if (!token) {
        router.replace("/(auth)/login");
        setIsDeleting(false);
        return;
      }

      const response = await fetch(
        `${Url}/api/reminders/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", data.message || "Failed to delete reminder.");
        return;
      }

      // On success
      getReminders(); // Refresh the list
      setShowMenuIndex(null);
    } catch (error) {
      console.error("Error deleting reminder:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setEditionId(item._id);
    setForm({
      title: item.title,
      date: new Date(item.datetime),
      discription: item.discription,
    });
    setShowModal(true);
  };

  const handleUpdateTask = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("uid");
      if (!token) {
        router.replace("/(auth)/login");
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        `${Url}/api/reminders/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: form.title,
            datetime: form.date,
            discription: form.discription, // consider fixing typo: "description"
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", data.message || "Failed to edit reminder.");
        setIsLoading(false);
        return;
      }

      // On success
      setForm({ title: "", date: new Date(), discription: "" });
      getReminders();
      setShowModal(false);
      setShowMenuIndex(null);
    } catch (error) {
      console.error("Error editing reminder:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        animated
        backgroundColor={colour.primary_background}
        barStyle="light-content"
      />
      <ScrollView>
        {tasks.map((item, index) => (
          <View
            key={item._id || index}
            style={[
              styles.taskItem,
              { zIndex: showMenuIndex === index ? 100 : 0 },
            ]}
          >
            <View style={styles.textContainer}>
              <Text style={styles.taskTitle}>{item.title}</Text>
              <Text
                style={styles.taskDiscription}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {item.discription}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() =>
                setShowMenuIndex(showMenuIndex === index ? null : index)
              }
            >
              <Entypo name="dots-three-vertical" size={18} color="black" />
            </TouchableOpacity>

            {showMenuIndex === index && (
              <View style={styles.menu}>
                {/* ❌ Close Button */}
                <TouchableOpacity
                  onPress={() => setShowMenuIndex(null)}
                  style={styles.closeButton}
                >
                  <Text style={{ fontSize: fontSize.base, fontWeight: "bold" }}>
                    ✖
                  </Text>
                </TouchableOpacity>

                {/* Menu Options */}
                <TouchableOpacity
                  onPress={() => handleEdit(item)}
                  style={styles.menuItem}
                >
                  <Text style={styles.menuText}>✏️ Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(item._id)}
                  style={styles.menuItem}
                >
                  {isDeleting ? (
                    <ActivityIndicator size="small" color={colour.primary_background} />
                  ) : (
                    <Text style={[styles.menuText, { color: "red" }]}>
                      🗑 Delete
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowModal(true)}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Modal Form */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Add Reminder</Text>
            <TextInput
              placeholder="Title"
              style={styles.input}
              value={form.title}
              onChangeText={(text) => setForm({ ...form, title: text })}
            />
            <TextInput
              placeholder="Discription"
              style={styles.input}
              multiline={true}
              numberOfLines={5}
              value={form.discription}
              onChangeText={(text) => setForm({ ...form, discription: text })}
            />

            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.dateButton}
            >
              <Text style={{ color: "#000" }}>{form.date.toDateString()}</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={form.date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setForm({ ...form, date: selectedDate });
                  }
                }}
              />
            )}
            <Text style={styles.errorText}>{error.createError}</Text>
            {/* 
            <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
              <Text style={{ color: "#000" }}>
                {form.image ? "Change Image" : "Pick Image"}
              </Text>
            </TouchableOpacity> */}

            {/* {form.image && (
              <Image source={{ uri: form.image }} style={styles.imagePreview} />
            )} */}

            {isEditing ? (
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleUpdateTask}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    Update
                  </Text>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleAddTask}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    Save
                  </Text>
                )}
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelTask}
              disabled={isLoading}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Home;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  taskItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginBottom: 10,
    backgroundColor: colour.secondary_background,
    borderRadius: 10,
    position: "relative",
  },
  textContainer: {
    flexDirection: "column",
  },
  taskTitle: {
    fontSize: fontSize.primary,
    color: textColour.primary,
  },
  taskDiscription: {
    fontSize: fontSize.base,
    color: textColour.secondary,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: colour.primary_background,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(23, 21, 21, 0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: colour.secondary_background,
    borderRadius: 10,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: colour.light_grey,
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  dateButton: {
    padding: 10,
    backgroundColor: colour.border,
    borderRadius: 6,
    marginBottom: 10,
  },
  imageButton: {
    padding: 10,
    backgroundColor: "#e6e6e6",
    borderRadius: 6,
    marginBottom: 10,
  },
  imagePreview: {
    width: "100%",
    height: 150,
    borderRadius: 6,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: textColour.success,
    padding: 12,
    alignItems: "center",
    borderRadius: 6,
    marginBottom: 5,
  },
  cancelButton: {
    backgroundColor: textColour.danger,
    padding: 12,
    alignItems: "center",
    borderRadius: 6,
  },
  errorText: {
    color: textColour.danger,
    padding: 10,
  },
  menu: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#fff",
    paddingVertical: 8,
    borderRadius: 8,
    elevation: 5, // for Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 10,
    minWidth: 120,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: colour.border,
  },
  menuText: {
    fontSize: fontSize.base,
    color: "#333",
  },
  closeButton: {
    position: "absolute",
    top: 4,
    right: 6,
    zIndex: 1,
    padding: 4,
  },
});
