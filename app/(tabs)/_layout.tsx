import { AuthGuard } from '@/components/AuthGuard';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Tabs } from 'expo-router';
import {
  Briefcase,
  SquareCheck as CheckSquare,
  FileText,
  Chrome as Home,
  User,
  Users,
} from 'lucide-react-native';
import React from 'react';

function TabLayoutContent() {
  const { user } = useAuth();
  const { colors } = useTheme();

  // Debug logging
  console.log('TabLayout - Current user:', user);
  console.log('TabLayout - User role:', user?.role);
  console.log('TabLayout - User role type:', typeof user?.role);

  const isFieldWorker = user?.role === 'fieldworker';
  const isAdmin = user?.role === 'admin';
  const isStaff = user?.role === 'staff';

  console.log('TabLayout - isFieldWorker:', isFieldWorker);
  console.log('TabLayout - isAdmin:', isAdmin);
  console.log('TabLayout - isStaff:', isStaff);

  if (isFieldWorker) {
    // Field Worker Portal Layout
    return (
      <Tabs
        key="fieldworker"
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            borderTopWidth: 1,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
        }}
      >
        <Tabs.Screen
          name="fieldworker"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color, size }) => (
              <CheckSquare color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="tasks"
          options={{
            title: 'My Tasks',
            tabBarIcon: ({ color, size }) => (
              <Briefcase color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          }}
        />
        {/* Hide other tabs for field workers */}
        <Tabs.Screen name="index" options={{ href: null }} />
        <Tabs.Screen name="reports" options={{ href: null }} />
        <Tabs.Screen name="community" options={{ href: null }} />
      </Tabs>
    );
  }

  if (isAdmin || isStaff) {
    // Admin/Staff Portal Layout
    return (
      <Tabs
        key="admin-staff"
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            borderTopWidth: 1,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="reports"
          options={{
            title: 'Reports',
            tabBarIcon: ({ color, size }) => (
              <FileText color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="analytics"
          options={{
            title: 'Analytics',
            tabBarIcon: ({ color, size }) => (
              <Users color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          }}
        />
        {/* Hide citizen-specific tabs */}
        <Tabs.Screen name="community" options={{ href: null }} />
        <Tabs.Screen name="fieldworker" options={{ href: null }} />
        <Tabs.Screen name="tasks" options={{ href: null }} />
      </Tabs>
    );
  }

  // Citizen App Layout (default)
  return (
    <Tabs
      key="citizen"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'My Reports',
          tabBarIcon: ({ color, size }) => (
            <FileText color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
      {/* Hide other role-specific tabs */}
      <Tabs.Screen name="fieldworker" options={{ href: null }} />
      <Tabs.Screen name="tasks" options={{ href: null }} />
      <Tabs.Screen name="analytics" options={{ href: null }} />
    </Tabs>
  );
}

export default function TabLayout() {
  const { user } = useAuth();

  // Force re-render when user role changes
  const layoutKey = user?.role || 'no-user';

  return (
    <AuthGuard requireAuth={true} fallbackRoute="/landing">
      <TabLayoutContent key={layoutKey} />
    </AuthGuard>
  );
}
