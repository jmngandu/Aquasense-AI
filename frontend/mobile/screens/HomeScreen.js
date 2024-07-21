import React, { useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import NavBar from './navBar';

function HomeScreen() {
  const navigation = useNavigation();
  const [pickedImage, setPickedImage] = useState(null);
  const [label, setLabel] = useState('');
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pressed, setPressed] = useState(false);

  const verifyPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Insufficient permissions!',
        'You need to grant camera permissions to use this feature.',
        [{ text: 'Okay' }]
      );
      return false;
    }
    return true;
  };

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Insufficient permissions!',
        'You need to grant location permissions to use this feature.',
        [{ text: 'Okay' }]
      );
      return;
    }
    const loc = await Location.getCurrentPositionAsync({});
    setLocation(loc);
  };

  const handleTakeImage = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }
    const image = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5
    });

    if (!image.canceled) {
      setPickedImage(image.uri);
      setLoading(true);
      await getLocation();
      setTimeout(() => {
        const isTrash = Math.random() > 0.5;
        setLabel(isTrash ? 'Trash' : 'Not Trash');
        setLoading(false);
        setTimeout(() => {
          setPickedImage(null);
          setLabel('');
          setLocation(null);
        }, 10000); // Wait for 10 seconds before resetting the state
      }, 2000);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.container_header}>
        <NavBar />
      </View>
      <View style={styles.photoContainer}>
        {pickedImage ? (
          <View style={styles.resultContainer}>
            <Image source={{ uri: pickedImage }} style={styles.imagePreview} />
            {loading ? (
              <ActivityIndicator size="large" color="#0072ff" />
            ) : (
              <View style={styles.iconContainer}>
                <Text style={styles.labelText}>
                  {label === 'Trash' 
                    ? `Thank you for your contribution because it is really trash. Your location: (${location?.coords.latitude}, ${location?.coords.longitude})` 
                    : `Please check the image carefully because it is not trash.`}
                </Text>
                <Ionicons 
                  name={label === 'Trash' ? 'checkmark-circle' : 'close-circle'} 
                  size={30} 
                  color={label === 'Trash' ? 'green' : 'red'} 
                  style={styles.icon} 
                />
              </View>
            )}
          </View>
        ) : (
          <View style={styles.takeContainer}>
            
            <Text style={styles.cameraText}>Take photos if you see trash</Text>
            <TouchableOpacity 
              style={[styles.cameraButton, pressed && styles.cameraButtonPressed]} 
              onPressIn={() => setPressed(true)}
              onPressOut={() => setPressed(false)}
              onPress={handleTakeImage}
            >
              <Ionicons name="camera" size={70} color="#0072ff" />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={styles.tabContent}>
        <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('LeaderBoard')}>
          <Ionicons name="wine-outline" size={50} color="#0072ff" />
          <Text style={styles.text}>LeaderBoard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('Water')}>
          <Ionicons name="water" size={50} color="#0072ff" />
          <Text style={styles.text}>Your water</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Thank you for collaborating with AI and the world in waste and water management.
        </Text>
      </View>
    </View>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    backgroundColor: 'white',
    gap:2
  },
  container_header: {
    top: 12,
    display: 'flex',
    height: 100,
  },
  tabContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#ddd',
    marginHorizontal: 20,
    height: 250,
  },
  takeContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  photoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    margin: 20,
    backgroundColor: '#ddd',
    height: 300,
    width: '90%',
  },
  wasteImage: {
    width: 100,
    height: 100,
    marginRight: 10,
    marginTop: 150,
  },
  cameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cameraButtonPressed: {
    opacity: 0.6,
  },
  cameraText: {
    width: '60%',
    fontSize: 30,
    fontWeight: 'bold',
  },
  sustainabilityText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#0072ff',
  },
  labelText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    color: 'grey',
  },
  imagePreview: {
    width: '100%',
    height: '76%',
    borderRadius: 3,
  },
  iconContainer: {
    display: 'flex',
  },
  icon: {
    alignSelf: 'center',
    marginTop: 10,
  },
  resultContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButton: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    flex: 1,
    margin: 10,
    justifyContent: 'center',
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: '#0072af',
  },
  footer: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    margin:20,
  },
  footerText: {
    fontSize: 16,
    color: 'grey',
    textAlign: 'center',
  }
});
