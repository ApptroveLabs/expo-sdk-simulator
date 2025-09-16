import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import * as Linking from 'expo-linking';

// Import Trackier SDK
import { TrackierConfig, TrackierSDK, TrackierEvent } from 'trackier-expo-sdk';

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

const Stack = createNativeStackNavigator();

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [deferredDeeplinkUri, setDeferredDeeplinkUri] = useState(null);
  const [initialDeepLink, setInitialDeepLink] = useState(null);
  const navigationRef = useRef(null);

  useEffect(() => {
    initializeTrackierSDK();
  }, []);

  const initializeTrackierSDK = async () => {
    try {
      // Check if TrackierSDK is available
      if (!TrackierSDK || !TrackierConfig) {
        console.warn("Trackier SDK not available - running in demo mode");
        setInitializing(false);
        return;
      }

      // Initialize Trackier SDK
      const trackierConfig = new TrackierConfig(
        "Add your Sdk keys from Trackier Dashboard", // Replace with your actual app token
        TrackierConfig.EnvironmentDevelopment
      );
      
      // Set app secret for SDK signing (optional)
      if (trackierConfig.setAppSecret) {
        trackierConfig.setAppSecret(
          "Add Secret Id", // Replace with your actual secret ID
          "Add Secret Key" // Replace with your actual secret key
        );
      }

      // Set App ID
      trackierConfig.setAppId("MYcJ6a79MQ"); // Replace with your actual App ID

      // Set encryption key for secure data transmission 
      trackierConfig.setEncryptionKey("Your Encruption Keys"); // Replace with your encryption key

      // Set encryption type 
      trackierConfig.setEncryptionType(TrackierConfig.EncryptionType.AES_GCM); // Use AES_GCM encryption

      // Set Facebook App ID for Meta attribution (Android)
      trackierConfig.setFacebookAppId("123456789012345"); // Replace with your actual Facebook App ID

      // Set custom Android ID for device identification (Android)
      trackierConfig.setAndroidId("custom_android_device_id_123"); // Replace with your custom Android ID

      // Set deferred deeplink callback
      if (trackierConfig.setDeferredDeeplinkCallbackListener) {
        trackierConfig.setDeferredDeeplinkCallbackListener((uri) => {
          console.log("Deferred Deeplink Callback received");
          console.log("URL: " + uri);
          setDeferredDeeplinkUri(uri);
          handleDeferredDeepLink(uri);
        });
      }

      // Initialize the SDK
      if (TrackierSDK.initialize) {
        TrackierSDK.initialize(trackierConfig);
      }
      
      // Send initial deep link to SDK after initialization
      if (initialDeepLink && TrackierSDK.parseDeepLink) {
        console.log("Sending initial deep link to SDK:", initialDeepLink);
        TrackierSDK.parseDeepLink(initialDeepLink);
      }
      
      // Setup Apple Ads Token for iOS (if available)
      if (Platform.OS === 'ios') {
        await setupAppleAdsToken();
      }
      
      // Setup Uninstall Tracking with Firebase Analytics (Android only)
      if (Platform.OS === 'android') {
        await setupUninstallTracking();
      }
      
      console.log("Trackier SDK initialized successfully");
    } catch (error) {
      console.error("Error initializing Trackier SDK:", error);
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
          
          // Send IDFA to Trackier SDK
          if (advertisingId && TrackierSDK && TrackierSDK.updateAppleAdsToken) {
            TrackierSDK.updateAppleAdsToken(advertisingId);
            console.log("IDFA sent to Trackier SDK successfully");
          } else if (!advertisingId) {
            console.log("No IDFA available (user may have limited ad tracking)");
          } else {
            console.log("Trackier SDK not available for IDFA update");
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
          
          if (TrackierSDK && TrackierSDK.updateAppleAdsToken) {
            TrackierSDK.updateAppleAdsToken(simulatedIDFA);
            console.log("Simulated IDFA sent to Trackier SDK for testing");
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

  const setupUninstallTracking = async () => {
    try {
      const trackierId = await TrackierSDK.getTrackierId();
      console.log("Trackier ID for uninstall tracking:", trackierId);
      console.log("Uninstall tracking setup completed (manual tracking)");
      console.log("Note: For production, integrate with your preferred analytics platform");
      //await analytics().setUserProperty('ct_objectId', trackierId);
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
    console.log("Deferred Deeplink Callback received");
    console.log("URL: " + uri);
    
    // Handle deferred deep links (when app is installed via deep link)
    try {
      // Check if it's a valid URL
      let urlObj;
      let params;
      
      if (uri.startsWith('http://') || uri.startsWith('https://') || uri.startsWith('exp://') || uri.startsWith('exp+')) {
        try {
          urlObj = new URL(uri);
          params = new URLSearchParams(urlObj.search);
        } catch (urlError) {
          console.log("Failed to parse as URL, treating as query string:", urlError.message);
          // If URL parsing fails, treat as query string
          params = new URLSearchParams(uri);
        }
      } else {
        // Handle query string only (like "utm_source=google-play&utm_medium=organic")
        params = new URLSearchParams(uri);
      }
      
      const dlv = params.get('dlv');
      const productId = params.get('productid') || params.get('product_id');
      const quantity = params.get('quantity');
      const pid = params.get('pid');
      const costValue = params.get('cost_value');
      const costCurrency = params.get('cost_currency');
      const camp = params.get('camp');
      const p1 = params.get('p1');
      const p2 = params.get('p2');
      
      console.log('Deferred deep link parameters:', { 
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
          deepLinkUrl: uri,
        });
      } else {
        navigationRef.current?.navigate('DeepLinking', {
          deepLinkUrl: uri,
        });
      }
    } catch (error) {
      console.error("Error handling deferred deep link:", error);
      // Still navigate to DeepLinking screen even if parsing fails
      navigationRef.current?.navigate('DeepLinking', {
        deepLinkUrl: uri,
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
      if (TrackierSDK && TrackierSDK.parseDeepLink) {
        TrackierSDK.parseDeepLink(url);
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
          options={{ title: 'Trackier Expo SDK Simulator' }}
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