import React, { useState } from 'react';
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
import { AppTroveSDK, AppTroveEvent } from 'apptrove-expo-sdk';

const ProductPageScreen = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const products = [
    {
      id: 'product_1',
      name: 'Chocolate Chip Cupcake',
      price: 4.99,
      currency: 'USD',
      image: require('../assets/chocochipcupcake.png'),
      description: 'Delicious chocolate chip cupcake with vanilla frosting',
    },
    {
      id: 'product_2',
      name: 'Blueberry Cupcake',
      price: 5.49,
      currency: 'USD',
      image: require('../assets/blueberrycupcake.jpeg'),
      description: 'Fresh blueberry cupcake with cream cheese frosting',
    },
    {
      id: 'product_3',
      name: 'Vanilla Cupcake',
      price: 3.99,
      currency: 'USD',
      image: require('../assets/vanillaccupake.jpeg'),
      description: 'Classic vanilla cupcake with buttercream frosting',
    },
  ];

  const handleProductView = (product) => {
    setSelectedProduct(product);
    
    // Track product view event
    const appTroveEvent = new AppTroveEvent(AppTroveEvent.CONTENT_VIEW);
    appTroveEvent.revenue = product.price;
    appTroveEvent.currency = product.currency;
    appTroveEvent.param1 = product.id;
    appTroveEvent.param2 = product.name;
    appTroveEvent.param3 = 'product_page';
    
    AppTroveSDK.trackEvent(appTroveEvent);
    
    Alert.alert('Product View Tracked', `Viewed: ${product.name}`);
  };

  const handleAddToCart = (product) => {
    // Track add to cart event
    const appTroveEvent = new AppTroveEvent(AppTroveEvent.ADD_TO_CART);
    appTroveEvent.revenue = product.price;
    appTroveEvent.currency = product.currency;
    appTroveEvent.param1 = product.id;
    appTroveEvent.param2 = product.name;
    appTroveEvent.param3 = '1'; // quantity
    
    AppTroveSDK.trackEvent(appTroveEvent);
    
    Alert.alert('Added to Cart', `${product.name} added to cart!`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Product Page</Text>
        <Text style={styles.subtitle}>View products and track product events</Text>

        {products.map((product) => (
          <View key={product.id} style={styles.productCard}>
            <Image source={product.image} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productDescription}>{product.description}</Text>
              <Text style={styles.productPrice}>
                ${product.price} {product.currency}
              </Text>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.viewButton]}
                  onPress={() => handleProductView(product)}
                >
                  <Ionicons name="eye" size={16} color="#fff" />
                  <Text style={styles.buttonText}>View Product</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.button, styles.cartButton]}
                  onPress={() => handleAddToCart(product)}
                >
                  <Ionicons name="cart" size={16} color="#fff" />
                  <Text style={styles.buttonText}>Add to Cart</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {selectedProduct && (
          <View style={styles.selectedProductContainer}>
            <Text style={styles.selectedProductTitle}>Currently Viewing:</Text>
            <Text style={styles.selectedProductName}>{selectedProduct.name}</Text>
          </View>
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Product Tracking Events</Text>
          <Text style={styles.infoText}>
            • CONTENT_VIEW: Tracked when a product is viewed{'\n'}
            • ADD_TO_CART: Tracked when a product is added to cart{'\n'}
            • Events include product ID, name, price, and currency
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
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 15,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#28a745',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  viewButton: {
    backgroundColor: '#007bff',
  },
  cartButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  selectedProductContainer: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  selectedProductTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976d2',
    marginBottom: 5,
  },
  selectedProductName: {
    fontSize: 16,
    color: '#1976d2',
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#495057',
  },
  infoText: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
  },
});

export default ProductPageScreen;
