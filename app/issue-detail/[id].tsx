import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useAuth } from '@/contexts/AuthContext';
import { getCategoryColor, mockIssues } from '@/services/mockData';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ChevronLeft,
  Clock,
  Flag,
  MapPin,
  MessageCircle,
  Share,
  TrendingDown,
  TrendingUp,
  User,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function IssueDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const issue = mockIssues.find((i) => i.id === id);

  if (!issue) {
    return (
      <LinearGradient colors={['#111827', '#1F2937']} style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Issue Not Found</Text>
          <Text style={styles.errorText}>
            The issue you&apos;re looking for doesn&apos;t exist.
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  const handleVote = async (type: 'up' | 'down') => {
    // Mock voting functionality
    Alert.alert('Vote Recorded', `Thank you for your ${type}vote!`);
  };

  const handleComment = () => {
    Alert.alert(
      'Coming Soon',
      'Comment functionality will be available in the next update.'
    );
  };

  const handleShare = () => {
    Alert.alert('Share', 'Issue link copied to clipboard!');
  };

  const handleReport = () => {
    Alert.alert(
      'Report Issue',
      'Thank you for helping keep our community safe. This issue has been reported to moderators.'
    );
  };

  const isCitizen = user?.role === 'citizen';

  return (
    <LinearGradient colors={['#111827', '#1F2937']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButtonHeader}
          onPress={() => router.back()}
        >
          <ChevronLeft color="#9CA3AF" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Issue Details
        </Text>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Share color="#9CA3AF" size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Issue Card */}
        <Card style={styles.mainCard}>
          {/* Status and Category */}
          <View style={styles.headerRow}>
            <View style={styles.categoryBadge}>
              <View
                style={[
                  styles.categoryDot,
                  { backgroundColor: getCategoryColor(issue.category) },
                ]}
              />
              <Text style={styles.categoryText}>
                {issue.category.charAt(0).toUpperCase() +
                  issue.category.slice(1)}
              </Text>
            </View>
            <StatusBadge status={issue.status} />
          </View>

          {/* Title */}
          <Text style={styles.issueTitle}>{issue.title}</Text>

          {/* Description */}
          <Text style={styles.issueDescription}>{issue.description}</Text>

          {/* Images */}
          {issue.images.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.imagesContainer}
            >
              {issue.images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={styles.issueImage}
                />
              ))}
            </ScrollView>
          )}

          {/* Location */}
          <View style={styles.locationContainer}>
            <MapPin color="#9CA3AF" size={16} />
            <Text style={styles.locationText}>{issue.location.address}</Text>
          </View>

          {/* Metadata */}
          <View style={styles.metadata}>
            <View style={styles.metaItem}>
              <Clock color="#6B7280" size={14} />
              <Text style={styles.metaText}>
                Reported {new Date(issue.reportedAt).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <User color="#6B7280" size={14} />
              <Text style={styles.metaText}>ID: {issue.trackingId}</Text>
            </View>
          </View>
        </Card>

        {/* Progress Timeline */}
        <Card style={styles.timelineCard}>
          <Text style={styles.sectionTitle}>Progress Timeline</Text>

          <View style={styles.timeline}>
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, styles.timelineDotActive]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Issue Reported</Text>
                <Text style={styles.timelineDate}>
                  {new Date(issue.reportedAt).toLocaleDateString()}
                </Text>
              </View>
            </View>

            {issue.status !== 'pending' && (
              <View style={styles.timelineItem}>
                <View style={[styles.timelineDot, styles.timelineDotActive]} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>
                    {issue.status === 'assigned'
                      ? 'Assigned to Field Worker'
                      : issue.status === 'in-progress'
                      ? 'Work in Progress'
                      : 'Issue Resolved'}
                  </Text>
                  <Text style={styles.timelineDate}>
                    {new Date(issue.updatedAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </Card>

        {/* Community Actions */}
        {isCitizen && (
          <Card style={styles.actionsCard}>
            <Text style={styles.sectionTitle}>Community Actions</Text>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleVote('up')}
              >
                <TrendingUp color="#10B981" size={20} />
                <Text style={styles.actionText}>Support ({issue.upvotes})</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleVote('down')}
              >
                <TrendingDown color="#EF4444" size={20} />
                <Text style={styles.actionText}>
                  Flag Issue ({issue.downvotes})
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.commentButton}
              onPress={handleComment}
            >
              <MessageCircle color="#8B5CF6" size={20} />
              <Text style={styles.commentButtonText}>Add Comment</Text>
            </TouchableOpacity>
          </Card>
        )}

        {/* Comments */}
        {issue.comments.length > 0 && (
          <Card style={styles.commentsCard}>
            <Text style={styles.sectionTitle}>
              Comments ({issue.comments.length})
            </Text>

            {issue.comments.map((comment) => (
              <View key={comment.id} style={styles.comment}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentAuthor}>{comment.authorName}</Text>
                  <Text style={styles.commentDate}>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.commentContent}>{comment.text}</Text>
              </View>
            ))}
          </Card>
        )}

        {/* Report Issue */}
        <TouchableOpacity style={styles.reportButton} onPress={handleReport}>
          <Flag color="#EF4444" size={20} />
          <Text style={styles.reportText}>Report This Issue</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F9FAFB',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  backButtonHeader: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F9FAFB',
    flex: 1,
    textAlign: 'center',
  },
  shareButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  mainCard: {
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 12,
    color: '#F9FAFB',
    fontWeight: '500',
  },
  issueTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F9FAFB',
    marginBottom: 12,
    lineHeight: 28,
  },
  issueDescription: {
    fontSize: 16,
    color: '#D1D5DB',
    lineHeight: 24,
    marginBottom: 16,
  },
  imagesContainer: {
    marginBottom: 16,
  },
  issueImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginRight: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginLeft: 8,
  },
  metadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
  timelineCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F9FAFB',
    marginBottom: 16,
  },
  timeline: {
    paddingLeft: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#374151',
    marginTop: 6,
    marginRight: 12,
  },
  timelineDotActive: {
    backgroundColor: '#8B5CF6',
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F9FAFB',
  },
  timelineDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  actionsCard: {
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#374151',
    paddingVertical: 12,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#F9FAFB',
    marginLeft: 8,
    fontWeight: '500',
  },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF620',
    borderWidth: 1,
    borderColor: '#8B5CF6',
    paddingVertical: 12,
    borderRadius: 8,
  },
  commentButtonText: {
    fontSize: 14,
    color: '#8B5CF6',
    marginLeft: 8,
    fontWeight: '500',
  },
  commentsCard: {
    marginBottom: 16,
  },
  comment: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F9FAFB',
  },
  commentDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  commentContent: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 20,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF444420',
    borderWidth: 1,
    borderColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  reportText: {
    color: '#EF4444',
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500',
  },
});
