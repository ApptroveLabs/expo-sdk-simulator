import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppTroveSDK } from 'apptrove-expo-sdk';

const CampaignDataScreen = () => {
  const [campaignData, setCampaignData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCampaignData = async () => {
    setIsLoading(true);
    try {
      // Get comprehensive campaign data using all available methods
      let data = {};
      
      if (AppTroveSDK) {
        data = {
          // Basic campaign data
          ad: AppTroveSDK.getAd ? AppTroveSDK.getAd() : 'Demo Ad',
          adId: AppTroveSDK.getAdID ? AppTroveSDK.getAdID() : 'demo_ad_id',
          campaign: AppTroveSDK.getCampaign ? AppTroveSDK.getCampaign() : 'Demo Campaign',
          campaignId: AppTroveSDK.getCampaignID ? AppTroveSDK.getCampaignID() : 'demo_campaign_id',
          adSet: AppTroveSDK.getAdSet ? AppTroveSDK.getAdSet() : 'Demo Ad Set',
          adSetId: AppTroveSDK.getAdSetID ? AppTroveSDK.getAdSetID() : 'demo_adset_id',
          channel: AppTroveSDK.getChannel ? AppTroveSDK.getChannel() : 'Demo Channel',
          
          // Custom parameters
          p1: AppTroveSDK.getP1 ? AppTroveSDK.getP1() : 'demo_p1',
          p2: AppTroveSDK.getP2 ? AppTroveSDK.getP2() : 'demo_p2',
          p3: AppTroveSDK.getP3 ? AppTroveSDK.getP3() : 'demo_p3',
          p4: AppTroveSDK.getP4 ? AppTroveSDK.getP4() : 'demo_p4',
          p5: AppTroveSDK.getP5 ? AppTroveSDK.getP5() : 'demo_p5',
          
          // Tracking identifiers
          clickId: AppTroveSDK.getClickId ? AppTroveSDK.getClickId() : 'demo_click_id',
          dlv: AppTroveSDK.getDlv ? AppTroveSDK.getDlv() : 'demo_dlv',
          pid: AppTroveSDK.getPid ? AppTroveSDK.getPid() : 'demo_pid',
          
          // Campaign type
          isRetargeting: AppTroveSDK.getIsRetargeting ? AppTroveSDK.getIsRetargeting() : false,
          
          // Additional data
          trackierId: AppTroveSDK.getAppTroveId ? await AppTroveSDK.getAppTroveId() : 'demo_trackier_id',
          timestamp: new Date().toISOString(),
        };
      } else {
        // Demo data when SDK is not available
        data = {
          ad: 'Demo Ad',
          adId: 'demo_ad_id',
          campaign: 'Demo Campaign',
          campaignId: 'demo_campaign_id',
          adSet: 'Demo Ad Set',
          adSetId: 'demo_adset_id',
          channel: 'Demo Channel',
          p1: 'demo_p1',
          p2: 'demo_p2',
          p3: 'demo_p3',
          p4: 'demo_p4',
          p5: 'demo_p5',
          clickId: 'demo_click_id',
          dlv: 'demo_dlv',
          pid: 'demo_pid',
          isRetargeting: false,
          trackierId: 'demo_trackier_id',
          timestamp: new Date().toISOString(),
        };
      }
      
      setCampaignData(data);
    } catch (error) {
      console.error('Error fetching campaign data:', error);
      Alert.alert('Error', 'Failed to fetch campaign data');
    } finally {
      setIsLoading(false);
    }
  };

  const clearCampaignData = () => {
    setCampaignData(null);
    Alert.alert('Cleared', 'Campaign data cleared from display');
  };

  const refreshData = () => {
    fetchCampaignData();
  };

  useEffect(() => {
    fetchCampaignData();
  }, []);

  const renderDataItem = (label, value, isLast = false) => (
    <View key={label} style={[styles.dataItem, isLast && styles.lastDataItem]}>
      <Text style={styles.dataLabel}>{label}:</Text>
      <Text style={styles.dataValue}>{value || 'N/A'}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Campaign Data</Text>
        <Text style={styles.subtitle}>View attribution and campaign information</Text>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.refreshButton]}
            onPress={refreshData}
            disabled={isLoading}
          >
            <Ionicons name="refresh" size={20} color="#fff" />
            <Text style={styles.buttonText}>
              {isLoading ? 'Loading...' : 'Refresh Data'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.clearButton]}
            onPress={clearCampaignData}
          >
            <Ionicons name="trash" size={20} color="#fff" />
            <Text style={styles.buttonText}>Clear Display</Text>
          </TouchableOpacity>
        </View>

        {/* Campaign Data Display */}
        {campaignData ? (
          <View style={styles.dataContainer}>
            <Text style={styles.dataTitle}>Campaign Information</Text>
            
            {renderDataItem('Ad', campaignData.ad)}
            {renderDataItem('Ad ID', campaignData.adId)}
            {renderDataItem('Campaign', campaignData.campaign)}
            {renderDataItem('Campaign ID', campaignData.campaignId)}
            {renderDataItem('Ad Set', campaignData.adSet)}
            {renderDataItem('Ad Set ID', campaignData.adSetId)}
            {renderDataItem('Channel', campaignData.channel)}
            {renderDataItem('Parameter 1', campaignData.p1)}
            {renderDataItem('Parameter 2', campaignData.p2)}
            {renderDataItem('Parameter 3', campaignData.p3)}
            {renderDataItem('Parameter 4', campaignData.p4)}
            {renderDataItem('Parameter 5', campaignData.p5)}
            {renderDataItem('Click ID', campaignData.clickId)}
            {renderDataItem('Deep Link Value', campaignData.dlv)}
            {renderDataItem('Partner ID', campaignData.pid)}
            {renderDataItem('Is Retargeting', campaignData.isRetargeting ? 'Yes' : 'No')}
            {renderDataItem('AppTrove ID', campaignData.trackierId)}
            {renderDataItem('Timestamp', campaignData.timestamp, true)}
          </View>
        ) : (
          <View style={styles.noDataContainer}>
            <Ionicons name="information-circle" size={48} color="#666" />
            <Text style={styles.noDataText}>
              {isLoading ? 'Loading campaign data...' : 'No campaign data available'}
            </Text>
            <Text style={styles.noDataSubtext}>
              Campaign data will be available after the first attribution or when provided by the SDK
            </Text>
          </View>
        )}

        {/* Info Section */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>About Campaign Data</Text>
          <Text style={styles.infoText}>
            Campaign data provides detailed attribution information including:{'\n'}
            • Ad and campaign details{'\n'}
            • Ad set and channel information{'\n'}
            • Custom parameters (P1-P5){'\n'}
            • Click ID and deep link values{'\n'}
            • Partner ID and retargeting status{'\n'}
            • AppTrove ID for user identification
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  refreshButton: {
    backgroundColor: '#007bff',
  },
  clearButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  dataContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dataTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  dataItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  lastDataItem: {
    borderBottomWidth: 0,
  },
  dataLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  dataValue: {
    fontSize: 14,
    color: '#666',
    flex: 2,
    textAlign: 'right',
  },
  noDataContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    marginBottom: 20,
  },
  noDataText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 15,
    marginBottom: 10,
    textAlign: 'center',
  },
  noDataSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
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

export default CampaignDataScreen;
