import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileScreen from './ProfileScreen';
import SearchScreen from './SearchScreen';
import DiscussionScreen from './DiscussionScreen';
import PublicationScreen from './publication';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const { id } = JSON.parse(userData);
          setUserId(parseInt(id));
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    fetchUserId();
  }, []);

  if (userId === null) {
    return null; // or return a loading spinner, splash screen, etc.
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let iconColor = focused ? '#2ecc71' : 'grey';

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Search') {
            iconName = 'search';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          } else if (route.name === 'Discussion') {
            iconName = 'chatbubbles';
          }

          return <Ionicons name={iconName} size={size} color={iconColor} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#2ecc71',
        inactiveTintColor: 'grey',
        style: {
          backgroundColor: '#FF084B',
          borderTopWidth: 0,
          elevation: 8,
          height: 150,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          padding: 20,
        },
        labelStyle: {
          fontSize: 10,
          marginBottom: 5,
          padding: 1,
        },
      }}
    >
      <Tab.Screen name="Home" component={PublicationScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Discussion" component={DiscussionScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Search" component={SearchScreen} options={{ headerShown: false }} />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
        initialParams={{ userId }}  
      />
    </Tab.Navigator>
  );
}

export default TabNavigator;
