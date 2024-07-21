import React, { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Welcome from './Welcome'; // Importez le composant Welcome

const random = () => parseInt(Math.random() * 255);
const randomColor = () => 'rgb(' + random() + ',' + random() + ',' + random() + ')';

const Dim = 50;

export default function Loader5() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Après 3 secondes, passez à la page Welcome
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return isLoading ? (
    <View style={styles.container}>
      {/* Votre Loader ici */}
    </View>
  ) : (
    <Welcome /> // Passez à la page Welcome une fois le chargement terminé
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  item: {
    width: Dim,
    height: Dim,
    borderWidth: 0,
    backgroundColor: 'transparent',
    position: 'absolute',
    justifyContent: 'center'
  },
  innerItem: {
    height: 10,
    width: 10,
    borderRadius: 10
  }
});