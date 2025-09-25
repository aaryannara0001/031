import { Card } from '@/components/ui/Card';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Edit,
  Mail,
  MoreVertical,
  Search,
  Trash2,
  User,
  UserCheck,
  UserX,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'citizen' | 'fieldworker' | 'staff' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  joinDate: string;
  lastActive: string;
  issuesReported?: number;
  issuesResolved?: number;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Citizen',
    email: 'john.citizen@example.com',
    role: 'citizen',
    status: 'active',
    joinDate: '2024-01-15',
    lastActive: '2 hours ago',
    issuesReported: 12,
  },
  {
    id: '2',
    name: 'Sarah Fieldworker',
    email: 'sarah.field@example.com',
    role: 'fieldworker',
    status: 'active',
    joinDate: '2024-01-10',
    lastActive: '1 hour ago',
    issuesResolved: 45,
  },
  {
    id: '3',
    name: 'Mike Staff',
    email: 'mike.staff@example.com',
    role: 'staff',
    status: 'active',
    joinDate: '2024-01-08',
    lastActive: '30 minutes ago',
  },
  {
    id: '4',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    joinDate: '2024-01-01',
    lastActive: '5 minutes ago',
  },
  {
    id: '5',
    name: 'Inactive User',
    email: 'inactive@example.com',
    role: 'citizen',
    status: 'inactive',
    joinDate: '2024-01-05',
    lastActive: '2 weeks ago',
    issuesReported: 3,
  },
];

export default function UserManagementScreen() {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const roles = [
    { id: 'all', label: 'All Roles' },
    { id: 'citizen', label: 'Citizens' },
    { id: 'fieldworker', label: 'Field Workers' },
    { id: 'staff', label: 'Staff' },
    { id: 'admin', label: 'Admins' },
  ];

  const statuses = [
    { id: 'all', label: 'All Status' },
    { id: 'active', label: 'Active' },
    { id: 'inactive', label: 'Inactive' },
    { id: 'suspended', label: 'Suspended' },
  ];

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus =
      selectedStatus === 'all' || user.status === selectedStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return '#EF4444';
      case 'staff':
        return '#F59E0B';
      case 'fieldworker':
        return '#10B981';
      case 'citizen':
        return '#8B5CF6';
      default:
        return '#6B7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10B981';
      case 'inactive':
        return '#6B7280';
      case 'suspended':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const handleUserAction = (user: User, action: string) => {
    Alert.alert(
      `${action.charAt(0).toUpperCase() + action.slice(1)} User`,
      `Are you sure you want to ${action} ${user.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: action.charAt(0).toUpperCase() + action.slice(1),
          style: action === 'delete' ? 'destructive' : 'default',
          onPress: () => {
            Alert.alert(
              'Success',
              `User ${user.name} has been ${action}ed successfully.`
            );
          },
        },
      ]
    );
  };

  const handleAddUser = () => {
    Alert.alert('Add User', 'User creation functionality coming soon!');
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
            User Management
          </Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAddUser}>
            <User color="#FFFFFF" size={20} />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <View
            style={[
              styles.searchInput,
              { backgroundColor: colors.input, borderColor: colors.border },
            ]}
          >
            <Search color={colors.textSecondary} size={20} />
            <TextInput
              style={[styles.searchText, { color: colors.text }]}
              placeholder="Search users by name or email..."
              placeholderTextColor={colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
          >
            <View style={styles.filterGroup}>
              <Text
                style={[styles.filterLabel, { color: colors.textSecondary }]}
              >
                Role:
              </Text>
              {roles.map((role) => (
                <TouchableOpacity
                  key={role.id}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    },
                    selectedRole === role.id && [
                      styles.filterChipActive,
                      { backgroundColor: colors.primary },
                    ],
                  ]}
                  onPress={() => setSelectedRole(role.id)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      { color: colors.textSecondary },
                      selectedRole === role.id && [
                        styles.filterChipTextActive,
                        { color: colors.text },
                      ],
                    ]}
                  >
                    {role.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.filterGroup}>
              <Text
                style={[styles.filterLabel, { color: colors.textSecondary }]}
              >
                Status:
              </Text>
              {statuses.map((status) => (
                <TouchableOpacity
                  key={status.id}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    },
                    selectedStatus === status.id && [
                      styles.filterChipActive,
                      { backgroundColor: colors.primary },
                    ],
                  ]}
                  onPress={() => setSelectedStatus(status.id)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      { color: colors.textSecondary },
                      selectedStatus === status.id && [
                        styles.filterChipTextActive,
                        { color: colors.text },
                      ],
                    ]}
                  >
                    {status.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* User Stats */}
        <View style={styles.statsContainer}>
          <Card style={styles.statsCard}>
            <View style={styles.statItem}>
              <UserCheck color="#10B981" size={24} />
              <View style={styles.statContent}>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {mockUsers.filter((u) => u.status === 'active').length}
                </Text>
                <Text
                  style={[styles.statLabel, { color: colors.textSecondary }]}
                >
                  Active Users
                </Text>
              </View>
            </View>
            <View
              style={[styles.statDivider, { backgroundColor: colors.border }]}
            />
            <View style={styles.statItem}>
              <UserX color="#EF4444" size={24} />
              <View style={styles.statContent}>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {mockUsers.filter((u) => u.status !== 'active').length}
                </Text>
                <Text
                  style={[styles.statLabel, { color: colors.textSecondary }]}
                >
                  Inactive
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Users List */}
        <View style={styles.usersList}>
          {filteredUsers.map((user) => (
            <Card key={user.id} style={styles.userCard}>
              <View style={styles.userHeader}>
                <View style={styles.userInfo}>
                  <View style={styles.userNameRow}>
                    <Text style={[styles.userName, { color: colors.text }]}>
                      {user.name}
                    </Text>
                    <View
                      style={[
                        styles.roleBadge,
                        { backgroundColor: getRoleColor(user.role) + '20' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.roleText,
                          { color: getRoleColor(user.role) },
                        ]}
                      >
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.userEmailRow}>
                    <Mail color={colors.textSecondary} size={14} />
                    <Text
                      style={[
                        styles.userEmail,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {user.email}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.moreButton}>
                  <MoreVertical color="#9CA3AF" size={20} />
                </TouchableOpacity>
              </View>

              <View style={styles.userDetails}>
                <View style={styles.userStats}>
                  <Text
                    style={[styles.userStat, { color: colors.textTertiary }]}
                  >
                    Joined: {new Date(user.joinDate).toLocaleDateString()}
                  </Text>
                  <Text
                    style={[styles.userStat, { color: colors.textTertiary }]}
                  >
                    Last Active: {user.lastActive}
                  </Text>
                </View>

                {user.issuesReported && (
                  <Text
                    style={[styles.userStat, { color: colors.textTertiary }]}
                  >
                    Issues Reported: {user.issuesReported}
                  </Text>
                )}
                {user.issuesResolved && (
                  <Text
                    style={[styles.userStat, { color: colors.textTertiary }]}
                  >
                    Issues Resolved: {user.issuesResolved}
                  </Text>
                )}
              </View>

              <View
                style={[styles.userActions, { borderTopColor: colors.border }]}
              >
                <View
                  style={[
                    styles.statusIndicator,
                    { backgroundColor: getStatusColor(user.status) },
                  ]}
                />
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(user.status) },
                  ]}
                >
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </Text>

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => handleUserAction(user, 'edit')}
                  >
                    <Edit color="#8B5CF6" size={16} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleUserAction(user, 'delete')}
                  >
                    <Trash2 color="#EF4444" size={16} />
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          ))}
        </View>
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
  addButton: {
    backgroundColor: '#8B5CF6',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
  },
  searchText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterGroup: {
    marginRight: 24,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  filterChipActive: {
    backgroundColor: '#8B5CF6',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  statsContainer: {
    marginBottom: 16,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statContent: {
    marginLeft: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 40,
  },
  usersList: {
    paddingBottom: 24,
  },
  userCard: {
    marginBottom: 12,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '600',
  },
  userEmailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userEmail: {
    fontSize: 14,
    marginLeft: 6,
  },
  moreButton: {
    padding: 8,
  },
  userDetails: {
    marginBottom: 12,
  },
  userStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  userStat: {
    fontSize: 12,
  },
  userActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#8B5CF620',
  },
  deleteButton: {
    backgroundColor: '#EF444420',
  },
});
