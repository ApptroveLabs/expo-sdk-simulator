import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TrackierSDK, TrackierEvent } from 'trackier-expo-sdk';

const CakeScreen = ({ route, navigation }) => {
  const [selectedCake, setSelectedCake] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const { productId, quantity: routeQuantity, actionData, dlv } = route.params || {};

  const cakes = [
    {
      id: 'cake_001',
      name: 'Chocolate Chip Cupcake',
      price: 4.99,
      currency: 'USD',
      image: require('../assets/chocochipcupcake.png'),
      description: 'Delicious chocolate chip cupcake with vanilla frosting and chocolate chips',
      category: 'Cupcakes',
    },
    {
      id: 'cake_002',
      name: 'Blueberry Cupcake',
      price: 5.49,
      currency: 'USD',
      image: require('../assets/blueberrycupcake.jpeg'),
      description: 'Fresh blueberry cupcake with cream cheese frosting and fresh blueberries',
      category: 'Cupcakes',
    },
    {
      id: 'cake_003',
      name: 'Vanilla Cupcake',
      price: 3.99,
      currency: 'USD',
      image: require('../assets/vanillaccupake.jpeg'),
      description: 'Classic vanilla cupcake with buttercream frosting and vanilla extract',
      category: 'Cupcakes',
    },
  ];

  useEffect(() => {
    // Handle deep link parameters
    if (productId) {
      const cake = cakes.find(c => c.id === productId);
      if (cake) {
        setSelectedCake(cake);
        if (routeQuantity) {
          setQuantity(parseInt(routeQuantity) || 1);
        }
        
        // Track deep link arrival
        const trackierEvent = new TrackierEvent(TrackierEvent.CONTENT_VIEW);
        trackierEvent.revenue = cake.price;
        trackierEvent.currency = cake.currency;
        trackierEvent.param1 = cake.id;
        trackierEvent.param2 = cake.name;
        trackierEvent.param3 = 'deep_link';
        trackierEvent.param4 = actionData || '';
        trackierEvent.param5 = dlv || '';
        
        TrackierSDK.trackEvent(trackierEvent);
      }
    }
  }, [productId, routeQuantity, actionData, dlv]);

  const handleCakeSelect = (cake) => {
    setSelectedCake(cake);
    
    // Track product view
    const trackierEvent = new TrackierEvent(TrackierEvent.CONTENT_VIEW);
    trackierEvent.revenue = cake.price;
    trackierEvent.currency = cake.currency;
    trackierEvent.param1 = cake.id;
    trackierEvent.param2 = cake.name;
    trackierEvent.param3 = 'manual_selection';
    
    TrackierSDK.trackEvent(trackierEvent);
  };

  const handleAddToCart = () => {
    if (!selectedCake) {
      Alert.alert('Error', 'Please select a cake first');
      return;
    }

    // Track add to cart event
    const trackierEvent = new TrackierEvent(TrackierEvent.ADD_TO_CART);
    trackierEvent.revenue = selectedCake.price * quantity;
    trackierEvent.currency = selectedCake.currency;
    trackierEvent.param1 = selectedCake.id;
    trackierEvent.param2 = selectedCake.name;
    trackierEvent.param3 = quantity.toString();
    trackierEvent.param4 = selectedCake.category;
    
    TrackierSDK.trackEvent(trackierEvent);
    
    Alert.alert('Added to Cart', `${selectedCake.name} (Qty: ${quantity}) added to cart!`);
  };

  const handlePurchase = () => {
    if (!selectedCake) {
      Alert.alert('Error', 'Please select a cake first');
      return;
    }

    // Track purchase event
    const trackierEvent = new TrackierEvent(TrackierEvent.PURCHASE);
    trackierEvent.revenue = selectedCake.price * quantity;
    trackierEvent.currency = selectedCake.currency;
    trackierEvent.param1 = selectedCake.id;
    trackierEvent.param2 = selectedCake.name;
    trackierEvent.param3 = quantity.toString();
    trackierEvent.param4 = selectedCake.category;
    
    TrackierSDK.trackEvent(trackierEvent);
    
    Alert.alert('Purchase Complete', `Thank you for purchasing ${selectedCake.name}!`);
  };

  const adjustQuantity = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Cake Details</Text>
        
        {productId && (
          <View style={styles.deepLinkInfo}>
            <Ionicons name="link" size={20} color="#007bff" />
            <Text style={styles.deepLinkText}>Opened via deep link</Text>
          </View>
        )}

        {/* Cake Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select a Cake</Text>
          {cakes.map((cake) => (
            <TouchableOpacity
              key={cake.id}
              style={[
                styles.cakeCard,
                selectedCake?.id === cake.id && styles.selectedCakeCard
              ]}
              onPress={() => handleCakeSelect(cake)}
            >
              <Image source={cake.image} style={styles.cakeImage} />
              <View style={styles.cakeInfo}>
                <Text style={styles.cakeName}>{cake.name}</Text>
                <Text style={styles.cakeDescription}>{cake.description}</Text>
                <Text style={styles.cakePrice}>${cake.price} {cake.currency}</Text>
              </View>
              {selectedCake?.id === cake.id && (
                <Ionicons name="checkmark-circle" size={24} color="#28a745" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Quantity Selection */}
        {selectedCake && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => adjustQuantity(-1)}
                disabled={quantity <= 1}
              >
                <Ionicons name="remove" size={20} color={quantity <= 1 ? "#ccc" : "#007bff"} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => adjustQuantity(1)}
                disabled={quantity >= 10}
              >
                <Ionicons name="add" size={20} color={quantity >= 10 ? "#ccc" : "#007bff"} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        {selectedCake && (
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
              <Ionicons name="cart" size={20} color="#fff" />
              <Text style={styles.buttonText}>Add to Cart</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.purchaseButton} onPress={handlePurchase}>
              <Ionicons name="card" size={20} color="#fff" />
              <Text style={styles.buttonText}>Purchase Now</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Deep Link Parameters Display */}
        {(actionData || dlv) && (
          <View style={styles.parametersContainer}>
            <Text style={styles.parametersTitle}>Deep Link Parameters</Text>
            {actionData && (
              <Text style={styles.parameterText}>Action Data: {actionData}</Text>
            )}
            {dlv && (
              <Text style={styles.parameterText}>DLV: {dlv}</Text>
            )}
          </View>
        )}

        {/* Info Section */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Cake Screen Features</Text>
          <Text style={styles.infoText}>
            • Deep link support with product parameters{'\n'}
            • Product view tracking{'\n'}
            • Add to cart and purchase events{'\n'}
            • Quantity selection and price calculation
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
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  deepLinkInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e3f2fd',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  deepLinkText: {
    marginLeft: 8,
    color: '#1976d2',
    fontWeight: '600',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  cakeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedCakeCard: {
    borderWidth: 2,
    borderColor: '#28a745',
  },
  cakeImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  cakeInfo: {
    flex: 1,
  },
  cakeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cakeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  cakePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#28a745',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 20,
    color: '#333',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: '#007bff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    marginRight: 10,
  },
  purchaseButton: {
    flex: 1,
    backgroundColor: '#28a745',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  parametersContainer: {
    backgroundColor: '#fff3cd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  parametersTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#856404',
  },
  parameterText: {
    fontSize: 14,
    color: '#856404',
    marginBottom: 4,
  },
  infoContainer: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1976d2',
  },
  infoText: {
    fontSize: 14,
    color: '#1976d2',
    lineHeight: 20,
  },
});

export default CakeScreen;
