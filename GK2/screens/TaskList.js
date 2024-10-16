import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Modal, Button, RefreshControl } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getDatabase, ref, onValue, off } from "firebase/database";

const TaskList = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [taskKeys, setTaskKeys] = useState([]);
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // State for refresh

  useEffect(() => {
    fetchTasks();
  }, []); // Tomt array betyder at useEffect kun kører ved første render

  const fetchTasks = () => {
    const db = getDatabase();
    const tasksRef = ref(db, "Tasks");

    onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Tasks Object:", data);
      if (data) {
        const taskArray = Object.keys(data).map(key => ({ ...data[key], id: key }));
        setTasks(taskArray);
        setTaskKeys(Object.keys(data));
      }
    });

    return () => {
      off(tasksRef);
    };
  };

  // Funksjon for pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchTasks(); // Genindlæs data
    setRefreshing(false);
  };

  // Hvis der ikke er nogen opgaver, vises en loading besked
  if (!tasks.length) {
    return <Text>Loading...</Text>;
  }

  const handleSelectTask = (id) => {
    const selectedTask = tasks.find(task => task.id === id);

    if (selectedTask) {
      navigation.navigate('Detaljer', { task: [id, selectedTask] });
    }
  };  

  const assignees = [...new Set(tasks.map(task => task.assignee))];

  const filteredTasks = tasks.filter(task => 
    selectedAssignee === '' || task.assignee === selectedAssignee
  );

  return (
    <View style={styles.wrapper}>
      <Button title="Vælg person" onPress={() => setModalVisible(true)} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.pickerLabel}>Vælg person:</Text>
          <Picker
            selectedValue={selectedAssignee}
            onValueChange={(itemValue) => setSelectedAssignee(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Alle" value="" />
            {assignees.map((assignee, index) => (
              <Picker.Item key={index} label={assignee} value={assignee} />
            ))}
          </Picker>
          <Button title="Done" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={styles.container}
              onPress={() => handleSelectTask(item.id)}
            >
              <Text style={styles.label}>
                Opgavebeskrivelse:{" "}
                <Text style={styles.value}>{item.taskDescription}</Text>
              </Text>
              <Text style={styles.label}>
                Tildelt person: <Text style={styles.value}>{item.assignee}</Text>
              </Text>
              <Text style={styles.label}>
                Tidspunkt for udførelse:{" "}
                <Text style={styles.value}>{item.timeOfExecution}</Text>
              </Text>
              <Text style={styles.label}>
                Forventet tid for opgave:{" "}
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
            </TouchableOpacity>
          );
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh} // Funksjon til pull-to-refresh
          />
        }
      />
    </View>
  );
}

export default TaskList;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 10,
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
