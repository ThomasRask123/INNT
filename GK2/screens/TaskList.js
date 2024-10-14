import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";

function TaskList({ navigation }) {
  const [tasks, setTasks] = useState();

  useEffect(() => {
    const db = getDatabase();
    const tasksRef = ref(db, "Tasks");

    // Lyt efter ændringer i Tasks-noden
    onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Tasks Object:", data);
      if (data) {
        setTasks(data);
      }
    });

    // Returner en clean-up function, der fjerner event listeneren, når komponenten unmountes
    return () => {
      off(tasksRef);
    };
  }, []); // Tomt array betyder at useEffect kun kører ved første render

  //  Hvis der ikke er nogen opgaver, vises en loading besked
  if (!tasks) {
    return <Text>Loading...</Text>;
  }

  const handleSelectTask = (id) => {
    /*Her søger vi direkte i vores array af opgaver og finder opgave objektet som matcher id'et vi har tilsendt*/
    const task = Object.entries(tasks).find((task) => task[0] === id);
    navigation.navigate("Task Details", { task });
  };

  // Flatlist forventer et array. Derfor tager vi alle values fra vores tasks objekt, og bruger som array til listen
  const taskArray = Object.values(tasks);
  const taskKeys = Object.keys(tasks);

  return (
    <FlatList
      data={taskArray}
      // Bruger taskKeys til at finde ID på den aktuelle task og returnerer dette som key, og giver det med som ID til taskListItem
      keyExtractor={(item, index) => taskKeys[index]}
      renderItem={({ item, index }) => {
        return (
          <TouchableOpacity
            style={styles.container}
            onPress={() => handleSelectTask(taskKeys[index])}
          >
            {/* Opgavebeskrivelse */}
            <Text style={styles.label}>
              Opgavebeskrivelse:{" "}
              <Text style={styles.value}>{item.taskDescription}</Text>
            </Text>
            {/* Tildelt person */}
            <Text style={styles.label}>
              Tildelt person: <Text style={styles.value}>{item.assignee}</Text>
            </Text>
            {/* Tidspunkt for udførelse */}
            <Text style={styles.label}>
              Tidspunkt for udførelse:{" "}
              <Text style={styles.value}>{item.timeOfExecution}</Text>
            </Text>
            {/* Forventet tid for opgave */}
            <Text style={styles.label}>
              Forventet tid for opgave:{" "}
              <Text style={styles.value}>{item.aproxTimeForTask} minutter</Text>
            </Text>
            {/* Status */}
            <Text style={styles.label}>
              Status:{" "}
              <Text style={styles.value}>
                {item.status === "not_started"
                  ? "Ikke startet"
                  : item.status === "in_progress"
                  ? "I gang"
                  : "Afsluttet"}
              </Text>
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
}

export default TaskList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    margin: 5,
    padding: 10,
    backgroundColor: "#f9f9f9", 
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  value: {
    fontWeight: "normal",
    fontSize: 16,
  },
});
