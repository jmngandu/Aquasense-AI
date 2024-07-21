import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER_IP } from './constants';
import pdfIcon from './../assets/pdf.jpg';
import docxIcon from './../assets/docx.png';
import excelIcon from './../assets/excel.jpg';
import pptxIcon from './../assets/pptx.png';

const SearchScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userList, setUserList] = useState([]);
  const [publicationList, setPublicationList] = useState([]);
  const [showAllUsers, setShowAllUsers] = useState(false); // State to track if all users should be shown
  const navigation = useNavigation();
  const [likes, setLikes] = useState(0); 

  
  const handleLike = (publicationId) => {
    const isLiked = publicationList.find(publication => publication.id_partage === publicationId)?.likes.includes(userId);
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
      setPublicationList(prevPublications => {
        return prevPublications.map(publication => {
          if (publication.id_partage === publicationId) {
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

  const handleComment = (publicationId) => {
    navigation.navigate('Comment', { publicationId });
  };

  const handleProfile = (userId) => {
    navigation.navigate('Profile', { userId });
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
          setUserId(id);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'ID utilisateur depuis AsyncStorage:', error);
      }
    };

    fetchUserId();
  }, []);

  const fetchData = async (query) => {
    try {
      setLoading(true);
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const { id } = JSON.parse(userData);
        const response = await axios.get(`${SERVER_IP}/api/partage/search/${id}/${query}/`);
        setUserList(response.data.users);
        setPublicationList(response.data.partages);
      }
    } catch (error) {
      console.error('Erreur lors de la recherche :', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim().length > 0) {
      fetchData(text);
    } else {
      setUserList([]);
      setPublicationList([]);
    }
  };

  const clearSearch = () => {
    setSearchText('');
    setUserList([]);
    setPublicationList([]);
  };

  const handleSendMessage = async (userSelectId)=>{
    try {
      const userData = await AsyncStorage.getItem('userData');
        if( (userData) && (userSelectId)) {
          const { id } = JSON.parse(userData);
          setUserId(parseInt(id));
          const response = await axios.post(`${SERVER_IP}/api/discussion/`,{membres:[userId,userSelectId]});
          setDiscussionResult(response.data)
          
          navigation.navigate('DiscussionUsers',{userId, discussion:discussionResult.id_discussion, userDiscussion:discussionResult.nom, profile_url:discussionResult.profile_url })
        }
    } catch (error) {
      console.error('Erreur lors de la récupération du profil utilisateur :', error);
    }
  }

  const renderUserItem = ({ item, index }) => {
    // Ne rend que les trois premiers utilisateurs par défaut
    if (index < 3 || showAllUsers) {
      return (
        <TouchableOpacity onPress={() => handleProfile(item.id)} style={styles.profileContainer}>
          <Image source={{ uri: item.profile_url }} style={styles.profileImage} />
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.nom}</Text>
            <TouchableOpacity style={styles.messageButton} onPress={() => handleSendMessage(item.id)}>
              <Ionicons name="chatbubbles" size={16} color="white" />
              <Text style={styles.messageButtonText}>Envoyer un message</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    }
    return null; // Renvoie null pour ne pas afficher d'autres utilisateurs par défaut
  };

  const renderPublicationItem = ({ item }) => (
    <View style={styles.publicationContainer}>
      <TouchableOpacity onPress={() => handleProfile(item.sender.id)} style={styles.personContainer}>
        <Image source={{ uri: item.sender.profile_url }} style={styles.personImage} />
        <Text style={styles.personName}>{item.sender.nom}</Text>
      </TouchableOpacity>

      {item.contenu && (
        <Text style={styles.title}>{item.contenu}</Text>
      )}

      {item.images_list && item.images_list.length > 0 && (
        <Image source={{ uri: item.images_list[0] }} style={styles.image} />
      )}

      {item.files_list && item.files_list.length > 0 && item.files_list.map((file, fileIndex) => (
        <TouchableOpacity style={styles.fileContainer} key={fileIndex} onPress={() => openFile(file.url)}>
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
              <TouchableOpacity style={styles.reactionButton} onPress={() => handleLike(item.id_partage)}>
                <Ionicons 
                  name="heart"  
                  size={20} 
                  color={(item.likes.filter(l=>l==userId)).length == 1 ? '#ff0000' : '#000000'}
                />
                <Text>{item.likes_number}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.commentButton} onPress={() => handleComment(item.id_partage)}>
                <Ionicons name="chatbubble-outline" size={20} color="black" />
                <Text style={styles.commentButtonText}>{item.comments_number} </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.reactionButton} onPress={() => console.log('Partager')}>
                <FontAwesome name="share" size={20} color="blue" />
              </TouchableOpacity>
        </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Recherchez une personne..."
          value={searchText}
          onChangeText={handleSearch}
        />
        {searchText ? (
          <TouchableOpacity onPress={clearSearch} style={styles.clearIcon}>
            <Ionicons name="close" style={styles.close} size={16} />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity style={styles.searchIcon} onPress={() => fetchData(searchText)}>
          <Ionicons name="search" size={34} color="black" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text style={styles.loadingText}>Chargement...</Text>
      ) : (
        <>
          <FlatList
            data={userList}
            renderItem={renderUserItem}
            keyExtractor={(item) => item.id.toString()}
            ListHeaderComponent={<Text style={styles.sectionHeader}>Utilisateurs</Text>}
            ListEmptyComponent={<Text style={styles.emptyText}>Aucun utilisateur trouvé</Text>}
          />

          {userList.length > 3 && !showAllUsers && (
            <TouchableOpacity style={styles.viewMoreButton} onPress={() => setShowAllUsers(true)}>
              <Text style={styles.viewMoreText}>Voir plus</Text>
            </TouchableOpacity>
          )}

          <FlatList
            data={publicationList}
            renderItem={renderPublicationItem}
            keyExtractor={(item) => item.id_partage.toString()}
            ListHeaderComponent={<Text style={styles.sectionHeader}>Publications</Text>}
            ListEmptyComponent={<Text style={styles.emptyText}>Aucune publication trouvée</Text>}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 8,
  },
  clearIcon: {
    marginLeft: 10,
  },
  close: {
    color: 'gray',
  },
  searchIcon: {
    marginLeft: 10,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 20,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
  },
  messageButtonText: {
    color: '#fff',
    marginLeft: 5,
  },
  publicationContainer: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  personContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  personImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  personName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 5,
    marginBottom: 5,
  },
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  fileName: {
    fontSize: 16,
    marginRight: 10,
  },
  fileIcon: {
    width: 24,
    height: 24,
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
  viewMoreButton: {
    alignItems: 'center',
    marginVertical: 10,
  },
  viewMoreText: {
    fontSize: 16,
    color: 'blue',
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

export default SearchScreen;
