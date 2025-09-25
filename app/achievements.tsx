import { Card } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Award,
  CheckCircle,
  Lock,
  Star,
  Target,
  Trophy,
  Users,
} from 'lucide-react-native';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function AchievementsScreen() {
  const { user } = useAuth();

  const achievements = [
    {
      id: 'first-report',
      icon: '📝',
      title: 'First Reporter',
      description: 'Report your first issue',
      requirement: 'Report 1 issue',
      progress: 1,
      maxProgress: 1,
      unlocked: true,
      unlockedDate: '2024-01-15',
      rarity: 'Common',
      points: 50,
    },
    {
      id: 'problem-solver',
      icon: '🎯',
      title: 'Problem Solver',
      description: 'Help resolve community issues',
      requirement: '5 issues resolved',
      progress: 3,
      maxProgress: 5,
      unlocked: false,
      rarity: 'Uncommon',
      points: 150,
    },
    {
      id: 'community-hero',
      icon: '⭐',
      title: 'Community Hero',
      description: 'Earn the respect of your community',
      requirement: '10 upvotes received',
      progress: 8,
      maxProgress: 10,
      unlocked: false,
      rarity: 'Rare',
      points: 300,
    },
    {
      id: 'veteran-reporter',
      icon: '🏆',
      title: 'Veteran Reporter',
      description: 'Become a reporting veteran',
      requirement: '25 issues reported',
      progress: 12,
      maxProgress: 25,
      unlocked: false,
      rarity: 'Epic',
      points: 500,
    },
    {
      id: 'validation-master',
      icon: '✅',
      title: 'Validation Master',
      description: 'Validate issues with precision',
      requirement: '50 validations',
      progress: 23,
      maxProgress: 50,
      unlocked: false,
      rarity: 'Epic',
      points: 400,
    },
    {
      id: 'social-butterfly',
      icon: '🦋',
      title: 'Social Butterfly',
      description: 'Engage with the community',
      requirement: '20 comments posted',
      progress: 15,
      maxProgress: 20,
      unlocked: false,
      rarity: 'Rare',
      points: 250,
    },
    {
      id: 'early-adopter',
      icon: '🚀',
      title: 'Early Adopter',
      description: 'Join the platform early',
      requirement: 'Be in top 100 users',
      progress: 1,
      maxProgress: 1,
      unlocked: true,
      unlockedDate: '2024-01-01',
      rarity: 'Legendary',
      points: 1000,
    },
    {
      id: 'perfect-week',
      icon: '📅',
      title: 'Perfect Week',
      description: 'Report issues for 7 consecutive days',
      requirement: '7 day streak',
      progress: 5,
      maxProgress: 7,
      unlocked: false,
      rarity: 'Rare',
      points: 200,
    },
    {
      id: 'team-player',
      icon: '🤝',
      title: 'Team Player',
      description: 'Collaborate with field workers',
      requirement: '3 issues assigned to you',
      progress: 1,
      maxProgress: 3,
      unlocked: false,
      rarity: 'Uncommon',
      points: 100,
    },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common':
        return '#9CA3AF';
      case 'Uncommon':
        return '#10B981';
      case 'Rare':
        return '#3B82F6';
      case 'Epic':
        return '#8B5CF6';
      case 'Legendary':
        return '#F59E0B';
      default:
        return '#9CA3AF';
    }
  };

  const unlockedAchievements = achievements.filter((a) => a.unlocked);
  const lockedAchievements = achievements.filter((a) => !a.unlocked);

  const totalPoints = unlockedAchievements.reduce(
    (sum, achievement) => sum + achievement.points,
    0
  );

  return (
    <LinearGradient colors={['#111827', '#1F2937']} style={styles.container}>
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
            <ArrowLeft color="#F9FAFB" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Achievements</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Stats Overview */}
        <Card style={styles.statsCard}>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Trophy color="#F59E0B" size={24} />
              <Text style={styles.statNumber}>
                {unlockedAchievements.length}
              </Text>
              <Text style={styles.statLabel}>Unlocked</Text>
            </View>
            <View style={styles.statItem}>
              <Star color="#8B5CF6" size={24} />
              <Text style={styles.statNumber}>{totalPoints}</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
            <View style={styles.statItem}>
              <Target color="#10B981" size={24} />
              <Text style={styles.statNumber}>
                {Math.round(
                  (unlockedAchievements.length / achievements.length) * 100
                )}
                %
              </Text>
              <Text style={styles.statLabel}>Complete</Text>
            </View>
          </View>
        </Card>

        {/* Unlocked Achievements */}
        <Card style={styles.achievementsCard}>
          <Text style={styles.sectionTitle}>Unlocked Achievements</Text>

          {unlockedAchievements.map((achievement) => (
            <View key={achievement.id} style={styles.achievementItem}>
              <View style={styles.achievementLeft}>
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                <View style={styles.achievementDetails}>
                  <Text style={styles.achievementTitle}>
                    {achievement.title}
                  </Text>
                  <Text style={styles.achievementDescription}>
                    {achievement.description}
                  </Text>
                  <View style={styles.achievementMeta}>
                    <Text
                      style={[
                        styles.rarityBadge,
                        { color: getRarityColor(achievement.rarity) },
                      ]}
                    >
                      {achievement.rarity}
                    </Text>
                    <Text style={styles.pointsText}>
                      +{achievement.points} pts
                    </Text>
                  </View>
                </View>
              </View>
              <CheckCircle color="#10B981" size={20} />
            </View>
          ))}
        </Card>

        {/* Locked Achievements */}
        <Card style={styles.achievementsCard}>
          <Text style={styles.sectionTitle}>Locked Achievements</Text>

          {lockedAchievements.map((achievement) => (
            <View key={achievement.id} style={styles.achievementItem}>
              <View style={styles.achievementLeft}>
                <View style={styles.lockedIcon}>
                  <Text style={styles.achievementIconLocked}>
                    {achievement.icon}
                  </Text>
                  <Lock color="#6B7280" size={12} style={styles.lockOverlay} />
                </View>
                <View style={styles.achievementDetails}>
                  <Text style={styles.achievementTitleLocked}>
                    {achievement.title}
                  </Text>
                  <Text style={styles.achievementDescription}>
                    {achievement.description}
                  </Text>
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${
                              (achievement.progress / achievement.maxProgress) *
                              100
                            }%`,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {achievement.progress}/{achievement.maxProgress}
                    </Text>
                  </View>
                  <View style={styles.achievementMeta}>
                    <Text
                      style={[
                        styles.rarityBadge,
                        { color: getRarityColor(achievement.rarity) },
                      ]}
                    >
                      {achievement.rarity}
                    </Text>
                    <Text style={styles.pointsTextLocked}>
                      +{achievement.points} pts
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </Card>

        {/* Achievement Categories */}
        <Card style={styles.categoriesCard}>
          <Text style={styles.sectionTitle}>Categories</Text>

          <View style={styles.categoryGrid}>
            <View style={styles.categoryItem}>
              <Users color="#3B82F6" size={20} />
              <Text style={styles.categoryTitle}>Community</Text>
              <Text style={styles.categoryCount}>
                {
                  achievements.filter(
                    (a) => a.id.includes('community') || a.id.includes('social')
                  ).length
                }{' '}
                badges
              </Text>
            </View>

            <View style={styles.categoryItem}>
              <Award color="#10B981" size={20} />
              <Text style={styles.categoryTitle}>Reporting</Text>
              <Text style={styles.categoryCount}>
                {achievements.filter((a) => a.id.includes('report')).length}{' '}
                badges
              </Text>
            </View>

            <View style={styles.categoryItem}>
              <CheckCircle color="#F59E0B" size={20} />
              <Text style={styles.categoryTitle}>Validation</Text>
              <Text style={styles.categoryCount}>
                {achievements.filter((a) => a.id.includes('validation')).length}{' '}
                badges
              </Text>
            </View>

            <View style={styles.categoryItem}>
              <Trophy color="#8B5CF6" size={20} />
              <Text style={styles.categoryTitle}>Special</Text>
              <Text style={styles.categoryCount}>
                {
                  achievements.filter(
                    (a) => a.id.includes('early') || a.id.includes('perfect')
                  ).length
                }{' '}
                badges
              </Text>
            </View>
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
    color: '#F9FAFB',
  },
  statsCard: {
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F9FAFB',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  achievementsCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F9FAFB',
    marginBottom: 16,
  },
  achievementItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  achievementLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  achievementDetails: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    color: '#F9FAFB',
    fontWeight: '600',
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  achievementMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rarityBadge: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  pointsText: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '600',
  },
  lockedIcon: {
    position: 'relative',
    marginRight: 12,
  },
  achievementIconLocked: {
    fontSize: 32,
    opacity: 0.5,
  },
  lockOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  achievementTitleLocked: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 2,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#374151',
    borderRadius: 2,
    marginRight: 8,
  },
  progressFill: {
    height: 4,
    backgroundColor: '#8B5CF6',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#9CA3AF',
    minWidth: 40,
  },
  pointsTextLocked: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  categoriesCard: {
    marginBottom: 24,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: '48%',
    backgroundColor: '#374151',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 14,
    color: '#F9FAFB',
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
