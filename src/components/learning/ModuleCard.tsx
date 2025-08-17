import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { violetTheme } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  title: string;
  objectives: string[];
  topics: string[];
  timeHours: number;
  resources: { title: string; url: string }[];
}

const ModuleCard: React.FC<Props> = ({ title, objectives, topics, timeHours, resources }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.meta}>{timeHours} h estimadas</Text>
      <Text style={styles.section}>Objetivos</Text>
      {objectives.map((o, i) => (
        <Text key={i} style={styles.item}>• {o}</Text>
      ))}
      <Text style={styles.section}>Temas</Text>
      {topics.map((t, i) => (
        <Text key={i} style={styles.item}>• {t}</Text>
      ))}
      <Text style={styles.section}>Recursos</Text>
      {resources.map((r, i) => (
        <TouchableOpacity key={i} onPress={() => Linking.openURL(r.url)} style={styles.linkRow}>
          <Ionicons name="open-outline" size={16} color={violetTheme.colors.primary} />
          <Text style={styles.link}>{r.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderColor: violetTheme.colors.border, borderRadius: violetTheme.borderRadius.md, padding: violetTheme.spacing.md, marginBottom: violetTheme.spacing.md, backgroundColor: violetTheme.colors.card },
  title: { fontSize: 16, fontWeight: '700', color: violetTheme.colors.foreground },
  meta: { fontSize: 12, color: violetTheme.colors.muted, marginBottom: 8 },
  section: { marginTop: 6, fontWeight: '700', color: violetTheme.colors.foreground },
  item: { color: violetTheme.colors.foreground, marginLeft: 6, marginTop: 2 },
  linkRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  link: { color: violetTheme.colors.primary, marginLeft: 6 },
});

export default ModuleCard;


