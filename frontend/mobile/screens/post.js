import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, Platform, ScrollView } from 'react-native';
import { Ionicons, Entypo } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/core';
import { SERVER_IP } from './constants';
function Post() {
  const [message, setMessage] = useState('');
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const [user, setUser] = useState({});

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const handlePickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setFiles([...files, result.assets[0].uri]);
    }
  };

  const handlePickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({ multiple: true });

    if (result.type === 'success') {
      if (Array.isArray(result.uri)) {
        setFiles([...files, ...result.uri]);
      } else {
        setFiles([...files, result.uri]);
      }
    }
  };

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const { id } = JSON.parse(userData);
          setUserId(parseInt(id));
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'ID utilisateur depuis AsyncStorage:', error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${SERVER_IP}/api/users/${userId}/`);
        setUser(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
      }
    };

    if (userId !== null) {
      fetchUserData();
    }
  }, [userId]);

  const uploadPost = async () => {
    try {
      const formData = new FormData();
      formData.append('sender', parseInt(userId));
      formData.append('contenu', message);

      images.forEach((image, index) => {
        const type = getTypeFromExtension(image);
        formData.append('images', { uri: image, name: `image_${index}.${type}`, type });
      });

      files.forEach((file, index) => {
        const type = getTypeFromExtension(file);
        const file_list = file.split('/');
        const name = file_list[file_list.length - 1];
        formData.append('files', { uri: file, name, type });
      });

      const response = await axios.post(`${SERVER_IP}/api/partage/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 201) {
        Alert.alert('Success', 'La publication a été publiée');
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', 'Failed to upload post');
      }
    } catch (error) {
      console.error('Error uploading post:', error);
      Alert.alert('Error', 'Failed to upload post');
    }
  };

  const getTypeFromExtension = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();

    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      case 'pdf':
        return 'application/pdf';
      case 'mp4':
      case 'mov':
      case 'avi':
        return 'video/mp4';
      default:
        return Platform.OS === 'ios' ? 'application/octet-stream' : 'application/*';
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.container_header}>
          <Text style={styles.placeholder}>Exprimez-vous</Text>
        </View>
        <View style={styles.personContainer}>
          <Image source={user.profile_url ? { uri: user.profile_url } : require('./../assets/profil.jpg')} style={styles.personImage} />
          <Text style={styles.personName}>{ user.nom}</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Exprimez-vous"
          value={message}
          onChangeText={(text) => setMessage(text)}
          multiline
          textAlignVertical="top" 
        />
        <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={handlePickImage}>
            <Ionicons name="image" size={24} color="#2ecc71" />
            <Text style={styles.iconText}>Photos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handlePickVideo}>
            <Entypo name="video" size={24} color="#2ecc71" />
            <Text style={styles.iconText}>Vidéos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handlePickFile}>
            <Ionicons name="attach" size={24} color="#2ecc71" />
            <Text style={styles.iconText}>Fichiers</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.shareButton} onPress={uploadPost}>
          <Text style={styles.shareButtonText}>Partager</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    padding: 7,
    backgroundColor: 'white',
    top: 40,
  },
  container_header: {
    paddingBottom: 10,
    paddingHorizontal: 20,
    alignItems: 'flex-start',
  },
  placeholder: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  personContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  personImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  personName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    height: 200,
  },
  iconContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginBottom: 20,
  },
  iconButton: {
    alignItems: 'center',
  },
  iconText: {
    color: 'grey',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 5, 
  },
  shareButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 13,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  shareButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Post;
