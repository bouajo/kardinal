import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  Dimensions, 
  TouchableOpacity, 
  TextStyle,
  ViewStyle,
  StyleProp
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Calendar, TrendingUp } from 'react-native-feather';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const { width } = Dimensions.get('window');

// Define the delivery data types
type TimeFrame = 'lastWeek' | 'lastMonth' | 'allTime';

interface DeliveryStats {
  completed: number;
  total: number;
  onTime: number;
  distance: number;
  time: string;
}

interface DeliveryData {
  lastWeek: DeliveryStats;
  lastMonth: DeliveryStats;
  allTime: DeliveryStats;
}

// Mock data for analytics
const deliveryData: DeliveryData = {
  lastWeek: {
    completed: 85,
    total: 92,
    onTime: 78,
    distance: 489.3,
    time: '47h 30m',
  },
  lastMonth: {
    completed: 342,
    total: 355,
    onTime: 318,
    distance: 1958.4,
    time: '182h 15m',
  },
  allTime: {
    completed: 2145,
    total: 2201,
    onTime: 1982,
    distance: 12589.7,
    time: '1072h 45m',
  }
};

// Style definitions to properly type the text styles
const textStyles = StyleSheet.create({
  metricValueText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  distanceValueText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  }
});

export default function AnalyticsScreen() {
  const [timeframe, setTimeframe] = useState<TimeFrame>('lastWeek');
  const data = deliveryData[timeframe];
  
  const completionRate = Math.round((data.completed / data.total) * 100);
  const onTimeRate = Math.round((data.onTime / data.completed) * 100);
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft stroke="#0f172a" width={24} height={24} />
        </TouchableOpacity>
        <ThemedText type="title">Analytics</ThemedText>
        <View style={{ width: 24 }} />
      </View>
      
      <View style={styles.timeframeSelector}>
        {['lastWeek', 'lastMonth', 'allTime'].map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.timeframeOption,
              timeframe === period && styles.activeTimeframe
            ]}
            onPress={() => setTimeframe(period as TimeFrame)}
          >
            <ThemedText
              style={[
                styles.timeframeText,
                timeframe === period && styles.activeTimeframeText
              ]}
            >
              {period === 'lastWeek' ? 'Week' : 
               period === 'lastMonth' ? 'Month' : 'All Time'}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
      
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Card style={styles.summaryCard}>
          <CardHeader style={styles.cardHeader}>
            <CardTitle>
              <ThemedText style={{fontSize: 18, fontWeight: 'bold', color: '#0f172a'}}>Performance Summary</ThemedText>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <ThemedText style={textStyles.metricValueText}>{completionRate}%</ThemedText>
                <ThemedText style={styles.metricLabel}>Completion Rate</ThemedText>
              </View>
              <View style={styles.metricCard}>
                <ThemedText style={textStyles.metricValueText}>{onTimeRate}%</ThemedText>
                <ThemedText style={styles.metricLabel}>On-Time Rate</ThemedText>
              </View>
              <View style={styles.metricCard}>
                <ThemedText style={textStyles.metricValueText}>{data.completed}</ThemedText>
                <ThemedText style={styles.metricLabel}>Stops Completed</ThemedText>
              </View>
              <View style={styles.metricCard}>
                <ThemedText style={textStyles.metricValueText}>{data.total - data.completed}</ThemedText>
                <ThemedText style={styles.metricLabel}>Missed Stops</ThemedText>
              </View>
            </View>
          </CardContent>
        </Card>
        
        <Card style={styles.distanceCard}>
          <CardHeader style={styles.cardHeader}>
            <CardTitle>
              <ThemedText style={{fontSize: 18, fontWeight: 'bold', color: '#0f172a'}}>Distance & Time</ThemedText>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <View style={styles.distanceContent}>
              <View style={styles.distanceItem}>
                <ThemedText style={textStyles.distanceValueText}>{data.distance.toFixed(1)} km</ThemedText>
                <ThemedText style={styles.distanceLabel}>Total Distance</ThemedText>
              </View>
              <View style={styles.divider} />
              <View style={styles.distanceItem}>
                <ThemedText style={textStyles.distanceValueText}>{data.time}</ThemedText>
                <ThemedText style={styles.distanceLabel}>Total Time</ThemedText>
              </View>
            </View>
          </CardContent>
        </Card>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Calendar stroke="#ffffff" width={24} height={24} />
            <ThemedText style={styles.actionButtonText}>Export Report</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <TrendingUp stroke="#ffffff" width={24} height={24} />
            <ThemedText style={styles.actionButtonText}>View Details</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  timeframeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  timeframeOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  timeframeOptionActive: {
    backgroundColor: '#3b82f6',
  },
  timeframeText: {
    fontSize: 14,
    color: '#64748b',
  },
  timeframeTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: 16,
  },
  summaryCard: {
    marginBottom: 16,
  },
  cardHeader: {
    paddingBottom: 8,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  distanceCard: {
    marginBottom: 16,
  },
  distanceContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  distanceItem: {
    flex: 1,
    alignItems: 'center',
  },
  distanceLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  divider: {
    width: 1,
    height: 50,
    backgroundColor: '#e2e8f0',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    paddingVertical: 12,
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  activeTimeframe: {
    backgroundColor: '#3b82f6',
  },
  activeTimeframeText: {
    color: '#ffffff',
  },
});