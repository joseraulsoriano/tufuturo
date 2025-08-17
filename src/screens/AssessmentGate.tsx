import React from 'react';
import LoginScreen from './LoginScreen';
import ProfileFormScreen from './ProfileFormScreen';
import FormScreen from './FormScreen';
import { useAuth } from '../context/AuthContext';
import { useOnboarding } from '../context/OnboardingContext';

const AssessmentGate: React.FC = () => {
  const { user } = useAuth();
  const { profileCompleted, assessmentCompleted } = useOnboarding();

  if (!user) return <LoginScreen />;
  if (!profileCompleted) return <ProfileFormScreen />;
  if (!assessmentCompleted) return <FormScreen />;
  return <FormScreen />;
};

export default AssessmentGate;


