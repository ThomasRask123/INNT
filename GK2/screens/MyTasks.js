import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { getDatabase, ref, onValue, off } from "firebase/database";
import { getAuth } from "firebase/auth";

const MyTasks = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
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
      }
    });

    // Returner en clean-up function, der fjerner event listeneren, når komponenten unmountes
    return () => {
      off(tasksRef);
    };
  }, [userName]); // Kør useEffect igen, hvis userName ændres

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
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('TaskDetails', { taskId: item.id })}>
            <View style={styles.taskItem}>
              <Text style={styles.taskTitle}>{item.title}</Text>
              <Text style={styles.taskAssignee}>Assigned to: {item.assignee}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  taskItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  taskTitle: {
    fontSize: 18,
  },
  taskAssignee: {
    fontSize: 14,
    color: '#555',
  },
});

export default MyTasks;