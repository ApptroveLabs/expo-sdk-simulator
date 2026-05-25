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
import { AppTroveSDK } from 'apptrove-expo-sdk';

const DynamicLinkScreen = () => {
  const [deepLinkUrl, setDeepLinkUrl] = useState('');
  const [resolvedUrl, setResolvedUrl] = useState('');
  const [isResolving, setIsResolving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  // Dynamic Link Creation Form State
  const [templateId, setTemplateId] = useState('your_template_id');
  const [link, setLink] = useState('https://yourapp.com/product/123');
  const [domainUriPrefix, setDomainUriPrefix] = useState('https://yourapp.page.link');
  const [deepLinkValue, setDeepLinkValue] = useState('product_detail?product_id=123');
  const [androidRedirect, setAndroidRedirect] = useState('https://play.google.com/store/apps/details?id=com.yourapp');
  const [iosRedirect, setIosRedirect] = useState('https://apps.apple.com/app/id123456789');
  const [socialTitle, setSocialTitle] = useState('Amazing Product');
  const [socialDescription, setSocialDescription] = useState('Check out this amazing product!');
  const [socialImageLink, setSocialImageLink] = useState('https://example.com/product-image.jpg');
  const [channel, setChannel] = useState('social');
  const [campaign, setCampaign] = useState('summer_sale');
  const [mediaSource, setMediaSource] = useState('facebook');

  const handleResolveDynamicLink = async () => {
    if (!deepLinkUrl.trim()) {
      Alert.alert('Error', 'Please enter a dynamic link URL');
      return;
    }

    setIsResolving(true);
    try {
      // Use AppTrove SDK to resolve deep link URL (if available)
      if (AppTroveSDK && AppTroveSDK.resolveDeeplinkUrl) {
        const result = await AppTroveSDK.resolveDeeplinkUrl(deepLinkUrl);
        
        if (result && result.url) {
          setResolvedUrl(`Resolved URL: ${result.url}\nSDK Parameters: ${JSON.stringify(result.sdkParams, null, 2)}`);
        } else {
          setResolvedUrl('Link resolved successfully but no additional data found');
        }
      } else {
        // Simulate resolution for demo
        setResolvedUrl(`Simulated resolution for: ${deepLinkUrl}\nSDK Parameters: {"demo": true, "simulated": true}`);
      }
    } catch (error) {
      console.error('Error resolving dynamic link:', error);
      setResolvedUrl('Error resolving link: ' + error.message);
    } finally {
      setIsResolving(false);
    }
  };

  const handleCreateDynamicLink = async () => {
    if (!templateId.trim() || !link.trim() || !domainUriPrefix.trim()) {
      Alert.alert('Error', 'Please fill in all required fields (Template ID, Link, Domain URI Prefix)');
      return;
    }

    setIsCreating(true);
    try {
      // Create comprehensive dynamic link configuration
      const config = {
        // Basic configuration
        templateId: templateId,
        link: link,
        domainUriPrefix: domainUriPrefix,
        deepLinkValue: deepLinkValue,
        
        // Platform-specific parameters
        androidParameters: {
          redirectLink: androidRedirect
        },
        iosParameters: {
          redirectLink: iosRedirect
        },
        desktopParameters: {
          redirectLink: link // Use main link as desktop fallback
        },
        
        // Social media metadata
        socialMetaTagParameters: {
          title: socialTitle,
          description: socialDescription,
          imageLink: socialImageLink
        },
        
        // SDK parameters for tracking
        sdkParameters: {
          param1: "dynamic_link_test",
          param2: "expo_sdk",
          param3: "v1.0"
        },
        
        // Attribution parameters
        attributionParameters: {
          channel: channel,
          campaign: campaign,
          mediaSource: mediaSource,
          p1: "custom_param1",
          p2: "custom_param2",
          p3: "custom_param3",
          p4: "custom_param4",
          p5: "custom_param5"
        }
      };

      if (AppTroveSDK && AppTroveSDK.createDynamicLink) {
        const dynamicLinkUrl = await AppTroveSDK.createDynamicLink(config);
        setResolvedUrl(dynamicLinkUrl);
        Alert.alert('Dynamic Link Created', dynamicLinkUrl);
      } else {
        // Simulate dynamic link creation for demo
        const simulatedLink = `${domainUriPrefix}/?link=${encodeURIComponent(link)}&template=${templateId}&dlv=${deepLinkValue}`;
        setResolvedUrl(simulatedLink);
        Alert.alert('Dynamic Link Created (Simulated)', simulatedLink);
      }
    } catch (error) {
      console.error('Error creating dynamic link:', error);
      if (error.code === "CREATE_DYNAMIC_LINK_FAILED") {
        Alert.alert('Creation Failed', 'Failed to create dynamic link: ' + error.message);
      } else if (error.code === "CREATE_DYNAMIC_LINK_EXCEPTION") {
        Alert.alert('Exception', 'Exception during dynamic link creation: ' + error.message);
      } else {
        Alert.alert('Error', 'Unknown error creating dynamic link: ' + error.message);
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleQuickCreate = (type) => {
    switch (type) {
      case 'product':
        setTemplateId('product_share_template');
        setLink('https://yourapp.com/product/123');
        setDeepLinkValue('product_detail?product_id=123');
        setSocialTitle('Amazing Product');
        setSocialDescription('Check out this amazing product on our app!');
        setChannel('social');
        setCampaign('product_sharing');
        setMediaSource('user_generated');
        break;
      case 'referral':
        setTemplateId('referral_template');
        setLink('https://yourapp.com/referral/ABC123');
        setDeepLinkValue('referral?code=ABC123&referrer=user456');
        setSocialTitle('Join me on this app!');
        setSocialDescription('Get exclusive benefits when you join through my referral link!');
        setChannel('referral');
        setCampaign('user_referral');
        setMediaSource('referral_program');
        break;
      case 'promo':
        setTemplateId('promo_template');
        setLink('https://yourapp.com/promo/SUMMER2024');
        setDeepLinkValue('promo?campaign=SUMMER2024&code=SAVE20');
        setSocialTitle('Special Offer!');
        setSocialDescription('Get exclusive discounts on our app!');
        setChannel('promotional');
        setCampaign('SUMMER2024');
        setMediaSource('email');
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.header}>Dynamic Link & Resolver</Text>
          
          {/* Quick Templates */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Templates</Text>
            <View style={styles.quickTemplateContainer}>
              <TouchableOpacity
                style={[styles.quickTemplateButton, styles.productButton]}
                onPress={() => handleQuickCreate('product')}
              >
                <Ionicons name="cube" size={20} color="#fff" />
                <Text style={styles.quickTemplateText}>Product Share</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.quickTemplateButton, styles.referralButton]}
                onPress={() => handleQuickCreate('referral')}
              >
                <Ionicons name="people" size={20} color="#fff" />
                <Text style={styles.quickTemplateText}>Referral</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.quickTemplateButton, styles.promoButton]}
                onPress={() => handleQuickCreate('promo')}
              >
                <Ionicons name="gift" size={20} color="#fff" />
                <Text style={styles.quickTemplateText}>Promo</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Dynamic Link Creation Form */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Create Dynamic Link</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Template ID *</Text>
              <TextInput
                style={styles.input}
                placeholder="your_template_id"
                placeholderTextColor="#888"
                value={templateId}
                onChangeText={setTemplateId}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Link *</Text>
              <TextInput
                style={styles.input}
                placeholder="https://yourapp.com/product/123"
                placeholderTextColor="#888"
                value={link}
                onChangeText={setLink}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Domain URI Prefix *</Text>
              <TextInput
                style={styles.input}
                placeholder="https://yourapp.page.link"
                placeholderTextColor="#888"
                value={domainUriPrefix}
                onChangeText={setDomainUriPrefix}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Deep Link Value</Text>
              <TextInput
                style={styles.input}
                placeholder="product_detail?product_id=123"
                placeholderTextColor="#888"
                value={deepLinkValue}
                onChangeText={setDeepLinkValue}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>Android Redirect</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Play Store URL"
                  placeholderTextColor="#888"
                  value={androidRedirect}
                  onChangeText={setAndroidRedirect}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
                <Text style={styles.label}>iOS Redirect</Text>
                <TextInput
                  style={styles.input}
                  placeholder="App Store URL"
                  placeholderTextColor="#888"
                  value={iosRedirect}
                  onChangeText={setIosRedirect}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Social Media Title</Text>
              <TextInput
                style={styles.input}
                placeholder="Amazing Product"
                placeholderTextColor="#888"
                value={socialTitle}
                onChangeText={setSocialTitle}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Social Media Description</Text>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                placeholder="Check out this amazing product!"
                placeholderTextColor="#888"
                value={socialDescription}
                onChangeText={setSocialDescription}
                multiline
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Social Media Image Link</Text>
              <TextInput
                style={styles.input}
                placeholder="https://example.com/image.jpg"
                placeholderTextColor="#888"
                value={socialImageLink}
                onChangeText={setSocialImageLink}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>Channel</Text>
                <TextInput
                  style={styles.input}
                  placeholder="social"
                  placeholderTextColor="#888"
                  value={channel}
                  onChangeText={setChannel}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
                <Text style={styles.label}>Campaign</Text>
                <TextInput
                  style={styles.input}
                  placeholder="summer_sale"
                  placeholderTextColor="#888"
                  value={campaign}
                  onChangeText={setCampaign}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Media Source</Text>
              <TextInput
                style={styles.input}
                placeholder="facebook"
                placeholderTextColor="#888"
                value={mediaSource}
                onChangeText={setMediaSource}
              />
            </View>

            <TouchableOpacity
              style={[styles.createButton, { marginTop: 20 }]}
              onPress={handleCreateDynamicLink}
              disabled={isCreating}
            >
              <Ionicons name="add-circle" size={20} color="#fff" />
              <Text style={styles.buttonText}>
                {isCreating ? 'Creating...' : 'Create Dynamic Link'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Deep Link Resolver */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resolve Dynamic Link</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Dynamic Link URL</Text>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                placeholder="Enter dynamic link URL to resolve"
                placeholderTextColor="#888"
                value={deepLinkUrl}
                onChangeText={setDeepLinkUrl}
                multiline
              />
            </View>

            <TouchableOpacity
              style={[styles.resolveButton, { marginBottom: 20 }]}
              onPress={handleResolveDynamicLink}
              disabled={isResolving}
            >
              <Ionicons name="link" size={20} color="#fff" />
              <Text style={styles.buttonText}>
                {isResolving ? 'Resolving...' : 'Resolve Dynamic Link'}
              </Text>
            </TouchableOpacity>
          </View>

          {resolvedUrl ? (
            <View style={styles.resultContainer}>
              <Text style={styles.resultLabel}>Result:</Text>
              <Text style={styles.resultText}>{resolvedUrl}</Text>
            </View>
          ) : null}

          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>About Dynamic Links</Text>
            <Text style={styles.infoText}>
              • Create shareable links that work across platforms{'\n'}
              • Track attribution data through link parameters{'\n'}
              • Configure platform-specific redirect behavior{'\n'}
              • Add social media metadata for better sharing{'\n'}
              • Set custom SDK parameters for enhanced tracking{'\n'}
              • Support for deferred deep linking
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
    marginBottom: 30,
    color: '#333',
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
  quickTemplateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quickTemplateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  productButton: {
    backgroundColor: '#007bff',
  },
  referralButton: {
    backgroundColor: '#28a745',
  },
  promoButton: {
    backgroundColor: '#ffc107',
  },
  quickTemplateText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
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
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  resolveButton: {
    backgroundColor: '#007bff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
  },
  createButton: {
    backgroundColor: '#28a745',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  resultContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  resultText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
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

export default DynamicLinkScreen;
