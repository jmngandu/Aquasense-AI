import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, TextInput, StyleSheet, Share, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const Publication = ({ title, imageSource, views, likes, shares }) => {
  return (
    <View style={styles.publicationContainer}>
      <Image
        source={imageSource}
        style={styles.image}
      />
      <Text style={styles.title}>{title}</Text>
      <View style={styles.reactionContainer}>
        <TouchableOpacity style={styles.reactionButton}>
          <Ionicons name="eye" size={24} color="black" />
          <Text>{views}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reactionButton}>
          <Ionicons name="heart" size={24} color="red" />
          <Text>{likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reactionButton}>
          <Ionicons name="share" size={24} color="blue" />
          <Text>{shares}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function HomeScreen({ title }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [publications, setPublications] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [newPublicationTitle, setNewPublicationTitle] = useState('');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSelectNewPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setSelectedImage(result.uri);
      }
    } catch (error) {
      console.error('Erreur lors de la sélection de l\'image :', error);
    }
  };

  const handleShare = async () => {
    if (selectedImage) {
      try {
        const newPublication = {
          title: newPublicationTitle || 'Nouvelle publication', // Utilise le titre saisi ou un titre par défaut
          imageSource: { uri: selectedImage }, // Image sélectionnée
          views: 0,
          likes: 0,
          shares: 0,
        };
        setPublications([newPublication, ...publications]);
        setSelectedImage(null);
        setNewPublicationTitle(''); // Réinitialise le titre de la nouvelle publication
        Alert.alert('Succès', 'L\'image a été partagée avec succès !');
      } catch (error) {
        console.error('Erreur lors du partage :', error.message);
        Alert.alert('Erreur', 'Une erreur est survenue lors du partage de l\'image.');
      }
    } else {
      Alert.alert('Erreur', 'Veuillez sélectionner une image avant de partager.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>{title}</Text>
        {publications.map((publication, index) => (
          <Publication
            key={index}
            title={publication.title}
            imageSource={publication.imageSource}
            views={publication.views}
            likes={publication.likes}
            shares={publication.shares}
          />
        ))}
        {selectedImage && (
          <View style={styles.selectedImageContainer}>
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
          </View>
        )}
            <View style={styles.contenu_partage}>
              <TouchableOpacity style={styles.selectPhotoButton} onPress={handleSelectNewPhoto}>
                        <Ionicons name="image-outline" size={24} color="black" />
                        <Text style={styles.selectPhotoButtonText}>Photos</Text>
                      </TouchableOpacity>
                      <TextInput
                        placeholder="Titre de la publication"
                        value={newPublicationTitle}
                        onChangeText={setNewPublicationTitle}
                        style={styles.titleInput}
                      />
                      <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                        <Text style={styles.shareButtonText}>Partager</Text>
                      </TouchableOpacity>
            </View>

      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
    alignItems: "center",
    height: '100%',
    justifyContent: "center",
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
  image: {
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
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  shareButton: {
    backgroundColor: '#FF084B',
    padding: 10,
    borderRadius: 8,
    marginTop: -37,
    alignSelf: 'center',
    color: 'white',
    marginLeft: 250,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoContainer: {
    marginTop: 20,
    width: '100%',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
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
  newPublicationContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  shareButtonText: {
   color: 'white',
   fontSize: 16,
   fontWeight: 'bold',
  },
  contenu_partage: {
  backgroundColor: 'white',
  display: 'flex',
  flexDirection: 'row',
  },
titleInput: {
  borderWidth: 1,
  borderColor: '#FBFBFB',
  borderRadius: 8,
  padding: 10,
  width: '40%',
  marginTop: -45,
  marginLeft: 110,
  backgroundColor: '#F0F0F0',
  fontSize: 16,
  color: 'black',
},

});

