import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

import TaskList from "./screens/TaskList";
import TaskDetails from "./screens/TaskDetails";
import Add_edit_task from "./screens/Add_edit_task";
import CameraScreen from "./screens/CameraScreen"; // Import CameraScreen

// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBGC7F3aNLev7zuzY_D1O6UvuqtZnzB8vY",
  authDomain: "godkend1-a0cf4.firebaseapp.com",
  databaseURL: "https://godkend1-a0cf4-default-rtdb.europe-west1.firebasedatabase.app", 
  projectId: "godkend1-a0cf4",
  storageBucket: "godkend1-a0cf4.appspot.com",
  messagingSenderId: "198182813324",
  appId: "1:198182813324:web:21576941f3bc2ee563c5a9",
};

export default function App() {
  if (getApps().length < 1) {
    initializeApp(firebaseConfig);
    console.log("Firebase On!");
  }

  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();

  const StackNavigation = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name={"Task List"}
          component={TaskList}
          options={{ headerShown: null }}
        />
        <Stack.Screen
          name={"Task Details"}
          component={TaskDetails}
          options={{ headerShown: null }}
        />
        <Stack.Screen
          name={"Edit Task"}
          component={Add_edit_task}
          options={{ headerShown: null }}
        />
        {/* Adding the Camera Screen to the stack */}
        <Stack.Screen
          name={"CameraScreen"}
          component={CameraScreen}
          options={{ headerShown: null }}
        />
      </Stack.Navigator>
    );
  };

  const BottomNavigation = () => {
    return (
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen
            name={"Hustanden"}
            component={StackNavigation}
            options={{ tabBarIcon: () => <Ionicons name="home" size={20} /> }}
          />
          <Tab.Screen
            name={"Tilføj opgave"}
            component={Add_edit_task}
            options={{ tabBarIcon: () => <Ionicons name="add" size={20} /> }}
          />
          {/* Add a Tab for the Camera screen */}
          <Tab.Screen
            name={"Kamera"}
            component={CameraScreen}
            options={{
              tabBarIcon: () => <Ionicons name="camera-outline" size={20} />,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    );
  };

  return <BottomNavigation />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
