import React from 'react';
import { View, Image, StyleSheet, PanResponder } from 'react-native';

// Simplified DraggableImage using PanResponder instead of reanimated
// to avoid potential initialization crashes
const DraggableImage = ({ uri, isSelected, onSelect, transform, onTransformChange }) => {
    const panResponder = React.useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                onSelect();
            },
            onPanResponderMove: (evt, gestureState) => {
                onTransformChange({
                    x: (transform.x || 0) + gestureState.dx,
                    y: (transform.y || 0) + gestureState.dy,
                });
            },
            onPanResponderRelease: () => { },
        })
    ).current;

    const t = transform || { x: 0, y: 0, scale: 1, rotation: 0 };

    return (
        <View
            {...panResponder.panHandlers}
            style={[
                styles.container,
                {
                    transform: [
                        { translateX: t.x || 0 },
                        { translateY: t.y || 0 },
                        { scale: t.scale || 1 },
                        { rotate: `${t.rotation || 0}deg` },
                    ],
                    borderColor: isSelected ? '#00ffff' : 'transparent',
                    borderWidth: isSelected ? 1 : 0,
                },
            ]}
        >
            <Image source={{ uri }} style={styles.image} resizeMode="contain" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: 150,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    image: {
        width: '100%',
        height: '100%',
    },
});

export default DraggableImage;
