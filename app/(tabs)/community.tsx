import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { getCategoryColor } from '@/services/mockData';
import { issuesAPI } from '@/services/api';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  Award,
  Filter,
  MapPin,
  MessageCircle,
  Search,
  TrendingDown,
  TrendingUp,
} from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';

export default function CommunityScreen() {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIssues();
  }, []);

  const loadIssues = async () => {
    try {
      setLoading(true);
      const response = await issuesAPI.getIssues({ limit: 50 });
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

  const categories = [
    { id: 'all', label: 'All Issues', count: issues.length },
    {
      id: 'pothole',
      label: 'Potholes',
      count: issues.filter((i) => i.category === 'pothole').length,
    },
    {
      id: 'streetlight',
      label: 'Lights',
      count: issues.filter((i) => i.category === 'streetlight').length,
    },
    {
      id: 'garbage',
      label: 'Garbage',
      count: issues.filter((i) => i.category === 'garbage').length,
    },
  ];

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchText.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || issue.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const leaderboard = [
    { name: 'John Citizen', points: 1250, badge: '🏆', reports: 12 },
    { name: 'Sarah Helper', points: 980, badge: '🥈', reports: 8 },
    { name: 'Mike Validator', points: 756, badge: '🥉', reports: 15 },
  ];

  const handleVote = async (issueId: string, type: 'up' | 'down') => {
    try {
      const response = await issuesAPI.voteIssue(issueId, {
        is_upvote: type === 'up',
      });
      if (response.error) {
        Alert.alert('Error', response.error);
      } else {
        // Reload issues to get updated vote counts
        loadIssues();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to vote on issue');
    }
  };

  return (
    <LinearGradient colors={['#FFFFFF', '#F9FAFB']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Community</Text>
          <Text style={styles.headerSubtitle}>
            Validate and support local issues
          </Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search color="#9CA3AF" size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search issues..."
            placeholderTextColor="#6B7280"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter color="#8B5CF6" size={20} />
        </TouchableOpacity>
      </View>

      {/* Category Filter */}
      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryTab,
                selectedCategory === category.id && styles.categoryTabActive,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.categoryTextActive,
                ]}
              >
                {category.label} ({category.count})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Leaderboard */}
        <Card style={styles.leaderboardCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Award color="#8B5CF6" size={20} />
              <Text style={[styles.sectionTitle, { marginLeft: 8 }]}>
                Community Heroes
              </Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/leaderboard')}>
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {leaderboard.map((user, index) => (
            <View key={index} style={styles.leaderboardItem}>
              <View style={styles.leaderboardLeft}>
                <Text style={styles.leaderboardBadge}>{user.badge}</Text>
                <View>
                  <Text style={styles.leaderboardName}>{user.name}</Text>
                  <Text style={styles.leaderboardStats}>
                    {user.points} points • {user.reports} reports
                  </Text>
                </View>
              </View>
              {index === 0 && (
                <View style={styles.topUserBadge}>
                  <Text style={styles.topUserText}>TOP</Text>
                </View>
              )}
            </View>
          ))}
        </Card>

        {/* Issues Feed */}
        <Card>
          <Text style={styles.sectionTitle}>Recent Issues</Text>

          {filteredIssues.map((issue) => (
            <TouchableOpacity
              key={issue.id}
              style={styles.issueItem}
              onPress={() => router.push(`/issue-detail/${issue.id}`)}
            >
              <View style={styles.issueContent}>
                <Image
                  source={{ uri: issue.images && issue.images.length > 0 ? issue.images[0] : 'https://via.placeholder.com/80' }}
                  style={styles.issueImage}
                />

                <View style={styles.issueDetails}>
                  <View style={styles.issueHeader}>
                    <View style={styles.issueTitleRow}>
                      <View
                        style={[
                          styles.categoryDot,
                          { backgroundColor: getCategoryColor(issue.category) },
                        ]}
                      />
                      <Text style={styles.issueTitle} numberOfLines={2}>
                        {issue.title}
                      </Text>
                    </View>
                    <StatusBadge status={issue.status} size="sm" />
                  </View>

                  <View style={styles.issueLocation}>
                    <MapPin color="#9CA3AF" size={14} />
                    <Text style={styles.issueLocationText} numberOfLines={1}>
                      {issue.address}
                    </Text>
                  </View>

                  <Text style={styles.issueDescription} numberOfLines={2}>
                    {issue.description}
                  </Text>

                  <View style={styles.issueFooter}>
                    <Text style={styles.issueTime}>
                      {new Date(issue.reported_at).toLocaleDateString()}
                    </Text>

                    <View style={styles.issueActions}>
                      <TouchableOpacity
                        style={styles.voteButton}
                        onPress={() => handleVote(issue.id, 'up')}
                      >
                        <TrendingUp color="#10B981" size={16} />
                        <Text style={[styles.voteText, { color: '#10B981' }]}>
                          {issue.upvotes || 0}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.voteButton}
                        onPress={() => handleVote(issue.id, 'down')}
                      >
                        <TrendingDown color="#EF4444" size={16} />
                        <Text style={[styles.voteText, { color: '#EF4444' }]}>
                          {issue.downvotes || 0}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.commentButton}>
                        <MessageCircle color="#9CA3AF" size={16} />
                        <Text style={styles.commentText}>
                          {issue.comments_count || 0}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </Card>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: '#F9FAFB',
    fontSize: 16,
    marginLeft: 12,
  },
  filterButton: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  categoryTab: {
    backgroundColor: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  categoryTabActive: {
    backgroundColor: '#8B5CF6',
  },
  categoryText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  leaderboardCard: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F9FAFB',
  },
  seeAllText: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '600',
  },
  leaderboardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  leaderboardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leaderboardBadge: {
    fontSize: 24,
    marginRight: 12,
  },
  leaderboardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F9FAFB',
  },
  leaderboardStats: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  topUserBadge: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  topUserText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  issueItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  issueContent: {
    flexDirection: 'row',
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
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
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
    fontSize: 14,
    fontWeight: '600',
    color: '#F9FAFB',
    flex: 1,
    lineHeight: 20,
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
    fontSize: 13,
    color: '#D1D5DB',
    lineHeight: 18,
    marginBottom: 12,
  },
  issueFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  issueTime: {
    fontSize: 11,
    color: '#6B7280',
  },
  issueActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  voteText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  commentText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
  },
});
