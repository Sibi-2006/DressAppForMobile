import React from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { tshirtAssets } from '../config/tshirtAssets';

const COLORS = ['Black', 'White', 'Blue', 'Purple'];

const TShirtPreview = ({ selectedColor = 'Black', fitType = 'NORMAL_FIT', activeSide = 'front' }) => {

    const getImageSource = (color) => {
        const colorObj = tshirtAssets.colors.find(c => c.id === color) || tshirtAssets.colors[0];
        return colorObj.images[fitType]?.[activeSide] || colorObj.images['NORMAL_FIT'][activeSide];
    };

    return (
        <View style={styles.container}>
            {COLORS.map((color) => (
                <Image
                    key={color}
                    source={getImageSource(color)}
                    style={[
                        styles.shirtImage,
                        { opacity: selectedColor === color ? 1 : 0, position: 'absolute' }
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
