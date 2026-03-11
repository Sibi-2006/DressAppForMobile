import React from 'react';
import { Text, StyleSheet } from 'react-native';

export const GlowText = ({ children, style, color = '#00ffff', intensity = 'medium' }) => {
    const glowRadius = intensity === 'strong' ? 15 : intensity === 'subtle' ? 4 : 8;
    const glowOpacity = intensity === 'strong' ? 0.9 : intensity === 'subtle' ? 0.3 : 0.5;
    const glowColor = color === '#ff00aa'
        ? `rgba(255,0,170,${glowOpacity})`
        : color === '#00ff88'
            ? `rgba(0,255,136,${glowOpacity})`
            : `rgba(0,255,255,${glowOpacity})`;

    return (
        <Text style={[
            styles.base,
            { color },
            {
                textShadowColor: glowColor,
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: glowRadius,
            },
            style,
        ]}>
            {children}
        </Text>
    );
};

const styles = StyleSheet.create({
    base: {
        fontWeight: '700',
    },
});

export default GlowText;
