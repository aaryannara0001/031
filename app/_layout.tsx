import { AuthRouter } from '@/components/AuthRouter';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

function RootLayoutContent() {
  useFrameworkReady();
  const { theme } = useTheme();

  return (
    <>
      <AuthRouter />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="+not-found" />
        {/* Additional screens that don't require auth */}
        <Stack.Screen name="welcome" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="admin-dashboard" />
        <Stack.Screen name="achievements" />
        <Stack.Screen name="edit-profile" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="help" />
        <Stack.Screen name="leaderboard" />
        <Stack.Screen name="map" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="privacy" />
        <Stack.Screen name="report-issue" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="unauthorized" />
        <Stack.Screen name="user-management" />
        <Stack.Screen name="issue-detail/[id]" />
        <Stack.Screen name="task-detail/[id]" />
      </Stack>
      <StatusBar
        style={theme === 'dark' ? 'light' : 'dark'}
        backgroundColor={theme === 'dark' ? '#111827' : '#FFFFFF'}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RootLayoutContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
