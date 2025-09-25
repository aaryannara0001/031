import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import { issuesAPI } from '@/services/api';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Camera, ChevronLeft, MapPin, Send, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const categories = [
  { id: 'pothole', label: 'Pothole', icon: '🕳️' },
  { id: 'streetlight', label: 'Street Light', icon: '💡' },
  { id: 'garbage', label: 'Garbage', icon: '🗑️' },
  { id: 'waterlogging', label: 'Waterlogging', icon: '💧' },
  { id: 'other', label: 'Other', icon: '📝' },
];

const urgencies = [
  {
    id: 1,
    label: 'Low',
    description: 'Minor issue, can wait',
    color: '#10B981',
  },
  {
    id: 2,
    label: 'Medium',
    description: 'Should be addressed soon',
    color: '#F59E0B',
  },
  {
    id: 3,
    label: 'High',
    description: 'Needs attention quickly',
    color: '#EF4444',
  },
  {
    id: 4,
    label: 'Critical',
    description: 'Immediate action required',
    color: '#DC2626',
  },
  {
    id: 5,
    label: 'Emergency',
    description: 'Dangerous situation',
    color: '#7C2D12',
  },
];

export default function ReportIssueScreen() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [urgency, setUrgency] = useState(1);
  const [images, setImages] = useState<string[]>([]);
  const [location, setLocation] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    address: 'Current Location',
  });

  const handleAddPhoto = () => {
    // Mock photo addition - in real app would use camera/gallery
    const mockPhotos = [
      'https://images.pexels.com/photos/163016/highway-asphalt-space-sky-163016.jpeg?w=400',
      'https://images.pexels.com/photos/1166643/pexels-photo-1166643.jpeg?w=400',
      'https://images.pexels.com/photos/2827735/pexels-photo-2827735.jpeg?w=400',
    ];
    const randomPhoto =
      mockPhotos[Math.floor(Math.random() * mockPhotos.length)];
    setImages([...images, randomPhoto]);
  };

  const handleRemovePhoto = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !category) {
      Alert.alert(
        'Missing Information',
        'Please fill in all required fields and select a category.'
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await issuesAPI.createIssue({
        title: title.trim(),
        description: description.trim(),
        category: category as
          | 'pothole'
          | 'streetlight'
          | 'garbage'
          | 'waterlogging'
          | 'other',
        urgency,
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address,
        images,
      });

      if (response.error) {
        Alert.alert('Error', response.error);
        return;
      }

      Alert.alert(
        'Report Submitted!',
        'Your issue has been reported successfully. You can track its progress in the My Reports section.',
        [
          {
            text: 'View Report',
            onPress: () => router.replace('/(tabs)/reports'),
          },
          {
            text: 'Home',
            onPress: () => router.replace('/(tabs)'),
            style: 'cancel',
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <LinearGradient
        colors={['#111827', '#1F2937']}
        style={styles.loadingContainer}
      >
        <LoadingSpinner />
        <Text style={styles.loadingText}>Submitting your report...</Text>
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
        <Text style={styles.headerTitle}>Report Issue</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Card style={styles.inputCard}>
          <Text style={styles.label}>Issue Title *</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="Brief description of the issue"
            placeholderTextColor="#6B7280"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
          <Text style={styles.charCount}>{title.length}/100</Text>
        </Card>

        {/* Category */}
        <Card style={styles.inputCard}>
          <Text style={styles.label}>Category *</Text>
          <View style={styles.categoryGrid}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryButton,
                  category === cat.id && styles.categoryButtonActive,
                ]}
                onPress={() => setCategory(cat.id)}
              >
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <Text
                  style={[
                    styles.categoryText,
                    category === cat.id && styles.categoryTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Urgency */}
        <Card style={styles.inputCard}>
          <Text style={styles.label}>Urgency Level</Text>
          <View style={styles.urgencyContainer}>
            {urgencies.map((urg) => (
              <TouchableOpacity
                key={urg.id}
                style={[
                  styles.urgencyButton,
                  urgency === urg.id && { borderColor: urg.color },
                ]}
                onPress={() => setUrgency(urg.id)}
              >
                <View
                  style={[styles.urgencyDot, { backgroundColor: urg.color }]}
                />
                <View style={styles.urgencyContent}>
                  <Text style={styles.urgencyLabel}>{urg.label}</Text>
                  <Text style={styles.urgencyDesc}>{urg.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Description */}
        <Card style={styles.inputCard}>
          <Text style={styles.label}>Detailed Description *</Text>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Provide more details about the issue..."
            placeholderTextColor="#6B7280"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </Card>

        {/* Location */}
        <Card style={styles.inputCard}>
          <Text style={styles.label}>Location</Text>
          <TouchableOpacity style={styles.locationButton}>
            <MapPin color="#8B5CF6" size={20} />
            <View style={styles.locationInfo}>
              <Text style={styles.locationText}>{location.address}</Text>
              <Text style={styles.locationSubtext}>
                Tap to select different location
              </Text>
            </View>
          </TouchableOpacity>
        </Card>

        {/* Photos */}
        <Card style={styles.inputCard}>
          <Text style={styles.label}>Photos</Text>
          <View style={styles.photoSection}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {images.map((image, index) => (
                <View key={index} style={styles.photoContainer}>
                  <Image source={{ uri: image }} style={styles.photo} />
                  <TouchableOpacity
                    style={styles.removePhotoButton}
                    onPress={() => handleRemovePhoto(index)}
                  >
                    <X color="#FFFFFF" size={16} />
                  </TouchableOpacity>
                </View>
              ))}
              {images.length < 5 && (
                <TouchableOpacity
                  style={styles.addPhotoButton}
                  onPress={handleAddPhoto}
                >
                  <Camera color="#8B5CF6" size={24} />
                  <Text style={styles.addPhotoText}>Add Photo</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </Card>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Send color="#FFFFFF" size={20} />
          <Text style={styles.submitButtonText}>Submit Report</Text>
        </TouchableOpacity>

        {/* Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Your report will be reviewed and assigned to the appropriate
            department. You&apos;ll receive updates on the progress.
          </Text>
        </View>
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  inputCard: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F9FAFB',
    marginBottom: 12,
  },
  titleInput: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 12,
    color: '#F9FAFB',
    fontSize: 16,
  },
  charCount: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'right',
    marginTop: 4,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryButtonActive: {
    backgroundColor: '#8B5CF620',
    borderColor: '#8B5CF6',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#8B5CF6',
  },
  urgencyContainer: {
    gap: 8,
  },
  urgencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  urgencyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  urgencyContent: {
    flex: 1,
  },
  urgencyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F9FAFB',
  },
  urgencyDesc: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  descriptionInput: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 12,
    color: '#F9FAFB',
    fontSize: 16,
    minHeight: 100,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 12,
  },
  locationInfo: {
    flex: 1,
    marginLeft: 12,
  },
  locationText: {
    fontSize: 14,
    color: '#F9FAFB',
    fontWeight: '500',
  },
  locationSubtext: {
    fontSize: 12,
    color: '#8B5CF6',
    marginTop: 2,
  },
  photoSection: {
    marginTop: 8,
  },
  photoContainer: {
    position: 'relative',
    marginRight: 12,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoButton: {
    width: 80,
    height: 80,
    backgroundColor: '#374151',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#8B5CF6',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoText: {
    color: '#8B5CF6',
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingVertical: 16,
    marginVertical: 24,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoContainer: {
    backgroundColor: '#8B5CF620',
    borderRadius: 8,
    padding: 16,
    marginBottom: 32,
  },
  infoText: {
    color: '#8B5CF6',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
