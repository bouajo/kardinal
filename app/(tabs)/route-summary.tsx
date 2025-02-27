import React from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Share2, Calendar } from 'react-native-feather';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const { width } = Dimensions.get('window');

// Mock data for the route summary
const routeSummary = {
  totalDistance: 120.5,
  totalTime: '5h 30m',
  averageSpeed: 22,
  stopsCompleted: 18,
  stopsAttempted: 20,
  successfulDeliveries: 18,
  failedDeliveries: 2,
  onTimeDeliveries: 16,
  lateDeliveries: 2,
};

export default function RouteSummaryScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(tabs)')}>
          <ArrowLeft stroke="#0f172a" width={24} height={24} />
        </TouchableOpacity>
        <ThemedText type="title">Route Summary</ThemedText>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.summaryCard}>
          <CardHeader>
            <CardTitle>High-Level Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <ThemedText style={styles.summaryValue}>{routeSummary.totalDistance} km</ThemedText>
                <ThemedText style={styles.summaryLabel}>Total Distance</ThemedText>
              </View>
              <View style={styles.summaryItem}>
                <ThemedText style={styles.summaryValue}>{routeSummary.totalTime}</ThemedText>
                <ThemedText style={styles.summaryLabel}>Total Time</ThemedText>
              </View>
              <View style={styles.summaryItem}>
                <ThemedText style={styles.summaryValue}>{routeSummary.averageSpeed} km/h</ThemedText>
                <ThemedText style={styles.summaryLabel}>Avg. Speed</ThemedText>
              </View>
            </View>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <ThemedText style={styles.summaryValue}>
                  {routeSummary.stopsCompleted}/{routeSummary.stopsAttempted}
                </ThemedText>
                <ThemedText style={styles.summaryLabel}>Stops Completed</ThemedText>
              </View>
            </View>
          </CardContent>
        </Card>

        <Card style={styles.deliveryCard}>
          <CardHeader>
            <CardTitle>Delivery Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <View style={styles.deliveryMetrics}>
              <View style={styles.metricItem}>
                <ThemedView style={[styles.metricCircle, { backgroundColor: '#10b981' }]}>
                  <ThemedText style={styles.metricCircleText}>{routeSummary.successfulDeliveries}</ThemedText>
                </ThemedView>
                <ThemedText style={styles.metricLabel}>Successful</ThemedText>
              </View>
              <View style={styles.metricItem}>
                <ThemedView style={[styles.metricCircle, { backgroundColor: '#ef4444' }]}>
                  <ThemedText style={styles.metricCircleText}>{routeSummary.failedDeliveries}</ThemedText>
                </ThemedView>
                <ThemedText style={styles.metricLabel}>Failed</ThemedText>
              </View>
              <View style={styles.metricItem}>
                <ThemedView style={[styles.metricCircle, { backgroundColor: '#3b82f6' }]}>
                  <ThemedText style={styles.metricCircleText}>{routeSummary.onTimeDeliveries}</ThemedText>
                </ThemedView>
                <ThemedText style={styles.metricLabel}>On-Time</ThemedText>
              </View>
              <View style={styles.metricItem}>
                <ThemedView style={[styles.metricCircle, { backgroundColor: '#f59e0b' }]}>
                  <ThemedText style={styles.metricCircleText}>{routeSummary.lateDeliveries}</ThemedText>
                </ThemedView>
                <ThemedText style={styles.metricLabel}>Late</ThemedText>
              </View>
            </View>
          </CardContent>
        </Card>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Share2 stroke="#ffffff" width={24} height={24} />
            <ThemedText style={styles.actionButtonText}>Export Data</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/(tabs)/analytics')}
          >
            <Calendar stroke="#ffffff" width={24} height={24} />
            <ThemedText style={styles.actionButtonText}>View Analytics</ThemedText>
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
  content: {
    padding: 16,
  },
  summaryCard: {
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  deliveryCard: {
    marginBottom: 16,
  },
  deliveryMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  metricItem: {
    alignItems: 'center',
    margin: 8,
  },
  metricCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricCircleText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  metricLabel: {
    fontSize: 14,
    color: '#64748b',
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
});