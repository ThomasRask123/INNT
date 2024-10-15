import { StatusBar } from "expo-status-bar";
import { View, Text, Platform, StyleSheet, Button, Alert } from "react-native";
import { useEffect, useState } from "react";
import { getDatabase, ref, remove } from "firebase/database";

function TaskDetails({ route, navigation }) {
  const [task, setTask] = useState({});

  useEffect(() => {
    // Henter task values og sætter dem
    setTask(route.params.task[1]);

    // Når vi forlader screen, tøm object
    return () => {
      setTask({});
    };
  }, [route.params.task]);

  const handleEdit = () => {
    // Vi navigerer videre til EditTask skærmen og sender opgaven videre med
    const task = route.params.task;
    navigation.navigate("Edit Task", { task });
  };
 
  const confirmDelete = () => {
    // Vi spørger brugeren om han er sikker
    if (Platform.OS === "ios" || Platform.OS === "android") {
      Alert.alert("Er du sikker?", "Vil du slette denne opgave?", [
        { text: "Annuller", style: "cancel" },
        { text: "Slet", style: "destructive", onPress: () => handleDelete() },
      ]);
    }
  };

  const handleDelete = async () => {
    const id = route.params.task[0];
    const db = getDatabase();
    const taskRef = ref(db, `Tasks/${id}`);

    // Sletter task fra Firebase
    await remove(taskRef)
      .then(() => {
        navigation.goBack();
      })
      .catch((error) => {
        Alert.alert(error.message);
      });
  };

  if (!task) {
    return <Text>No data</Text>;
  }

  // Returner alt indholdet
  return (
    <View style={styles.container}>
      <Button title="Rediger" onPress={() => handleEdit()} />
      <Button title="Slet" onPress={() => confirmDelete()} />

      {/* Opgavebeskrivelse */}
      <View style={styles.row}>
        <Text style={styles.label}>Opgavebeskrivelse:</Text>
        <Text style={styles.value}>{task.taskDescription}</Text>
      </View>

      {/* Tildelt person */}
      <View style={styles.row}>
        <Text style={styles.label}>Tildelt person:</Text>
        <Text style={styles.value}>{task.assignee}</Text>
      </View>

      {/* Tidspunkt for udførelse */}
      <View style={styles.row}>
        <Text style={styles.label}>Tidspunkt for udførelse:</Text>
        <Text style={styles.value}>{task.timeOfExecution}</Text>
      </View>

      {/* Forventet tid for opgave */}
      <View style={styles.row}>
        <Text style={styles.label}>Forventet tid for opgave:</Text>
        <Text style={styles.value}>{task.aproxTimeForTask} minutter</Text>
      </View>

      {/* Status */}
      <View style={styles.row}>
        <Text style={styles.label}>Status:</Text>
        <Text style={styles.value}>
          {task.status === "not_started"
            ? "Ikke startet"
            : task.status === "in_progress"
            ? "I gang"
            : "Afsluttet"}
        </Text>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

export default TaskDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 20,
  },
  row: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
});
