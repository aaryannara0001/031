import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getStatusColor } from '@/services/mockData';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const color = getStatusColor(status);
  
  return (
    <View style={[styles.badge, { backgroundColor: `${color}20`, borderColor: color }, size === 'sm' && styles.badgeSmall]}>
      <Text style={[styles.text, { color }, size === 'sm' && styles.textSmall]}>
        {status.replace('-', ' ').toUpperCase()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeSmall: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
  textSmall: {
    fontSize: 10,
  },
});