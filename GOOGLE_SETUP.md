# 🔐 Authentication Setup Guide

## **Current Implementation (Expo Go Compatible)**

The app currently uses a **simplified authentication system** that works with Expo Go:

- ✅ **Session persistence** using AsyncStorage
- ✅ **Mock authentication** for development
- ✅ **Expo Go compatible** - no native dependencies
- ✅ **Ready to use** immediately

## **For Production (Real Google Sign-In)**

When you're ready to deploy to production, you can upgrade to real Google Sign-In:

### **Option 1: Development Build (Recommended)**
```bash
npx expo install expo-dev-client
npx expo run:android  # or run:ios
```

### **Option 2: EAS Build**
```bash
npm install -g @expo/eas-cli
eas build --platform android  # or ios
```

### **Option 3: Expo Auth Session (Expo Go Compatible)**
```bash
npx expo install expo-auth-session expo-crypto
```

## **Current Features**

- **Mock Sign-In**: Tap "Sign In" to authenticate
- **Session Persistence**: Stays logged in across app restarts
- **User Profile**: Shows welcome message with user name
- **Secure Logout**: Properly clears all authentication data
- **Expo Go Compatible**: Works immediately without configuration

## **Testing the Current Setup**

1. Run `npm start`
2. Scan QR code with Expo Go
3. Tap "Sign In" button
4. You'll be authenticated as "Demo User"
5. Navigate through the app
6. Use logout button to sign out

## **Next Steps**

1. **Test the current setup** - it should work immediately
2. **Customize the mock user** in `AuthContext.tsx` if needed
3. **When ready for production**, follow the development build steps above

The current implementation gives you a fully functional authentication system that works with Expo Go while maintaining the same user experience!
