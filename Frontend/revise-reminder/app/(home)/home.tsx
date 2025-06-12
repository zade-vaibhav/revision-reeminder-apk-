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
import { colour } from "@/constants/theme";
import { Url } from "@/utils/baseUrls";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error,setError] = useState({createError:""})
  const [showMenuIndex, setShowMenuIndex] = useState(null);
  const [form, setForm] = useState({
    title: "",
    discreption: "",
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
        discription: form.discreption, // consider fixing typo: "description"
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError({createError:data.message})
      return;
    }

    // Success
    setForm({ title: "", date: new Date(), discreption: "" });
    setShowModal(false);
  } catch (error) {
    console.error("Error adding reminder:", error);
    Alert.alert("Error", "Something went wrong. Please try again.");
  }
};


  const handleCancelTask = () => {
    setForm({ title: "", date: new Date() });
    setError({})
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
        }
      });

      const data = await response.json();
      if (response.ok) {
        console.log(data)
        setTasks(data)
      } else {
        Alert.alert(data.message)
      }
    } catch (error) {
      console.error("Error getting reminder :", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
   getReminders()
  },[])

  const handleDelete = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
    setShowMenuIndex(null);
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
      <Text style={styles.taskTitle}>{item.title}</Text>
      <TouchableOpacity
        onPress={() =>
          setShowMenuIndex(showMenuIndex === index ? null : index)
        }
      >
        <Entypo name="dots-three-vertical" size={18} color="black" />
      </TouchableOpacity>

      {showMenuIndex === index && (
        <View style={styles.menu}>
          <TouchableOpacity>
            <Text style={styles.menuText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
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
              value={form.discreption}
              onChangeText={(text) => setForm({ ...form, discreption: text })}
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

            <TouchableOpacity style={styles.saveButton} onPress={handleAddTask}>
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Save</Text>
            </TouchableOpacity>
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
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    position: "relative",
  },
  taskTitle: {
    fontSize: 16,
  },
  menu: {
    position: "absolute",
    top: 40,
    right: 10,
    backgroundColor: "#fff",
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
    backgroundColor: "#007bff",
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
  errorText:{
    color :"#FF0000",
    padding:10,
  }
});
