import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';

export default function IndexScreen() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/welcome');
      } else {
        router.replace('/landing');
      }
    }
  }, [isAuthenticated, isLoading]);

  return (
    <LinearGradient colors={['#111827', '#1F2937']} style={styles.container}>
      <LoadingSpinner size={50} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
