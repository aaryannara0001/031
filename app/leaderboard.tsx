import { Card } from '@/components/ui/Card';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowLeft, MapPin, TrendingUp, Trophy } from 'lucide-react-native';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function LeaderboardScreen() {
  const [selectedPeriod, setSelectedPeriod] = React.useState('all-time');

  const periods = [
    { id: 'all-time', label: 'All Time' },
    { id: 'monthly', label: 'This Month' },
    { id: 'weekly', label: 'This Week' },
  ];

  const leaderboardData = {
    'all-time': [
      {
        rank: 1,
        name: 'John Citizen',
        avatar:
          'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=100',
        points: 2840,
        reports: 45,
        validations: 120,
        badges: 8,
        trend: 'up',
        location: 'Downtown',
      },
      {
        rank: 2,
        name: 'Sarah Helper',
        avatar:
          'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=100',
        points: 2650,
        reports: 38,
        validations: 95,
        badges: 7,
        trend: 'up',
        location: 'Westside',
      },
      {
        rank: 3,
        name: 'Mike Validator',
        avatar:
          'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=100',
        points: 2380,
        reports: 52,
        validations: 85,
        badges: 6,
        trend: 'down',
        location: 'East End',
      },
      {
        rank: 4,
        name: 'Emma Community',
        avatar:
          'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100',
        points: 2150,
        reports: 29,
        validations: 110,
        badges: 5,
        trend: 'up',
        location: 'North District',
      },
      {
        rank: 5,
        name: 'David Reporter',
        avatar:
          'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=100',
        points: 1980,
        reports: 41,
        validations: 75,
        badges: 4,
        trend: 'same',
        location: 'Southside',
      },
    ],
    monthly: [
      {
        rank: 1,
        name: 'Emma Community',
        avatar:
          'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100',
        points: 450,
        reports: 12,
        validations: 28,
        badges: 2,
        trend: 'up',
        location: 'North District',
      },
      {
        rank: 2,
        name: 'Mike Validator',
        avatar:
          'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=100',
        points: 380,
        reports: 15,
        validations: 22,
        badges: 1,
        trend: 'up',
        location: 'East End',
      },
      {
        rank: 3,
        name: 'John Citizen',
        avatar:
          'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=100',
        points: 320,
        reports: 8,
        validations: 18,
        badges: 1,
        trend: 'down',
        location: 'Downtown',
      },
    ],
    weekly: [
      {
        rank: 1,
        name: 'Mike Validator',
        avatar:
          'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=100',
        points: 120,
        reports: 5,
        validations: 8,
        badges: 0,
        trend: 'up',
        location: 'East End',
      },
      {
        rank: 2,
        name: 'Emma Community',
        avatar:
          'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100',
        points: 95,
        reports: 3,
        validations: 12,
        badges: 1,
        trend: 'up',
        location: 'North District',
      },
      {
        rank: 3,
        name: 'Sarah Helper',
        avatar:
          'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=100',
        points: 85,
        reports: 4,
        validations: 6,
        badges: 0,
        trend: 'same',
        location: 'Westside',
      },
    ],
  };

  const currentLeaderboard =
    leaderboardData[selectedPeriod as keyof typeof leaderboardData];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return rank.toString();
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp color="#10B981" size={16} />;
      case 'down':
        return (
          <TrendingUp
            color="#EF4444"
            size={16}
            style={{ transform: [{ rotate: '180deg' }] }}
          />
        );
      default:
        return <View style={{ width: 16, height: 16 }} />;
    }
  };

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
          <Text style={styles.headerTitle}>Leaderboard</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.id}
              style={[
                styles.periodButton,
                selectedPeriod === period.id && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod(period.id)}
            >
              <Text
                style={[
                  styles.periodText,
                  selectedPeriod === period.id && styles.periodTextActive,
                ]}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Top 3 Podium */}
        {selectedPeriod === 'all-time' && (
          <Card style={styles.podiumCard}>
            <View style={styles.podiumContainer}>
              {/* Second Place */}
              <View style={styles.podiumItem}>
                <View style={styles.podiumAvatarContainer}>
                  <Image
                    source={{ uri: currentLeaderboard[1]?.avatar }}
                    style={styles.podiumAvatar}
                  />
                  <View style={[styles.rankBadge, styles.silverBadge]}>
                    <Text style={styles.rankBadgeText}>2</Text>
                  </View>
                </View>
                <View style={styles.podiumStand}>
                  <Text style={styles.podiumName}>
                    {currentLeaderboard[1]?.name}
                  </Text>
                  <Text style={styles.podiumPoints}>
                    {currentLeaderboard[1]?.points} pts
                  </Text>
                </View>
              </View>

              {/* First Place */}
              <View style={[styles.podiumItem, styles.firstPlace]}>
                <View style={styles.podiumAvatarContainer}>
                  <Image
                    source={{ uri: currentLeaderboard[0]?.avatar }}
                    style={styles.podiumAvatar}
                  />
                  <View style={[styles.rankBadge, styles.goldBadge]}>
                    <Trophy color="#F59E0B" size={16} />
                  </View>
                </View>
                <View style={styles.podiumStand}>
                  <Text style={styles.podiumName}>
                    {currentLeaderboard[0]?.name}
                  </Text>
                  <Text style={styles.podiumPoints}>
                    {currentLeaderboard[0]?.points} pts
                  </Text>
                </View>
              </View>

              {/* Third Place */}
              <View style={styles.podiumItem}>
                <View style={styles.podiumAvatarContainer}>
                  <Image
                    source={{ uri: currentLeaderboard[2]?.avatar }}
                    style={styles.podiumAvatar}
                  />
                  <View style={[styles.rankBadge, styles.bronzeBadge]}>
                    <Text style={styles.rankBadgeText}>3</Text>
                  </View>
                </View>
                <View style={styles.podiumStand}>
                  <Text style={styles.podiumName}>
                    {currentLeaderboard[2]?.name}
                  </Text>
                  <Text style={styles.podiumPoints}>
                    {currentLeaderboard[2]?.points} pts
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        )}

        {/* Full Leaderboard */}
        <Card style={styles.leaderboardCard}>
          <Text style={styles.sectionTitle}>Full Rankings</Text>

          {currentLeaderboard.map((user, index) => (
            <View key={user.rank} style={styles.leaderboardItem}>
              <View style={styles.rankContainer}>
                <Text style={styles.rankText}>{getRankIcon(user.rank)}</Text>
              </View>

              <Image source={{ uri: user.avatar }} style={styles.userAvatar} />

              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <View style={styles.userStats}>
                  <MapPin color="#9CA3AF" size={12} />
                  <Text style={styles.userLocation}>{user.location}</Text>
                </View>
              </View>

              <View style={styles.userMetrics}>
                <View style={styles.metric}>
                  <Text style={styles.metricValue}>{user.points}</Text>
                  <Text style={styles.metricLabel}>pts</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricValue}>{user.reports}</Text>
                  <Text style={styles.metricLabel}>reports</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricValue}>{user.badges}</Text>
                  <Text style={styles.metricLabel}>badges</Text>
                </View>
              </View>

              <View style={styles.trendContainer}>
                {getTrendIcon(user.trend)}
              </View>
            </View>
          ))}
        </Card>

        {/* Your Rank */}
        <Card style={styles.yourRankCard}>
          <Text style={styles.sectionTitle}>Your Rank</Text>

          <View style={styles.leaderboardItem}>
            <View style={styles.rankContainer}>
              <Text style={styles.rankText}>12</Text>
            </View>

            <Image
              source={{
                uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=100',
              }}
              style={styles.userAvatar}
            />

            <View style={styles.userInfo}>
              <Text style={styles.userName}>You</Text>
              <View style={styles.userStats}>
                <MapPin color="#9CA3AF" size={12} />
                <Text style={styles.userLocation}>Your Location</Text>
              </View>
            </View>

            <View style={styles.userMetrics}>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>1250</Text>
                <Text style={styles.metricLabel}>pts</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>12</Text>
                <Text style={styles.metricLabel}>reports</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricValue}>3</Text>
                <Text style={styles.metricLabel}>badges</Text>
              </View>
            </View>

            <View style={styles.trendContainer}>
              <TrendingUp color="#10B981" size={16} />
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
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#8B5CF6',
  },
  periodText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  periodTextActive: {
    color: '#FFFFFF',
  },
  podiumCard: {
    marginBottom: 16,
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingVertical: 20,
  },
  podiumItem: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  firstPlace: {
    marginBottom: 20,
  },
  podiumAvatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  podiumAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  rankBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#1F2937',
  },
  goldBadge: {
    backgroundColor: '#F59E0B',
  },
  silverBadge: {
    backgroundColor: '#9CA3AF',
  },
  bronzeBadge: {
    backgroundColor: '#D97706',
  },
  rankBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  podiumStand: {
    alignItems: 'center',
    minHeight: 40,
  },
  podiumName: {
    fontSize: 14,
    color: '#F9FAFB',
    fontWeight: '600',
    textAlign: 'center',
  },
  podiumPoints: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '600',
    marginTop: 2,
  },
  leaderboardCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F9FAFB',
    marginBottom: 16,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F9FAFB',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    color: '#F9FAFB',
    fontWeight: '600',
    marginBottom: 2,
  },
  userStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userLocation: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  userMetrics: {
    flexDirection: 'row',
    marginRight: 12,
  },
  metric: {
    alignItems: 'center',
    marginLeft: 12,
  },
  metricValue: {
    fontSize: 14,
    color: '#F9FAFB',
    fontWeight: '600',
  },
  metricLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },
  trendContainer: {
    width: 20,
    alignItems: 'center',
  },
  yourRankCard: {
    marginBottom: 24,
  },
});
