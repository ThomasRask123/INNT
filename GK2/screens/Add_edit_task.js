import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TextInput,
  Button,
  Alert,
  ScrollView,
  SafeAreaView,
  Image,
  View,
  Text,
} from "react-native";
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
    photoUri: null,
  };

  const [newTask, setNewTask] = useState(initialState);

  const isEditTask = route.name === "Edit Task";

  useEffect(() => {
    if (isEditTask && route.params?.task) {
      const task = route.params.task[1];
      setNewTask(task);
    }
    if (route.params?.photoUri) {
      setNewTask((prevTask) => ({ ...prevTask, photoUri: route.params.photoUri }));
    }
  }, [isEditTask, route.params]);

  const handleSave = async () => {
    if (isEditTask && route.params?.task) {
      const taskId = route.params.task[0];
      update(ref(db, `Tasks/${taskId}`), newTask)
        .then(() => {
          Alert.alert("Success", "Task updated successfully");
          navigation.goBack();
        })
        .catch((error) => {
          console.error(`Error: ${error.message}`);
        });
    } else {
      const tasksRef = ref(db, "/Tasks/");
      const newTaskData = {
        taskDescription: newTask.taskDescription,
        assignee: newTask.assignee,
        timeOfExecution: newTask.timeOfExecution,
        aproxTimeForTask: newTask.aproxTimeForTask,
        status: newTask.status,
        photoUri: newTask.photoUri,
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
            onChangeText={(event) => setNewTask({ ...newTask, taskDescription: event })}
            placeholder="Indtast opgave beskrivelse"
            style={styles.input}
          />
        </View>

        {/* Tildelt person */}
        <View style={styles.row}>
          <Text style={styles.label}>Tildelt person</Text>
          <TextInput
            value={newTask.assignee}
            onChangeText={(event) => setNewTask({ ...newTask, assignee: event })}
            placeholder="Indtast tildelt person"
            style={styles.input}
          />
        </View>

        {/* Tidspunkt for udførelse (scroll menu) */}
        <View style={styles.row}>
          <Text style={styles.label}>Tidspunkt for udførelse</Text>
          <RNPickerSelect
            onValueChange={(value) => setNewTask({ ...newTask, timeOfExecution: value })}
            items={timeOptions}
            value={newTask.timeOfExecution}
            style={pickerSelectStyles}
            placeholder={{ label: "Vælg tidspunkt", value: null }}
          />
        </View>

        {/* Omtrentlig tid for opgave */}
        <View style={styles.row}>
          <Text style={styles.label}>Omtrentlig tid for opgave</Text>
          <TextInput
            value={newTask.aproxTimeForTask}
            onChangeText={(event) => setNewTask({ ...newTask, aproxTimeForTask: event })}
            placeholder="Indtast omtrentlig tid for opgave"
            style={styles.input}
          />
        </View>

        {/* Status */}
        <View style={styles.row}>
          <Text style={styles.label}>Status</Text>
          <RNPickerSelect
            onValueChange={(value) => setNewTask({ ...newTask, status: value })}
            items={statusOptions}
            value={newTask.status}
            style={pickerSelectStyles}
            placeholder={{ label: "Vælg status", value: null }}
          />
        </View>

        {/* Billede */}
        {newTask.photoUri && (
          <Image source={{ uri: newTask.photoUri }} style={styles.image} />
        )}
        <Button
          title="Tilføj Billede"
          onPress={() => navigation.navigate('Kamera')}
        />

        {/* Gem opgave */}
        <Button title={isEditTask ? "Opdater Opgave" : "Tilføj Opgave"} onPress={handleSave} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  row: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingLeft: 8,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 12,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  inputAndroid: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
});

export default Add_edit_task;
