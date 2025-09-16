import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TrackierSDK, TrackierEvent } from 'trackier-expo-sdk';

const AddToCartScreen = () => {
  const [productId, setProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [quantity, setQuantity] = useState('1');
  const [category, setCategory] = useState('');

  const handleAddToCart = () => {
    if (!productId || !productName || !price) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const priceValue = parseFloat(price);
    const quantityValue = parseInt(quantity);

    if (isNaN(priceValue) || isNaN(quantityValue)) {
      Alert.alert('Error', 'Price and quantity must be valid numbers');
      return;
    }

    // Track add to cart event
    const trackierEvent = new TrackierEvent(TrackierEvent.ADD_TO_CART);
    trackierEvent.revenue = priceValue * quantityValue;
    trackierEvent.currency = currency;
    trackierEvent.param1 = productId;
    trackierEvent.param2 = productName;
    trackierEvent.param3 = quantityValue.toString();
    trackierEvent.param4 = category;

    TrackierSDK.trackEvent(trackierEvent);

    Alert.alert('Success', 'Item added to cart and event tracked!');
  };

  const handleQuickAdd = (product) => {
    setProductId(product.id);
    setProductName(product.name);
    setPrice(product.price.toString());
    setCategory(product.category);
  };

  const quickProducts = [
    { id: 'cupcake_001', name: 'Chocolate Cupcake', price: 4.99, category: 'Desserts' },
    { id: 'coffee_001', name: 'Premium Coffee', price: 3.49, category: 'Beverages' },
    { id: 'cookie_001', name: 'Chocolate Cookie', price: 2.99, category: 'Snacks' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Add to Cart</Text>
        <Text style={styles.subtitle}>Track add to cart events with product details</Text>

        {/* Quick Add Products */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Add Products</Text>
          {quickProducts.map((product, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickProductCard}
              onPress={() => handleQuickAdd(product)}
            >
              <View style={styles.quickProductInfo}>
                <Text style={styles.quickProductName}>{product.name}</Text>
                <Text style={styles.quickProductPrice}>${product.price}</Text>
              </View>
              <Ionicons name="add-circle" size={24} color="#007bff" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Manual Entry Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Manual Entry</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Product ID *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter product ID"
              placeholderTextColor="#888"
              value={productId}
              onChangeText={setProductId}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Product Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter product name"
              placeholderTextColor="#888"
              value={productName}
              onChangeText={setProductName}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Price *</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                placeholderTextColor="#888"
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
              <Text style={styles.label}>Currency</Text>
              <TextInput
                style={styles.input}
                placeholder="USD"
                placeholderTextColor="#888"
                value={currency}
                onChangeText={setCurrency}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Quantity</Text>
              <TextInput
                style={styles.input}
                placeholder="1"
                placeholderTextColor="#888"
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
              <Text style={styles.label}>Category</Text>
              <TextInput
                style={styles.input}
                placeholder="Product category"
                placeholderTextColor="#888"
                value={category}
                onChangeText={setCategory}
              />
            </View>
          </View>
        </View>

        {/* Add to Cart Button */}
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Ionicons name="cart" size={24} color="#fff" />
          <Text style={styles.addToCartButtonText}>Add to Cart & Track Event</Text>
        </TouchableOpacity>

        {/* Info Section */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Add to Cart Event Details</Text>
          <Text style={styles.infoText}>
            • Event Type: ADD_TO_CART{'\n'}
            • Revenue: Price × Quantity{'\n'}
            • Parameters: Product ID, Name, Quantity, Category{'\n'}
            • Currency: Used for revenue calculation
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
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  quickProductCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quickProductInfo: {
    flex: 1,
  },
  quickProductName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  quickProductPrice: {
    fontSize: 14,
    color: '#28a745',
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  row: {
    flexDirection: 'row',
  },
  addToCartButton: {
    backgroundColor: '#28a745',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 8,
    marginBottom: 20,
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
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

export default AddToCartScreen;
