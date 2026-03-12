import React, { useState, useContext } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView,
    Image, ActivityIndicator, Dimensions, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Image as ImageIcon, Trash2, Maximize2, RotateCw } from 'lucide-react-native';
import { CartContext } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import DraggableImage from '../../components/DraggableImage';
import api from '../../config/api';
import AppHeader from '../../components/AppHeader';
import { tshirtAssets } from '../../config/tshirtAssets';
import ColorPickerSimple from '../../components/ColorPickerSimple';

const { width } = Dimensions.get('window');
const CANVAS_SIZE = width - 32;

const SIZES = ['S', 'M', 'L', 'XL', '2XL'];
const FIT_TYPES = [
    { label: tshirtAssets.fits.normal.label, value: 'NORMAL_FIT', key: 'normal', price: parseInt(tshirtAssets.fits.normal.price.replace('₹', '')) },
    { label: tshirtAssets.fits.oversized.label, value: 'OVERSIZED_FIT', key: 'oversized', price: parseInt(tshirtAssets.fits.oversized.price.replace('₹', '')) },
];

// ─────────────────────────────────────────────────
const CustomizeScreen = ({ navigation, route }) => {
    const { addToCart } = useContext(CartContext);
    const { toast_success, toast_error, toast_warning, toast_info, toast_cart } = useToast();

    // Default params parsing
    const passedColor = route?.params?.color?.toLowerCase() || 'black';
    const passedFit = route?.params?.fit || 'NORMAL_FIT';
    const defaultFit = FIT_TYPES.find(f => f.value === passedFit) || FIT_TYPES[0];

    // State
    const [selectedColor, setSelectedColor] = useState(passedColor);
    const [fitType, setFitType] = useState(defaultFit);
    const [selectedSize, setSelectedSize] = useState('M');
    const [quantity, setQuantity] = useState(1);
    const [activeSide, setActiveSide] = useState('front');

    // Design layers
    const [frontLayers, setFrontLayers] = useState([]);
    const [backLayers, setBackLayers] = useState([]);
    const [selectedLayerId, setSelectedLayerId] = useState(null);
    const [uploading, setUploading] = useState(false);

    const activeLayers = activeSide === 'front' ? frontLayers : backLayers;
    const setActiveLayers = activeSide === 'front' ? setFrontLayers : setBackLayers;

    // Image Map as requested
    const getImage = () => {
        try {
            const imageMap = {
                'normal_black_front': require('../../../assets/tshirts/normal_black_front.png'),
                'normal_black_back': require('../../../assets/tshirts/normal_black_back.png'),
                'normal_white_front': require('../../../assets/tshirts/normal_white_front.png'),
                'normal_white_back': require('../../../assets/tshirts/normal_white_back.png'),
                'normal_blue_front': require('../../../assets/tshirts/normal_blue_front.png'),
                'normal_blue_back': require('../../../assets/tshirts/normal_blue_back.png'),
                'normal_purple_front': require('../../../assets/tshirts/normal_purple_front.png'),
                'normal_purple_back': require('../../../assets/tshirts/normal_purple_back.png'),
                'oversized_black_front': require('../../../assets/tshirts/oversized_black_front.png'),
                'oversized_black_back': require('../../../assets/tshirts/oversized_black_back.png'),
                'oversized_white_front': require('../../../assets/tshirts/oversized_white_front.png'),
                'oversized_white_back': require('../../../assets/tshirts/oversized_white_back.png'),
                'oversized_blue_front': require('../../../assets/tshirts/oversized_blue_front.png'),
                'oversized_blue_back': require('../../../assets/tshirts/oversized_blue_back.png'),
                'oversized_purple_front': require('../../../assets/tshirts/oversized_purple_front.png'),
                'oversized_purple_back': require('../../../assets/tshirts/oversized_purple_back.png'),
            };

            const key = `${fitType.key}_${selectedColor}_${activeSide}`;
            return imageMap[key];
        } catch (error) {
            console.log('Image error:', error);
            return null;
        }
    };

    const tshirtSource = getImage();

    // ──────────────────────────────────────────────
    // BUG 3 FIX: Base64 JSON upload
    // Works on BOTH web preview AND real device
    // ──────────────────────────────────────────────
    const handleAddImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                toast_error('Gallery permission denied! Enable in Settings.');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'], // Expo SDK 50+ uses array for mediaTypes. 
                allowsEditing: false,
                quality: 0.6,   // lower quality = smaller base64 = faster upload
                base64: true,   // ← works on both web preview & real device
            });

            if (result.canceled) return;

            const asset = result.assets[0];
            const mimeType = asset.mimeType || 'image/jpeg';

            console.log('Image picked:', asset.fileName, 'type:', mimeType, 'has base64:', !!asset.base64);

            if (!asset.base64) {
                toast_error('Could not read image data. Try again.');
                return;
            }

            toast_info('Uploading design... ⏳');
            setUploading(true);

            // Send as base64 JSON — backend handles both multipart and base64
            const base64Image = `data:${mimeType};base64,${asset.base64}`;

            const res = await api.post(
                '/api/upload',
                { image: base64Image },
                {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 30000,
                }
            );

            console.log('Upload response:', res.data);

            const imageUrl = res.data?.url || res.data?.secure_url || res.data?.imageUrl;

            if (!imageUrl) {
                throw new Error('No URL in response: ' + JSON.stringify(res.data));
            }

            const newLayer = {
                id: `img_${Date.now()}`,
                url: imageUrl,
                x: 20,
                y: 20,
                scale: 1,
                rotation: 0,
            };

            setActiveLayers(prev => [...prev, newLayer]);
            setSelectedLayerId(newLayer.id);
            toast_success('Design uploaded! 🎨');

        } catch (err) {
            console.log('Upload error:', err.response?.status, err.response?.data, err.message);
            toast_error(`Upload failed: ${err.response?.data?.message || err.message}`);
        } finally {
            setUploading(false);
        }
    };

    // Layer transforms
    const updateLayerTransform = (id, update) => {
        const apply = layers => layers.map(l => l.id === id ? { ...l, ...update } : l);
        if (activeSide === 'front') setFrontLayers(prev => apply(prev));
        else setBackLayers(prev => apply(prev));
    };

    const removeLayer = (id) => {
        const without = layers => layers.filter(l => l.id !== id);
        if (activeSide === 'front') setFrontLayers(prev => without(prev));
        else setBackLayers(prev => without(prev));
        setSelectedLayerId(null);
        toast_info('Image removed');
    };

    const transformControl = (type, val) => {
        const layer = activeLayers.find(l => l.id === selectedLayerId);
        if (!layer) return;
        if (type === 'move') updateLayerTransform(selectedLayerId, { x: layer.x + val.x, y: layer.y + val.y });
        if (type === 'scale') updateLayerTransform(selectedLayerId, { scale: Math.max(0.1, layer.scale + val) });
        if (type === 'rotate') updateLayerTransform(selectedLayerId, { rotation: layer.rotation + val });
    };

    // Add to cart
    const handleAddToCart = async () => {
        if (!selectedSize) { toast_warning('Please select a size!'); return; }
        if (!selectedColor) { toast_warning('Please select a color!'); return; }
        try {
            const item = {
                productId: fitType.value === 'OVERSIZED_FIT' ? 'OVERSIZED_ID' : 'NORMAL_ID',
                name: `${fitType.label} Custom T-Shirt`,
                price: fitType.price,
                quantity,
                size: selectedSize,
                color: selectedColor,
                fit_type: fitType.value,
                front_images: frontLayers,
                back_images: backLayers,
                image: frontLayers[0]?.url || backLayers[0]?.url || '',
            };
            await addToCart(item);
            toast_cart('Added to cart! 🛒');
        } catch (err) {
            toast_error('Could not add to cart!');
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <AppHeader title="CUSTOMIZE" />

            {/* Front / Back Tabs */}
            <View style={styles.sideTabs}>
                {['front', 'back'].map(side => (
                    <TouchableOpacity
                        key={side}
                        style={[styles.sideTab, activeSide === side && styles.activeSideTab]}
                        onPress={() => { setActiveSide(side); setSelectedLayerId(null); }}
                    >
                        <Text style={[styles.sideTabText, activeSide === side && styles.activeSideTabText]}>
                            {side.toUpperCase()}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* ── T-Shirt Canvas ── */}
                <View style={styles.canvasWrapper}>
                    {tshirtSource ? (
                        <Image
                            source={tshirtSource}
                            style={styles.tshirtImage}
                            resizeMode="contain"
                        />
                    ) : (
                        <View style={styles.tshirtPlaceholder}>
                            <Text style={styles.tshirtEmoji}>👕</Text>
                        </View>
                    )}

                    {/* Design layers */}
                    {activeLayers.map(layer => (
                        <DraggableImage
                            key={layer.id}
                            uri={layer.url}
                            isSelected={selectedLayerId === layer.id}
                            onSelect={() => setSelectedLayerId(layer.id)}
                            transform={layer}
                            onTransformChange={(newT) => updateLayerTransform(layer.id, newT)}
                        />
                    ))}

                    {uploading && (
                        <View style={styles.uploadOverlay}>
                            <ActivityIndicator color="#00ffff" size="large" />
                            <Text style={styles.uploadingText}>UPLOADING...</Text>
                        </View>
                    )}
                </View>

                <View style={styles.controls}>

                    {/* ── Size Selector ── */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>SIZE</Text>
                        <View style={styles.sizeRow}>
                            {SIZES.map(s => (
                                <TouchableOpacity
                                    key={s}
                                    style={[styles.sizeBtn, selectedSize === s && styles.sizeBtnActive]}
                                    onPress={() => { setSelectedSize(s); toast_info(`Size ${s} selected`); }}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[styles.sizeBtnText, selectedSize === s && styles.sizeBtnTextActive]}>
                                        {s}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* ── Color Selector ── */}
                    <ColorPickerSimple
                        onColorSelect={setSelectedColor}
                        selectedColor={selectedColor}
                    />

                    {/* ── Fit Type ── */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>FIT TYPE</Text>
                        <View style={styles.fitRow}>
                            {FIT_TYPES.map(f => (
                                <TouchableOpacity
                                    key={f.value}
                                    style={[styles.fitBtn, fitType.value === f.value && styles.fitBtnActive]}
                                    onPress={() => setFitType(f)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[styles.fitBtnLabel, fitType.value === f.value && styles.fitBtnLabelActive]}>
                                        {f.label}
                                    </Text>
                                    <Text style={[styles.fitBtnPrice, fitType.value === f.value && styles.fitBtnLabelActive]}>
                                        ₹{f.price}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* ── Quantity ── */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>QUANTITY</Text>
                        <View style={styles.qtyRow}>
                            <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(Math.max(1, quantity - 1))}>
                                <Text style={styles.qtyBtnText}>−</Text>
                            </TouchableOpacity>
                            <Text style={styles.qtyValue}>{quantity}</Text>
                            <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(quantity + 1)}>
                                <Text style={styles.qtyBtnText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* ── Upload Button ── */}
                    <TouchableOpacity style={styles.uploadBtn} onPress={handleAddImage} disabled={uploading} activeOpacity={0.7}>
                        <ImageIcon color="#00ffff" size={18} />
                        <Text style={styles.uploadBtnText}>ADD DESIGN ({activeSide.toUpperCase()})</Text>
                    </TouchableOpacity>

                    {/* ── Layer controls ── */}
                    {selectedLayerId && (
                        <View style={styles.layerBox}>
                            <Text style={styles.sectionLabel}>ADJUST DESIGN</Text>
                            <View style={styles.ctrlRow}>
                                <TouchableOpacity style={styles.ctrlBtn} onPress={() => transformControl('scale', -0.1)}>
                                    <Text style={styles.ctrlBtnText}>−</Text>
                                </TouchableOpacity>
                                <Maximize2 color="#555" size={14} />
                                <TouchableOpacity style={styles.ctrlBtn} onPress={() => transformControl('scale', 0.1)}>
                                    <Text style={styles.ctrlBtnText}>+</Text>
                                </TouchableOpacity>
                                <View style={styles.vDivide} />
                                <TouchableOpacity style={styles.ctrlBtn} onPress={() => transformControl('rotate', -15)}>
                                    <RotateCw color="#555" size={14} style={{ transform: [{ scaleX: -1 }] }} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.ctrlBtn} onPress={() => transformControl('rotate', 15)}>
                                    <RotateCw color="#555" size={14} />
                                </TouchableOpacity>
                                <View style={styles.vDivide} />
                                <TouchableOpacity style={styles.ctrlBtn} onPress={() => removeLayer(selectedLayerId)}>
                                    <Trash2 color="#ff3333" size={16} />
                                </TouchableOpacity>
                            </View>
                            {/* D-Pad */}
                            <View style={styles.dPad}>
                                <TouchableOpacity style={styles.dBtn} onPress={() => transformControl('move', { x: 0, y: -8 })}>
                                    <Text style={styles.dBtnText}>▲</Text>
                                </TouchableOpacity>
                                <View style={styles.dRow}>
                                    <TouchableOpacity style={styles.dBtn} onPress={() => transformControl('move', { x: -8, y: 0 })}>
                                        <Text style={styles.dBtnText}>◀</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.dBtn, styles.centerBtn]} onPress={() => updateLayerTransform(selectedLayerId, { x: 0, y: 0 })}>
                                        <Text style={styles.centerText}>CTR</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.dBtn} onPress={() => transformControl('move', { x: 8, y: 0 })}>
                                        <Text style={styles.dBtnText}>▶</Text>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity style={styles.dBtn} onPress={() => transformControl('move', { x: 0, y: 8 })}>
                                    <Text style={styles.dBtnText}>▼</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {/* ── Add to Cart ── */}
                    <TouchableOpacity style={styles.cartBtn} onPress={handleAddToCart} activeOpacity={0.8}>
                        <Text style={styles.cartBtnText}>🛒  ADD TO CART — ₹{fitType.price * quantity}</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a0a' },
    scrollContent: { paddingBottom: 60 },

    sideTabs: { flexDirection: 'row', backgroundColor: '#0f0f0f', borderBottomWidth: 1, borderBottomColor: '#1a1a1a' },
    sideTab: { flex: 1, paddingVertical: 13, alignItems: 'center' },
    activeSideTab: { borderBottomWidth: 2, borderBottomColor: '#00ffff' },
    sideTabText: { color: '#444', fontWeight: '700', fontSize: 11, letterSpacing: 2 },
    activeSideTabText: { color: '#00ffff' },

    canvasWrapper: {
        width: CANVAS_SIZE, height: CANVAS_SIZE * 1.1,
        alignSelf: 'center', marginTop: 16,
        borderRadius: 12, overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#111',
        borderWidth: 1, borderColor: '#1a1a1a',
    },
    tshirtImage: { width: '100%', height: '100%' },
    tshirtPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    tshirtEmoji: { fontSize: 80, opacity: 0.3 },

    uploadOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.75)',
        justifyContent: 'center', alignItems: 'center', zIndex: 99,
    },
    uploadingText: { color: '#00ffff', fontSize: 11, marginTop: 10, fontWeight: '700', letterSpacing: 2 },

    controls: { padding: 20 },
    section: { marginBottom: 20 },
    sectionLabel: { color: '#555', fontSize: 10, fontWeight: '700', letterSpacing: 3, marginBottom: 10 },

    sizeRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
    sizeBtn: { width: 52, height: 52, borderRadius: 8, borderWidth: 1, borderColor: '#2a2a2a', backgroundColor: '#111', justifyContent: 'center', alignItems: 'center' },
    sizeBtnActive: { borderColor: '#00ffff', backgroundColor: '#001a1a' },
    sizeBtnText: { color: '#555', fontSize: 13, fontWeight: '700' },
    sizeBtnTextActive: { color: '#00ffff' },

    colorRowInner: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    colorListBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', borderRadius: 10, marginBottom: 8 },
    colorListBtnActive: { backgroundColor: 'rgba(0,255,249,0.08)', borderColor: 'rgba(0,255,249,0.5)' },
    colorCircle: { width: 24, height: 24, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
    colorCircleActive: { borderColor: '#00ffff', borderWidth: 2 },
    colorNameLabel: { color: '#ccc', fontSize: 13, fontWeight: '400', letterSpacing: 1 },
    colorNameLabelActive: { color: '#00ffff', fontWeight: '700' },
    colorListCheck: { color: '#00ffff', fontSize: 16, fontWeight: '900' },

    fitRow: { flexDirection: 'row', gap: 10 },
    fitBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: '#2a2a2a', backgroundColor: '#111', alignItems: 'center' },
    fitBtnActive: { borderColor: '#ff00aa', backgroundColor: '#1a0011' },
    fitBtnLabel: { color: '#555', fontSize: 12, fontWeight: '700', marginBottom: 2 },
    fitBtnLabelActive: { color: '#ff00aa' },
    fitBtnPrice: { color: '#555', fontSize: 10 },

    qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    qtyBtn: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#111', borderWidth: 1, borderColor: '#2a2a2a', justifyContent: 'center', alignItems: 'center' },
    qtyBtnText: { color: '#fff', fontSize: 20, fontWeight: '700' },
    qtyValue: { color: '#fff', fontSize: 18, fontWeight: '900', minWidth: 30, textAlign: 'center' },

    divider: { height: 1, backgroundColor: '#1a1a1a', marginVertical: 16 },

    uploadBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 15, borderRadius: 10, backgroundColor: 'rgba(0,255,255,0.04)', borderWidth: 1, borderStyle: 'dashed', borderColor: 'rgba(0,255,255,0.3)', marginBottom: 16 },
    uploadBtnText: { color: '#00ffff', fontSize: 11, fontWeight: '700', letterSpacing: 1 },

    layerBox: { backgroundColor: '#111', borderRadius: 14, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#1a1a1a' },
    ctrlRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginBottom: 16 },
    ctrlBtn: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#1a1a1a', justifyContent: 'center', alignItems: 'center' },
    ctrlBtnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
    vDivide: { width: 1, height: 24, backgroundColor: '#2a2a2a' },

    dPad: { alignItems: 'center', gap: 4 },
    dRow: { flexDirection: 'row', gap: 4 },
    dBtn: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#1a1a1a', justifyContent: 'center', alignItems: 'center' },
    dBtnText: { color: '#555', fontSize: 14 },
    centerBtn: { backgroundColor: '#0f0f0f' },
    centerText: { color: '#444', fontSize: 9, fontWeight: '700' },

    cartBtn: { backgroundColor: '#00ffff', borderRadius: 12, paddingVertical: 18, alignItems: 'center', marginTop: 8, shadowColor: '#00ffff', shadowOffset: { width: 0, height: 0 }, shadowRadius: 12, shadowOpacity: 0.3 },
    cartBtnText: { color: '#0a0a0a', fontWeight: '900', fontSize: 14, letterSpacing: 1 },
});

export default CustomizeScreen;
