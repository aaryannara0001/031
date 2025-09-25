import { Card } from '@/components/ui/Card';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  AlertTriangle,
  ArrowLeft,
  Book,
  ChevronRight,
  ExternalLink,
  FileText,
  CircleHelp as HelpCircle,
  Mail,
  MessageSquare,
  Phone,
  Shield,
  Users,
} from 'lucide-react-native';
import React from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HelpScreen() {
  const faqItems = [
    {
      question: 'How do I report an issue?',
      answer:
        'Tap the "+" button on the home screen, fill in the details, and submit. You can also attach photos for better context.',
    },
    {
      question: 'How does the voting system work?',
      answer:
        'Community members can upvote issues they agree are important. Higher voted issues get priority attention from field workers.',
    },
    {
      question: 'What are badges and achievements?',
      answer:
        'Badges are earned by contributing to the community - reporting issues, voting, and helping resolve problems.',
    },
    {
      question: 'How do I become a field worker?',
      answer:
        'Contact your local civic administration. Field workers are trained professionals who resolve reported issues.',
    },
  ];

  const supportOptions = [
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Chat with our support team',
      action: () =>
        Alert.alert('Live Chat', 'Live chat feature would be available here.'),
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us an email',
      action: () => Linking.openURL('mailto:support@civichub.com'),
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Call our helpline',
      action: () => Linking.openURL('tel:+1234567890'),
    },
  ];

  const resourceLinks = [
    {
      icon: Book,
      title: 'User Guide',
      description: 'Complete guide to using CivicHub',
      url: 'https://civichub.com/guide',
    },
    {
      icon: Users,
      title: 'Community Forum',
      description: 'Connect with other users',
      url: 'https://forum.civichub.com',
    },
    {
      icon: FileText,
      title: 'Terms of Service',
      description: 'Read our terms and conditions',
      url: 'https://civichub.com/terms',
    },
    {
      icon: Shield,
      title: 'Privacy Policy',
      description: 'How we protect your data',
      url: 'https://civichub.com/privacy',
    },
  ];

  const [expandedFAQ, setExpandedFAQ] = React.useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
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
          <Text style={styles.headerTitle}>Help & Support</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Quick Help */}
        <Card style={styles.quickHelpCard}>
          <Text style={styles.sectionTitle}>Need Help?</Text>
          <Text style={styles.quickHelpText}>
            Find answers to common questions or get in touch with our support
            team.
          </Text>

          <View style={styles.supportGrid}>
            {supportOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.supportOption}
                onPress={option.action}
              >
                <option.icon color="#8B5CF6" size={24} />
                <Text style={styles.supportTitle}>{option.title}</Text>
                <Text style={styles.supportDescription}>
                  {option.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* FAQ Section */}
        <Card style={styles.faqCard}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

          {faqItems.map((item, index) => (
            <View key={index}>
              <TouchableOpacity
                style={styles.faqItem}
                onPress={() => toggleFAQ(index)}
              >
                <Text style={styles.faqQuestion}>{item.question}</Text>
                <ChevronRight
                  color="#8B5CF6"
                  size={16}
                  style={{
                    transform: [
                      { rotate: expandedFAQ === index ? '90deg' : '0deg' },
                    ],
                  }}
                />
              </TouchableOpacity>

              {expandedFAQ === index && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.faqAnswerText}>{item.answer}</Text>
                </View>
              )}
            </View>
          ))}
        </Card>

        {/* Resources */}
        <Card style={styles.resourcesCard}>
          <Text style={styles.sectionTitle}>Resources</Text>

          {resourceLinks.map((link, index) => (
            <TouchableOpacity
              key={index}
              style={styles.resourceItem}
              onPress={() => Linking.openURL(link.url)}
            >
              <View style={styles.resourceLeft}>
                <link.icon color="#8B5CF6" size={20} />
                <View style={styles.resourceText}>
                  <Text style={styles.resourceTitle}>{link.title}</Text>
                  <Text style={styles.resourceDescription}>
                    {link.description}
                  </Text>
                </View>
              </View>
              <ExternalLink color="#6B7280" size={16} />
            </TouchableOpacity>
          ))}
        </Card>

        {/* Contact Information */}
        <Card style={styles.contactCard}>
          <Text style={styles.sectionTitle}>Contact Information</Text>

          <View style={styles.contactItem}>
            <Mail color="#8B5CF6" size={20} />
            <View style={styles.contactText}>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>support@civichub.com</Text>
            </View>
          </View>

          <View style={styles.contactItem}>
            <Phone color="#8B5CF6" size={20} />
            <View style={styles.contactText}>
              <Text style={styles.contactLabel}>Phone</Text>
              <Text style={styles.contactValue}>+1 (555) 123-4567</Text>
            </View>
          </View>

          <View style={styles.contactItem}>
            <HelpCircle color="#8B5CF6" size={20} />
            <View style={styles.contactText}>
              <Text style={styles.contactLabel}>Support Hours</Text>
              <Text style={styles.contactValue}>Mon-Fri 9AM-6PM EST</Text>
            </View>
          </View>
        </Card>

        {/* Report Issue */}
        <TouchableOpacity style={styles.reportButton}>
          <AlertTriangle color="#EF4444" size={20} />
          <Text style={styles.reportText}>Report App Issue</Text>
        </TouchableOpacity>
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
  quickHelpCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F9FAFB',
    marginBottom: 16,
  },
  quickHelpText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 20,
    lineHeight: 20,
  },
  supportGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  supportOption: {
    alignItems: 'center',
    backgroundColor: '#374151',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
  },
  supportTitle: {
    fontSize: 14,
    color: '#F9FAFB',
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  supportDescription: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 16,
  },
  faqCard: {
    marginBottom: 16,
  },
  faqItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  faqQuestion: {
    fontSize: 16,
    color: '#F9FAFB',
    fontWeight: '500',
    flex: 1,
  },
  faqAnswer: {
    paddingTop: 8,
    paddingBottom: 16,
    paddingLeft: 0,
  },
  faqAnswerText: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
  },
  resourcesCard: {
    marginBottom: 16,
  },
  resourceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  resourceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  resourceText: {
    marginLeft: 12,
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    color: '#F9FAFB',
    fontWeight: '500',
    marginBottom: 2,
  },
  resourceDescription: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  contactCard: {
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  contactText: {
    marginLeft: 12,
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 16,
    color: '#F9FAFB',
    fontWeight: '500',
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF444420',
    borderWidth: 1,
    borderColor: '#EF4444',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  reportText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
