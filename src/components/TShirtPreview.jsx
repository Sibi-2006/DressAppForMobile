import React from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';

const COLORS = ['Black', 'White', 'Skyblue', 'Purple'];

const TShirtPreview = ({ selectedColor = 'Black', fitType = 'NORMAL_FIT', activeSide = 'front' }) => {

    const getImagePath = (color) => {
        const fitPrefix = fitType === 'OVERSIZED_FIT' ? 'Oversized_fit' : 'Normal_fit';
        const sideSuffix = activeSide === 'front' ? 'frontside' : 'backside';

        // Using the same convention as web app assets
        return `https://dressappclient.onrender.com/assets/${fitType}/${fitPrefix}_${color}_${sideSuffix}.png`;
    };

    return (
        <View style={styles.container}>
            {COLORS.map((color) => (
                <Image
                    key={color}
                    source={{ uri: getImagePath(color) }}
                    style={[
                        styles.shirtImage,
                        { opacity: selectedColor === color ? 1 : 0 }
                    ]}
                    resizeMode="contain"
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        aspectRatio: 1,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    shirtImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    }
});

export default TShirtPreview;
