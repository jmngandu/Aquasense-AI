import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import pdfIcon from './../assets/pdf.jpg';
import docxIcon from './../assets/docx.png';
import excelIcon from './../assets/excel.jpg';
import pptxIcon from './../assets/pptx.png';
import { useNavigation,useRoute } from '@react-navigation/core';
import { SERVER_IP } from './constants';

const ProfileScreen = () => {

  const [user, setUser] = useState({});
  const [likes, setLikes] = useState(0);
  const [publicationsData, setPublicationsData] = useState([]);
  const navigation = useNavigation();
  const [showOptions, setShowOptions] = useState({});
  const route = useRoute();
  const { userId } = route.params;
  
  const handleLike = (publicationId) => {
    const isLiked = publicationsData.find(publication => publication.id === publicationId)?.likes.includes(userId);
    setLikes(likes => isLiked ? likes - 1 : likes + 1);

    axios.put(`${SERVER_IP}/api/partage/likes/${publicationId}/${userId}/`)
      .then(response => {
        updatePublicationLike(publicationId, isLiked);
      })
      .catch(error => {
        // Handle error
      });
  };

  const updatePublicationLike = (publicationId, isLiked) => {
    setPublicationsData(prevPublications => {
      return prevPublications.map(publication => {
        if (publication.id === publicationId) {
          return {
            ...publication,
            likes_number: isLiked ? publication.likes_number - 1 : publication.likes_number + 1,
            likes: isLiked ? publication.likes.filter(like => like !== userId) : [...publication.likes, userId]
          };
        }
        return publication;
      });
    });
  };

  const handlePublish = () => {
    navigation.navigate('Post', { userName: user.nom, userProfilePhoto: user.profile_url });
  };

  const handleComment = (publicationId) => {
    navigation.navigate('Comment', { publicationId });
  };

  const openFile = (url) => {
    Linking.openURL(url);
  };

  const toggleOptions = (publicationId) => {
    setShowOptions(prevState => ({
      ...prevState,
      [publicationId]: !prevState[publicationId]
    }));
  };

  const handleDelete = async (publicationId) => {
    try {
      await axios.delete(`${SERVER_IP}/api/partage/${publicationId}/`);
      Alert.alert("Supprimé avec succès");
      setPublicationsData(prevPublications => prevPublications.filter(publication => publication.id !== publicationId));
    } catch {
     
    }
  };



  useEffect(() => {
    const fetchData = async () => {
      const { userId } = route.params;
      if (userId !== null) {
        try {
          const response = await axios.get(`${SERVER_IP}/api/users/${userId}/partage/`);
          setPublicationsData(response.data.partage);
        } catch {
          // Handle error
        }
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId !== null) {
        try {
          const response = await axios.get(`${SERVER_IP}/api/users/${userId}/`);
          setUser(response.data);
        } catch {
          // Handle error
        }
      }
    };

    fetchUserData();
  }, [userId]);

  const handleSendMessage = async (userSelectId) => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const { id } = JSON.parse(userData);
        setUserId(parseInt(id));
        const response = await axios.post(`${SERVER_IP}/api/discussion/`, { membres: [userId, userSelectId] });
        navigation.navigate('DiscussionUsers', {
          userId,
          discussion: response.data,
          userDiscussion: response.data.nom,
          profile_url: response.data.profile
        });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du profil utilisateur :', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        {user && (
          <>
            <Image source={{ uri: user.profile_url }} style={styles.profile} />
            <View style={styles.textContainer}>
              <Text style={styles.text}>{user.nom}</Text>
              <Text style={styles.text}>{user.email}</Text>
              <Text style={styles.text}>{user.genre}</Text>
              <TouchableOpacity
                style={styles.messageButton}
                onPress={() => handleSendMessage(user.id)}
              >
                <Ionicons name="chatbubbles" size={16} color="white" />
                <Text style={styles.messageButtonText}>Envoyer un message</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {publicationsData && publicationsData.map((publication, index) => (
          <View key={index} style={styles.publicationContainer}>
            <View style={styles.personContainer}>
              <Image source={{ uri: publication.sender['profile_url'] }} style={styles.personImage} />
              <Text style={styles.personName}>{publication.sender['nom']}</Text>
              {publication.sender.id === userId && (
                <TouchableOpacity style={styles.optionsButton} onPress={() => toggleOptions(publication.id)}>
                  <FontAwesome name="ellipsis-v" size={24} color="black" />
                </TouchableOpacity>
              )}
              {showOptions[publication.id] && (
                <View style={styles.optionsContainer}>
                  <TouchableOpacity style={styles.optionButton} onPress={() => handleDelete(publication.id)}>
                    <Text style={styles.optionText}>Supprimer</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.optionButton} onPress={() => handleEdit()}>
                    <Text style={styles.optionText}>Modifier</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            {publication.contenu && (
              <Text style={styles.title}>{publication.contenu}</Text>
            )}
            {publication.images_list && publication.images_list.length > 0 && (
              <Image source={{ uri: publication.images_list[0] }} style={styles.image} />
            )}
            {publication.files_list && publication.files_list.length > 0 && publication.files_list.map((file, index) => (
              <TouchableOpacity style={styles.fileContainer} key={index} onPress={() => openFile(file.url)}>
                <Text style={styles.fileName}>{file.name}</Text>
                {file.type === 'pdf' ? (
                  <Image source={pdfIcon} style={styles.fileIcon} />
                ) : file.type === 'docx' ? (
                  <Image source={docxIcon} style={styles.fileIcon} />
                ) : file.type === 'excel' ? (
                  <Image source={excelIcon} style={styles.fileIcon} />
                ) : file.type === 'pptx' ? (
                  <Image source={pptxIcon} style={styles.fileIcon} />
                ) : null}
              </TouchableOpacity>
            ))}
            <View style={styles.interactionContainer}>
              <TouchableOpacity style={styles.reactionButton} onPress={() => handleLike(publication.id)}>
                <Ionicons 
                  name="heart"  
                  size={20} 
                  color={(publication.likes.includes(userId)) ? '#ff0000' : '#000000'}
                />
                <Text>{publication.likes_number}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.reactionButton} onPress={() => handleComment(publication.id)}>
                <Ionicons name="chatbubble-outline" size={20} color="black" />
                <Text style={styles.commentButtonText}>{publication.comments_number} </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.reactionButton} onPress={() => console.log('Partager')}>
                <FontAwesome name="share" size={20} color="blue" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  optionsButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  optionsContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  optionButton: {
    padding: 10,
  },
  optionText: {
    fontSize: 16,
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'center',
  },
  textContainer: {
    width: '50%',
  },
  profile: {
    width: 150,
    height: 140,
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666',
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  messageButtonText: {
    color: 'white',
    marginLeft: 5,
  },
  scrollView: {
    flexGrow: 1,
    alignItems: 'center',
  },
  publicationContainer: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    marginVertical: 4,
    borderRadius: 7,
    width: '97%',
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
    fontWeight: '600',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 3,
    marginBottom: 10,
  },
  fileContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileIcon: {
    width: 290,
    height: 200,
    marginBottom: 5,
    resizeMode: 'contain',
  },
  fileName: {
    marginRight: 260,
    fontSize: 12,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 1,
  },
  interactionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    gap: 10,
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 7,
    width: '30%',
    justifyContent: 'center',
  },
  commentButtonText: {
    fontSize: 12,
    marginLeft: 5,
  },
});

export default ProfileScreen;
