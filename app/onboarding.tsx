import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ChevronRight, MapPin, Shield, Users, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    id: 1,
    title: 'Welcome to CivicHub',
    subtitle: 'Your community in your hands',
    description:
      'Report issues, track progress, and help make your city better.',
    icon: MapPin,
    color: '#8B5CF6',
    gradient: ['#8B5CF6', '#A855F7'],
  },
  {
    id: 2,
    title: 'Report Issues',
    subtitle: 'Capture and report local problems',
    description:
      'Use photos, location, and detailed descriptions to report issues that matter to you.',
    icon: MapPin,
    color: '#10B981',
    gradient: ['#10B981', '#34D399'],
  },
  {
    id: 3,
    title: 'Community Power',
    subtitle: 'Validate and support reports',
    description:
      'Vote on issues, add comments, and help prioritize what gets fixed first.',
    icon: Users,
    color: '#F59E0B',
    gradient: ['#F59E0B', '#FBBF24'],
  },
  {
    id: 4,
    title: 'Track Progress',
    subtitle: 'See real results',
    description:
      'Follow the status of your reports and watch as issues get resolved.',
    icon: Shield,
    color: '#EF4444',
    gradient: ['#EF4444', '#F87171'],
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    router.replace('/(tabs)');
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  const currentSlide = onboardingData[currentIndex];
  const IconComponent = currentSlide.icon;

  return (
    <LinearGradient
      colors={['#0F172A', '#1E293B', '#334155']}
      style={styles.container}
    >
      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <X color="#CBD5E1" size={24} />
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.slideContainer}>
          {/* Icon */}
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: currentSlide.color + '20' },
            ]}
          >
            <IconComponent color={currentSlide.color} size={64} />
          </View>

          {/* Text Content */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>{currentSlide.title}</Text>
            <Text style={styles.subtitle}>{currentSlide.subtitle}</Text>
            <Text style={styles.description}>{currentSlide.description}</Text>
          </View>

          {/* Progress Indicators */}
          <View style={styles.progressContainer}>
            {onboardingData.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  index === currentIndex && styles.progressDotActive,
                ]}
              />
            ))}
          </View>
        </View>
      </View>

      {/* Bottom Actions */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: currentSlide.color }]}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>
            {currentIndex === onboardingData.length - 1
              ? 'Get Started'
              : 'Next'}
          </Text>
          <ChevronRight color="#FFFFFF" size={20} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    padding: 8,
    zIndex: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  slideContainer: {
    alignItems: 'center',
    width: width - 48,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#CBD5E1',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4B5563',
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: '#8B5CF6',
    width: 24,
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 60,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
  },
});
