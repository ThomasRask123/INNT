import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useEffect, useState } from "react";
import { getDatabase, ref, push, update } from "firebase/database";
import RNPickerSelect from "react-native-picker-select";

const statusOptions = [
  { label: "Ikke startet", value: "not_started" },
  { label: "I gang", value: "in_progress" },
  { label: "Afsluttet", value: "completed" },
];

function Add_edit_task({ navigation, route }) {
  const db = getDatabase();

  const initialState = {
    taskDescription: "",
    assignee: "",
    timeOfExecution: "", 
    aproxTimeForTask: "", 
    status: "", 
  };

  const [newTask, setNewTask] = useState(initialState);

  const isEditTask = route.name === "Edit Task";

  useEffect(() => {
    if (isEditTask) {
      const task = route.params.task[1];
      setNewTask(task);
    }

    return () => {
      setNewTask(initialState);
    };
  }, []);

  const changeTextInput = (name, event) => {
    setNewTask({ ...newTask, [name]: event });
  };

  const handleSave = async () => {
    const {
      taskDescription,
      assignee,
      timeOfExecution,
      aproxTimeForTask,
      status,
    } = newTask;

    if (
      taskDescription.length === 0 ||
      assignee.length === 0 ||
      timeOfExecution.length === 0 ||
      aproxTimeForTask.length === 0 ||
      status.length === 0
    ) {
      return Alert.alert("Et af felterne er tomme!");
    }

    if (isEditTask) {
      const id = route.params.task[0];
      const taskRef = ref(db, `Tasks/${id}`);
      const updatedFields = {
        taskDescription,
        assignee,
        timeOfExecution,
        aproxTimeForTask,
        status,
      };

      await update(taskRef, updatedFields)
        .then(() => {
          Alert.alert("Din info er nu opdateret");
          const task = newTask;
          navigation.navigate("Hustandens opgaver", { task });
        })
        .catch((error) => {
          console.error(`Error: ${error.message}`);
        });
    } else {
      const tasksRef = ref(db, "/Tasks/");
      const newTaskData = {
        taskDescription,
        assignee,
        timeOfExecution,
        aproxTimeForTask,
        status,
      };

      await push(tasksRef, newTaskData)
        .then(() => {
          Alert.alert("Saved");
          setNewTask(initialState);
        })
        .catch((error) => {
          console.error(`Error: ${error.message}`);
        });
    }
  };

  // Tidspunkter til scrolle-menuen
  const timeOptions = [
    { label: "00:00", value: "00:00" },
    { label: "01:00", value: "01:00" },
    { label: "02:00", value: "02:00" },
    { label: "03:00", value: "03:00" },
    { label: "04:00", value: "04:00" },
    { label: "05:00", value: "05:00" },
    { label: "06:00", value: "06:00" },
    { label: "07:00", value: "07:00" },
    { label: "08:00", value: "08:00" },
    { label: "09:00", value: "09:00" },
    { label: "10:00", value: "10:00" },
    { label: "11:00", value: "11:00" },
    { label: "12:00", value: "12:00" },
    { label: "13:00", value: "13:00" },
    { label: "14:00", value: "14:00" },
    { label: "15:00", value: "15:00" },
    { label: "16:00", value: "16:00" },
    { label: "17:00", value: "17:00" },
    { label: "18:00", value: "18:00" },
    { label: "19:00", value: "19:00" },
    { label: "20:00", value: "20:00" },
    { label: "21:00", value: "21:00" },
    { label: "22:00", value: "22:00" },
    { label: "23:00", value: "23:00" },
    { label: "24:00", value: "24:00" },
  ];

  // Forventet tid til scrolle-menuen
  const aproxTimeOptions = [
    { label: "30 minutter", value: "30" },
    { label: "1 time", value: "60" },
    { label: "1,5 time", value: "90" },
    { label: "2 timer", value: "120" },
    { label: "2,5 timer", value: "150" },
    { label: "3 timer", value: "180" },
    { label: "3,5 timer", value: "210" },
    { label: "4 timer", value: "240" },
    { label: "4,5 timer", value: "270" },
    { label: "5 timer", value: "300" },
    { label: "5,5 timer", value: "330" },
    { label: "6 timer", value: "360" },
    { label: "6,5 timer", value: "390" },
    { label: "7 timer", value: "420" },
    { label: "7,5 timer", value: "450" },
    { label: "8 timer", value: "480" },
    { label: "8,5 timer", value: "510" },
    { label: "9 timer", value: "540" },
    { label: "9,5 timer", value: "570" },
    { label: "10 timer", value: "600" },
    { label: "10,5 timer", value: "630" },
    { label: "11 timer", value: "660" },
    { label: "11,5 timer", value: "690" },
    { label: "12 timer", value: "720" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>
          {isEditTask ? "Rediger Opgave" : "Tilføj Ny Opgave"}
        </Text>

        {/* Opgavebeskrivelse */}
        <View style={styles.row}>
          <Text style={styles.label}>Opgave beskrivelse</Text>
          <TextInput
            value={newTask.taskDescription}
            onChangeText={(event) => changeTextInput("taskDescription", event)}
            placeholder="Indtast opgave beskrivelse"
            style={styles.input}
          />
        </View>

        {/* Tildelt person */}
        <View style={styles.row}>
          <Text style={styles.label}>Tildelt person</Text>
          <TextInput
            value={newTask.assignee}
            onChangeText={(event) => changeTextInput("assignee", event)}
            placeholder="Indtast tildelt person"
            style={styles.input}
          />
        </View>

        {/* Tidspunkt for udførelse (scroll menu) */}
        <View style={styles.row}>
          <Text style={styles.label}>Tidspunkt for udførelse</Text>
          <RNPickerSelect
            onValueChange={(value) => changeTextInput("timeOfExecution", value)}
            items={timeOptions}
            placeholder={{ label: "Vælg tidspunkt", value: null }}
            style={pickerSelectStyles}
            value={newTask.timeOfExecution}
          />
        </View>

        {/* Forventet tid for opgave (scroll menu) */}
        <View style={styles.row}>
          <Text style={styles.label}>Forventet tid for opgave</Text>
          <RNPickerSelect
            onValueChange={(value) =>
              changeTextInput("aproxTimeForTask", value)
            }
            items={aproxTimeOptions}
            placeholder={{ label: "Vælg forventet tid", value: null }}
            style={pickerSelectStyles}
            value={newTask.aproxTimeForTask}
          />
        </View>

        {/* Status (scroll menu) */}
        <View style={styles.row}>
          <Text style={styles.label}>Status</Text>
          <RNPickerSelect
            onValueChange={(value) => changeTextInput("status", value)}
            items={statusOptions}
            placeholder={{ label: "Vælg status", value: null }}
            style={pickerSelectStyles}
            value={newTask.status} // Bind statusværdi til picker
          />
        </View>

        {/* Gem ændringer / Tilføj opgave knap */}
        <Button
          title={isEditTask ? "Gem ændringer" : "Tilføj opgave"}
          onPress={() => handleSave()}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

export default Add_edit_task;

// Tilpasning af stil til picker-select
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    color: "black",
    paddingRight: 30, // Til plads til dropdown-pil
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "gray",
    borderRadius: 5,
    color: "black",
    paddingRight: 30, // Til plads til dropdown-pil
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  row: {
    marginVertical: 15,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
});
