import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { CarbonEntry, CarbonSummary } from '../types';
import { carbonApi } from '../services/api';
import {useRouter}from 'expo-router';

const HomeScreen = () => {
  const router = useRouter();
  const [entries, setEntries] = useState<CarbonEntry[]>([]);
  const [summary, setSummary] = useState<CarbonSummary | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newEntry, setNewEntry] = useState({
    activity: '',
    category: 'transport',
    carbonAmount: '',
    location: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [entriesData, summaryData] = await Promise.all([
        carbonApi.getEntries(),
        carbonApi.getSummary(),
      ]);
      setEntries(entriesData);
      setSummary(summaryData);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert(
        'Connection Error', 
        'Could not connect to server. Please make sure the backend is running on http://localhost:8080'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = async () => {
    if (!newEntry.activity || !newEntry.carbonAmount || !newEntry.location) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (isNaN(parseFloat(newEntry.carbonAmount))) {
      Alert.alert('Error', 'Carbon amount must be a number');
      return;
    }

    setLoading(true);
    try {
      await carbonApi.createEntry({
        activity: newEntry.activity,
        category: newEntry.category,
        carbonAmount: parseFloat(newEntry.carbonAmount),
        location: newEntry.location,
        timestamp: new Date(),
      });
      
      setModalVisible(false);
      setNewEntry({
        activity: '',
        category: 'transport',
        carbonAmount: '',
        location: '',
      });
      await loadData(); // Reload data to include the new entry
      Alert.alert('Success', 'Carbon entry added successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add entry');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      transport: '#FF6B6B',
      home: '#4ECDC4',
      travel: '#45B7D1',
      food: '#96CEB4',
      other: '#FFEAA7',
    };
    return colors[category] || '#CCCCCC';
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Summary Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Carbon Footprint Summary</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#4CAF50" />
          ) : summary ? (
            <>
              <Text style={styles.totalCarbon}>
                Total: {summary.totalCarbon.toFixed(2)} kg CO₂
              </Text>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>By Category</Text>
              {Object.entries(summary.categoryBreakdown).map(([category, amount]) => (
                <View key={category} style={styles.categoryRow}>
                  <View style={styles.categoryInfo}>
                    <View 
                      style={[
                        styles.categoryDot, 
                        { backgroundColor: getCategoryColor(category) }
                      ]} 
                    />
                    <Text style={styles.categoryText}>{category}</Text>
                  </View>
                  <Text style={styles.categoryAmount}>{amount.toFixed(2)} kg</Text>
                </View>
              ))}
            </>
          ) : (
            <Text>No data available</Text>
          )}
        </View>

        {/* Recent Entries */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Entries</Text>
          {loading ? (
            <ActivityIndicator size="small" color="#4CAF50" />
          ) : entries.length > 0 ? (
            entries.slice(0, 5).map((entry) => (
              <View key={entry.id} style={styles.entryItem}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryActivity}>{entry.activity}</Text>
                  <View 
                    style={[
                      styles.categoryPill,
                      { backgroundColor: getCategoryColor(entry.category) }
                    ]}
                  >
                    <Text style={styles.categoryPillText}>{entry.category}</Text>
                  </View>
                </View>
                <Text style={styles.entryDetails}>
                  {entry.carbonAmount} kg CO₂
                </Text>
                <Text style={styles.entryLocation}>📍 {entry.location}</Text>
                <Text style={styles.entryDate}>
                  {new Date(entry.timestamp).toLocaleDateString()}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noEntries}>No entries yet. Add your first carbon entry!</Text>
          )}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => router.push('/map')}
          >
            <Text style={styles.buttonText}>🗺️ View Map</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.outlineButton]}
            onPress={() => router.push('/analytics')}
          >
            <Text style={styles.outlineButtonText}>📊 Analytics</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Add Entry Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Add Entry Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Add Carbon Entry</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Activity (e.g., Car commute, Flight)"
              value={newEntry.activity}
              onChangeText={(text) => setNewEntry({ ...newEntry, activity: text })}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Category (e.g., transport, home, travel)"
              value={newEntry.category}
              onChangeText={(text) => setNewEntry({ ...newEntry, category: text })}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Carbon Amount (kg CO₂)"
              value={newEntry.carbonAmount}
              onChangeText={(text) => setNewEntry({ ...newEntry, carbonAmount: text })}
              keyboardType="numeric"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Location"
              value={newEntry.location}
              onChangeText={(text) => setNewEntry({ ...newEntry, location: text })}
            />
            
            <TouchableOpacity
              style={[styles.button, styles.primaryButton, styles.modalButton]}
              onPress={handleAddEntry}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Add Entry</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  totalCarbon: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 8,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    textTransform: 'capitalize',
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  entryItem: {
    marginVertical: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  entryActivity: {
    fontWeight: 'bold',
    fontSize: 14,
    flex: 1,
    color: '#333',
  },
  categoryPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  categoryPillText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  entryDetails: {
    color: '#4CAF50',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  entryLocation: {
    color: '#666',
    fontSize: 12,
    marginBottom: 2,
  },
  entryDate: {
    color: '#888',
    fontSize: 11,
  },
  noEntries: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginVertical: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 6,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  outlineButtonText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#4CAF50',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  fabText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modal: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  modalButton: {
    marginBottom: 8,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#666',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default HomeScreen;