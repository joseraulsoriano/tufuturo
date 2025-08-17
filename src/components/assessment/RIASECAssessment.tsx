import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { violetTheme } from '../../theme/colors';
import Button from '../ui/Button';
import { Ionicons } from '@expo/vector-icons';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';

type Dimension = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

interface QuestionItem {
  id: string;
  text: string;
  dim: Dimension;
}

export interface RiasecScores {
  R: number; I: number; A: number; S: number; E: number; C: number;
}

interface Props {
  onComplete?: (
    scores: RiasecScores,
    topDimensions: Dimension[],
    answered: {
      interests: { id: string; text: string; value: number; label: string; dim: Dimension }[];
      skills: { id: string; text: string; value: number; label: string; dim: Dimension }[];
      values: { id: string; text: string; value: number; label: string; dim: Dimension }[];
    }
  ) => void;
}

const interestsScale = [
  { label: 'Me disgusta', value: 1 },
  { label: 'No me gusta', value: 2 },
  { label: 'Neutral', value: 3 },
  { label: 'Me gusta', value: 4 },
  { label: 'Me encanta', value: 5 },
];

const skillsScale = [
  { label: 'Malo', value: 1 },
  { label: 'Regular', value: 2 },
  { label: 'Bueno', value: 3 },
  { label: 'Muy bueno', value: 4 },
];

const valuesScale = [
  { label: 'Nada', value: 1 },
  { label: 'Poco', value: 2 },
  { label: 'Importante', value: 3 },
  { label: 'Muy importante', value: 4 },
];

const interests: QuestionItem[] = [
  { id: 'i1', text: 'Resolver problemas matemáticos o lógicos.', dim: 'I' },
  { id: 'i2', text: 'Escribir, leer o comunicar ideas.', dim: 'A' },
  { id: 'i3', text: 'Dibujar, diseñar o crear cosas artísticas.', dim: 'A' },
  { id: 'i4', text: 'Organizar actividades, eventos o equipos.', dim: 'E' },
  { id: 'i5', text: 'Investigar cómo funcionan las cosas.', dim: 'I' },
  { id: 'i6', text: 'Ayudar a otras personas con sus problemas.', dim: 'S' },
  { id: 'i7', text: 'Trabajar con tecnología y computadoras.', dim: 'I' },
  { id: 'i8', text: 'Estar en contacto con la naturaleza o animales.', dim: 'R' },
  { id: 'i9', text: 'Vender, persuadir o negociar con otros.', dim: 'E' },
];

const skills: QuestionItem[] = [
  { id: 's1', text: 'Explicar temas a otras personas.', dim: 'S' },
  { id: 's2', text: 'Analizar datos o información.', dim: 'I' },
  { id: 's3', text: 'Dibujar, música o arte.', dim: 'A' },
  { id: 's4', text: 'Tomar decisiones rápidas bajo presión.', dim: 'E' },
  { id: 's5', text: 'Liderar o coordinar un equipo.', dim: 'E' },
  { id: 's6', text: 'Aprender nuevas tecnologías.', dim: 'I' },
  { id: 's7', text: 'Reparar o construir cosas manualmente.', dim: 'R' },
];

const valuesQ: QuestionItem[] = [
  { id: 'v1', text: 'Ganar buen sueldo.', dim: 'E' },
  { id: 'v2', text: 'Estabilidad y seguridad laboral.', dim: 'C' },
  { id: 'v3', text: 'Libertad creativa.', dim: 'A' },
  { id: 'v4', text: 'Ayudar a otros y tener impacto social.', dim: 'S' },
  { id: 'v5', text: 'Trabajar con personas.', dim: 'S' },
  { id: 'v6', text: 'Viajar y conocer lugares nuevos.', dim: 'E' },
  { id: 'v7', text: 'Innovar y usar nuevas tecnologías.', dim: 'I' },
  { id: 'v8', text: 'Tener horarios flexibles.', dim: 'A' },
];

const initialScores: RiasecScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

const RIASECAssessment: React.FC<Props> = ({ onComplete }) => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const { speak, listenOnce, isListening, supportsListening } = useVoiceAssistant({ language: 'es-MX' });
  const allQuestions = useMemo(() => ({ interests, skills, valuesQ }), []);

  const setAnswer = (qid: string, val: number) => {
    setAnswers(prev => ({ ...prev, [qid]: val }));
  };

  const computeScores = (): RiasecScores => {
    const scores: RiasecScores = { ...initialScores };

    interests.forEach(q => {
      const v = answers[q.id];
      if (typeof v === 'number') scores[q.dim] += v; // 1..5
    });
    skills.forEach(q => {
      const v = answers[q.id];
      if (typeof v === 'number') scores[q.dim] += v; // 1..4
    });
    valuesQ.forEach(q => {
      const v = answers[q.id];
      if (typeof v === 'number') scores[q.dim] += v; // 1..4
    });

    return scores;
  };

  const result = useMemo(() => computeScores(), [answers]);

  const sortedDims = useMemo(() => {
    return (Object.keys(result) as Dimension[]).sort((a, b) => result[b] - result[a]);
  }, [result]);

  const handleComplete = () => {
    if (onComplete) {
      const answeredInterests = interests
        .filter(q => typeof answers[q.id] === 'number')
        .map(q => ({
          id: q.id,
          text: q.text,
          value: answers[q.id],
          label: interestsScale.find(s => s.value === answers[q.id])?.label || String(answers[q.id]),
          dim: q.dim,
        }));
      const answeredSkills = skills
        .filter(q => typeof answers[q.id] === 'number')
        .map(q => ({
          id: q.id,
          text: q.text,
          value: answers[q.id],
          label: skillsScale.find(s => s.value === answers[q.id])?.label || String(answers[q.id]),
          dim: q.dim,
        }));
      const answeredValues = valuesQ
        .filter(q => typeof answers[q.id] === 'number')
        .map(q => ({
          id: q.id,
          text: q.text,
          value: answers[q.id],
          label: valuesScale.find(s => s.value === answers[q.id])?.label || String(answers[q.id]),
          dim: q.dim,
        }));
      onComplete(result, sortedDims.slice(0, 2), {
        interests: answeredInterests,
        skills: answeredSkills,
        values: answeredValues,
      });
    }
  };

  const renderScale = (qid: string, scale: { label: string; value: number }[]) => (
    <View style={styles.scaleRow}>
      {scale.map(opt => (
        <TouchableOpacity
          key={opt.value}
          style={[styles.scaleChip, answers[qid] === opt.value && styles.scaleChipSelected]}
          onPress={() => setAnswer(qid, opt.value)}
          activeOpacity={0.8}
        >
          <Text style={[styles.scaleChipText, answers[qid] === opt.value && styles.scaleChipTextSelected]}>
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderQuestion = (q: QuestionItem, scale: 'interests' | 'skills' | 'values') => (
    <View key={q.id} style={styles.questionItem}>
      <View style={styles.questionHeader}>
        <Text style={styles.questionText}>{q.text}</Text>
        <View style={styles.qActions}>
          <TouchableOpacity onPress={() => speak(q.text)} style={styles.iconBtn} accessibilityLabel="Leer pregunta">
            <Ionicons name="volume-high" size={18} color={violetTheme.colors.primary} />
          </TouchableOpacity>
          {supportsListening && (
            <TouchableOpacity
              onPress={async () => {
                const said = await listenOnce();
                // Map simple intents
                const normalized = (said || '').toLowerCase();
                const map: Record<string, number> = {
                  'me disgusta': 1,
                  'no me gusta': 2,
                  'neutral': 3,
                  'me gusta': 4,
                  'me encanta': 5,
                  'malo': 1,
                  'regular': 2,
                  'bueno': 3,
                  'muy bueno': 4,
                  'nada': 1,
                  'poco': 2,
                  'importante': 3,
                  'muy importante': 4,
                };
                const val = map[normalized];
                if (val) setAnswer(q.id, val);
              }}
              style={styles.iconBtn}
              accessibilityLabel="Responder por voz"
            >
              <Ionicons name={isListening ? 'mic' : 'mic-outline'} size={18} color={violetTheme.colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {scale === 'interests' && renderScale(q.id, interestsScale)}
      {scale === 'skills' && renderScale(q.id, skillsScale)}
      {scale === 'values' && renderScale(q.id, valuesScale)}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.progressRow}>
        <Text style={styles.progressText}>Progreso: {Object.keys(answers).length} / {interests.length + skills.length + valuesQ.length}</Text>
      </View>
      <Text style={styles.sectionTitle}>Intereses</Text>
      {interests.map(q => renderQuestion(q, 'interests'))}

      <Text style={styles.sectionTitle}>Habilidades percibidas</Text>
      {skills.map(q => renderQuestion(q, 'skills'))}

      <Text style={styles.sectionTitle}>Valores</Text>
      {valuesQ.map(q => renderQuestion(q, 'values'))}

      <View style={styles.resultContainer}>
        <Text style={styles.resultTitle}>Perfil (RIASEC)</Text>
        <View style={styles.bars}>
          {(Object.keys(result) as Dimension[]).map(dim => (
            <View key={dim} style={styles.barRow}>
              <Text style={styles.barLabel}>{dim}</Text>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${Math.min(100, result[dim] * 8)}%` }]} />
              </View>
              <Text style={styles.barValue}>{result[dim]}</Text>
            </View>
          ))}
        </View>
      </View>

      <Button variant="default" size="lg" onPress={handleComplete}>
        Ver resultados y continuar
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: violetTheme.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: violetTheme.colors.primary,
    marginTop: violetTheme.spacing.sm,
  },
  questionItem: {
    borderWidth: 1,
    borderColor: violetTheme.colors.border,
    borderRadius: violetTheme.borderRadius.md,
    padding: violetTheme.spacing.sm,
    backgroundColor: violetTheme.colors.background,
    marginBottom: violetTheme.spacing.sm,
  },
  questionText: {
    fontSize: 14,
    color: violetTheme.colors.foreground,
    marginBottom: violetTheme.spacing.xs,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: violetTheme.spacing.xs,
  },
  qActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: violetTheme.colors.violet50,
    borderWidth: 1,
    borderColor: violetTheme.colors.violet200,
  },
  scaleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  progressRow: {
    alignItems: 'flex-end',
  },
  progressText: {
    fontSize: 12,
    color: violetTheme.colors.muted,
    marginBottom: violetTheme.spacing.xs,
  },
  scaleChip: {
    borderWidth: 1,
    borderColor: violetTheme.colors.border,
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: violetTheme.colors.background,
  },
  scaleChipSelected: {
    borderColor: violetTheme.colors.primary,
    backgroundColor: violetTheme.colors.violet50,
  },
  scaleChipText: {
    fontSize: 12,
    color: violetTheme.colors.foreground,
  },
  scaleChipTextSelected: {
    color: violetTheme.colors.primary,
    fontWeight: '600',
  },
  resultContainer: {
    marginTop: violetTheme.spacing.md,
    padding: violetTheme.spacing.sm,
    borderWidth: 1,
    borderColor: violetTheme.colors.border,
    borderRadius: violetTheme.borderRadius.md,
    backgroundColor: violetTheme.colors.accent,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: violetTheme.spacing.sm,
    color: violetTheme.colors.foreground,
  },
  bars: {
    gap: 8,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  barLabel: {
    width: 18,
    fontWeight: '700',
    color: violetTheme.colors.foreground,
  },
  barTrack: {
    flex: 1,
    height: 8,
    backgroundColor: violetTheme.colors.violet100,
    borderRadius: 4,
  },
  barFill: {
    height: 8,
    backgroundColor: violetTheme.colors.primary,
    borderRadius: 4,
  },
  barValue: {
    width: 28,
    textAlign: 'right',
    color: violetTheme.colors.muted,
    fontSize: 12,
  },
});

export default RIASECAssessment;


