import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppTroveConfig, AppTroveSDK, AppTroveEvent } from 'apptrove-expo-sdk';

const CustomEventsScreen = () => {
  const [eventId, setEventId] = useState('');
  const [revenue, setRevenue] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [params, setParams] = useState([]);
  const [paramValues, setParamValues] = useState({});
  const [currencyDropdownVisible, setCurrencyDropdownVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const currencyList = [
    "USD", "EUR", "GBP", "INR", "AUD", "CAD", "SGD", "CHF", "MYR", "JPY",
    "ARS", "BHD", "BWP", "BRL", "BND", "BGN", "CLP", "COP", "HRK", "CZK",
    "DKK", "AED", "HKD", "HUF", "ISK", "IDR", "ILS", "KZT", "KWD", "LYD",
    "MUR", "MXN", "NPR", "NZD", "NOK", "OMR", "PKR", "PHP", "PLN", "RUB",
    "RON", "SAR", "ZAR", "KRW", "LKR", "SEK", "TWD", "THB", "TTD", "TRY",
    "VEF", "ZMW", "YER", "XPF", "VND", "VES"
  ];

  const addParam = () => {
    if (params.length < 10) {
      const newParamKey = `param${params.length + 1}`;
      setParams([...params, newParamKey]);
    } else {
      setSnackbarMessage('You can only add up to 10 parameters.');
      setSnackbarVisible(true);
    }
  };

  const deleteParam = (index) => {
    const updatedParams = params.filter((_, i) => i !== index);
    const updatedParamValues = { ...paramValues };
    delete updatedParamValues[params[index]];
    setParams(updatedParams);
    setParamValues(updatedParamValues);
  };

  const handleParamChange = (key, value) => {
    setParamValues({ ...paramValues, [key]: value });
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
    setTimeout(() => setSnackbarVisible(false), 3000);
  };

  const handleSubmit = () => {
    if (!eventId || !revenue || !selectedCurrency) {
      showSnackbar('Please fill in all required fields.');
      return;
    }

    const revenueValue = parseFloat(revenue);
    if (isNaN(revenueValue)) {
      showSnackbar('Revenue must be a valid number.');
      return;
    }

    // Create custom event with the provided event ID
    const appTroveEvent = new AppTroveEvent(eventId);
    appTroveEvent.revenue = revenueValue;
    appTroveEvent.currency = selectedCurrency;
    appTroveEvent.orderId = 'CustomOrder123';

    // Add custom parameters
    params.forEach((paramKey, index) => {
      if (paramValues[paramKey]) {
        appTroveEvent[`param${index + 1}`] = paramValues[paramKey];
      }
    });

    // Set user data
    AppTroveSDK.setUserName('Custom Event User');
    AppTroveSDK.setUserPhone('+1234567890');
    AppTroveSDK.setUserId('customUser123');

    // Set additional user details
    const customData = {
      "name": "Custom User",
      "phone": "+1234567890",
      "email": "custom@example.com"
    };
    AppTroveSDK.setUserAdditionalDetails("customData", customData);

    // Track the event
    AppTroveSDK.trackEvent(appTroveEvent);

    showSnackbar('Custom Event Submitted Successfully');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.header}>Custom Event Tracking</Text>

          {/* Event ID Input */}
          <View style={styles.section}>
            <Text style={styles.label}>Event ID *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your custom event ID"
              placeholderTextColor="#888"
              value={eventId}
              onChangeText={setEventId}
            />
            <Text style={styles.helpText}>
              Enter the custom event ID created in your Trackier dashboard
            </Text>
          </View>

          {/* Revenue Input */}
          <View style={styles.section}>
            <Text style={styles.label}>Revenue *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Revenue"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={revenue}
              onChangeText={setRevenue}
            />
          </View>

          {/* Currency Dropdown */}
          <View style={styles.section}>
            <Text style={styles.label}>Currency *</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setCurrencyDropdownVisible(!currencyDropdownVisible)}
            >
              <Text style={styles.dropdownText}>
                {selectedCurrency || 'Select Currency'}
              </Text>
              <Ionicons
                name={currencyDropdownVisible ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#333"
              />
            </TouchableOpacity>
            {currencyDropdownVisible && (
              <View style={styles.dropdownList}>
                <ScrollView style={{ maxHeight: 200 }}>
                  {currencyList.map((currency, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedCurrency(currency);
                        setCurrencyDropdownVisible(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{currency}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Parameters */}
          <View style={styles.section}>
            <Text style={styles.label}>Custom Parameters</Text>
            {params.map((paramKey, index) => (
              <View key={index} style={styles.paramContainer}>
                <TextInput
                  style={styles.input}
                  placeholder={`Param ${index + 1}`}
                  placeholderTextColor="#888"
                  value={paramValues[paramKey] || ''}
                  onChangeText={(value) => handleParamChange(paramKey, value)}
                />
                <TouchableOpacity
                  onPress={() => deleteParam(index)}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash-outline" size={20} color="#ff4444" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addButton} onPress={addParam}>
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Add Parameter</Text>
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit Custom Event</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Snackbar */}
        {snackbarVisible && (
          <View style={styles.snackbar}>
            <Text style={styles.snackbarText}>{snackbarMessage}</Text>
          </View>
        )}
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
    marginBottom: 30,
    color: '#333',
  },
  section: {
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
  helpText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    fontStyle: 'italic',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownList: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 5,
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  paramContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  deleteButton: {
    marginLeft: 10,
    padding: 10,
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  snackbar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  snackbarText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default CustomEventsScreen;
