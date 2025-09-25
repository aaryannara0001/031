import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { UserRole } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function LoginScreen() {
  const { role } = useLocalSearchParams<{ role?: UserRole }>();
  const { login, isLoading } = useAuth();
  const { colors } = useTheme();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [touched, setTouched] = useState<{
    email?: boolean;
    password?: boolean;
  }>({});
  const [rememberMe, setRememberMe] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (password: string) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const handleInputChange = (field: 'email' | 'password', value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleInputBlur = (field: 'email' | 'password') => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    let error = '';
    if (field === 'email') {
      error = validateEmail(formData.email);
    } else if (field === 'password') {
      error = validatePassword(formData.password);
    }

    if (error) {
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleGoogleLogin = async () => {
    setSocialLoading(true);
    try {
      // Mock Google authentication
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // For demo purposes, use the first citizen user
      await login('google@example.com', 'password', role);
    } catch (error) {
      Alert.alert(
        'Google Login Failed',
        'Unable to authenticate with Google. Please try again.',
        [{ text: 'Try Again' }]
      );
    } finally {
      setSocialLoading(false);
    }
  };

  const handleDigilocerLogin = async () => {
    setSocialLoading(true);
    try {
      // Mock Digilocer authentication
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // For demo purposes, use a Digilocer-authenticated user
      await login('digilocer@example.com', 'password', role);
    } catch (error) {
      Alert.alert(
        'Digilocer Login Failed',
        'Unable to authenticate with Digilocer. Please try again.',
        [{ text: 'Try Again' }]
      );
    } finally {
      setSocialLoading(false);
    }
  };

  const handleLogin = async () => {
    // Validate all fields
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    setErrors({
      email: emailError,
      password: passwordError,
    });
    setTouched({ email: true, password: true });

    if (emailError || passwordError) {
      return;
    }

    try {
      await login(formData.email, formData.password, role);

      // Route based on role after successful login
      switch (role) {
        case 'admin':
          router.replace('/admin-dashboard');
          break;
        case 'staff':
          router.replace('/welcome');
          break;
        case 'fieldworker':
          router.replace('/welcome');
          break;
        case 'citizen':
        default:
          router.replace('/welcome');
          break;
      }
    } catch (error) {
      Alert.alert(
        'Login Failed',
        error instanceof Error
          ? error.message
          : 'Please check your credentials and try again.',
        [{ text: 'Try Again' }]
      );
    }
  };

  const getInputStyle = (field: 'email' | 'password') => {
    const hasError = errors[field] && touched[field];
    return [
      styles.inputContainer,
      { borderColor: hasError ? colors.error : colors.border },
      !hasError && touched[field] && styles.inputContainerSuccess,
    ];
  };

  const getRoleIcon = () => {
    if (role === 'admin') return <Shield color="#EF4444" size={20} />;
    if (role === 'fieldworker') return <Shield color="#10B981" size={20} />;
    return <Mail color="#8B5CF6" size={20} />;
  };

  if (isLoading) {
    return (
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        style={styles.loadingContainer}
      >
        <LoadingSpinner />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Signing you in...
        </Text>
        <Text style={[styles.loadingSubtext, { color: colors.textSecondary }]}>
          Please wait while we verify your credentials
        </Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <Animated.ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft color="#CBD5E1" size={24} />
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <Text style={[styles.title, { color: colors.text }]}>
                Welcome Back
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                {role
                  ? `Sign in as ${role.charAt(0).toUpperCase() + role.slice(1)}`
                  : 'Sign in to your account'}
              </Text>
              {role && (
                <View style={styles.roleBadge}>
                  {getRoleIcon()}
                  <Text style={styles.roleText}>
                    {role.charAt(0).toUpperCase() + role.slice(1)} Account
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                Email Address
              </Text>
              <View style={getInputStyle('email')}>
                <Mail
                  color={
                    errors.email && touched.email
                      ? '#EF4444'
                      : colors.textSecondary
                  }
                  size={20}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.textTertiary}
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  onBlur={() => handleInputBlur('email')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
                {touched.email &&
                  (errors.email ? (
                    <AlertCircle color="#EF4444" size={20} />
                  ) : (
                    <CheckCircle color="#10B981" size={20} />
                  ))}
              </View>
              {errors.email && touched.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                Password
              </Text>
              <View style={getInputStyle('password')}>
                <Lock
                  color={
                    errors.password && touched.password
                      ? '#EF4444'
                      : colors.textSecondary
                  }
                  size={20}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textTertiary}
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  onBlur={() => handleInputBlur('password')}
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  {showPassword ? (
                    <EyeOff color="#9CA3AF" size={20} />
                  ) : (
                    <Eye color="#9CA3AF" size={20} />
                  )}
                </TouchableOpacity>
              </View>
              {errors.password && touched.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            {/* Remember Me & Forgot Password */}
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View
                  style={[
                    styles.checkbox,
                    rememberMe && styles.checkboxChecked,
                  ]}
                >
                  {rememberMe && <CheckCircle color="#8B5CF6" size={12} />}
                </View>
                <Text
                  style={[styles.checkboxText, { color: colors.textSecondary }]}
                >
                  Remember me
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={() => router.push('/forgot-password')}
              >
                <Text
                  style={[styles.forgotPasswordText, { color: colors.primary }]}
                >
                  Forgot password?
                </Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Sign In</Text>
            </TouchableOpacity>

            {/* Social Login Divider */}
            <View style={styles.divider}>
              <View
                style={[styles.dividerLine, { backgroundColor: colors.border }]}
              />
              <Text
                style={[styles.dividerText, { color: colors.textTertiary }]}
              >
                or continue with
              </Text>
              <View
                style={[styles.dividerLine, { backgroundColor: colors.border }]}
              />
            </View>

            {/* Social Login Buttons */}
            <View style={styles.socialButtons}>
              <TouchableOpacity
                style={[
                  styles.socialButton,
                  { backgroundColor: colors.input, borderColor: colors.border },
                ]}
                onPress={handleGoogleLogin}
                disabled={socialLoading}
              >
                {socialLoading ? (
                  <LoadingSpinner size={20} color={colors.text} />
                ) : (
                  <Text
                    style={[styles.socialButtonText, { color: colors.text }]}
                  >
                    Google
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.socialButton,
                  { backgroundColor: colors.input, borderColor: colors.border },
                ]}
                onPress={handleDigilocerLogin}
                disabled={socialLoading}
              >
                {socialLoading ? (
                  <LoadingSpinner size={20} color={colors.text} />
                ) : (
                  <Text
                    style={[styles.socialButtonText, { color: colors.text }]}
                  >
                    Digilocer
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textTertiary }]}>
              Don&apos;t have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/signup')}>
              <Text style={[styles.linkText, { color: colors.primary }]}>
                Create one
              </Text>
            </TouchableOpacity>
          </View>

          {/* Demo Notice */}
          <View
            style={[
              styles.demoNotice,
              {
                backgroundColor: colors.primary + '10',
                borderColor: colors.primary + '20',
              },
            ]}
          >
            <Text style={[styles.demoText, { color: colors.primaryDark }]}>
              🔐 Demo Mode: Any email/password combination will work
            </Text>
          </View>
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 8,
  },
  loadingSubtext: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  roleText: {
    color: '#8B5CF6',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
  },
  inputContainerError: {
    borderColor: '#EF4444',
  },
  inputContainerSuccess: {
    borderColor: '#10B981',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#111827',
    fontSize: 16,
    paddingVertical: 12,
  },
  eyeIcon: {
    padding: 8,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 6,
    marginLeft: 4,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  checkboxText: {
    color: '#374151',
    fontSize: 14,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    color: '#6B7280',
    paddingHorizontal: 16,
    fontSize: 14,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  socialButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  socialButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  footerText: {
    color: '#6B7280',
    fontSize: 14,
  },
  linkText: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '600',
  },
  demoNotice: {
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.1)',
  },
  demoText: {
    color: '#7C3AED',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
});
