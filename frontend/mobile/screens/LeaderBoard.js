import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, SafeAreaView } from 'react-native';

const Leaderboard = () => {
  const [data, setData] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    // Données statiques pour l'exemple
    const leaderboardData = [
      {
        rank: 1,
        name: 'Lucas Friman',
        country: 'UK',
        points: 1047,
        image: require('../assets/hero1.jpg'),
      },
      {
        rank: 2,
        name: 'Julie Georges',
        country: 'Switzerland',
        points: 914,
        image: require('../assets/hero2.jpg'),
      },
      {
        rank: 3,
        name: 'Guillaume Mps',
        country: 'France',
        points: 908,
        image: require('../assets/hero3.jpg'),
      },
      {
        rank: 4,
        name: 'Pierre Loger',
        country: 'France',
        points: 856,
        image: require('../assets/hero2.jpg'),
      },
      {
        rank: 5,
        name: 'Mona Lopez',
        country: 'United States',
        points: 833,
        image: require('../assets/hero1.jpg'),
      },
      {
        rank: 6,
        name: 'Franck Ri',
        country: 'UK',
        points: 832,
        image: require('../assets/profil.jpg'),
      },
    ];

    const currentUser = {
      rank: 5,
      points: 833,
      image: require('../assets/profil.jpg'), // Use your uploaded image for the current user
    };

    setData(leaderboardData);
    setUser(currentUser);
  }, []);

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.listItem,
        item.rank === 1 && styles.firstItem, // Apply different style for the first item
      ]}
    >
      <View style={styles.rankContainer}>
        <Text style={styles.rankText}>{item.rank}</Text>
      </View>
      <Image source={item.image} style={styles.avatar} />
      <View style={styles.listItemContent}>
        <Text style={styles.listItemTitle}>{item.name}</Text>
        <Text style={styles.listItemSubtitle}>{item.country}</Text>
      </View>
      <Text style={styles.points}>{item.points}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Leaderboard</Text>
         
          <View style={styles.userInfo}>
            <Image source={user.image} style={styles.userImage} />
            <View>
              <Text style={styles.userRank}>{user.rank}ème</Text>
              <Text style={styles.userPoints}>{user.points} Pts</Text>
            </View>
          </View>
        </View>
        <FlatList
          data={data}
          keyExtractor={(item) => item.rank.toString()}
          renderItem={renderItem}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#e0f7fa',
  },
  container: {
    flex: 1,
    backgroundColor: '#ddd',
    margin: 20,
    top: 10,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
    padding: 25,
    gap:5
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0072ff',
    letterSpacing:5,
  },
  subtitle: {
    fontSize: 16,
    color: '#004d40',
    marginTop: 5,
    textAlign: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap:10
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  userRank: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0072af',
  },
  userPoints: {
    fontSize: 20,
    color: '#004d40',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor:'#fff',
    marginTop:10
    
  },
  firstItem: {
    backgroundColor: '#ffeb3b', 
  },
  rankContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#0072ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    
  },
  rankText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  listItemContent: {
    flex: 1,
   
    
  },
  listItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  listItemSubtitle: {
    fontSize: 14,
    color: '#757575',
  },
  points: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'orange',
  },
});

export default Leaderboard;
