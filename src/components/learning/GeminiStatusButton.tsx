import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../ui/Button';
import { violetTheme } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { pingGemini } from '../../services/gemini';

const GeminiStatusButton: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'checking' | 'ok' | 'fail'>('idle');
  const [reason, setReason] = useState<string>('');

  const check = async () => {
    setStatus('checking');
    const res = await pingGemini();
    if (res.ok) {
      setStatus('ok');
      setReason('');
    } else {
      setStatus('fail');
      setReason(res.reason || 'Unknown');
    }
  };

  return (
    <View style={styles.row}>
      <Button variant="outline" size="sm" onPress={check} loading={status === 'checking'}>
        <Ionicons name="pulse-outline" size={16} color={violetTheme.colors.primary} />
        <Text style={styles.text}>Probar conexión Gemini</Text>
      </Button>
      {status === 'ok' && (
        <View style={styles.badgeOk}>
          <Ionicons name="checkmark-circle" size={16} color={violetTheme.colors.primaryForeground} />
          <Text style={styles.badgeText}>OK</Text>
        </View>
      )}
      {status === 'fail' && (
        <View style={styles.badgeFail}>
          <Ionicons name="alert-circle" size={16} color={violetTheme.colors.primaryForeground} />
          <Text style={styles.badgeText}>Falla</Text>
        </View>
      )}
      {!!reason && <Text style={styles.reason}>{reason}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  text: { marginLeft: 6, color: violetTheme.colors.primary },
  badgeOk: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: violetTheme.colors.success, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeFail: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: violetTheme.colors.danger, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: '#fff', fontWeight: '700' },
  reason: { marginLeft: 8, color: violetTheme.colors.muted, fontSize: 12 },
});

export default GeminiStatusButton;


