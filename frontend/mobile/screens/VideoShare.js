import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, TextInput, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av'; // Importez le composant Video d'expo-av

import { FontAwesome5 } from '@expo/vector-icons';

const Publication = ({ title, content, contentType, likes, shares, downloads, comments }) => {
  const renderContent = () => {
    if (contentType === 'image') {
      return <Image source={content} style={styles.contentImage} />;
    } else if (contentType === 'video') { // Ajout de la condition pour afficher la vidéo
      return (
        <View style={styles.contentContainer}>
         
          <Text style={styles.contentText}>{title}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.contentContainer}>
          <FontAwesome5 name="file-alt" size={48} color="black" />
          <Text style={styles.contentText}>{title}</Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.publicationContainer}>
      {renderContent()}
      <View style={styles.reactionContainer}>
        <TouchableOpacity style={styles.reactionButton}>
          <Ionicons name="heart" size={24} color="red" />
          <Text>{likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reactionButton}>
          <Ionicons name="chatbox-outline" size={24} color="green" />
          <Text>{comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reactionButton}>
          <Ionicons name="download-outline" size={24} color="black" />
          <Text>{downloads}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reactionButton}>
          <Ionicons name="share" size={24} color="blue" />
          <Text>{shares}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function Chat({ title }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [publications, setPublications] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newPublicationTitle, setNewPublicationTitle] = useState('');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSelectNewPhoto = async () => {
    // Votre code pour sélectionner une image reste inchangé
  };

  const handleSelectNewVideo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos, // Spécifiez les vidéos au lieu des images
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

      if (!result.cancelled) {
        setSelectedFile(result.uri);
      }
    } catch (error) {
      console.error('Erreur lors de la sélection de la vidéo :', error);
    }
  };

  const handleShare = async () => {
    // Votre code pour partager reste inchangé
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  menuButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  menu: {
    ...StyleSheet.absoluteFillObject,
    top: 60,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    zIndex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  menuText: {
    marginLeft: 10,
  },
  publicationContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  contentContainer: {
    alignItems: 'center',
  },
  contentVideo: {
    width: 300,
    height: 200,
    borderRadius: 10,
  },
  contentImage: {
    width: 300,
    height: 200,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  reactionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  reactionContainer: {
   flexDirection: 'row',
   alignItems: 'center',
  },
  selectedImageContainer: {
   alignItems: 'center',
   marginTop: 20,
  },
  selectedImage: {
   width: 200,
   height: 200,
   resizeMode: 'cover',
   marginBottom: 20,
  },
  selectPhotoButton: {
   flexDirection: 'row',
   alignItems: 'center',
   justifyContent: 'center',
   backgroundColor: 'green',
   borderRadius: 8,
   paddingVertical: 10,
   paddingHorizontal: 20,
   width: '30%',
   marginTop: 20,
  },
  selectPhotoButtonText: {
   color: 'white',
   fontSize: 16,
   marginLeft: 10,
  },
  selectFileButton: {
   flexDirection: 'row',
   alignItems: 'center',
   justifyContent: 'center',
   backgroundColor: '#6B0AB8',
   borderRadius: 8,
   paddingVertical: 10,
   paddingHorizontal: 20,
   width: '30%',
   marginTop:10,
  },
  selectFileButtonText: {
   color: 'white',
   fontSize: 16,
   marginLeft: 10,
  },
  titleInput: {
   borderWidth: 1,
   borderColor: '#FBFBFB',
   borderRadius: 8,
   padding: 10,
   width: '40%',
   marginTop: -40,
   marginLeft: 110,
   backgroundColor: '#F0F0F0',
   fontSize: 16,
   color: 'black',
  },
  shareButton: {
   backgroundColor: '#FF084B',
   padding: 12,
   borderRadius: 8,
   marginTop: -45,
   alignSelf: 'center',
   color: 'white',
   marginLeft: 250,
  },
  shareButtonText: {
   color: 'white',
   fontSize: 16,
   fontWeight: 'bold',
  },
});