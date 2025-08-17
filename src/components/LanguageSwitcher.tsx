import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage, Language } from '../context/LanguageContext';
import { violetTheme } from '../theme/colors';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  const handleLanguageChange = (langCode: Language) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  const renderLanguageItem = ({ item }: { item: typeof languages[0] }) => (
    <TouchableOpacity
      style={[
        styles.languageItem,
        item.code === language && styles.selectedLanguage
      ]}
      onPress={() => handleLanguageChange(item.code as Language)}
    >
      <Text style={styles.flagText}>{item.flag}</Text>
      <Text style={[
        styles.languageName,
        item.code === language && styles.selectedLanguageText
      ]}>
        {item.name}
      </Text>
      {item.code === language && (
        <Ionicons 
          name="checkmark" 
          size={20} 
          color={violetTheme.colors.primary} 
        />
      )}
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setIsOpen(true)}
      >
        <Text style={styles.flagText}>{currentLanguage?.flag}</Text>
        <Text style={styles.triggerText}>{currentLanguage?.code.toUpperCase()}</Text>
        <Ionicons 
          name="chevron-down" 
          size={16} 
          color={violetTheme.colors.muted} 
        />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Language</Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Ionicons name="close" size={24} color={violetTheme.colors.muted} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={languages}
              renderItem={renderLanguageItem}
              keyExtractor={(item) => item.code}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: violetTheme.colors.violet50,
    paddingHorizontal: violetTheme.spacing.sm,
    paddingVertical: violetTheme.spacing.xs,
    borderRadius: violetTheme.borderRadius.md,
    borderWidth: 1,
    borderColor: violetTheme.colors.violet200,
  },
  flagText: {
    fontSize: 18,
    marginRight: violetTheme.spacing.xs,
  },
  triggerText: {
    fontSize: 14,
    fontWeight: '600',
    color: violetTheme.colors.primary,
    marginRight: violetTheme.spacing.xs,
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
    padding: violetTheme.spacing.lg,
    width: '80%',
    maxHeight: '60%',
    elevation: 5,
    shadowColor: violetTheme.colors.foreground,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: violetTheme.spacing.md,
    paddingBottom: violetTheme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: violetTheme.colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: violetTheme.colors.foreground,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: violetTheme.spacing.md,
    paddingHorizontal: violetTheme.spacing.sm,
    borderRadius: violetTheme.borderRadius.md,
    marginBottom: violetTheme.spacing.xs,
  },
  selectedLanguage: {
    backgroundColor: violetTheme.colors.violet50,
    borderWidth: 1,
    borderColor: violetTheme.colors.violet200,
  },
  languageName: {
    flex: 1,
    fontSize: 16,
    color: violetTheme.colors.foreground,
    marginLeft: violetTheme.spacing.sm,
  },
  selectedLanguageText: {
    color: violetTheme.colors.primary,
    fontWeight: '600',
  },
});

export default LanguageSwitcher;
