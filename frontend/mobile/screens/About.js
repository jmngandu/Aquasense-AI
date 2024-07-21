import React from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Importation de Ionicons depuis react-native-vector-icons
import COLORS from '../constants/colors';

const About = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name="information-circle-outline" size={100} color={COLORS.primary} />
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 20 }}>À propos</Text>
            <Text style={{ fontSize: 16, textAlign: 'center', marginHorizontal: 20, marginTop: 20 }}>
                IZARA est une application de messagerie sécurisée et privée qui permet aux utilisateurs de se connecter les uns aux autres en discutant, en appelant et en partageant des fichiers de manière sécurisée.
            </Text>
            <View style={{ marginTop: 20 }}>
                <Text style={{ fontSize: 16 }}>Date de création : Janvier 2023</Text>
                <Text style={{ fontSize: 16 }}>Licence : Licence ouverte MIT</Text>
            </View>
        </View>
    );
}

export default About;