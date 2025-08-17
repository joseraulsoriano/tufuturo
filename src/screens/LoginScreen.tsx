import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { violetTheme } from '../theme/colors';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const LoginScreen: React.FC = () => {
  const { t } = useLanguage();
  const { signInWithGoogle, authEnabled } = useAuth();
  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (e) {
      console.log('Sign-in error', e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Welcome Card */}
        <Card style={styles.welcomeCard}>
          <CardHeader>
            <CardTitle>Welcome to Tu Futuro</CardTitle>
            <CardDescription>
              Your career journey starts here. Sign in to access personalized career recommendations and track your progress.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Sign In Options */}
        <Card style={styles.signInCard}>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              {authEnabled ? 'Click below to sign in to your account' : 'Auth is disabled (dev mode). Continue without sign in.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Sign In Button */}
            <Button
              variant="default"
              size="lg"
              style={styles.signInButton}
              onPress={handleSignIn}
            >
              <Ionicons name="log-in" size={20} color={violetTheme.colors.primaryForeground} />
              <Text style={styles.signInButtonText}>
                {authEnabled ? 'Sign In' : 'Continue (Auth Disabled)'}
              </Text>
            </Button>

            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                By signing in, you agree to our Terms of Service and Privacy Policy
              </Text>
            </View>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <Card style={styles.featuresCard}>
          <CardHeader>
            <CardTitle>What You'll Get</CardTitle>
          </CardHeader>
          <CardContent>
            <View style={styles.featureItem}>
              <Ionicons name="analytics" size={24} color={violetTheme.colors.primary} />
              <Text style={styles.featureText}>Personalized career recommendations</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="trending-up" size={24} color={violetTheme.colors.primary} />
              <Text style={styles.featureText}>Track your skills development</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="people" size={24} color={violetTheme.colors.primary} />
              <Text style={styles.featureText}>Discover volunteer opportunities</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="document-text" size={24} color={violetTheme.colors.primary} />
              <Text style={styles.featureText}>Complete career assessments</Text>
            </View>
          </CardContent>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: violetTheme.colors.background,
  },
  scrollView: {
    flex: 1,
    padding: violetTheme.spacing.md,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: violetTheme.spacing.xl,
  },
  logoImage: {
    width: 120,
    height: 120,
  },
  welcomeCard: {
    marginBottom: violetTheme.spacing.lg,
    backgroundColor: violetTheme.colors.violet50,
    borderColor: violetTheme.colors.violet200,
  },
  signInCard: {
    marginBottom: violetTheme.spacing.lg,
  },
  signInButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: violetTheme.spacing.md,
  },
  signInButtonText: {
    marginLeft: violetTheme.spacing.sm,
    fontSize: 16,
    fontWeight: '600',
  },
  termsContainer: {
    alignItems: 'center',
    marginTop: violetTheme.spacing.sm,
  },
  termsText: {
    color: violetTheme.colors.muted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  featuresCard: {
    marginBottom: violetTheme.spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: violetTheme.spacing.md,
  },
  featureText: {
    marginLeft: violetTheme.spacing.md,
    fontSize: 16,
    color: violetTheme.colors.foreground,
    flex: 1,
  },
});

export default LoginScreen;
