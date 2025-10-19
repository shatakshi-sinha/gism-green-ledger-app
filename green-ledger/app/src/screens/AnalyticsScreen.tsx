import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { CarbonSummary } from '../types';
import { carbonApi } from '../services/api';

const AnalyticsScreen = () => {
  const [summary, setSummary] = useState<CarbonSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      const summaryData = await carbonApi.getSummary();
      setSummary(summaryData);
    } catch (error) {
      console.log('Error loading summary');
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading analytics...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Monthly Analysis */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Monthly Carbon Analysis</Text>
        {summary?.monthlyData.map((monthData, index) => (
          <View key={index} style={styles.monthItem}>
            <View style={styles.monthHeader}>
              <Text style={styles.monthText}>{monthData.month}</Text>
              <Text style={styles.monthCarbon}>{monthData.carbonAmount.toFixed(1)} kg CO₂</Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { 
                    width: `${Math.min((monthData.carbonAmount / 200) * 100, 100)}%`,
                    backgroundColor: monthData.carbonAmount > 150 ? '#F44336' : 
                                   monthData.carbonAmount > 100 ? '#FFC107' : '#4CAF50'
                  }
                ]} 
              />
            </View>
          </View>
        ))}
      </View>

      {/* Category Distribution */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Category Distribution</Text>
        {summary && Object.entries(summary.categoryBreakdown).map(([category, amount]) => {
          const percentage = summary.totalCarbon > 0 ? (amount / summary.totalCarbon) * 100 : 0;
          return (
            <View key={category} style={styles.categoryItem}>
              <View style={styles.categoryHeader}>
                <View style={styles.categoryInfo}>
                  <View 
                    style={[
                      styles.categoryDot, 
                      { backgroundColor: getCategoryColor(category) }
                    ]} 
                  />
                  <Text style={styles.categoryName}>{category}</Text>
                </View>
                <View style={styles.categoryStats}>
                  <Text style={styles.categoryAmount}>{amount.toFixed(1)} kg</Text>
                  <Text style={styles.categoryPercentage}>({percentage.toFixed(1)}%)</Text>
                </View>
              </View>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill,
                    { 
                      width: `${percentage}%`,
                      backgroundColor: getCategoryColor(category)
                    }
                  ]} 
                />
              </View>
            </View>
          );
        })}
      </View>

      {/* Insights */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Carbon Insights</Text>
        <View style={styles.insightItem}>
          <Text style={styles.insightIcon}>📊</Text>
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Total Footprint</Text>
            <Text style={styles.insightValue}>{summary?.totalCarbon.toFixed(1)} kg CO₂</Text>
          </View>
        </View>
        
        <View style={styles.insightItem}>
          <Text style={styles.insightIcon}>📈</Text>
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Monthly Average</Text>
            <Text style={styles.insightValue}>
              {summary && summary.monthlyData.length > 0 
                ? (summary.totalCarbon / summary.monthlyData.length).toFixed(1) 
                : '0'} kg CO₂
            </Text>
          </View>
        </View>
        
        <View style={styles.insightItem}>
          <Text style={styles.insightIcon}>🎯</Text>
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Largest Category</Text>
            <Text style={styles.insightValue}>
              {summary && Object.entries(summary.categoryBreakdown).reduce(
                (max, [cat, amount]) => amount > max.amount ? { cat, amount } : max,
                { cat: '', amount: 0 }
              ).cat}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  monthItem: {
    marginBottom: 16,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  monthText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textTransform: 'uppercase',
  },
  monthCarbon: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  categoryItem: {
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textTransform: 'capitalize',
  },
  categoryStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 4,
  },
  categoryPercentage: {
    fontSize: 12,
    color: '#666',
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  insightIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  insightValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textTransform: 'capitalize',
  },
});

export default AnalyticsScreen;