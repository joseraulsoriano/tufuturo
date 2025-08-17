import React from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { violetTheme } from '../../theme/colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  labelStyle,
  errorStyle,
  leftIcon,
  rightIcon,
  style,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
        </Text>
      )}
      <View style={styles.inputContainer}>
        {leftIcon && (
          <View style={styles.leftIcon}>
            {leftIcon}
          </View>
        )}
        <TextInput
          style={[
            styles.input,
            leftIcon ? styles.inputWithLeftIcon : null,
            rightIcon ? styles.inputWithRightIcon : null,
            error ? styles.inputError : null,
            style,
          ]}
          placeholderTextColor={violetTheme.colors.mutedForeground}
          {...props}
        />
        {rightIcon && (
          <View style={styles.rightIcon}>
            {rightIcon}
          </View>
        )}
      </View>
      {error && (
        <Text style={[styles.error, errorStyle]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: violetTheme.spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: violetTheme.colors.foreground,
    marginBottom: violetTheme.spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: violetTheme.colors.border,
    borderRadius: violetTheme.borderRadius.md,
    backgroundColor: violetTheme.colors.background,
  },
  input: {
    height: 44,
    flex: 1,
    paddingHorizontal: violetTheme.spacing.md,
    fontSize: 16,
    color: violetTheme.colors.foreground,
  },
  inputWithLeftIcon: {
    paddingLeft: violetTheme.spacing.sm,
  },
  inputWithRightIcon: {
    paddingRight: violetTheme.spacing.sm,
  },
  leftIcon: {
    paddingLeft: violetTheme.spacing.md,
    paddingRight: violetTheme.spacing.sm,
  },
  rightIcon: {
    paddingRight: violetTheme.spacing.md,
    paddingLeft: violetTheme.spacing.sm,
  },
  inputError: {
    borderColor: violetTheme.colors.destructive,
  },
  error: {
    fontSize: 12,
    color: violetTheme.colors.destructive,
    marginTop: violetTheme.spacing.xs,
  },
});

export default Input;
