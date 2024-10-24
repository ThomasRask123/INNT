// Importere de nødvendige biblioteker
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Importer skærme
import TaskList from "./screens/TaskList";
import TaskDetails from "./screens/TaskDetails";
import Add_edit_task from "./screens/Add_edit_task";
import CameraScreen from "./screens/CameraScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import MyTasks from "./screens/MyTasks";
import AiChatScreen from './screens/AiChatScreen';

// Importer Firebase
import { initializeApp, getApps } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";

// Firebase konfiguration
const firebaseConfig = {
  apiKey: "AIzaSyAbpPt4y-k7_3HB_rsVfUdNcDguiEygetA",
  authDomain: "gk-2-465eb.firebaseapp.com",
  projectId: "gk-2-465eb",
  storageBucket: "gk-2-465eb.appspot.com",
  messagingSenderId: "851048690218",
  appId: "1:851048690218:web:2824445616221e347cc953",
  databaseURL: "https://gk-2-465eb-default-rtdb.europe-west1.firebasedatabase.app/"
};

// Tjekker, om Firebase allerede er initialiseret
if (!getApps().length) {
  const app = initializeApp(firebaseConfig);
  initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
  console.log("Firebase initialized!");
}

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Home-tabs opsætning
const HomeTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Hustandens opgaver" component={TaskList} />
    <Tab.Screen name="Tilføj opgaver" component={Add_edit_task} />
    <Tab.Screen name="Mine opgaver" component={MyTasks} />
    <Tab.Screen name="Chat" component={AiChatScreen} />
  </Tab.Navigator>
);

export default function App() {
  const [userName, setUserName] = useState('');
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || user.email); // Brug displayName hvis tilgængelig, ellers email
      } else {
        setUserName(''); // Nulstil brugerens navn, hvis der ikke er nogen bruger
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
        />
        <Stack.Screen 
          name="Opret" 
          component={RegisterScreen} 
        />
        <Stack.Screen 
          name="Hjem" 
          component={HomeTabs} 
          options={{
            headerRight: () => (
              <Text style={styles.userName}>{userName}</Text>
            ),
          }}
        />
        <Stack.Screen 
          name="Detaljer" 
          component={TaskDetails} 
        />
        <Stack.Screen 
          name="Rediger opgave" 
          component={Add_edit_task} 
        />
        <Stack.Screen name="Kamera" component={CameraScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
});