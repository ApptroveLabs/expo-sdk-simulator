# AppTrove Expo SDK Simulator

A comprehensive React Native Expo application demonstrating the complete implementation of the **AppTrove Expo SDK** with all core and advanced features, including event tracking, deep linking, Apple Ads Token, uninstall tracking, and the new **APNs & FCM Push Token registration** integration.

**Official Documentation:** [AppTrove Expo SDK Documentation](https://developers.apptrove.com/docs/expo-sdk/intro)

---

## 📱 App Overview

This simulator app showcases the full capabilities of the AppTrove Expo SDK, providing a rich, developer-friendly sandbox to test mobile app attribution, deep linking, user metadata, and push token handshakes.

**Bundle Identifier:** `com.anonymous.exposdksimulator`

---

## ✨ Features Implemented

### 1. AppTrove SDK Core Features
* SDK Initialization with Configuration
* Event Tracking (Predefined Built-in & Custom Events)
* Universal Deep Link Handling (Cold & Warm states)
* Deferred Deep Link Callback Listener
* Extensive User Metadata Management
* Dynamic Link Resolution & Generation
* Real-time Campaign Attribution Variables display

### 2. 🔔 Newly Added Push Token Integrations
* **FCM Token Simulation (Android)**: Call `AppTroveSDK.sendFcmToken(token)` directly from a custom dashboard.
* **APN Token Simulation (iOS)**: Call `AppTroveSDK.sendAPNToken(token)` directly from a custom dashboard.
* Dynamic Mock Token Generator for both platforms.
* Real-time in-app simulation logs.

### 3. Platform-Specific Features
* **iOS**: Apple Ads Token (IDFA) with standard App Tracking Transparency flow.
* **Android**: Install Referrer and manual analytics bindings for app uninstalls.

### 4. Security & Compliance
* AES_GCM encryption for data transmission.
* App secret code signing for secure API requests.
* Native ProGuard configuration rules for release obfuscation.

---

## 📂 Project Structure

```
expo-sdk-simulator/
├── App.js                          # SDK initialization, core event listeners & routing config
├── index.js                        # App registration entry point
├── app.json                        # Expo app plugins registration
├── fix-nodejs.sh                   # Android Studio Node.js environment patcher
├── assets/                         # Local storefront cupcake images
└── screens/                        # Interactive Simulator UI Screen Deck
    ├── HomeScreen.js               # Main Dashboard with Ionicons navigation
    ├── BuiltInEventsScreen.js      # Sandbox for 15 standard Trackier events
    ├── CustomEventsScreen.js       # Dynamic event tracker with custom parameter lists
    ├── CompleteEventScreen.js      # High-coverage tracking case (User IDs, IMEI, MAC, JSON metadata)
    ├── CakeScreen.js               # Product details showcase (Add-to-cart, Purchase flows)
    ├── ProductPageScreen.js        # Individual product view tracker
    ├── DeepLinkingScreen.js        # Deep Link parsing & simulation cockpit
    ├── DynamicLinkScreen.js        # Dynamic link creator & resolution engine
    └── CampaignDataScreen.js       # Real-time dashboard showing Click IDs & campaign variables
```

---

## ⚙️ SDK Setup & Code Snips

### 1. Core Initialization (`App.js`)

```javascript
import { AppTroveConfig, AppTroveSDK } from 'apptrove-expo-sdk';

const initializeAppTroveSDK = async () => {
  const sdkConfig = new AppTroveConfig(
    "YOUR_APP_TOKEN", // Get from AppTrove Dashboard
    AppTroveConfig.EnvironmentDevelopment
  );
  
  // Set app secret for SDK signing
  sdkConfig.setAppSecret("SECRET_ID", "SECRET_KEY");
  sdkConfig.setAppId("MYcJ6a79MQ");
  sdkConfig.setEncryptionKey("YOUR_AES_GCM_ENCRYPTION_KEY");
  sdkConfig.setEncryptionType(AppTroveConfig.EncryptionType.AES_GCM);
  sdkConfig.setFacebookAppId("YOUR_FACEBOOK_APP_ID");
  sdkConfig.setAndroidId("custom_android_device_id_123");

  // Deferred Deep Link Listener
  sdkConfig.setDeferredDeeplinkCallbackListener((uri) => {
    console.log("Deferred Deep Link Callback received: " + uri);
  });

  // Initialize
  AppTroveSDK.initialize(sdkConfig);
};
```

### 2. Automated Push Token Registration (`App.js`)

The app automatically requests push notification permissions on startup, retrieves the native device push token using `expo-notifications`, and sends the token directly to the AppTrove SDK:

```javascript
import * as Notifications from 'expo-notifications';

const registerPushNotificationsWithAppTrove = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') return;

  // Retrieve native device token (FCM on Android, APNs on iOS)
  const deviceToken = await Notifications.getDevicePushTokenAsync();
  const token = deviceToken.data;

  if (deviceToken.type === 'android') {
    AppTroveSDK.sendFcmToken(token);
  } else if (deviceToken.type === 'ios') {
    AppTroveSDK.sendAPNToken(token);
  }
};
```

---

## 🚀 Getting Started

### Prerequisites
* Node.js v18+
* Expo CLI
* iOS Simulator / Android Emulator

### Installation & Run

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure AppTrove Credentials**
   * Open `App.js` and insert your actual Token, App Secret, and App ID credentials.

3. **Run the Simulator**
   ```bash
   # Start the development client
   npx expo start

   # Build / run iOS
   npx expo run:ios

   # Build / run Android
   npx expo run:android
   ```

---

## 🔒 ProGuard Rules (`android/app/proguard-rules.pro`)

If your application uses optimization tools, add these lines to keep the native modules:

```proguard
# AppTrove SDK ProGuard rules
-keep class com.apptrove.sdk.** { *; }

# Google Play Services ProGuard rules for Advertising ID
-keep class com.google.android.gms.common.ConnectionResult {
    int SUCCESS;
}
-keep class com.google.android.gms.ads.identifier.AdvertisingIdClient {
    com.google.android.gms.ads.identifier.AdvertisingIdClient$Info getAdvertisingIdInfo(android.content.Context);
}
-keep class com.google.android.gms.ads.identifier.AdvertisingIdClient$Info {
    java.lang.String getId();
    boolean isLimitAdTrackingEnabled();
}
-keep public class com.android.installreferrer.** { *; }
```

---

## 📞 Support & Contacts

* Developers Portal: [AppTrove Docs](https://developers.apptrove.com)
* Technical Support: [support@apptrove.com](mailto:support@apptrove.com)
