import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const WelcomeToast = ({ message }) => {
    if (!message) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{message.toUpperCase()}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(0, 255, 255, 0.1)',
        borderBottomWidth: 1,
        borderBottomColor: '#00ffff',
        paddingVertical: 10,
        alignItems: 'center',
        width: '100%',
    },
    text: {
        color: '#00ffff',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 2,
    }
});

export default WelcomeToast;
