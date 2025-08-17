import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { violetTheme } from '../../theme/colors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

interface CardHeaderProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

interface CardTitleProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

interface CardDescriptionProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

interface CardContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

interface CardFooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const Card: React.FC<CardProps> = ({ children, style }) => {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
};

const CardHeader: React.FC<CardHeaderProps> = ({ children, style }) => {
  return (
    <View style={[styles.header, style]}>
      {children}
    </View>
  );
};

const CardTitle: React.FC<CardTitleProps> = ({ children, style }) => {
  return (
    <Text style={[styles.title, style]}>
      {children}
    </Text>
  );
};

const CardDescription: React.FC<CardDescriptionProps> = ({ children, style }) => {
  return (
    <Text style={[styles.description, style]}>
      {children}
    </Text>
  );
};

const CardContent: React.FC<CardContentProps> = ({ children, style }) => {
  return (
    <View style={[styles.content, style]}>
      {children}
    </View>
  );
};

const CardFooter: React.FC<CardFooterProps> = ({ children, style }) => {
  return (
    <View style={[styles.footer, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: violetTheme.colors.card,
    borderRadius: violetTheme.borderRadius.lg,
    borderWidth: 1,
    borderColor: violetTheme.colors.border,
    shadowColor: violetTheme.shadows.md.shadowColor,
    shadowOffset: violetTheme.shadows.md.shadowOffset,
    shadowOpacity: violetTheme.shadows.md.shadowOpacity,
    shadowRadius: violetTheme.shadows.md.shadowRadius,
    elevation: violetTheme.shadows.md.elevation,
  },
  header: {
    padding: violetTheme.spacing.lg,
    paddingBottom: violetTheme.spacing.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: violetTheme.colors.cardForeground,
    marginBottom: violetTheme.spacing.xs,
  },
  description: {
    fontSize: 14,
    color: violetTheme.colors.mutedForeground,
  },
  content: {
    padding: violetTheme.spacing.lg,
    paddingTop: 0,
  },
  footer: {
    padding: violetTheme.spacing.lg,
    paddingTop: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
