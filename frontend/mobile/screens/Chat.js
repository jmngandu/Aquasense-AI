import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';


import { useNavigation } from '@react-navigation/native';

const Chat = () => {
  const navigation = useNavigation();
  const [showIcons, setShowIcons] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imageTitle, setImageTitle] = useState('');

  useEffect(() => {
    requestMediaLibraryPermission();
  }, []);

  const requestMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission refusée pour accéder à la bibliothèque de médias.');
    }
  };

  const handleSearch = () => {
    console.log('Recherche : ', searchText);
  };

  const handlePost = () => {
    setShowIcons(!showIcons);
  };
  const handleVideoIconPress = () => {
   navigation.navigate('VideoShare'); // Naviguer vers VideoShare
  };
  const handleImageIconPress = () => {
    navigation.navigate('PhotoShare'); // Naviguer vers PhotoShare
  };

  const handleFileIconPress = async () => {
    navigation.navigate('FileShare'); // Naviguer vers FileShare
  };

return (
  <View style={styles.container}>
    <TouchableOpacity style={styles.postButton} onPress={handlePost}>
      <Text style={styles.postButtonText}>Poster</Text>
    </TouchableOpacity>
    {showIcons && (
      <View style={styles.iconsContainer}>
        <TouchableOpacity onPress={handleImageIconPress}>
          <Ionicons name="images-outline" size={40} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleVideoIconPress}>
          <Ionicons name="videocam-outline" size={40} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleFileIconPress}>
          <Ionicons name="document-outline" size={40} color="black" />
        </TouchableOpacity>
      </View>
    )}
    <View style={styles.selectedFilesContainer}>
      {selectedFiles.map((file, index) => (
        <View key={index}>
          {file.type === 'image' && <Image source={{ uri: file.uri }} style={styles.image} />}
        </View>
      ))}
    </View>
  </View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: '80%',
    justifyContent: 'space-between',
  },
  searchInput: {
    flex: 1,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: '80%',
  },
  shareButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  shareButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  postButton: {
      backgroundColor: '#007bff',
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 20,
      marginBottom: 10,
      marginTop: 10,
      width: '80%',
      alignItems: 'center',
  },
  postButtonText: {
      color: 'white',
      fontWeight: 'bold',
  },
  iconsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '80%',
      marginTop: 10,
  },
  selectedFilesContainer: {
      marginTop: 20,
      alignItems: 'center',
  },
  image: {
      width: 100,
      height: 100,
      marginBottom: 10,
  },
});

export default Chat;