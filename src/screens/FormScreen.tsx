import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { violetTheme } from '../theme/colors';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useLanguage } from '../context/LanguageContext';

const FormScreen: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    education: '',
    skills: [] as string[],
    interests: [] as string[],
    location: '',
  });
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [showEducationDropdown, setShowEducationDropdown] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSelection = (field: 'skills' | 'interests', item: string) => {
    setFormData(prev => {
      const currentArray = prev[field] as string[];
      const newArray = currentArray.includes(item)
        ? currentArray.filter(i => i !== item)
        : [...currentArray, item];
      return { ...prev, [field]: newArray };
    });
  };

  const educationOptions = [
    'High School',
    'Some College',
    'Associate Degree',
    'Bachelor\'s Degree',
    'Master\'s Degree',
    'Doctorate (PhD)',
    'Professional Degree',
    'Other'
  ];

  const selectEducation = (education: string) => {
    handleInputChange('education', education);
    setShowEducationDropdown(false);
  };

  const getCurrentLocation = async () => {
    try {
      setIsLoadingLocation(true);
      
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Required',
          'We only use your city and country (not exact coordinates). Please enable location access.',
          [
            { text: 'OK' }
          ]
        );
        return;
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 10000,
        distanceInterval: 10,
      });

      // Reverse geocode to get city/country
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        const cityName = address.city || address.subregion || address.region || '';
        const country = address.country || '';
        const hasCityOrCountry = cityName || country;
        const locationString = hasCityOrCountry ? [cityName, country].filter(Boolean).join(', ') : '';
        
        if (locationString) {
          handleInputChange('location', locationString);
          Alert.alert('Location Set', `Your location: ${locationString}`);
        } else {
          Alert.alert('Location Unavailable', 'Could not determine your city and country. Please enter them manually.');
        }
      } else {
        // No reverse geocode results: do not use coordinates, ask user to enter manually
        Alert.alert('Location Unavailable', 'Could not determine your city and country. Please enter them manually.');
      }

    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert(
        'Location Error',
        'Unable to get your city and country. Please enter them manually.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleSubmit = () => {
    // Validate minimum selections
    if (formData.skills.length < 2) {
      Alert.alert('Skills Required', 'Please select at least 2 skills to proceed.');
      return;
    }
    if (formData.interests.length < 2) {
      Alert.alert('Interests Required', 'Please select at least 2 interests to proceed.');
      return;
    }
    
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  const skillsOptions = [
    { emoji: '💬', label: 'Communication' },
    { emoji: '👥', label: 'Leadership' },
    { emoji: '💻', label: 'Programming' },
    { emoji: '🎨', label: 'Design' },
    { emoji: '📊', label: 'Analytics' },
    { emoji: '🔍', label: 'Research' },
    { emoji: '📝', label: 'Writing' },
    { emoji: '🗣️', label: 'Speaking' },
    { emoji: '🤝', label: 'Teamwork' },
    { emoji: '⚡', label: 'Problem Solving' },
    { emoji: '📈', label: 'Management' },
    { emoji: '🌐', label: 'Languages' },
  ];

  const interestsOptions = [
    { emoji: '🧑‍🎨', label: 'Art' },
    { emoji: '🥐', label: 'Baking' },
    { emoji: '🍀', label: 'Botany' },
    { emoji: '🚗', label: 'Cars' },
    { emoji: '🏡', label: 'Real Estate' },
    { emoji: '📱', label: 'Technology' },
    { emoji: '👗', label: 'Fashion' },
    { emoji: '🐦', label: 'Birds' },
    { emoji: '🏥', label: 'Healthcare' },
    { emoji: '🗺️', label: 'Geography' },
    { emoji: '💰', label: 'Finance' },
    { emoji: '🧠', label: 'Mental Health' },
    { emoji: '🧑‍💻', label: 'Programming' },
    { emoji: '🎥', label: 'Cinema' },
    { emoji: '🏀', label: 'Sports' },
    { emoji: '🎒', label: 'Travel' },
    { emoji: '🎮', label: 'Gaming' },
    { emoji: '📷', label: 'Photography' },
  ];

  const renderSelectableGrid = (title: string, subtitle: string, options: Array<{emoji: string, label: string}>, field: 'skills' | 'interests') => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons 
          name={field === 'skills' ? 'construct-outline' : 'heart-outline'} 
          size={20} 
          color={violetTheme.colors.primary} 
        />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <Text style={styles.sectionSubtitle}>{subtitle}</Text>
      <View style={styles.gridContainer}>
        {options.map((option, index) => {
          const isSelected = (formData[field] as string[]).includes(option.label);
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.interestButton,
                isSelected && styles.interestButtonSelected
              ]}
              onPress={() => toggleSelection(field, option.label)}
            >
              <Text style={styles.interestEmoji}>{option.emoji}</Text>
              <Text
                style={[
                  styles.interestLabel,
                  isSelected && styles.interestLabelSelected
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.screenHeader}>
          <Text style={styles.screenTitle}>Career Assessment</Text>
          <Text style={styles.screenSubtitle}>
            Tell us about yourself to get personalized career recommendations
          </Text>
        </View>
            {/* Location Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="location-outline" size={20} color={violetTheme.colors.primary} />
                <Text style={styles.sectionTitle}>Location</Text>
              </View>
              <View style={styles.locationContainer}>
                <Input
                  label="Your Location"
                  placeholder="Enter your city or use current location"
                  value={formData.location}
                  onChangeText={(value) => handleInputChange('location', value)}
                  leftIcon={<Ionicons name="location" size={20} color={violetTheme.colors.muted} />}
                  rightIcon={
                    <TouchableOpacity 
                      onPress={getCurrentLocation}
                      disabled={isLoadingLocation}
                      style={styles.locationButton}
                    >
                      {isLoadingLocation ? (
                        <ActivityIndicator size="small" color={violetTheme.colors.primary} />
                      ) : (
                        <Ionicons name="navigate" size={20} color={violetTheme.colors.primary} />
                      )}
                    </TouchableOpacity>
                  }
                />
                {isLoadingLocation && (
                  <Text style={styles.locationStatus}>Getting your location...</Text>
                )}
              </View>
            </View>

            {/* Education Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="school-outline" size={20} color={violetTheme.colors.primary} />
                <Text style={styles.sectionTitle}>Education</Text>
              </View>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowEducationDropdown(true)}
              >
                <View style={styles.dropdownContent}>
                  <Text style={[
                    styles.dropdownText,
                    !formData.education && styles.dropdownPlaceholder
                  ]}>
                    {formData.education || 'Select your education level'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color={violetTheme.colors.muted} />
                </View>
              </TouchableOpacity>
            </View>

            {/* Skills Section */}
            {renderSelectableGrid(
              'Skills',
              'Please select two or more to proceed',
              skillsOptions,
              'skills'
            )}

            {/* Interests Section */}
            {renderSelectableGrid(
              'Interests',
              'Please select two or more to proceed',
              interestsOptions,
              'interests'
            )}

            {/* Submit Button */}
            <View style={styles.submitSection}>
              <Button
                variant="default"
                size="lg"
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Ionicons name="rocket" size={20} color={violetTheme.colors.primaryForeground} />
                <Text style={styles.submitButtonText}>Get Career Recommendations</Text>
              </Button>
            </View>
      
      </ScrollView>

      {/* Education Dropdown Modal */}
      <Modal
        visible={showEducationDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowEducationDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowEducationDropdown(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Education Level</Text>
              <TouchableOpacity onPress={() => setShowEducationDropdown(false)}>
                <Ionicons name="close" size={24} color={violetTheme.colors.muted} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScrollView}>
              {educationOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dropdownOption,
                    formData.education === option && styles.dropdownOptionSelected
                  ]}
                  onPress={() => selectEducation(option)}
                >
                  <Text style={[
                    styles.dropdownOptionText,
                    formData.education === option && styles.dropdownOptionTextSelected
                  ]}>
                    {option}
                  </Text>
                  {formData.education === option && (
                    <Ionicons name="checkmark" size={20} color={violetTheme.colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
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
  screenHeader: {
    marginBottom: violetTheme.spacing.md,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: violetTheme.colors.foreground,
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 14,
    color: violetTheme.colors.muted,
  },
  formCard: {
    marginBottom: violetTheme.spacing.lg,
  },
  section: {
    marginBottom: violetTheme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: violetTheme.spacing.xs,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: violetTheme.colors.primary,
    marginLeft: violetTheme.spacing.sm,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: violetTheme.colors.muted,
    marginBottom: violetTheme.spacing.sm,
    marginLeft: violetTheme.spacing.sm,
  },
  locationContainer: {
    position: 'relative',
  },
  locationButton: {
    padding: violetTheme.spacing.xs,
  },
  locationStatus: {
    fontSize: 12,
    color: violetTheme.colors.muted,
    fontStyle: 'italic',
    marginTop: violetTheme.spacing.xs,
    marginLeft: violetTheme.spacing.sm,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: violetTheme.colors.border,
    borderRadius: violetTheme.borderRadius.md,
    backgroundColor: violetTheme.colors.background,
    paddingHorizontal: violetTheme.spacing.md,
    paddingVertical: violetTheme.spacing.sm,
  },
  dropdownContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: {
    fontSize: 16,
    color: violetTheme.colors.foreground,
  },
  dropdownPlaceholder: {
    color: violetTheme.colors.muted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: violetTheme.colors.background,
    borderRadius: violetTheme.borderRadius.lg,
    width: '90%',
    maxHeight: '70%',
    shadowColor: violetTheme.shadows.lg.shadowColor,
    shadowOffset: violetTheme.shadows.lg.shadowOffset,
    shadowOpacity: violetTheme.shadows.lg.shadowOpacity,
    shadowRadius: violetTheme.shadows.lg.shadowRadius,
    elevation: violetTheme.shadows.lg.elevation,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: violetTheme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: violetTheme.colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: violetTheme.colors.foreground,
  },
  modalScrollView: {
    maxHeight: 300,
  },
  dropdownOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: violetTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: violetTheme.colors.border,
  },
  dropdownOptionSelected: {
    backgroundColor: violetTheme.colors.violet50,
  },
  dropdownOptionText: {
    fontSize: 16,
    color: violetTheme.colors.foreground,
  },
  dropdownOptionTextSelected: {
    color: violetTheme.colors.primary,
    fontWeight: '600',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: violetTheme.spacing.sm,
  },
  interestButton: {
    backgroundColor: violetTheme.colors.background,
    borderWidth: 1,
    borderColor: violetTheme.colors.border,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: violetTheme.spacing.md,
    paddingVertical: violetTheme.spacing.xs,
    shadowColor: violetTheme.shadows.sm.shadowColor,
    shadowOffset: violetTheme.shadows.sm.shadowOffset,
    shadowOpacity: violetTheme.shadows.sm.shadowOpacity,
    shadowRadius: violetTheme.shadows.sm.shadowRadius,
    elevation: violetTheme.shadows.sm.elevation,
    flexDirection: 'row',
    gap: violetTheme.spacing.xs,
  },
  interestButtonSelected: {
    borderColor: violetTheme.colors.primary,
    backgroundColor: violetTheme.colors.violet50,
    borderWidth: 2,
  },
  interestEmoji: {
    fontSize: 18,
    marginBottom: 0,
  },
  interestLabel: {
    fontSize: 11,
    color: violetTheme.colors.foreground,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 13,
    marginTop: 0,
    flexShrink: 1,
    minWidth: 0,
    maxWidth: '75%',
  },
  interestLabelSelected: {
    color: violetTheme.colors.primary,
    fontWeight: '600',
  },
  submitSection: {
    marginTop: violetTheme.spacing.md,
    paddingTop: violetTheme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: violetTheme.colors.border,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    marginLeft: violetTheme.spacing.sm,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FormScreen;
