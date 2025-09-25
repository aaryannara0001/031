import { Card } from '@/components/ui/Card';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  Download,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface ChartData {
  label: string;
  value: number;
  color: string;
}

const issueTrends: ChartData[] = [
  { label: 'Jan', value: 120, color: '#8B5CF6' },
  { label: 'Feb', value: 150, color: '#8B5CF6' },
  { label: 'Mar', value: 180, color: '#8B5CF6' },
  { label: 'Apr', value: 220, color: '#8B5CF6' },
  { label: 'May', value: 280, color: '#8B5CF6' },
  { label: 'Jun', value: 320, color: '#8B5CF6' },
];

const resolutionTimes: ChartData[] = [
  { label: '0-1 day', value: 35, color: '#10B981' },
  { label: '1-3 days', value: 45, color: '#F59E0B' },
  { label: '3-7 days', value: 15, color: '#EF4444' },
  { label: '7+ days', value: 5, color: '#6B7280' },
];

const categoryData: ChartData[] = [
  { label: 'Infrastructure', value: 35, color: '#8B5CF6' },
  { label: 'Environment', value: 25, color: '#10B981' },
  { label: 'Public Safety', value: 20, color: '#F59E0B' },
  { label: 'Utilities', value: 12, color: '#EF4444' },
  { label: 'Other', value: 8, color: '#6B7280' },
];

export default function AnalyticsScreen() {
  const { colors } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const periods = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'This Quarter' },
    { id: 'year', label: 'This Year' },
  ];

  const analyticsData = {
    totalIssues: 1247,
    resolvedIssues: 892,
    avgResolutionTime: '2.3 days',
    activeUsers: 3421,
    issuesThisPeriod: 156,
    resolutionRate: 71.5,
    userGrowth: 15.2,
    satisfactionScore: 4.2,
  };

  const getMaxValue = (data: ChartData[]) => {
    return Math.max(...data.map((item) => item.value));
  };

  const renderBarChart = (data: ChartData[], height: number = 120) => {
    const maxValue = getMaxValue(data);

    return (
      <View style={styles.chartContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.barGroup}>
            <View style={styles.barContainer}>
              <View
                style={[
                  styles.bar,
                  {
                    height: (item.value / maxValue) * height,
                    backgroundColor: item.color,
                  },
                ]}
              />
            </View>
            <Text style={styles.barLabel}>{item.label}</Text>
            <Text style={styles.barValue}>{item.value}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderPieChart = (data: ChartData[]) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let startAngle = 0;

    return (
      <View style={styles.pieChartContainer}>
        <View style={styles.pieChart}>
          {data.map((item, index) => {
            const percentage = item.value / total;
            const angle = percentage * 360;
            const endAngle = startAngle + angle;

            // Simple colored segments (in a real app, you'd use a proper pie chart library)
            const segmentStyle = {
              backgroundColor: item.color,
              transform: [{ rotate: `${startAngle}deg` }],
            };

            startAngle = endAngle;

            return (
              <View key={index} style={[styles.pieSegment, segmentStyle]}>
                <View style={styles.segmentOverlay} />
              </View>
            );
          })}
        </View>
        <View style={styles.legendContainer}>
          {data.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View
                style={[styles.legendColor, { backgroundColor: item.color }]}
              />
              <Text style={styles.legendText}>
                {item.label} ({item.value}%)
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const handleExportData = () => {
    // TODO: Implement data export
    alert('Data export functionality coming soon!');
  };

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft color={colors.text} size={24} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Analytics Dashboard
          </Text>
          <TouchableOpacity
            style={styles.exportButton}
            onPress={handleExportData}
          >
            <Download color={colors.primary} size={20} />
          </TouchableOpacity>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.periodScroll}
          >
            {periods.map((period) => (
              <TouchableOpacity
                key={period.id}
                style={[
                  styles.periodChip,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                  selectedPeriod === period.id && [
                    styles.periodChipActive,
                    { backgroundColor: colors.primary },
                  ],
                ]}
                onPress={() => setSelectedPeriod(period.id)}
              >
                <Text
                  style={[
                    styles.periodText,
                    { color: colors.textSecondary },
                    selectedPeriod === period.id && [
                      styles.periodTextActive,
                      { color: colors.text },
                    ],
                  ]}
                >
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Key Metrics */}
        <View style={styles.metricsGrid}>
          <Card style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <BarChart3 color="#8B5CF6" size={24} />
              <View style={styles.metricChange}>
                <TrendingUp color="#10B981" size={14} />
                <Text style={styles.metricChangeText}>+12%</Text>
              </View>
            </View>
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {analyticsData.totalIssues}
            </Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
              Total Issues
            </Text>
          </Card>

          <Card style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Users color="#10B981" size={24} />
              <View style={styles.metricChange}>
                <TrendingUp color="#10B981" size={14} />
                <Text style={styles.metricChangeText}>
                  +{analyticsData.userGrowth}%
                </Text>
              </View>
            </View>
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {analyticsData.activeUsers}
            </Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
              Active Users
            </Text>
          </Card>

          <Card style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Calendar color="#F59E0B" size={24} />
              <View style={styles.metricChange}>
                <TrendingDown color="#EF4444" size={14} />
                <Text style={styles.metricChangeText}>-0.3 days</Text>
              </View>
            </View>
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {analyticsData.avgResolutionTime}
            </Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
              Avg Resolution Time
            </Text>
          </Card>

          <Card style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <TrendingUp color="#EF4444" size={24} />
              <View style={styles.metricChange}>
                <TrendingUp color="#10B981" size={14} />
                <Text style={styles.metricChangeText}>+5.2%</Text>
              </View>
            </View>
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {analyticsData.resolutionRate}%
            </Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
              Resolution Rate
            </Text>
          </Card>
        </View>

        {/* Issue Trends Chart */}
        <Card style={styles.chartCard}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>
            Issue Trends
          </Text>
          <Text style={[styles.chartSubtitle, { color: colors.textSecondary }]}>
            Issues reported over the last 6 months
          </Text>
          {renderBarChart(issueTrends)}
        </Card>

        {/* Resolution Time Distribution */}
        <Card style={styles.chartCard}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>
            Resolution Time Distribution
          </Text>
          <Text style={[styles.chartSubtitle, { color: colors.textSecondary }]}>
            How quickly issues are being resolved
          </Text>
          {renderBarChart(resolutionTimes, 100)}
        </Card>

        {/* Category Breakdown */}
        <Card style={styles.chartCard}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>
            Issues by Category
          </Text>
          <Text style={[styles.chartSubtitle, { color: colors.textSecondary }]}>
            Distribution of reported issues by category
          </Text>
          {renderPieChart(categoryData)}
        </Card>

        {/* Performance Insights */}
        <Card style={styles.insightsCard}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Performance Insights
          </Text>

          <View style={styles.insightItem}>
            <View
              style={[styles.insightDot, { backgroundColor: colors.primary }]}
            />
            <Text style={[styles.insightText, { color: colors.textSecondary }]}>
              Infrastructure issues have increased by 25% this month, indicating
              a need for more focus on road maintenance.
            </Text>
          </View>

          <View style={styles.insightItem}>
            <View
              style={[styles.insightDot, { backgroundColor: colors.primary }]}
            />
            <Text style={[styles.insightText, { color: colors.textSecondary }]}>
              Resolution times have improved by 0.3 days on average, showing
              better efficiency in the field operations.
            </Text>
          </View>

          <View style={styles.insightItem}>
            <View
              style={[styles.insightDot, { backgroundColor: colors.primary }]}
            />
            <Text style={[styles.insightText, { color: colors.textSecondary }]}>
              User engagement is up 15%, with more citizens actively
              participating in community issue reporting.
            </Text>
          </View>

          <View style={styles.insightItem}>
            <View
              style={[styles.insightDot, { backgroundColor: colors.primary }]}
            />
            <Text style={[styles.insightText, { color: colors.textSecondary }]}>
              Public safety reports are trending downward, suggesting improved
              community safety measures are working.
            </Text>
          </View>
        </Card>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  exportButton: {
    padding: 8,
  },
  periodSelector: {
    marginBottom: 16,
  },
  periodScroll: {
    flexDirection: 'row',
  },
  periodChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
  },
  periodChipActive: {
    backgroundColor: '#8B5CF6',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '500',
  },
  periodTextActive: {
    color: '#FFFFFF',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  metricCard: {
    width: '48%',
    marginBottom: 16,
    marginRight: '4%',
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricChangeText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    marginLeft: 2,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  chartCard: {
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 140,
    paddingVertical: 20,
  },
  barGroup: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    height: 120,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: 24,
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
  },
  barValue: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  pieChartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
  },
  pieChart: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#374151',
    position: 'relative',
    marginRight: 20,
  },
  pieSegment: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  segmentOverlay: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  legendContainer: {
    flex: 1,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#F9FAFB',
  },
  insightsCard: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F9FAFB',
    marginBottom: 16,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  insightDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8B5CF6',
    marginTop: 6,
    marginRight: 12,
  },
  insightText: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 20,
    flex: 1,
  },
});
