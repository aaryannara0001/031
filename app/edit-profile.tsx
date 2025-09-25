import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  Camera,
  ChevronLeft,
  Mail,
  MapPin,
  Phone,
  Save,
  User,
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

export default function EditProfileScreen() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: 'Community-focused citizen helping make our city better.',
    location: 'San Francisco, CA',
  });

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      Alert.alert('Missing Information', 'Name and email are required.');
      return;
    }

    setIsLoading(true);

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Alert.alert('Success', 'Profile updated successfully!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePhoto = () => {
    Alert.alert('Change Photo', 'Photo upload functionality coming soon!');
  };

  if (isLoading) {
    return (
      <LinearGradient
        colors={['#111827', '#1F2937']}
        style={styles.loadingContainer}
      >
        <LoadingSpinner />
        <Text style={styles.loadingText}>Updating profile...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#111827', '#1F2937']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft color="#9CA3AF" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Save color="#8B5CF6" size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Photo */}
        <View style={styles.photoSection}>
          <View style={styles.photoContainer}>
            <Text style={styles.photoPlaceholder}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
            <TouchableOpacity
              style={styles.changePhotoButton}
              onPress={handleChangePhoto}
            >
              <Camera color="#FFFFFF" size={16} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.changePhotoTextButton}
            onPress={handleChangePhoto}
          >
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <Card style={styles.formCard}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          {/* Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name *</Text>
            <View style={styles.inputContainer}>
              <User color="#9CA3AF" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="#6B7280"
                value={formData.name}
                onChangeText={(text) =>
                  setFormData({ ...formData, name: text })
                }
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address *</Text>
            <View style={styles.inputContainer}>
              <Mail color="#9CA3AF" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#6B7280"
                value={formData.email}
                onChangeText={(text) =>
                  setFormData({ ...formData, email: text })
                }
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Phone */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <View style={styles.inputContainer}>
              <Phone color="#9CA3AF" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                placeholderTextColor="#6B7280"
                value={formData.phone}
                onChangeText={(text) =>
                  setFormData({ ...formData, phone: text })
                }
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Location */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Location</Text>
            <View style={styles.inputContainer}>
              <MapPin color="#9CA3AF" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your location"
                placeholderTextColor="#6B7280"
                value={formData.location}
                onChangeText={(text) =>
                  setFormData({ ...formData, location: text })
                }
              />
            </View>
          </View>

          {/* Bio */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Bio</Text>
            <TextInput
              style={[styles.input, styles.bioInput]}
              placeholder="Tell us about yourself..."
              placeholderTextColor="#6B7280"
              value={formData.bio}
              onChangeText={(text) => setFormData({ ...formData, bio: text })}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </Card>

        {/* Account Information */}
        <Card style={styles.accountCard}>
          <Text style={styles.sectionTitle}>Account Information</Text>

          <View style={styles.accountInfo}>
            <View style={styles.accountItem}>
              <Text style={styles.accountLabel}>Role</Text>
              <Text style={styles.accountValue}>
                {user?.role
                  ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                  : 'Citizen'}
              </Text>
            </View>

            <View style={styles.accountItem}>
              <Text style={styles.accountLabel}>Member Since</Text>
              <Text style={styles.accountValue}>January 2024</Text>
            </View>

            <View style={styles.accountItem}>
              <Text style={styles.accountLabel}>Reports Submitted</Text>
              <Text style={styles.accountValue}>12</Text>
            </View>
          </View>
        </Card>

        {/* Danger Zone */}
        <Card style={styles.dangerCard}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>

          <TouchableOpacity style={styles.dangerButton}>
            <Text style={styles.dangerButtonText}>Delete Account</Text>
          </TouchableOpacity>

          <Text style={styles.dangerNote}>
            This action cannot be undone. All your data will be permanently
            deleted.
          </Text>
        </Card>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#9CA3AF',
    fontSize: 16,
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F9FAFB',
  },
  saveButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  photoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  photoPlaceholder: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  changePhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#374151',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1F2937',
  },
  changePhotoTextButton: {
    paddingVertical: 8,
  },
  changePhotoText: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '500',
  },
  formCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F9FAFB',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#F9FAFB',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#F9FAFB',
    fontSize: 16,
    paddingVertical: 12,
  },
  bioInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  accountCard: {
    marginBottom: 16,
  },
  accountInfo: {
    gap: 12,
  },
  accountItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  accountLabel: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  accountValue: {
    fontSize: 14,
    color: '#F9FAFB',
    fontWeight: '500',
  },
  dangerCard: {
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  dangerButton: {
    backgroundColor: '#EF444420',
    borderWidth: 1,
    borderColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  dangerButtonText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
  },
  dangerNote: {
    fontSize: 12,
    color: '#EF4444',
    lineHeight: 16,
  },
});
