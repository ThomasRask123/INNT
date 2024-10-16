import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraType, Camera } from 'expo-camera/legacy';
import * as FileSystem from 'expo-file-system';

const CameraScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const [photoUri, setPhotoUri] = useState(null);
  const cameraRef = useRef(null);

  // Anmod om kamera tilladelser 
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Hvis kamera-tilladelser ikke er givet
  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  // Skift mellem kamera-front og -bag
  const toggleCameraType = () => {
    setType(type === CameraType.back ? CameraType.front : CameraType.back);
  };

  // Tag et billede
  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setPhotoUri(photo.uri);
      Alert.alert('Photo taken!', 'Your photo has been taken successfully.');
    }
  };

  // Gem billede og naviger tilbage
  const savePicture = async () => {
    if (photoUri) {
      const fileName = photoUri.split('/').pop();
      const newPath = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.moveAsync({
        from: photoUri,
        to: newPath,
      });
      // Send billedets sti tilbage til den forrige skærm
      navigation.navigate('Tilføj opgaver', { photoUri: newPath });
    }
  };

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <Text style={styles.text}>Vend kamera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Tag billede</Text>
          </TouchableOpacity>
          {photoUri && (
            <TouchableOpacity style={styles.button} onPress={savePicture}>
              <Text style={styles.text}>Gem billede</Text>
            </TouchableOpacity>
          )}
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 10,
    width: '260%',
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    margin: 10,
    width: 300,
    },
  text: {
    fontSize: 18,
    color: 'black',
    width: 110,
    textAlign: 'center',
  },
});

export default CameraScreen;