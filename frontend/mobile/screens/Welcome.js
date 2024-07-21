import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated, StyleSheet, Easing } from 'react-native';
import Button from '../components/Button';
import Loader from '../components/Loader';

const Welcome = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(true);
    const rotateValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsLoading(false);
        }, 3000);

        // Animation de rotation infinie
        const startRotation = () => {
            rotateValue.setValue(0);
            Animated.timing(rotateValue, {
                toValue: 1,
                duration: 5000,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start(() => startRotation());
        };

        startRotation();

        return () => clearTimeout(timeout);
    }, [rotateValue]);

    const rotation = rotateValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={{ flex: 1 }}>
            {isLoading ? (
                <Loader />
            ) : (
                <View style={{ justifyContent: 'space-between', alignItems: 'center', padding: 5 }}>
                    <Animated.Image
                        source={require('../assets/AImanage.png')}
                        style={[styles.image, { transform: [{ rotate: rotation }] }]}
                    />
                    
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>JOIN THE CHANGE</Text>
                        <Text style={styles.subtitle}>Help us manage waste and water more efficiently with AI. Together, we can create smarter solutions for a sustainable future</Text>
                    </View>

                    <Button
                        title="Login"
                        onPress={() => navigation.navigate("Login")}
                        style={styles.loginButton}
                    />

                    <Pressable
                        onPress={() => navigation.navigate("Signup")}
                        style={styles.signupLink}
                    >
                        <Text style={styles.signupText}>Have you not an account?</Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    image: {
        width: '90%',
        height: 340,
        marginTop: 45,
    },
    textContainer: {
        alignItems: 'center',
        marginVertical: 10,
        height: '30%',
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: "#0072ff",
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 19,
        color: "#000",
        textAlign: 'center',
        marginTop: 20,
    },
    loginButton: {
        marginTop: 0,
        width: "60%",
        height: 50,
        borderColor: "#0072ff",
        backgroundColor: "#0072ff",
    },
    signupLink: {
        marginTop: 20,
    },
    signupText: {
        fontSize: 16,
        color: "#000",
        fontWeight: "800",
        textAlign: 'center',
    },
});

export default Welcome;
