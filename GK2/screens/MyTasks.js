import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Modal, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getDatabase, ref, onValue, off } from "firebase/database";
import { getAuth } from "firebase/auth";

const MyTasks = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [taskKeys, setTaskKeys] = useState([]);
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      setUserName(user.displayName || user.email); // Brug displayName hvis tilgængelig, ellers email
    }

    const db = getDatabase();
    const tasksRef = ref(db, "Tasks");

    // Lyt efter ændringer i Tasks-noden
    onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Tasks Object:", data);
      if (data) {
        const taskArray = Object.keys(data)
          .map(key => ({ ...data[key], id: key }))
          .filter(task => task.assignee === userName); // Filtrer opgaver baseret på brugerens navn
        setTasks(taskArray);
        setTaskKeys(Object.keys(data));
      }
    });

    // Returner en clean-up function, der fjerner event listeneren, når komponenten unmountes
    return () => {
      off(tasksRef);
    };
  }, [userName]); // Kør useEffect igen, hvis userName ændres

  const handleSelectTask = (id) => {
    // Find den valgte opgave ud fra id'et
    const selectedTask = tasks.find(task => task.id === id);
  
    // Naviger til TaskDetails skærmen og send opgaven med som parameter
    if (selectedTask) {
      navigation.navigate('Detaljer', { task: [id, selectedTask] });
    }
  };  

  // Hvis der ikke er nogen opgaver, vises en loading besked
  if (!tasks.length) {
    return (
      <View style={styles.container}>
        <Text>No tasks assigned to you.</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => handleSelectTask(item.id)}
            >
              <View style={styles.container}>
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
                {/* Estimeret tid */}
                <Text style={styles.label}>
                  Estimeret tid:{" "}
                  <Text style={styles.value}>{item.aproxTimeForTask} minutter</Text>
                </Text>
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
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 10,
  },
  container: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    margin: 5,
    padding: 10,
    backgroundColor: "#f9f9f9", 
  },
  taskItem: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
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
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 20,
    padding: 35,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default MyTasks;