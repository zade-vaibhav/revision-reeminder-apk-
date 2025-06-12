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
  const [isEditing, setIsEditing] = useState(false)
  const [showMenuIndex, setShowMenuIndex] = useState(null);
  const [form, setForm] = useState({
    title: "",
    discription: "",
    date: new Date(),
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleAddTask = async () => {
    try {
      const token = await AsyncStorage.getItem("uid");

      if (!token) {
        router.replace("/(auth)/login");
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
    }
  };

  const handleCancelTask = () => {
    setForm({ title: "", date: new Date() });
    setError({});
    setIsEditing(false)
    setShowModal(false);
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
        console.log(data);
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
  try {
    const token = await AsyncStorage.getItem("uid");

    if (!token) {
      router.replace("/(auth)/login");
      return;
    }

    const response = await fetch(`http://localhost:5000/api/reminders/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      Alert.alert("Error", data.message || "Failed to delete reminder.");
      return;
    }

    // On success
    getReminders(); // Refresh the list
  } catch (error) {
    console.error("Error deleting reminder:", error);
    Alert.alert("Error", "Something went wrong. Please try again.");
  }
};


  const handleEdit = (item) => {
   setIsEditing(true)
   setForm({
          title: item.title,
          date: new Date(item.datetime),
          discription: item.discription,
        })
        setShowModal(true)

  };

  const handleUpdateTask = async () => {
    return;
    try {
      const token = await AsyncStorage.getItem("uid");

      if (!token) {
        router.replace("/(auth)/login");
        return;
      }

      const response = await fetch(`${Url}/api/reminders`, {
        method: "PATCH",
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
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        animated
        backgroundColor={colour.primary_background}
        barStyle="light-content"
      />
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.taskItem}>
            <View style={styles.textContainer}>
              <Text style={styles.taskTitle}>{item.title}</Text>
              <Text
                style={styles.taskDiscription}
                numberOfLines={2} // or 1 for a single-line ellipsis
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
                <TouchableOpacity onPress={() => handleEdit(item)}>
                  <Text style={styles.menuText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item._id)}>
                  <Text style={styles.menuText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />

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

            {isEditing ?<TouchableOpacity style={styles.saveButton} onPress={handleUpdateTask}>
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Update</Text>
            </TouchableOpacity> : <TouchableOpacity style={styles.saveButton} onPress={handleAddTask}>
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Save</Text>
            </TouchableOpacity>}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelTask}
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
  menu: {
    position: "absolute",
    top: 40,
    right: 10,
    backgroundColor: "#",
    padding: 10,
    borderRadius: 6,
    elevation: 4,
    zIndex: 99,
  },
  menuText: {
    fontSize: 14,
    paddingVertical: 4,
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
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  dateButton: {
    padding: 10,
    backgroundColor: "#e6e6e6",
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
    backgroundColor: "#007bff",
    padding: 12,
    alignItems: "center",
    borderRadius: 6,
    marginBottom: 5,
  },
  cancelButton: {
    backgroundColor: "#FF0000",
    padding: 12,
    alignItems: "center",
    borderRadius: 6,
  },
  errorText: {
    color: "#FF0000",
    padding: 10,
  },
});
