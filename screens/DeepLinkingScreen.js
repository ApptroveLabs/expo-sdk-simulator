import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';

const DeepLinkingScreen = ({ route }) => {
  const [linkMessage, setLinkMessage] = useState('Waiting for a deep link...');
  const [deepLinkData, setDeepLinkData] = useState(null);

  useEffect(() => {
    // Check if we received a deep link from navigation
    if (route?.params?.deepLinkUrl) {
      handleDeepLink(route.params.deepLinkUrl);
    }

    // Listen for new deep links
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    return () => {
      subscription?.remove();
    };
  }, [route?.params?.deepLinkUrl]);

  const handleDeepLink = (url) => {
    console.log('Deep link received:', url);
    setLinkMessage(`Deep Link: ${url}`);

    try {
      const parsedUrl = new URL(url);
      const data = {
        url: url,
        scheme: parsedUrl.protocol,
        host: parsedUrl.host,
        pathname: parsedUrl.pathname,
        searchParams: Object.fromEntries(parsedUrl.searchParams),
      };
      setDeepLinkData(data);
    } catch (error) {
      console.error('Error parsing deep link:', error);
      setDeepLinkData({ url: url, error: 'Failed to parse URL' });
    }
  };

  const testDeepLink = () => {
    const testUrl = 'https://trackier.u9ilnk.me/product?dlv=DeepLinkingScreen&quantity=5&pid=test123';
    handleDeepLink(testUrl);
  };

  const showDeepLinkInfo = () => {
    if (!deepLinkData) {
      Alert.alert('No Deep Link Data', 'No deep link has been received yet.');
      return;
    }

    const message = `URL: ${deepLinkData.url}\n\n` +
      `Scheme: ${deepLinkData.scheme || 'N/A'}\n` +
      `Host: ${deepLinkData.host || 'N/A'}\n` +
      `Path: ${deepLinkData.pathname || 'N/A'}\n\n` +
      `Parameters:\n${JSON.stringify(deepLinkData.searchParams || {}, null, 2)}`;

    Alert.alert('Deep Link Information', message);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Deep Linking Test</Text>
        
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#007bff" />
          <Text style={styles.infoText}>
            This screen demonstrates deep linking functionality. Deep links allow users to navigate directly to specific screens in your app.
          </Text>
        </View>

        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>Current Status:</Text>
          <Text style={styles.statusText}>{linkMessage}</Text>
        </View>

        {deepLinkData && (
          <View style={styles.dataCard}>
            <Text style={styles.dataTitle}>Deep Link Data:</Text>
            <Text style={styles.dataText}>
              {JSON.stringify(deepLinkData, null, 2)}
            </Text>
          </View>
        )}

        <View style={styles.imagesContainer}>
          <Text style={styles.imagesTitle}>Sample Products:</Text>
          <Image
            source={require('../assets/blueberrycupcake.jpeg')}
            style={styles.productImage}
            resizeMode="cover"
          />
          <Image
            source={require('../assets/chocochipcupcake.png')}
            style={styles.productImage}
            resizeMode="cover"
          />
          <Image
            source={require('../assets/vanillaccupake.jpeg')}
            style={styles.productImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.testButton} onPress={testDeepLink}>
            <Ionicons name="link" size={20} color="#fff" />
            <Text style={styles.testButtonText}>Test Deep Link</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.infoButton} onPress={showDeepLinkInfo}>
            <Ionicons name="eye" size={20} color="#007bff" />
            <Text style={styles.infoButtonText}>View Link Info</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>How to Test:</Text>
          <Text style={styles.instructionsText}>
            1. Use the "Test Deep Link" button to simulate a deep link{'\n'}
            2. Or use a URL like: https://trackier.u9ilnk.me/product?dlv=DeepLinkingScreen&quantity=5&pid=test123{'\n'}
            3. The app will parse the URL and display the extracted data{'\n'}
            4. Check the console logs for detailed information
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  infoCard: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#1976d2',
    lineHeight: 20,
  },
  statusCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
  },
  dataCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  dataTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  dataText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  imagesContainer: {
    marginBottom: 20,
  },
  imagesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  testButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0.48,
    justifyContent: 'center',
  },
  testButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0.48,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#007bff',
  },
  infoButtonText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  instructionsCard: {
    backgroundColor: '#fff3cd',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 10,
  },
  instructionsText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
});

export default DeepLinkingScreen;
