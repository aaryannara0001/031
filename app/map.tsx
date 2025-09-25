import { mockIssues } from '@/services/mockData';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  ChevronLeft,
  Filter,
  MapPin,
  ZoomIn,
  ZoomOut,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function MapScreen() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [zoomLevel, setZoomLevel] = useState(1);

  const filters = [
    { id: 'all', label: 'All Issues', color: '#8B5CF6' },
    { id: 'pothole', label: 'Potholes', color: '#EF4444' },
    { id: 'streetlight', label: 'Lights', color: '#F59E0B' },
    { id: 'garbage', label: 'Garbage', color: '#10B981' },
  ];

  const filteredIssues =
    selectedFilter === 'all'
      ? mockIssues
      : mockIssues.filter((issue) => issue.category === selectedFilter);

  const handleZoomIn = () => {
    setZoomLevel(Math.min(zoomLevel + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(Math.max(zoomLevel - 0.2, 0.5));
  };

  const handleIssuePress = (issueId: string) => {
    router.push(`/issue-detail/${issueId}`);
  };

  const handleNavigateToIssue = (issueId: string) => {
    // Mock navigation
    console.log('Navigate to issue:', issueId);
  };

  return (
    <LinearGradient colors={['#111827', '#1F2937']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft color="#9CA3AF" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Map View</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter color="#8B5CF6" size={20} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <View style={styles.filterTabs}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterTab,
                selectedFilter === filter.id && {
                  backgroundColor: filter.color,
                },
              ]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter.id && styles.filterTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Map Container */}
      <View style={styles.mapContainer}>
        {/* Mock Map Background */}
        <View
          style={[styles.mapBackground, { transform: [{ scale: zoomLevel }] }]}
        >
          {/* Mock streets and areas */}
          <View style={styles.mockStreet1} />
          <View style={styles.mockStreet2} />
          <View style={styles.mockArea1} />
          <View style={styles.mockArea2} />

          {/* Issue Markers */}
          {filteredIssues.map((issue, index) => (
            <TouchableOpacity
              key={issue.id}
              style={[
                styles.issueMarker,
                {
                  left: `${20 + ((index * 15) % 60)}%`,
                  top: `${20 + ((index * 20) % 50)}%`,
                  backgroundColor:
                    filters.find((f) => f.id === issue.category)?.color ||
                    '#8B5CF6',
                },
              ]}
              onPress={() => handleIssuePress(issue.id)}
            >
              <MapPin color="#FFFFFF" size={16} />
            </TouchableOpacity>
          ))}

          {/* Current Location */}
          <View style={styles.currentLocation}>
            <View style={styles.locationDot} />
            <View style={styles.locationPulse} />
          </View>
        </View>

        {/* Map Controls */}
        <View style={styles.mapControls}>
          <TouchableOpacity style={styles.controlButton} onPress={handleZoomIn}>
            <ZoomIn color="#F9FAFB" size={20} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={handleZoomOut}
          >
            <ZoomOut color="#F9FAFB" size={20} />
          </TouchableOpacity>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <Text style={styles.legendTitle}>Legend</Text>
          {filters.slice(1).map((filter) => (
            <View key={filter.id} style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: filter.color }]}
              />
              <Text style={styles.legendText}>{filter.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Bottom Sheet - Issue Details */}
      <View style={styles.bottomSheet}>
        <View style={styles.bottomSheetHandle} />
        <Text style={styles.bottomSheetTitle}>
          {filteredIssues.length}{' '}
          {selectedFilter === 'all'
            ? 'Issues'
            : filters.find((f) => f.id === selectedFilter)?.label}{' '}
          Nearby
        </Text>

        <View style={styles.quickStats}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>
              {filteredIssues.filter((i) => i.status === 'pending').length}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>
              {
                filteredIssues.filter(
                  (i) => i.status === 'in-progress' || i.status === 'assigned'
                ).length
              }
            </Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>
              {filteredIssues.filter((i) => i.status === 'resolved').length}
            </Text>
            <Text style={styles.statLabel}>Resolved</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F9FAFB',
  },
  filterButton: {
    padding: 8,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 4,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  filterText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapBackground: {
    flex: 1,
    backgroundColor: '#1F2937',
    position: 'relative',
  },
  mockStreet1: {
    position: 'absolute',
    left: '10%',
    top: '20%',
    width: '80%',
    height: 3,
    backgroundColor: '#4B5563',
  },
  mockStreet2: {
    position: 'absolute',
    left: '20%',
    top: '10%',
    width: 3,
    height: '80%',
    backgroundColor: '#4B5563',
  },
  mockArea1: {
    position: 'absolute',
    left: '15%',
    top: '25%',
    width: '30%',
    height: '20%',
    backgroundColor: '#374151',
    borderRadius: 8,
  },
  mockArea2: {
    position: 'absolute',
    left: '55%',
    top: '45%',
    width: '25%',
    height: '15%',
    backgroundColor: '#374151',
    borderRadius: 8,
  },
  issueMarker: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  currentLocation: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#8B5CF6',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  locationPulse: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#8B5CF6',
    opacity: 0.3,
  },
  mapControls: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -50 }],
  },
  controlButton: {
    backgroundColor: '#374151',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  legend: {
    position: 'absolute',
    left: 16,
    top: 16,
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F9FAFB',
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  bottomSheet: {
    backgroundColor: '#1F2937',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#4B5563',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F9FAFB',
    marginBottom: 16,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
});
