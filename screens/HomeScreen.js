import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  const menuItems = [
    {
      title: 'Built-in Events',
      icon: 'list-outline',
      screen: 'BuiltInEvents',
      description: 'Track predefined events like ADD_TO_CART, PURCHASE, etc.',
    },
    {
      title: 'Custom Events',
      icon: 'create-outline',
      screen: 'CustomEvents',
      description: 'Track custom events with your own event IDs.',
    },
    {
      title: 'Deep Linking',
      icon: 'link-outline',
      screen: 'DeepLinking',
      description: 'Test deep linking functionality and URL handling.',
    },
    {
      title: 'Dynamic Link & Resolver',
      icon: 'swap-horizontal-outline',
      screen: 'DynamicLink',
      description: 'Test dynamic link creation and resolution.',
    },
    {
      title: 'Product Page',
      icon: 'cube-outline',
      screen: 'ProductPage',
      description: 'View product details and track product views.',
    },
    {
      title: 'Add to Cart',
      icon: 'cart-outline',
      screen: 'AddToCart',
      description: 'Test add to cart functionality and tracking.',
    },
    {
      title: 'Cake Details',
      icon: 'gift-outline',
      screen: 'CakeScreen',
      description: 'View cake products and track purchases.',
    },
    {
      title: 'Campaign Data',
      icon: 'analytics-outline',
      screen: 'CampaignData',
      description: 'View campaign and attribution data.',
    },
    {
      title: 'Complete Event',
      icon: 'checkmark-circle-outline',
      screen: 'CompleteEvent',
      description: 'Comprehensive event tracking with all parameters.',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require('../assets/trackierlogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.welcomeText}>
            Welcome to Trackier Expo SDK Simulator
          </Text>
          <Text style={styles.subtitleText}>
            Test and explore all Trackier SDK features
          </Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View style={styles.menuItemContent}>
                <View style={styles.iconContainer}>
                  <Ionicons name={item.icon} size={24} color="#007bff" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                  <Text style={styles.menuItemDescription}>
                    {item.description}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#666" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Trackier Expo SDK Simulator v1.0.0
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
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 60,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  menuContainer: {
    paddingHorizontal: 20,
  },
  menuItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});

export default HomeScreen;
