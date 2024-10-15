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

  const handleSelectTask = (taskId) => {
    const selectedTask = tasks.find(task => task.id === taskId);
    navigation.navigate('TaskDetails', { task: selectedTask });
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
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <Picker
            selectedValue={selectedAssignee}
            onValueChange={(itemValue) => setSelectedAssignee(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Alle" value="" />
            {tasks.map((task, index) => (
              <Picker.Item key={index} label={task.assignee} value={task.assignee} />
            ))}
          </Picker>
          <Button title="Done" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={styles.taskItem}
              onPress={() => handleSelectTask(item.id)}
            >
              <View style={styles.taskItem}>
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
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  taskItem: {
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    fontSize: 14,
    color: '#555',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
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