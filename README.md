# DressAppForMobile

NEONTHREADS — Custom T-Shirt Design Mobile App built with React Native & Expo.

## Features
- 🎨 Dual-side custom t-shirt design (front & back)
- 🛒 Cart & Checkout with UPI payment
- 📦 Order tracking
- 👤 User authentication (cookie-based)
- 🔔 Toast notification system
- 🌙 Dark neon theme

## Tech Stack
- React Native (Expo ~54)
- React Navigation v7
- Axios (cookie-based auth)
- AsyncStorage (session persistence)
- expo-image-picker

## Build
```bash
npm install --legacy-peer-deps
npx expo start --clear

# Production APK
eas build -p android --profile release
```
