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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TrackierSDK, TrackierEvent } from 'trackier-expo-sdk';

const CompleteEventScreen = () => {
  const [eventId, setEventId] = useState('');
  const [revenue, setRevenue] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [customParams, setCustomParams] = useState([
    { key: '', value: '' },
  ]);

  const addCustomParam = () => {
    if (customParams.length < 10) {
      setCustomParams([...customParams, { key: '', value: '' }]);
    } else {
      Alert.alert('Limit Reached', 'You can only add up to 10 custom parameters');
    }
  };

  const removeCustomParam = (index) => {
    if (customParams.length > 1) {
      const updatedParams = customParams.filter((_, i) => i !== index);
      setCustomParams(updatedParams);
    }
  };

  const updateCustomParam = (index, field, value) => {
    const updatedParams = [...customParams];
    updatedParams[index][field] = value;
    setCustomParams(updatedParams);
  };

  const handleSubmitEvent = () => {
    if (!eventId.trim()) {
      Alert.alert('Error', 'Please enter an event ID');
      return;
    }

    if (!revenue.trim()) {
      Alert.alert('Error', 'Please enter revenue');
      return;
    }

    const revenueValue = parseFloat(revenue);
    if (isNaN(revenueValue)) {
      Alert.alert('Error', 'Revenue must be a valid number');
      return;
    }

    // Create custom event
    const trackierEvent = new TrackierEvent(eventId);
    trackierEvent.revenue = revenueValue;
    trackierEvent.currency = currency;

    // Add custom parameters
    customParams.forEach((param, index) => {
      if (param.key.trim() && param.value.trim()) {
        trackierEvent[`param${index + 1}`] = param.value;
      }
    });

    // Set user data
    TrackierSDK.setUserName('Complete Event User');
    TrackierSDK.setUserPhone('+1234567890');
    TrackierSDK.setUserId('complete_event_user_123');

    // Track the event
    TrackierSDK.trackEvent(trackierEvent);

    Alert.alert('Success', 'Complete event tracked successfully!');
  };

  const handleQuickEvent = (eventType) => {
    let event;
    switch (eventType) {
      case 'purchase':
        event = new TrackierEvent(TrackierEvent.PURCHASE);
        event.revenue = 99.99;
        event.currency = 'USD';
        event.param1 = 'premium_plan';
        event.param2 = 'monthly';
        event.param3 = '1';
        break;
      case 'registration':
        event = new TrackierEvent(TrackierEvent.COMPLETE_REGISTRATION);
        event.revenue = 0;
        event.currency = 'USD';
        event.param1 = 'email_signup';
        event.param2 = 'organic';
        break;
      case 'tutorial':
        event = new TrackierEvent(TrackierEvent.TUTORIAL_COMPLETION);
        event.revenue = 0;
        event.currency = 'USD';
        event.param1 = 'onboarding_tutorial';
        event.param2 = 'completed';
        event.param3 = '5_minutes';
        break;
      default:
        return;
    }

    TrackierSDK.trackEvent(event);
    Alert.alert('Quick Event', `${eventType} event tracked successfully!`);
  };

  const handleCompleteRegistrationExample = () => {
    // Create event with COMPLETE_REGISTRATION ID
    const event = new TrackierEvent(TrackierEvent.COMPLETE_REGISTRATION);
    
    // Built-in fields
    event.orderId = "REG_001";
    event.currency = "USD";
    event.couponCode = "WELCOME10";
    event.discount = 5.0;
    event.revenue = 0.0; // free signup in this case

    // Custom parameters for structured data
    event.param1 = "Test1";            // String: Dummy value
    event.param2 = "Test2";            // String: Dummy value
    event.param3 = "Test3";            // String: Dummy value
    event.param4 = "Test4";            // String: Dummy value
    event.param5 = "Test5";            // String: Dummy value
    event.param6 = "Test6";            // String: Dummy value
    event.param7 = "Test7";            // String: Dummy value
    event.param8 = "Test8";            // String: Dummy value
    event.param9 = "Test9";            // String: Dummy value
    event.param10 = "Test10";          // String: Dummy value
    
    // Custom key-value pairs for flexible data
    event.setEventValue("signup_time", Date.now()); // Number: Timestamp
    event.setEventValue("sdk", "ExpoNative");         // String: Device type

    // Custom data (ev map)
    event.ev = {
      signup_time: Date.now(),
      device: "Expo-ReactNative",
      referral: "Campaign_XYZ",
    };

    // Attach user details
    TrackierSDK.setUserId("USER12345");
    TrackierSDK.setUserEmail("user@example.com");
    TrackierSDK.setUserName("Jane Doe");
    TrackierSDK.setUserPhone("+1234567890");
    TrackierSDK.setIMEI("123456789012345", "987654321098765");
    TrackierSDK.setMacAddress("00:1A:2B:3C:4D:5E");

    // Additional user details
    const jsonData = {"phone": "+91-8137872378", "name": "Embassies"};
    TrackierSDK.setUserAdditionalDetails("data", jsonData);

    // Send event
    TrackierSDK.trackEvent(event);
    
    Alert.alert('Complete Registration', 'Comprehensive COMPLETE_REGISTRATION event tracked with all parameters and user data!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.header}>Complete Event Tracking</Text>
          <Text style={styles.subtitle}>Track comprehensive events with all parameters</Text>

          {/* Comprehensive Registration Example */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Complete Registration Example</Text>
            <Text style={styles.exampleDescription}>
              Comprehensive COMPLETE_REGISTRATION event with all parameters, user data, and custom attributes
            </Text>
            <TouchableOpacity
              style={[styles.comprehensiveButton]}
              onPress={handleCompleteRegistrationExample}
            >
              <Ionicons name="checkmark-circle" size={24} color="#fff" />
              <Text style={styles.comprehensiveButtonText}>Track Complete Registration</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Events */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Events</Text>
            <View style={styles.quickEventContainer}>
              <TouchableOpacity
                style={[styles.quickEventButton, styles.purchaseButton]}
                onPress={() => handleQuickEvent('purchase')}
              >
                <Ionicons name="card" size={20} color="#fff" />
                <Text style={styles.quickEventText}>Purchase</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.quickEventButton, styles.registrationButton]}
                onPress={() => handleQuickEvent('registration')}
              >
                <Ionicons name="person-add" size={20} color="#fff" />
                <Text style={styles.quickEventText}>Registration</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.quickEventButton, styles.tutorialButton]}
                onPress={() => handleQuickEvent('tutorial')}
              >
                <Ionicons name="school" size={20} color="#fff" />
                <Text style={styles.quickEventText}>Tutorial</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Custom Event Form */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Custom Event</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Event ID *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter custom event ID"
                placeholderTextColor="#888"
                value={eventId}
                onChangeText={setEventId}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>Revenue *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor="#888"
                  keyboardType="numeric"
                  value={revenue}
                  onChangeText={setRevenue}
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

            {/* Custom Parameters */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Custom Parameters</Text>
              {customParams.map((param, index) => (
                <View key={index} style={styles.paramRow}>
                  <TextInput
                    style={[styles.input, styles.paramKeyInput]}
                    placeholder="Parameter key"
                    placeholderTextColor="#888"
                    value={param.key}
                    onChangeText={(value) => updateCustomParam(index, 'key', value)}
                  />
                  <TextInput
                    style={[styles.input, styles.paramValueInput]}
                    placeholder="Parameter value"
                    placeholderTextColor="#888"
                    value={param.value}
                    onChangeText={(value) => updateCustomParam(index, 'value', value)}
                  />
                  {customParams.length > 1 && (
                    <TouchableOpacity
                      style={styles.removeParamButton}
                      onPress={() => removeCustomParam(index)}
                    >
                      <Ionicons name="trash" size={20} color="#ff4444" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              
              <TouchableOpacity style={styles.addParamButton} onPress={addCustomParam}>
                <Ionicons name="add" size={20} color="#007bff" />
                <Text style={styles.addParamText}>Add Parameter</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmitEvent}>
            <Ionicons name="send" size={20} color="#fff" />
            <Text style={styles.submitButtonText}>Track Custom Event</Text>
          </TouchableOpacity>

          {/* Info Section */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>Complete Event Features</Text>
            <Text style={styles.infoText}>
              • Comprehensive COMPLETE_REGISTRATION example with all parameters{'\n'}
              • Built-in fields: orderId, currency, couponCode, discount, revenue{'\n'}
              • Custom parameters: param1-param10 for structured data{'\n'}
              • Custom key-value pairs with setEventValue() method{'\n'}
              • Custom data object (ev map) for flexible data{'\n'}
              • Complete user data: ID, email, name, phone, IMEI, MAC address{'\n'}
              • Additional user details with JSON data{'\n'}
              • Quick event templates for common scenarios
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 100,
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
  quickEventContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickEventButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  purchaseButton: {
    backgroundColor: '#28a745',
  },
  registrationButton: {
    backgroundColor: '#007bff',
  },
  tutorialButton: {
    backgroundColor: '#ffc107',
  },
  quickEventText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  exampleDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
    textAlign: 'center',
  },
  comprehensiveButton: {
    backgroundColor: '#6f42c1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 8,
    marginBottom: 10,
  },
  comprehensiveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  inputGroup: {
    marginBottom: 20,
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
  paramRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  paramKeyInput: {
    flex: 1,
    marginRight: 10,
  },
  paramValueInput: {
    flex: 1,
    marginRight: 10,
  },
  removeParamButton: {
    padding: 10,
  },
  addParamButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007bff',
    backgroundColor: '#f8f9fa',
  },
  addParamText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: '#28a745',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 8,
    marginBottom: 20,
  },
  submitButtonText: {
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

export default CompleteEventScreen;
