import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { violetTheme } from '../theme/colors';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';

const AccountScreen: React.FC = () => {
  // Mock user data - you can replace this with real data later
  const user = {
    name: 'Demo User',
    email: 'user@example.com',
    avatar: 'https://via.placeholder.com/100',
    joinDate: 'January 2024',
    completedAssessments: 3,
    totalSkills: 12,
    volunteerHours: 24,
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logout pressed');
  };

  const handleEditProfile = () => {
    // Add your edit profile logic here
    console.log('Edit profile pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <Card style={styles.profileCard}>
          <CardContent>
            <View style={styles.profileHeader}>
              <Image
                source={{ uri: user.avatar }}
                style={styles.avatar}
              />
              <View style={styles.profileInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <Text style={styles.joinDate}>Member since {user.joinDate}</Text>
              </View>
              <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
                <Ionicons name="create-outline" size={20} color={violetTheme.colors.primary} />
              </TouchableOpacity>
            </View>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <Card style={styles.statsCard}>
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
            <CardDescription>Track your career development journey</CardDescription>
          </CardHeader>
          <CardContent>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: violetTheme.colors.violet100 }]}>
                  <Ionicons name="document-text" size={24} color={violetTheme.colors.primary} />
                </View>
                <Text style={styles.statValue}>{user.completedAssessments}</Text>
                <Text style={styles.statLabel}>Assessments</Text>
              </View>
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: violetTheme.colors.violet100 }]}>
                  <Ionicons name="construct" size={24} color={violetTheme.colors.primary} />
                </View>
                <Text style={styles.statValue}>{user.totalSkills}</Text>
                <Text style={styles.statLabel}>Skills</Text>
              </View>
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: violetTheme.colors.violet100 }]}>
                  <Ionicons name="people" size={24} color={violetTheme.colors.primary} />
                </View>
                <Text style={styles.statValue}>{user.volunteerHours}</Text>
                <Text style={styles.statLabel}>Volunteer Hours</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card style={styles.actionsCard}>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <TouchableOpacity style={styles.actionItem}>
              <Ionicons name="notifications-outline" size={20} color={violetTheme.colors.muted} />
              <Text style={styles.actionText}>Notifications</Text>
              <Ionicons name="chevron-forward" size={20} color={violetTheme.colors.muted} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionItem}>
              <Ionicons name="shield-outline" size={20} color={violetTheme.colors.muted} />
              <Text style={styles.actionText}>Privacy & Security</Text>
              <Ionicons name="chevron-forward" size={20} color={violetTheme.colors.muted} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionItem}>
              <Ionicons name="help-circle-outline" size={20} color={violetTheme.colors.muted} />
              <Text style={styles.actionText}>Help & Support</Text>
              <Ionicons name="chevron-forward" size={20} color={violetTheme.colors.muted} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionItem}>
              <Ionicons name="information-circle-outline" size={20} color={violetTheme.colors.muted} />
              <Text style={styles.actionText}>About</Text>
              <Ionicons name="chevron-forward" size={20} color={violetTheme.colors.muted} />
            </TouchableOpacity>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Button
          variant="outline"
          size="lg"
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out" size={20} color={violetTheme.colors.danger} />
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </Button>
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
  profileCard: {
    marginBottom: violetTheme.spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: violetTheme.spacing.md,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: violetTheme.colors.foreground,
    marginBottom: violetTheme.spacing.xs,
  },
  userEmail: {
    fontSize: 16,
    color: violetTheme.colors.muted,
    marginBottom: violetTheme.spacing.xs,
  },
  joinDate: {
    fontSize: 14,
    color: violetTheme.colors.muted,
  },
  editButton: {
    padding: violetTheme.spacing.sm,
  },
  statsCard: {
    marginBottom: violetTheme.spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: violetTheme.spacing.sm,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: violetTheme.colors.foreground,
    marginBottom: violetTheme.spacing.xs,
  },
  statLabel: {
    fontSize: 14,
    color: violetTheme.colors.muted,
    textAlign: 'center',
  },
  actionsCard: {
    marginBottom: violetTheme.spacing.lg,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: violetTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: violetTheme.colors.border,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    color: violetTheme.colors.foreground,
    marginLeft: violetTheme.spacing.md,
  },
  logoutButton: {
    marginBottom: violetTheme.spacing.lg,
    borderColor: violetTheme.colors.danger,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    marginLeft: violetTheme.spacing.sm,
    fontSize: 16,
    fontWeight: '600',
    color: violetTheme.colors.danger,
  },
});

export default AccountScreen;
