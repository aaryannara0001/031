import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { issuesAPI } from '@/services/api';
import { getCategoryColor } from '@/services/mockData';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Clock, MapPin, Plus, TrendingUp } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ReportsScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIssues();
  }, [user]);

  const loadIssues = async () => {
    try {
      setLoading(true);
      const response = await issuesAPI.getIssues();
      if (response.data) {
        setIssues(response.data);
      } else if (response.error) {
        Alert.alert('Error', response.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load issues');
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = user?.role === 'admin';
  const isStaff = user?.role === 'staff';

  // For admins and staff, show all issues; for others, show only their issues
  const userIssues =
    isAdmin || isStaff
      ? issues
      : issues.filter((issue) => issue.reporter_id === user?.id);

  const filters = [
    { id: 'all', label: 'All', count: userIssues.length },
    {
      id: 'pending',
      label: 'Pending',
      count: userIssues.filter((i) => i.status === 'pending').length,
    },
    {
      id: 'in-progress',
      label: 'In Progress',
      count: userIssues.filter(
        (i) => i.status === 'in_progress' || i.status === 'assigned'
      ).length,
    },
    {
      id: 'resolved',
      label: 'Resolved',
      count: userIssues.filter((i) => i.status === 'resolved').length,
    },
  ];

  const filteredIssues =
    selectedFilter === 'all'
      ? userIssues
      : userIssues.filter((issue) => {
          if (selectedFilter === 'in-progress') {
            return (
              issue.status === 'in_progress' || issue.status === 'assigned'
            );
          }
          return issue.status === selectedFilter;
        });

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {isAdmin || isStaff ? 'All Reports' : 'My Reports'}
          </Text>
          <Text
            style={[styles.headerSubtitle, { color: colors.textSecondary }]}
          >
            {isAdmin || isStaff
              ? 'Manage all reported issues in the system'
              : 'Track your submitted issues'}
          </Text>
        </View>
        {(isAdmin || isStaff) && (
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/analytics')}
          >
            <TrendingUp color={colors.text} size={24} />
          </TouchableOpacity>
        )}
        {!isAdmin && !isStaff && (
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/report-issue')}
          >
            <Plus color={colors.text} size={24} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterTab,
                { backgroundColor: colors.surface, borderColor: colors.border },
                selectedFilter === filter.id && [
                  styles.filterTabActive,
                  { backgroundColor: colors.primary },
                ],
              ]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: colors.textSecondary },
                  selectedFilter === filter.id && [
                    styles.filterTextActive,
                    { color: colors.text },
                  ],
                ]}
              >
                {filter.label}
              </Text>
              <View
                style={[
                  styles.filterCount,
                  { backgroundColor: colors.surface },
                  selectedFilter === filter.id && [
                    styles.filterCountActive,
                    { backgroundColor: colors.text + '20' },
                  ],
                ]}
              >
                <Text
                  style={[
                    styles.filterCountText,
                    { color: colors.text },
                    selectedFilter === filter.id && [
                      styles.filterCountTextActive,
                      { color: colors.primary },
                    ],
                  ]}
                >
                  {filter.count}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Issues List */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {filteredIssues.length === 0 ? (
          <Card style={styles.emptyState}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No reports found
            </Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {selectedFilter === 'all'
                ? isAdmin || isStaff
                  ? 'No issues have been reported in the system yet.'
                  : "You haven't reported any issues yet. Start by reporting your first issue!"
                : `No ${selectedFilter} reports found.`}
            </Text>
            {selectedFilter === 'all' && !isAdmin && !isStaff && (
              <TouchableOpacity
                style={[
                  styles.emptyButton,
                  { backgroundColor: colors.primary },
                ]}
                onPress={() => router.push('/report-issue')}
              >
                <Text style={[styles.emptyButtonText, { color: colors.text }]}>
                  Report Your First Issue
                </Text>
              </TouchableOpacity>
            )}
          </Card>
        ) : (
          filteredIssues.map((issue, index) => (
            <TouchableOpacity
              key={issue.id}
              onPress={() => router.push(`/issue-detail/${issue.id}`)}
            >
              <Card
                style={
                  index === 0
                    ? [styles.issueCard, styles.firstCard]
                    : styles.issueCard
                }
              >
                <View style={styles.issueHeader}>
                  <View style={styles.issueTitleRow}>
                    <View
                      style={[
                        styles.categoryDot,
                        { backgroundColor: getCategoryColor(issue.category) },
                      ]}
                    />
                    <Text
                      style={[styles.issueTitle, { color: colors.text }]}
                      numberOfLines={2}
                    >
                      {issue.title}
                    </Text>
                  </View>
                  <StatusBadge status={issue.status} size="sm" />
                </View>

                <View style={styles.issueContent}>
                  <Image
                    source={{
                      uri:
                        issue.images && issue.images.length > 0
                          ? issue.images[0]
                          : 'https://via.placeholder.com/80',
                    }}
                    style={styles.issueImage}
                  />
                  <View style={styles.issueDetails}>
                    <View style={styles.issueLocation}>
                      <MapPin color={colors.textSecondary} size={14} />
                      <Text
                        style={[
                          styles.issueLocationText,
                          { color: colors.textSecondary },
                        ]}
                        numberOfLines={1}
                      >
                        {issue.address}
                      </Text>
                    </View>

                    <Text
                      style={[
                        styles.issueDescription,
                        { color: colors.textTertiary },
                      ]}
                      numberOfLines={2}
                    >
                      {issue.description}
                    </Text>

                    <View style={styles.issueFooter}>
                      <View style={styles.issueTime}>
                        <Clock color={colors.textTertiary} size={14} />
                        <Text
                          style={[
                            styles.issueTimeText,
                            { color: colors.textTertiary },
                          ]}
                        >
                          {new Date(issue.reported_at).toLocaleDateString()}
                        </Text>
                      </View>
                      <View style={styles.issueStats}>
                        <View style={styles.issueStat}>
                          <TrendingUp color={colors.primary} size={14} />
                          <Text
                            style={[
                              styles.issueStatText,
                              { color: colors.primary },
                            ]}
                          >
                            {issue.upvotes || 0}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>

                <View
                  style={[
                    styles.trackingIdContainer,
                    { borderTopColor: colors.border },
                  ]}
                >
                  <Text
                    style={[styles.trackingId, { color: colors.textTertiary }]}
                  >
                    ID: {issue.tracking_id}
                  </Text>
                </View>
              </Card>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F9FAFB',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 2,
  },
  addButton: {
    backgroundColor: '#8B5CF6',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    paddingBottom: 16,
  },
  filterScroll: {
    paddingHorizontal: 16,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  filterTabActive: {
    backgroundColor: '#8B5CF6',
  },
  filterText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 6,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  filterCount: {
    backgroundColor: '#4B5563',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  filterCountActive: {
    backgroundColor: '#FFFFFF20',
  },
  filterCountText: {
    color: '#F9FAFB',
    fontSize: 11,
    fontWeight: '600',
  },
  filterCountTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F9FAFB',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  issueCard: {
    marginBottom: 12,
  },
  firstCard: {
    marginTop: 0,
  },
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  issueTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  issueTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F9FAFB',
    flex: 1,
    lineHeight: 22,
  },
  issueContent: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  issueImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  issueDetails: {
    flex: 1,
  },
  issueLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  issueLocationText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
    flex: 1,
  },
  issueDescription: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 20,
    marginBottom: 8,
  },
  issueFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  issueTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  issueTimeText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  issueStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  issueStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  issueStatText: {
    fontSize: 12,
    color: '#10B981',
    marginLeft: 4,
    fontWeight: '600',
  },
  trackingIdContainer: {
    borderTopWidth: 1,
    borderTopColor: '#374151',
    paddingTop: 8,
    marginTop: 4,
  },
  trackingId: {
    fontSize: 11,
    color: '#6B7280',
    fontFamily: 'monospace',
  },
});
