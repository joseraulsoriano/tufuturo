import React, { useState } from 'react';
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
import { useLanguage } from '../context/LanguageContext';

const ResultsScreen: React.FC = () => {
  const { t } = useLanguage();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const careerRecommendations = [
    {
      id: 1,
      title: 'Software Engineer',
      category: 'Technology',
      compatibility: 98,
      icon: '💻',
      skills: ['Programming', 'Problem Solving', 'Technical Skills'],
      description: 'Perfect for someone with strong analytical thinking and technical abilities.',
      growth: 'High growth potential with excellent salary progression.',
      reason: 'Your technical skills and logical thinking align perfectly with this role.'
    },
    {
      id: 2,
      title: 'Product Manager',
      category: 'Business & Technology',
      compatibility: 95,
      icon: '📊',
      skills: ['Leadership', 'Communication', 'Strategic Thinking'],
      description: 'Great for someone who enjoys coordinating teams and driving product vision.',
      growth: 'Strong career advancement opportunities in tech companies.',
      reason: 'Your communication skills and interest in business make this a great fit.'
    },
    {
      id: 3,
      title: 'UX/UI Designer',
      category: 'Creative & Technology',
      compatibility: 92,
      icon: '🎨',
      skills: ['Creativity', 'User Empathy', 'Design Tools'],
      description: 'Ideal for creative individuals who love solving user problems.',
      growth: 'Growing demand in digital product companies.',
      reason: 'Your creative interests and attention to detail are perfect for this role.'
    },
    {
      id: 4,
      title: 'Data Analyst',
      category: 'Analytics & Business',
      compatibility: 89,
      icon: '📈',
      skills: ['Data Analysis', 'Critical Thinking', 'Business Acumen'],
      description: 'Perfect for analytical minds who enjoy working with data.',
      growth: 'High demand across all industries.',
      reason: 'Your analytical skills and business understanding align well here.'
    },
    {
      id: 5,
      title: 'Business Consultant',
      category: 'Business & Strategy',
      compatibility: 87,
      icon: '💼',
      skills: ['Problem Solving', 'Communication', 'Business Strategy'],
      description: 'Great for strategic thinkers who enjoy helping businesses grow.',
      growth: 'Excellent career progression and networking opportunities.',
      reason: 'Your strategic thinking and communication skills are valuable here.'
    }
  ];

  const getCompatibilityColor = (score: number) => {
    if (score >= 95) return violetTheme.colors.success;
    if (score >= 85) return violetTheme.colors.primary;
    if (score >= 75) return violetTheme.colors.warning;
    return violetTheme.colors.muted;
  };

  const getCompatibilityIcon = (score: number) => {
    if (score >= 95) return 'heart';
    if (score >= 85) return 'star';
    if (score >= 75) return 'thumbs-up';
    return 'checkmark';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerIcon}>
              <Ionicons 
                name="heart" 
                size={32} 
                color={violetTheme.colors.primary} 
              />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>{t('results.title')}</Text>
              <Text style={styles.headerSubtitle}>{t('results.subtitle')}</Text>
            </View>
          </View>
          
          {/* Filter Buttons */}
          <View style={styles.filterContainer}>
            <Button
              variant={selectedFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onPress={() => setSelectedFilter('all')}
              style={styles.filterButton}
            >
              {t('results.filter.all')}
            </Button>
            <Button
              variant={selectedFilter === 'high' ? 'default' : 'outline'}
              size="sm"
              onPress={() => setSelectedFilter('high')}
              style={styles.filterButton}
            >
              {t('results.filter.high')}
            </Button>
            <Button
              variant={selectedFilter === 'nearby' ? 'default' : 'outline'}
              size="sm"
              onPress={() => setSelectedFilter('nearby')}
              style={styles.filterButton}
            >
              {t('results.filter.nearby')}
            </Button>
          </View>
        </View>

        {/* Results Count */}
        <View style={styles.resultsInfo}>
          <Text style={styles.resultsCount}>
            {careerRecommendations.length} {t('results.count')}
          </Text>
          <Text style={styles.resultsSubtitle}>
            {t('results.basedOn')}
          </Text>
        </View>

        {/* Career Recommendations */}
        {careerRecommendations.map((career) => (
          <Card key={career.id} style={styles.careerCard}>
            <CardContent>
              <View style={styles.careerHeader}>
                <View style={styles.careerIcon}>
                  <Text style={styles.iconEmoji}>{career.icon}</Text>
                </View>
                <View style={styles.careerInfo}>
                  <View style={styles.careerTitleRow}>
                    <Text style={styles.careerTitle}>{career.title}</Text>
                    <Text style={styles.careerCategory}>{career.category}</Text>
                  </View>
                  <Text style={styles.careerGrowth}>
                    <Ionicons name="trending-up" size={14} color={violetTheme.colors.success} />
                    {' '}{t('results.growth')}
                  </Text>
                  <Text style={styles.careerReason}>{career.reason}</Text>
                </View>
                <View style={styles.compatibilityScore}>
                  <View style={[styles.scoreCircle, { backgroundColor: getCompatibilityColor(career.compatibility) + '20' }]}>
                    <Ionicons 
                      name={getCompatibilityIcon(career.compatibility) as any} 
                      size={20} 
                      color={getCompatibilityColor(career.compatibility)} 
                    />
                  </View>
                  <Text style={[styles.scoreText, { color: getCompatibilityColor(career.compatibility) }]}>
                    {career.compatibility}%
                  </Text>
                </View>
              </View>
              
              <Text style={styles.careerDescription}>{career.description}</Text>
              
              <View style={styles.skillsContainer}>
                {career.skills.map((skill, index) => (
                  <View key={index} style={styles.skillTag}>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.actionSection}>
                <Button
                  variant="default"
                  size="lg"
                  style={styles.exploreButton}
                  onPress={() => {}}
                >
                  <Ionicons name="search" size={18} color={violetTheme.colors.primaryForeground} />
                  <Text style={styles.exploreButtonText}>{t('results.explore')}</Text>
                </Button>
              </View>
            </CardContent>
          </Card>
        ))}

        {/* Load More */}
        <View style={styles.loadMoreContainer}>
          <Button
            variant="outline"
            size="lg"
            onPress={() => {}}
            style={styles.loadMoreButton}
          >
            <Ionicons name="refresh" size={20} color={violetTheme.colors.primary} />
            <Text style={styles.loadMoreText}>{t('results.loadMore')}</Text>
          </Button>
        </View>
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
  header: {
    marginBottom: violetTheme.spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: violetTheme.spacing.md,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: violetTheme.colors.violet50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: violetTheme.spacing.md,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: violetTheme.colors.foreground,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 16,
    color: violetTheme.colors.muted,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterButton: {
    flex: 1,
    marginHorizontal: 2,
  },
  resultsInfo: {
    alignItems: 'center',
    marginBottom: violetTheme.spacing.lg,
    padding: violetTheme.spacing.md,
    backgroundColor: violetTheme.colors.violet50,
    borderRadius: violetTheme.borderRadius.md,
  },
  resultsCount: {
    fontSize: 18,
    fontWeight: '600',
    color: violetTheme.colors.foreground,
    marginBottom: 4,
  },
  resultsSubtitle: {
    fontSize: 14,
    color: violetTheme.colors.muted,
    textAlign: 'center',
  },
  careerCard: {
    marginBottom: violetTheme.spacing.lg,
    elevation: 2,
    shadowColor: violetTheme.colors.foreground,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 15,
  },
  cardContent: {
    padding: violetTheme.spacing.lg,
  },
  careerHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: violetTheme.spacing.lg,
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    flex: 1,
    marginRight: violetTheme.spacing.md,
  },
  careerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: violetTheme.colors.violet50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: violetTheme.spacing.md,
    shadowColor: violetTheme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconEmoji: {
    fontSize: 32,
  },
  careerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  careerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: violetTheme.spacing.sm,
    flexWrap: 'wrap',
  },
  careerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: violetTheme.colors.foreground,
    marginRight: violetTheme.spacing.sm,
    marginBottom: 2,
  },
  careerCategory: {
    fontSize: 16,
    color: violetTheme.colors.primary,
    fontWeight: '600',
    backgroundColor: violetTheme.colors.violet50,
    paddingHorizontal: violetTheme.spacing.sm,
    paddingVertical: 4,
    borderRadius: violetTheme.borderRadius.sm,
  },
  careerDetails: {
    marginTop: violetTheme.spacing.xs,
  },
  careerGrowth: {
    fontSize: 14,
    color: violetTheme.colors.success,
    marginBottom: violetTheme.spacing.xs,
    fontWeight: '500',
  },
  careerReason: {
    fontSize: 13,
    color: violetTheme.colors.muted,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  compatibilityScore: {
    alignItems: 'center',
    marginLeft: violetTheme.spacing.md,
  },
  scoreCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: violetTheme.spacing.xs,
    shadowColor: violetTheme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '700',
  },
  descriptionSection: {
    marginBottom: violetTheme.spacing.lg,
    paddingHorizontal: 2,
  },
  careerDescription: {
    fontSize: 15,
    color: violetTheme.colors.foreground,
    lineHeight: 22,
    textAlign: 'center',
    fontWeight: '500',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: violetTheme.spacing.lg,
    justifyContent: 'center',
  },
  skillTag: {
    backgroundColor: violetTheme.colors.violet100,
    paddingHorizontal: violetTheme.spacing.md,
    paddingVertical: violetTheme.spacing.sm,
    borderRadius: violetTheme.borderRadius.md,
    marginRight: violetTheme.spacing.sm,
    marginBottom: violetTheme.spacing.sm,
    borderWidth: 1,
    borderColor: violetTheme.colors.violet200,
  },
  skillText: {
    fontSize: 13,
    color: violetTheme.colors.primary,
    fontWeight: '600',
  },

  actionSection: {
    alignItems: 'center',
  },
  exploreButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: violetTheme.spacing.md,
  },
  exploreButtonText: {
    marginLeft: violetTheme.spacing.sm,
    fontSize: 16,
    fontWeight: '600',
  },
  loadMoreContainer: {
    alignItems: 'center',
    marginBottom: violetTheme.spacing.lg,
  },
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadMoreText: {
    marginLeft: violetTheme.spacing.sm,
  },
});

export default ResultsScreen;
