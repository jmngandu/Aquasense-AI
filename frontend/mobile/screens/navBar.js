import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation} from '@react-navigation/native';
import { SERVER_IP } from './constants'; 
function NavBar({ activeTab, onChangeTab }) {
  const [notifications,setNotifications] = useState(null);
  const [showModal, setShowModal] = useState(false);
 const [userId, setUserId] = useState(null)
 const navigation = useNavigation()

 useEffect(() => {
  const fetchNotifications = async () => {
      try {
          const response = await axios.get(`{SERVER_IP}/api/users/${userId}/notifications/`);
          setNotifications(response.data.new_notification);
      } catch {
          
      }
  };

  fetchNotifications();
}, [userId]);


  const handleLogout = () => {
    Alert.alert(
      "Déconnexion",
      
      "Êtes-vous sûr de vouloir vous déconnecter?",
      [
        {
          text: "Non",
          style: "cancel"
        },
        { text: "Oui", onPress: () => ConfirmLogout() }
      ],
      { cancelable: false }
    );
  };
  const handleNotif = () => {
    try{
      navigation.navigate('Notification', {userId});
      console.log('navigate')
    }
    catch{
      console.log(err)
    }
  }
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
  const ConfirmLogout = async () => {
    try {
      
          await axios.put(`${SERVER_IP}/api/users/logout/${userId}/`);
          await AsyncStorage.removeItem('userData');
          navigation.navigate('Welcome')
        
      
    } catch (error) {
      console.error('Erreur lors du chargement des données :', error);
    }
  };


  return (
    <View style={styles.navBar}>
      <View style={styles.leftContainer}>
      <View style={styles.aquaSenseContainer}>
        <Image source={require('../assets/logo.jpeg')} style={styles.aquaSenseImage} />
        <Text style={styles.aquaSenseText}>AQUASENSE AI</Text>
      </View>
      </View>
      <View style={styles.rightContainer}>
      <TouchableOpacity style={[styles.button, styles.settingButton]}>
        <Ionicons name="notifications" size={23} color="grey" onPress={()=>handleNotif()} />
        <Text style={styles.notif}>{notifications}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={()=>handleLogout()}>
          <Ionicons name="log-out-outline" size={23} color="#333" />
        </TouchableOpacity>
        
      </View>
   
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 5,
    paddingHorizontal: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aquaSenseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  aquaSenseImage: {
    width: 50, // Adjust the size as needed
    height: 50, // Adjust the size as needed
    marginRight: 10,
  },
  aquaSenseText: {
    fontSize: 18,
    fontWeight: 'bold',
    color:"#0072ff"
  },
  appName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'green',
    letterSpacing: 4,
    textTransform: 'uppercase',
    top:5
  },
  button: {
    padding: 10,
  },
  settingButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 20,
    marginRight: 13,
  },
  logoutButton: {
    marginRight: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding:10
  },
  modalContent: {
    backgroundColor: '#fff',
    paddingVertical: 40,
    borderRadius: 10,
    paddingHorizontal:20
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  notif:{
    backgroundColor: 'red',
    borderRadius: 20,
    color: 'white',
    position: 'absolute',
    fontWeight: 'bold',
    fontSize: 12,
    width: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NavBar;