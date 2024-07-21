import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const Water = () => {
  const [data, setData] = useState({
    temperature: 31,
    ph: 7.5,
    remainingWater: 200,
    aiPotability: 'Potable',
    sourceState: 'Normal',
    dailyWaterQuantity: [
      { time: '12:00', value: 28 },
      { time: '13:00', value: 29 },
      { time: '14:00', value: 30 },
      { time: '15:00', value: 31 },
      { time: '16:00', value: 30 },
      { time: '17:00', value: 29 },
    ],
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.icon}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Water Potability</Text>
        <TouchableOpacity>
          <Text style={styles.icon}>{"🙂"}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.searchBar}>
        <TextInput placeholder="Search" style={styles.searchInput} />
        

      </View>
      <Text style={styles.title}>Hi! Here is the water potability status.</Text>
      <Text style={styles.subtitle}>Location: Sample Location</Text>
      <View style={styles.mainInfo}>
        <LineChart
          data={{
            labels: data.dailyWaterQuantity.map(a => a.time),
            datasets: [{ data: data.dailyWaterQuantity.map(a => a.value) }],
          }}
          width={screenWidth - 40}
          height={260}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
            style: { borderRadius: 5 },
          }}
          bezier
          style={{ marginVertical: 8, borderRadius: 16 }}
        />
      </View>
      <View style={styles.titleWater}>
            <Text style={styles.titleWaterText}>
            Management of the water
            </Text>
      </View>
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>pH Level</Text>
          <Text style={styles.cardText}>{data.ph}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Remaining Water</Text>
          <Text style={styles.cardText}>{data.remainingWater}L</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>AI Potability</Text>
          <Text style={styles.cardText}>{data.aiPotability}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Source State</Text>
          <Text style={styles.cardText}>{data.sourceState}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f0f4f7',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    top:15
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color:"#0072af",
    letterSpacing: 4
  },
  icon: {
    fontSize: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  searchInput: {
    marginLeft: 10,
    color: '#888',
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
  mainInfo: {
    alignItems: 'center',
    marginBottom: 0,
  },
  mainTemperature: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: screenWidth / 2 - 30,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color:"#0072af"
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  titleWater:{
    padding:10,
    color:"#0072ff",
    fontSize:21

  },
  titleWaterText:{
    padding:10,
    color:"#0072ff",
    fontSize:21,
    letterSpacing: 2
  }
});

export default Water;
