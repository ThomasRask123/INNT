import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

import TaskList from "./screens/TaskList";
import TaskDetails from "./screens/TaskDetails";
import Add_edit_task from "./screens/Add_edit_task";
import CameraScreen from "./screens/CameraScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import MyTasks from "./screens/MyTasks"; // Importer den nye skærm

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";

// Firebase konfiguration
const firebaseConfig = {
  apiKey: "AIzaSyBGC7F3aNLev7zuzY_D1O6UvuqtZnzB8vY",
  authDomain: "godkend1-a0cf4.firebaseapp.com",
  databaseURL: "https://godkend1-a0cf4-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "godkend1-a0cf4",
  storageBucket: "godkend1-a0cf4.appspot.com",
  messagingSenderId: "198182813324",
  appId: "1:198182813324:web:21576941f3bc2ee563c5a9",
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
    <Tab.Screen name="Kamera" component={CameraScreen} />
    <Tab.Screen name="Mine opgaver" component={MyTasks} /> 
  </Tab.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Opret" component={RegisterScreen} />
        <Stack.Screen name="Hjem" component={HomeTabs} />
        <Stack.Screen name="Detaljer" component={TaskDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
