import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons,FontAwesome, AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import profilImage from './../assets/profil.jpg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import pdfIcon from './../assets/pdf.jpg';
import docxIcon from './../assets/docx.png';
import excelIcon from './../assets/excel.jpg';
import pptxIcon from './../assets/pptx.png';
import { SERVER_IP } from './constants';
import {useNavigation, useRoute} from '@react-navigation/core'
function PublicationScreen() {
  const [likes, setLikes] = useState(0); 
  const [publicationsData, setPublicationsData] = useState([]);
  const [imageURL, setImageURL] = useState(null);
  const navigation = useNavigation();
  const [userId, setUserId] = useState([]);
  const [user, setUser] = useState([]);

  
  const handleLike = (publicationId) => {
  const isLiked = publicationsData.find(publication => publication.id === publicationId)?.likes.includes(userId);
    setLikes(likes => isLiked ? likes - 1 : likes + 1);

    axios.put(`${SERVER_IP}/api/partage/likes/${publicationId}/${userId}/`)
      .then(response => {
        updatePublicationLike(publicationId, isLiked);
      })
      .catch(error => {
        //console.error('Erreur lors de la mise à jour du like :', error);
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
  const handleProfil = (idUser) => {
    navigation.navigate('Profile', { userId: idUser });
  };
  const openFile = (url) => {
    Linking.openURL(url);
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
        
      }
    };

    if (userId !== null) {
      fetchUserData();
    }
  }, [userId]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${SERVER_IP}/api/partage/`);
        setPublicationsData(response.data);
        
      } catch  {
        
      }
    };

    fetchData();
  }, [publicationsData]);

  return (
    <View style={styles.container}>
      <View style={styles.container_tab}>
        <TouchableOpacity
          style={styles.profileContainer}
          onPress={() => {
            handleProfil(user.id)
          }}>
          {
            user && (<Image source={{ uri: user.profile_url }} style={styles.profileImage} />)
          }
          
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.publishContainer}
          onPress={handlePublish}>
          <Text style={styles.publishText}>Que voulez-vous dire ?</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.publishButton}
          onPress={() => {
          }}>
          <Text style={styles.publishButtonText}>Publier</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {publicationsData && (publicationsData.map((publication, index) => (
          <View key={index} style={styles.publicationContainer}>
            <TouchableOpacity style={styles.personContainer}  onPress={() => {
            handleProfil(user.id)
          }}>
              <Image source={{ uri: publication.sender['profile_url'] }} style={styles.personImage} />
              <Text style={styles.personName}>{publication.sender['nom']}</Text>
              
            </TouchableOpacity>

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
              <TouchableOpacity style={styles.reactionButton} onPress={() => handleLike(publication.id_partage)}>
                <Ionicons 
                  name="heart"  
                  size={20} 
                  color={(publication.likes.filter(l=>l==userId)).length == 1 ? '#ff0000' : '#000000'}
                />
                <Text>{publication.likes_number}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.commentButton} onPress={() => handleComment(publication.id_partage)}>
                <Ionicons name="chatbubble-outline" size={20} color="black" />
                <Text style={styles.commentButtonText}>{publication.comments_number} </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.reactionButton} onPress={() => console.log('Partager')}>
                <FontAwesome name="share" size={20} color="blue" />
              </TouchableOpacity>
            </View>
          </View>
        )))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flexGrow: 1,
    alignItems: 'center',
  },
  publicationContainer: {
    backgroundColor: '#f0f0f0',
    padding: 5,
    marginVertical: 4,
    borderRadius: 7,
    width: '95%',
    
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
    fontWeight: '600'
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 5,
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
    marginBottom:5,
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
    borderColor:'white',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor:'white',
    padding: 7,
    width: '30%',
    alignItems:"center",
    justifyContent:'center',

  },
  container_tab: {
    backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    margingTop: 25,
    marginBottom: 0, 
    backgroundColor: 'white'
  

},
profileContainer: {
  width: 40,
  height: 40,
  borderRadius: 20,
  overflow: 'hidden',
  marginRight: 10,
},
profileImage: {
  width: '100%',
  height: '100%',
  resizeMode: 'cover',
},
publishContainer: {
  flex: 1,
  marginRight: 10,
  padding: 15,
  backgroundColor: '#f0f0f0',
  borderRadius: 20,
},
publishText: {
  color: '#666666',
},
publishButton: {
  backgroundColor: '#2ecc71', 
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 20,
},
publishButtonText: {
  color: '#ffffff',
  fontWeight: 'bold',
},
  commentButton: {
    borderColor:'white',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor:'white',
    padding: 7,
    width: '30%',
    alignItems:"center",
    justifyContent:'center',

   
  },
  commentButtonText: {
    fontSize: 12,
    marginLeft: 5,
    
   
  },
});

export default PublicationScreen;
