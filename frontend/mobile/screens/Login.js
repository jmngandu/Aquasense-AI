import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER_IP } from './constants';

const Login = ({ navigation }) => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');0
  const [error, setError] = useState('');
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  

  const handleSignup = () => {
    navigation.navigate('Signup');
  };

  const handleLogin = async () => {
    

    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      
      return;
    }

    setError(null); 

    try {
       const response = await axios.post(`${SERVER_IP}/api/users/login/`, { email, password });
       await AsyncStorage.setItem('userData', JSON.stringify({ email, id: response.data.id , nom: response.data.nom }));
       setUserId(response.data.id)
      
      navigation.navigate('HomeScreen', { userId });
    } catch (err) {
      Alert.alert('Erreur', 'votre adresse email ou mots de passe est incorrect');
      navigation.navigate('HomeScreen', { userId });
    }
 
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome! 👋</Text>
        <Text style={styles.subtitle}>Good Morning, Have a good surf!</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="mail" size={24} color="black" style={styles.inputIcon} />
          <TextInput
            placeholder="Adresse Email"
            value={email}
            onChangeText={text => setEmail(text)}
            style={[styles.input, isEmailFocused && styles.inputFocused]}
            onFocus={() => setIsEmailFocused(true)}
            onBlur={() => setIsEmailFocused(false)}
          />
        </View>
        <View style={styles.passwordInput}>
          <Ionicons name="lock-closed" size={24} color="black" style={styles.inputIcon} />
          <TextInput
            placeholder="Mot de passe"
            value={password}
            onChangeText={text => setPassword(text)}
            secureTextEntry={!isPasswordShown}
            style={[styles.input, isPasswordFocused && styles.inputFocused]}
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
          />
          <TouchableOpacity onPress={() => setIsPasswordShown(!isPasswordShown)}>
            <Ionicons name={isPasswordShown ? 'eye-off' : 'eye'} size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.checkboxContainer}>
          <Checkbox
            value={isChecked}
            onValueChange={setIsChecked}
            color="#007bff"
            style={styles.checkbox}
          />
          <Text>Se souvenir de moi</Text>
        </View>
         
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Connexion</Text>
          </TouchableOpacity>
      
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Je n'ai pas de compte</Text>
          <TouchableOpacity onPress={handleSignup}>
            <Text style={[styles.signupText, { color: '#0072ff', marginLeft: 5, fontWeight: "700" }]}>S'inscrire</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '80%',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color:'#0072af'
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    height: 46,
    paddingHorizontal: 10,
    marginBottom: 20,
    
  },
  inputIcon: {
    marginRight: 10,
    color: '#969587',
  },
  input: {
    flex: 1,
    fontSize: 11
  },
  inputFocused: {
    borderColor: '#007bff',
  },
  passwordInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 8,
    height: 46,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    marginRight: 8,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 17,
  },
  signupText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: '#0072ff',
    height: 45,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
    display: "flex"
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 5,
  },
  loadingSuccess: {
    backgroundColor: 'green',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    marginTop: 10,
  },
  successText: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default Login;
