import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER_IP } from './constants';
const ListeDiscussions = () => {
const [userId, setUserId] = useState(null)  
const [discussion, setDiscussion] = useState(null)
useEffect(() => {
  const fetchUserId = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const { id } = JSON.parse(userData);
        setUserId(parseInt(id));
      }
    } catch (error) {
     
    }
  };

  fetchUserId();
  
}, []);
useEffect(()=>{
    const fetchDiscussion= async () =>{
      try {
        const response = await axios.get(`${SERVER_IP}/api/users/connected/`);
        setDiscussion(response.data);
       
       
      } catch (error) {
        console.error('Erreur lors du chargement des données :', error);
      }

    }
fetchDiscussion()

},[])

  return (
    <ScrollView horizontal={true}>
      <View style={styles.container}>
          {discussion && discussion.map((discussion) => (
            discussion.id !== userId && (
                    <View key={discussion.id} style={styles.discussionContainer}>
                        <View style={styles.avatarContainer}>
                            <Image source={{ uri: discussion.profile_url }} style={styles.avatar} />
                            <View style={styles.statusIndicator} />
                        </View>
                        <Text style={styles.nom}>{(discussion.nom.split(' '))[0]}</Text>
                    </View>
                )
            ))}
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  discussionContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
    marginRight: 7, 
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginBottom: 5, 
  },
  nom: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 5,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'green',
    borderWidth: 2,
    borderColor: '#fff',
  },
});
export default ListeDiscussions;
