import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import * as Linking from 'expo-linking';

// Import AppTrove SDK
import { AppTroveConfig, AppTroveSDK, AppTroveEvent } from 'apptrove-expo-sdk';

// Firebase Analytics will be imported dynamically to avoid build errors

// Import Screens
import HomeScreen from './screens/HomeScreen';
import BuiltInEventsScreen from './screens/BuiltInEventsScreen';
import CustomEventsScreen from './screens/CustomEventsScreen';
import DeepLinkingScreen from './screens/DeepLinkingScreen';
import DynamicLinkScreen from './screens/DynamicLinkScreen';
import ProductPageScreen from './screens/ProductPageScreen';
import AddToCartScreen from './screens/AddToCartScreen';
import CakeScreen from './screens/CakeScreen';
import CampaignDataScreen from './screens/CampaignDataScreen';
import CompleteEventScreen from './screens/CompleteEventScreen';
import * as Notifications from 'expo-notifications';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [deferredDeeplinkUri, setDeferredDeeplinkUri] = useState(null);
  const [initialDeepLink, setInitialDeepLink] = useState(null);
  const navigationRef = useRef(null);

  useEffect(() => {
    initializeAppTroveSDK();
  }, []);

  const initializeAppTroveSDK = async () => {
    try {
      // Check if AppTroveSDK is available
      if (!AppTroveSDK || !AppTroveConfig) {
        console.warn("AppTrove SDK not available - running in demo mode");
        setInitializing(false);
        return;
      }

      // Initialize AppTrove SDK
      const sdkConfig = new AppTroveConfig(
        "SDk Key", // Replace with your actual app token
        AppTroveConfig.EnvironmentDevelopment
      );
      
      // Set app secret for SDK signing (optional)
      // if (sdkConfig.setAppSecret) {
      //   sdkConfig.setAppSecret(
      //     "Add Secret Id", // Replace with your actual secret ID
      //     "Add Secret Key" // Replace with your actual secret key
      //   );
      // }

      // Set App ID
      // sdkConfig.setAppId("MYcJ6a79MQ"); // Replace with your actual App ID

      // Set encryption key for secure data transmission 
      // sdkConfig.setEncryptionKey("Your Encruption Keys"); // Replace with your encryption key

      // Set encryption type 
      // sdkConfig.setEncryptionType(AppTroveConfig.EncryptionType.AES_GCM); // Use AES_GCM encryption

      // Set Facebook App ID for Meta attribution (Android)
      sdkConfig.setFacebookAppId("123456789012345"); // Replace with your actual Facebook App ID

      // Set custom Android ID for device identification (Android)
      sdkConfig.setAndroidId("custom_android_device_id_123"); // Replace with your custom Android ID

      // Set deferred deeplink callback
      if (sdkConfig.setDeferredDeeplinkCallbackListener) {
        sdkConfig.setDeferredDeeplinkCallbackListener((uri) => {
          console.log("Deferred Deeplink Callback received");
          console.log("URL/Attribution object:", uri);
          const uriStr = typeof uri === 'object' && uri !== null ? (uri.url || JSON.stringify(uri)) : uri;
          setDeferredDeeplinkUri(uriStr);
          handleDeferredDeepLink(uri);
        });
      }

      // Initialize the SDK
      if (AppTroveSDK.initialize) {
        AppTroveSDK.initialize(sdkConfig);
      }
      
      // Request permissions and register native push tokens with AppTrove automatically
      await registerPushNotificationsWithAppTrove();
      
      // Send initial deep link to SDK after initialization
      if (initialDeepLink && AppTroveSDK.parseDeepLink) {
        console.log("Sending initial deep link to SDK:", initialDeepLink);
        AppTroveSDK.parseDeepLink(initialDeepLink);
      }
      
      // Setup Apple Ads Token for iOS (if available)
      if (Platform.OS === 'ios') {
        await setupAppleAdsToken();
      }
      
      // Setup Uninstall Tracking with Firebase Analytics (Android only)
      if (Platform.OS === 'android') {
        await setupUninstallTracking();
      }
      
      console.log("AppTrove SDK initialized successfully");
    } catch (error) {
      console.error("Error initializing AppTrove SDK:", error);
      console.log("Running in demo mode - SDK features will be simulated");
    } finally {
      setInitializing(false);
    }
  };

  const setupAppleAdsToken = async () => {
    try {
      console.log("Setting up Apple Ads Token for iOS...");
      
      // Check if we're on iOS
      if (Platform.OS !== 'ios') {
        console.log("Apple Ads Token not needed on Android");
        return;
      }

      // Method 1: Use App Tracking Transparency to get IDFA
      try {
        const { requestTrackingPermission, getAdvertisingId } = require('react-native-tracking-transparency');
        
        console.log("Requesting App Tracking Transparency permission...");
        
        // Request tracking permission
        const permissionStatus = await requestTrackingPermission();
        console.log("Tracking permission status:", permissionStatus);
        
        if (permissionStatus === 'authorized') {
          // Get IDFA (Identifier for Advertisers)
          const advertisingId = await getAdvertisingId();
          console.log("IDFA obtained:", advertisingId ? "IDFA received" : "No IDFA");
          
          // Send IDFA to AppTrove SDK
          if (advertisingId && AppTroveSDK && AppTroveSDK.updateAppleAdsToken) {
            AppTroveSDK.updateAppleAdsToken(advertisingId);
            console.log("IDFA sent to AppTrove SDK successfully");
          } else if (!advertisingId) {
            console.log("No IDFA available (user may have limited ad tracking)");
          } else {
            console.log("AppTrove SDK not available for IDFA update");
          }
        } else if (permissionStatus === 'denied') {
          console.log("Tracking permission denied by user");
        } else if (permissionStatus === 'restricted') {
          console.log("Tracking permission restricted by device settings");
        } else if (permissionStatus === 'not-determined') {
          console.log("Tracking permission not determined");
        }
        
      } catch (trackingError) {
        console.warn("react-native-tracking-transparency not available:", trackingError.message);
        
        // Method 2: Try to get IDFA using native iOS methods (if available)
        try {
          // This would require a custom native module or different package
          console.log("Attempting to get IDFA using native methods...");
          
          // For now, we'll simulate getting an IDFA
          // In a real implementation, you would use a proper IDFA library
          const simulatedIDFA = "00000000-0000-0000-0000-000000000000";
          console.log("Simulated IDFA for testing:", simulatedIDFA);
          
          if (AppTroveSDK && AppTroveSDK.updateAppleAdsToken) {
            AppTroveSDK.updateAppleAdsToken(simulatedIDFA);
            console.log("Simulated IDFA sent to AppTrove SDK for testing");
          }
          
        } catch (nativeError) {
          console.warn("Native IDFA method failed:", nativeError.message);
          console.log("No IDFA library available, skipping Apple Ads Token setup");
        }
      }
      
      console.log("Apple Ads Token setup completed");
    } catch (error) {
      console.error("Error setting up Apple Ads Token:", error);
    }
  };

  const registerPushNotificationsWithAppTrove = async () => {
    try {
      console.log("=== PUSH TOKEN REGISTRATION START ===");
      console.log("[Push Token] Platform:", Platform.OS);
      
      // Step 1: Check/request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      console.log("[Push Token] Current permission status:", existingStatus);
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        console.log("[Push Token] Requesting push notification permissions...");
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        console.log("[Push Token] Permission response:", finalStatus);
      }
      
      if (finalStatus !== 'granted') {
        console.warn("[Push Token] DENIED - User did not grant push notification permissions.");
        console.log("=== PUSH TOKEN REGISTRATION END (no permission) ===");
        return;
      }
      console.log("[Push Token] Permission GRANTED ✓");

      // Step 2: Get REAL native device push token from Firebase
      console.log("[Push Token] Requesting REAL device push token from Firebase...");
      const deviceToken = await Notifications.getDevicePushTokenAsync();
      const token = deviceToken.data;
      const tokenType = deviceToken.type; // 'android' or 'ios'
      
      console.log("[Push Token] ✅ SUCCESS - Real native token obtained!");
      console.log("[Push Token] Token Type:", tokenType.toUpperCase());
      console.log("[Push Token] Token Value:", token);
      console.log("[Push Token] Token Length:", typeof token === 'string' ? token.length : 'N/A');

      // Step 3: Send to AppTrove SDK based on platform
      if (tokenType === 'android') {
        console.log("[Push Token] Sending REAL FCM token to AppTroveSDK.sendFcmToken()...");
        if (AppTroveSDK && AppTroveSDK.sendFcmToken) {
          AppTroveSDK.sendFcmToken(token);
          console.log("[Push Token] ✅ REAL FCM token sent to AppTrove SDK successfully!");
        } else {
          console.warn("[Push Token] ⚠️ AppTroveSDK.sendFcmToken is not available");
        }
      } else if (tokenType === 'ios') {
        console.log("[Push Token] Sending REAL APNs token to AppTroveSDK.sendAPNToken()...");
        if (AppTroveSDK && AppTroveSDK.sendAPNToken) {
          AppTroveSDK.sendAPNToken(token);
          console.log("[Push Token] ✅ REAL APNs token sent to AppTrove SDK successfully!");
        } else {
          console.warn("[Push Token] ⚠️ AppTroveSDK.sendAPNToken is not available");
        }
      }
      
      console.log("=== PUSH TOKEN REGISTRATION END (success) ===");
    } catch (error) {
      console.error("[Push Token] ❌ FAILED to get real device token:", error.message || error);
      console.log("[Push Token] Make sure google-services.json (Android) or GoogleService-Info.plist (iOS) is configured correctly.");
      console.log("=== PUSH TOKEN REGISTRATION END (error) ===");
    }
  };

  const setupUninstallTracking = async () => {
    try {
      const appTroveId = await AppTroveSDK.getAppTroveId();
      console.log("AppTrove ID for uninstall tracking:", appTroveId);
      console.log("Uninstall tracking setup completed (manual tracking)");
      console.log("Note: For production, integrate with your preferred analytics platform");
      //await analytics().setUserProperty('ct_objectId', appTroveId);
    } catch (error) {
      console.log("Error setting up uninstall tracking:", error);
    }
  };

  const handleDeepLink = (url) => {
    console.log("Deep link received:", url);
    
    try {
      // Note: SDK tracking is handled separately after SDK initialization
      // This function only handles navigation
      
      let parsedUrl;
      let productId, quantity, actionData, dlv, pid, costValue, costCurrency, camp, p1, p2;
      
      try {
        parsedUrl = new URL(url);
        productId = parsedUrl.searchParams.get('product_id') || parsedUrl.searchParams.get('productid');
        quantity = parsedUrl.searchParams.get('quantity');
        actionData = parsedUrl.searchParams.get('actionData');
        dlv = parsedUrl.searchParams.get('dlv');
        pid = parsedUrl.searchParams.get('pid');
        costValue = parsedUrl.searchParams.get('cost_value');
        costCurrency = parsedUrl.searchParams.get('cost_currency');
        camp = parsedUrl.searchParams.get('camp');
        p1 = parsedUrl.searchParams.get('p1');
        p2 = parsedUrl.searchParams.get('p2');
      } catch (urlError) {
        console.log("Failed to parse as URL, treating as query string:", urlError.message);
        // If URL parsing fails, treat as query string
        const params = new URLSearchParams(url);
        productId = params.get('product_id') || params.get('productid');
        quantity = params.get('quantity');
        actionData = params.get('actionData');
        dlv = params.get('dlv');
        pid = params.get('pid');
        costValue = params.get('cost_value');
        costCurrency = params.get('cost_currency');
        camp = params.get('camp');
        p1 = params.get('p1');
        p2 = params.get('p2');
      }

      // Handle different deep link patterns
      if ((parsedUrl && parsedUrl.pathname === '/d') || dlv) {
        // Navigate to CakeScreen with parameters for product deep links
        navigationRef.current?.navigate('CakeScreen', {
          productId,
          quantity,
          actionData,
          dlv,
          pid,
          costValue,
          costCurrency,
          camp,
          p1,
          p2,
        });
      } else if (parsedUrl && parsedUrl.pathname.includes('/d')) {
        // Navigate to ProductPageScreen for product links
        navigationRef.current?.navigate('ProductPageScreen', {
          productId,
          quantity,
          deepLinkUrl: url,
        });
      } else {
        // Navigate to DeepLinkingScreen for other deep links
        navigationRef.current?.navigate('DeepLinking', {
          deepLinkUrl: url,
        });
      }
    } catch (error) {
      console.error("Error parsing deep link:", error);
    }
  };

  const handleDeferredDeepLink = (uri) => {
    console.log("Deferred Deeplink Callback received in handler");
    console.log("URL/Attribution object:", uri);
    
    // Handle deferred deep links (when app is installed via deep link)
    try {
      let dlv, productId, quantity, pid, costValue, costCurrency, camp, p1, p2;
      const uriStr = typeof uri === 'object' && uri !== null ? (uri.url || JSON.stringify(uri)) : uri;

      if (typeof uri === 'object' && uri !== null) {
        // Retrieve values directly from attribution object
        dlv = uri.deepLinkValue;
        productId = uri.productId || uri.product_id;
        quantity = uri.quantity;
        pid = uri.pid || uri.partnerId;
        costValue = uri.costValue;
        costCurrency = uri.costCurrency;
        camp = uri.camp || uri.campaign;
        p1 = uri.p1;
        p2 = uri.p2;
      } else if (uriStr) {
        // Check if it's a valid URL and parse query params
        let urlObj;
        let params;
        
        if (uriStr.startsWith('http://') || uriStr.startsWith('https://') || uriStr.startsWith('exp://') || uriStr.startsWith('exp+')) {
          try {
            urlObj = new URL(uriStr);
            params = new URLSearchParams(urlObj.search);
          } catch (urlError) {
            console.log("Failed to parse as URL, treating as query string:", urlError.message);
            params = new URLSearchParams(uriStr);
          }
        } else {
          params = new URLSearchParams(uriStr);
        }
        
        dlv = params.get('dlv');
        productId = params.get('productid') || params.get('product_id');
        quantity = params.get('quantity');
        pid = params.get('pid');
        costValue = params.get('cost_value');
        costCurrency = params.get('cost_currency');
        camp = params.get('camp');
        p1 = params.get('p1');
        p2 = params.get('p2');
      }
      
      console.log('Deferred deep link parameters mapped:', { 
        dlv, productId, quantity, pid, costValue, costCurrency, camp, p1, p2 
      });
      
      // Navigate based on deep link value
      if (dlv === 'FirstProduct' || dlv === 'standard' || productId) {
        navigationRef.current?.navigate('CakeScreen', { 
          productId, 
          quantity, 
          dlv,
          pid,
          costValue,
          costCurrency,
          camp,
          p1,
          p2,
        });
      } else if (dlv === 'ProductPage') {
        navigationRef.current?.navigate('ProductPageScreen', { 
          productId, 
          quantity,
          deepLinkUrl: uriStr,
        });
      } else {
        navigationRef.current?.navigate('DeepLinking', {
          deepLinkUrl: uriStr,
        });
      }
    } catch (error) {
      console.error("Error handling deferred deep link:", error);
      const uriStr = typeof uri === 'object' && uri !== null ? (uri.url || JSON.stringify(uri)) : uri;
      // Still navigate to DeepLinking screen even if parsing fails
      navigationRef.current?.navigate('DeepLinking', {
        deepLinkUrl: uriStr,
      });
    }
  };

  useEffect(() => {
    // Store initial deep link for later processing after SDK initialization
    const getInitialUrl = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        // Store the initial URL to send to SDK after initialization
        setInitialDeepLink(initialUrl);
        // Still handle navigation immediately for user experience
        handleDeepLink(initialUrl);
      }
    };

    getInitialUrl();

    // Listen for deep links while app is running
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
      // Send to SDK for tracking (if SDK is initialized)
      if (AppTroveSDK && AppTroveSDK.parseDeepLink) {
        AppTroveSDK.parseDeepLink(url);
      }
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  if (initializing) {
    return null; // You can add a loading screen here
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar style="auto" />
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007bff',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'AppTrove Expo SDK Simulator' }}
        />
        <Stack.Screen 
          name="BuiltInEvents" 
          component={BuiltInEventsScreen}
          options={{ title: 'Built-in Events' }}
        />
        <Stack.Screen 
          name="CustomEvents" 
          component={CustomEventsScreen}
          options={{ title: 'Custom Events' }}
        />
        <Stack.Screen 
          name="DeepLinking" 
          component={DeepLinkingScreen}
          options={{ title: 'Deep Linking' }}
        />
        <Stack.Screen 
          name="DynamicLink" 
          component={DynamicLinkScreen}
          options={{ title: 'Dynamic Link & Resolver' }}
        />
        <Stack.Screen 
          name="ProductPage" 
          component={ProductPageScreen}
          options={{ title: 'Product Page' }}
        />
        <Stack.Screen 
          name="AddToCart" 
          component={AddToCartScreen}
          options={{ title: 'Add to Cart' }}
        />
        <Stack.Screen 
          name="CakeScreen" 
          component={CakeScreen}
          options={{ title: 'Cake Details' }}
        />
        <Stack.Screen 
          name="CampaignData" 
          component={CampaignDataScreen}
          options={{ title: 'Campaign Data' }}
        />
        <Stack.Screen 
          name="CompleteEvent" 
          component={CompleteEventScreen}
          options={{ title: 'Complete Event' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}