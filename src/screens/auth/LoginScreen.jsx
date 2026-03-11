import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { Mail, Lock, User, Phone, MessageCircle } from 'lucide-react-native';
import { useToast } from '../../context/ToastContext';

const LoginScreen = ({ navigation, route }) => {
    const isSignupInitial = route.params?.tab === 'signup';
    const [activeTab, setActiveTab] = useState(isSignupInitial ? 'signup' : 'signin');
    const { login, register } = useContext(AuthContext);
    const { toast_success, toast_error, toast_warning } = useToast();
    const [loading, setLoading] = useState(false);

    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [sameAsPhone, setSameAsPhone] = useState(true);

    const handleLogin = async () => {
        if (!email || !password) {
            toast_warning('Please enter email & password');
            return;
        }
        setLoading(true);
        const res = await login(email, password);
        setLoading(false);
        if (res.success) {
            toast_success(`Welcome back! 👋`);
        } else {
            toast_error(res.message || 'Invalid email or password ❌');
        }
    };

    const handleRegister = async () => {
        if (!email || !password || !name || !phoneNumber) {
            toast_warning('Please fill all required fields');
            return;
        }
        if (password !== confirmPassword) {
            toast_error("Passwords don't match ❌");
            return;
        }
        setLoading(true);
        const res = await register({
            name,
            email,
            password,
            phone_number: phoneNumber,
            whatsapp_number: sameAsPhone ? phoneNumber : whatsappNumber
        });
        setLoading(false);
        if (res.success) {
            toast_success('Account created! 🎉 Please sign in');
            setActiveTab('signin');
        } else {
            toast_error(res.message || 'Registration failed. Try again!');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.logoContainer}>
                    <Text style={styles.logoNeon}>NEON</Text>
                    <Text style={styles.logoThreads}>THREADS</Text>
                </View>

                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'signin' && styles.activeTab]}
                        onPress={() => setActiveTab('signin')}
                    >
                        <Text style={[styles.tabText, activeTab === 'signin' && styles.activeTabText]}>SIGN IN</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'signup' && styles.activeTab]}
                        onPress={() => setActiveTab('signup')}
                    >
                        <Text style={[styles.tabText, activeTab === 'signup' && styles.activeTabText]}>SIGN UP</Text>
                    </TouchableOpacity>
                </View>

                {activeTab === 'signin' ? (
                    <View style={styles.form}>
                        <Text style={styles.headerText}>WELCOME BACK</Text>
                        <Text style={styles.subHeaderText}>Enter your credentials to access your stash.</Text>

                        <View style={styles.inputContainer}>
                            <Mail color="#888" size={20} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Email Address"
                                placeholderTextColor="#555"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Lock color="#888" size={20} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor="#555"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.loginButton}
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            {loading ? <ActivityIndicator color="#0a0a0a" /> : <Text style={styles.buttonText}>SIGN IN</Text>}
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.form}>
                        <Text style={[styles.headerText, { color: '#ff00aa', textShadow: '0px 0px 8px rgba(255, 0, 170, 0.4)' }]}>JOIN THE TRIBE</Text>
                        <Text style={styles.subHeaderText}>Create your identity in the neon world.</Text>

                        <View style={styles.inputContainer}>
                            <User color="#888" size={20} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Full Name"
                                placeholderTextColor="#555"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Mail color="#888" size={20} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Email Address"
                                placeholderTextColor="#555"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Phone color="#888" size={20} style={styles.inputIcon} />
                            <Text style={styles.countryCode}>+91</Text>
                            <TextInput
                                style={[styles.input, { paddingLeft: 45 }]}
                                placeholder="Phone Number"
                                placeholderTextColor="#555"
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                keyboardType="phone-pad"
                            />
                        </View>

                        <View style={styles.checkboxContainer}>
                            <TouchableOpacity
                                style={styles.checkbox}
                                onPress={() => setSameAsPhone(!sameAsPhone)}
                            >
                                <View style={[styles.checkboxInner, sameAsPhone && styles.checkboxChecked]} />
                            </TouchableOpacity>
                            <Text style={styles.checkboxLabel}>Same as phone number</Text>
                        </View>

                        {!sameAsPhone && (
                            <View style={styles.inputContainer}>
                                <MessageCircle color="#888" size={20} style={styles.inputIcon} />
                                <Text style={styles.countryCode}>+91</Text>
                                <TextInput
                                    style={[styles.input, { paddingLeft: 45 }]}
                                    placeholder="WhatsApp Number"
                                    placeholderTextColor="#555"
                                    value={whatsappNumber}
                                    onChangeText={setWhatsappNumber}
                                    keyboardType="phone-pad"
                                />
                            </View>
                        )}

                        <View style={styles.inputContainer}>
                            <Lock color="#888" size={20} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor="#555"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Lock color="#888" size={20} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm Password"
                                placeholderTextColor="#555"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.loginButton, { backgroundColor: '#ff00aa' }]}
                            onPress={handleRegister}
                            disabled={loading}
                        >
                            {loading ? <ActivityIndicator color="#0a0a0a" /> : <Text style={styles.buttonText}>SIGN UP</Text>}
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a0a' },
    scrollContent: { padding: 30, alignItems: 'center' },
    logoContainer: { flexDirection: 'row', marginTop: 60, marginBottom: 50 },
    logoNeon: {
        color: '#00ffff', fontSize: 32, fontWeight: '900', letterSpacing: 2,
        textShadow: '0px 0px 8px rgba(0, 255, 255, 0.4)'
    },
    logoThreads: { color: '#ffffff', fontSize: 32, fontWeight: '900', letterSpacing: 2 },
    tabContainer: { flexDirection: 'row', width: '100%', borderBottomWidth: 1, borderBottomColor: '#222', marginBottom: 30 },
    tab: { flex: 1, paddingVertical: 15, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
    activeTab: { borderBottomColor: '#00ffff' },
    tabText: { color: '#888', fontWeight: 'bold', letterSpacing: 1 },
    activeTabText: { color: '#00ffff' },
    form: { width: '100%' },
    headerText: {
        color: '#00ffff', fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10,
        fontFamily: Platform.OS === 'ios' ? 'Orbitron' : 'sans-serif',
        textShadow: '0px 0px 8px rgba(0, 255, 255, 0.4)'
    },
    subHeaderText: { color: '#666', textAlign: 'center', marginBottom: 40, fontSize: 14 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', borderRadius: 10, borderWidth: 1, borderColor: '#222', marginBottom: 20, paddingHorizontal: 15 },
    inputIcon: { marginRight: 10 },
    input: { flex: 1, color: '#fff', paddingVertical: 15, fontSize: 16 },
    loginButton: { backgroundColor: '#00ffff', borderRadius: 10, paddingVertical: 15, alignItems: 'center', marginTop: 10 },
    buttonText: { color: '#0a0a0a', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
    countryCode: { position: 'absolute', left: 45, color: '#888', fontSize: 16 },
    checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 1, borderColor: '#00ffff', marginRight: 10, alignItems: 'center', justifyContent: 'center' },
    checkboxInner: { width: 12, height: 12, borderRadius: 2 },
    checkboxChecked: { backgroundColor: '#00ffff' },
    checkboxLabel: { color: '#ccc', fontSize: 14 }
});

export default LoginScreen;
