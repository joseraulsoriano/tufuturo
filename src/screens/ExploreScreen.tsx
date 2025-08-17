import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { violetTheme } from '../theme/colors';
import { useOnboarding } from '../context/OnboardingContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Ionicons } from '@expo/vector-icons';
import mcp, { extractResultsArray, normalizeVolunteerOpportunity, normalizeJobs } from '../services/mcp';
import ModuleCard from '../components/learning/ModuleCard';
import GeminiService from '../services/gemini';
import Input from '../components/ui/Input';
import GeminiStatusButton from '../components/learning/GeminiStatusButton';

const ExploreScreen: React.FC = () => {
  const { volunteerPlan, riasecTop, location, learningPlan, setLearningPlan, setVolunteerPlan, setLocation } = useOnboarding();
  const [jobs, setJobs] = useState<any[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [vols, setVols] = useState<any[]>([]);
  const [volsLoading, setVolsLoading] = useState(false);
  const [onlyLinkedIn, setOnlyLinkedIn] = useState(false);
  const [learning, setLearning] = useState<{ track: string; modules: any[] } | null>(null);
  const [edu, setEdu] = useState<{ title: string; url: string; snippet?: string }[]>([]);
  const [eduLoading, setEduLoading] = useState(false);
  const [studyLoading, setStudyLoading] = useState(false);
  const [kwChips, setKwChips] = useState<{ label: string; selected: boolean }[]>([]);
  const [locInput, setLocInput] = useState<string>(location || '');

  const loadVolunteer = async () => {
    setVolsLoading(true);
    try {
      const filters: any = { location: 'cdmx' };
      if (volunteerPlan?.categories?.length) filters.career = volunteerPlan.categories;
      if (volunteerPlan?.suggestedKeywords?.length) filters.keywords = volunteerPlan.suggestedKeywords;
      const resp = await mcp.volunteer.mxSearch({ filters });
      const arr = extractResultsArray(resp).map((x: any, i: number) => normalizeVolunteerOpportunity(x, i));
      setVols(arr);
    } catch (e) {
      setVols([]);
    } finally {
      setVolsLoading(false);
    }
  };

  const loadJobs = async () => {
    setJobsLoading(true);
    try {
      const inferredRole = (() => {
        const top = (riasecTop || []).join('');
        if (/IA|AI|I|A/.test(top)) return 'developer data analytics diseño';
        if (/S/.test(top)) return 'orientador educación salud social';
        if (/E/.test(top)) return 'project manager marketing ventas';
        if (/R/.test(top)) return 'operaciones logística mantenimiento';
        if (/C/.test(top)) return 'administrativo finanzas contabilidad';
        return 'analista';
      })();
      const query = [inferredRole, ...(volunteerPlan?.suggestedKeywords || []), 'remoto', location || 'CDMX']
        .filter(Boolean)
        .join(' ');
      const resp = await mcp.jobs.search({
        query,
        location: location || 'CDMX',
        career: volunteerPlan?.categories?.[0] || undefined,
        topK: 8,
      });
      let { items } = normalizeJobs(resp);
      if (onlyLinkedIn) items = items.filter((j: any) => (j.link || '').includes('linkedin.com/jobs'));
      setJobs(items);
    } catch {
      setJobs([]);
    } finally {
      setJobsLoading(false);
    }
  };

  useEffect(() => {
    // preload from stored plan if available
    if (learningPlan && !learning) setLearning(learningPlan);
    if (learningPlan && (edu.length === 0)) {
      loadEducation(volunteerPlan?.suggestedKeywords || []);
    }
    loadJobs();
    loadVolunteer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlyLinkedIn]);

  const loadEducation = async (keywords: string[], customLocation?: string) => {
    setEduLoading(true);
    try {
      const q = [keywords.join(' '), 'programa curso certificación', (customLocation || location || 'México')].filter(Boolean).join(' ');
      const resp = await mcp.education.search({ query: q, topK: 6 });
      const arr = extractResultsArray(resp).map((r: any) => ({ title: r.title || r.name, url: r.url, snippet: r.snippet }));
      setEdu(arr);
    } catch {
      setEdu([]);
    } finally {
      setEduLoading(false);
    }
  };

  // Initialize keyword chips from plan
  useEffect(() => {
    const initial = (volunteerPlan?.suggestedKeywords || []).map((k: string) => ({ label: k, selected: true }));
    setKwChips(initial);
  }, [volunteerPlan?.suggestedKeywords]);

  // Debounce updates for education search when keywords/location change
  useEffect(() => {
    const t = setTimeout(() => {
      const selected = kwChips.filter(c => c.selected).map(c => c.label);
      loadEducation(selected, locInput);
      // Persist to context
      setVolunteerPlan({ categories: volunteerPlan?.categories || [], suggestedKeywords: selected, rationale: volunteerPlan?.rationale });
      setLocation(locInput);
    }, 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kwChips, locInput]);

  return (
    <ScrollView style={styles.container}>
      {/* 1. Study */}
        <Card style={styles.card}>
          <CardHeader>
            <CardTitle>Study offers</CardTitle>
            <CardDescription>Programs and courses based on your interests</CardDescription>
          </CardHeader>
          <CardContent>
            <View style={{ marginBottom: 8 }}>
              <GeminiStatusButton />
            </View>
            {!learning && (
              <>
                <Text style={styles.placeholder}>Genera un plan de introducción con IA según tu perfil.</Text>
                <View style={{ height: 8 }} />
                <Button
                  variant="default"
                  onPress={async () => {
                    setStudyLoading(true);
                    try {
                      const goal = (() => {
                        const cats = volunteerPlan?.categories || [];
                        if (cats.includes('ti') || /IA|AI|I|A/.test((riasecTop||[]).join(''))) return 'licenciatura en matemáticas y computación (intro)';
                        if (cats.includes('salud') || (riasecTop||[]).includes('S')) return 'ciencias de la salud (intro)';
                        if (cats.includes('ambiental') || (riasecTop||[]).includes('R')) return 'ingeniería ambiental (intro)';
                        if (cats.includes('social') || (riasecTop||[]).includes('S')) return 'ciencias sociales y educación (intro)';
                        return 'matemáticas aplicadas (intro)';
                      })();
                      const plan = await GeminiService.generateLearningPlan({
                        goal,
                        riasecScores: riasec || { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 },
                        topDimensions: riasecTop || [],
                        interests: volunteerPlan?.suggestedKeywords || [],
                        suggestedKeywords: volunteerPlan?.suggestedKeywords || [],
                      });
                      setLearning(plan);
                      await setLearningPlan(plan);
                      await loadEducation(volunteerPlan?.suggestedKeywords || []);
                    } catch { setLearning(null); } finally { setStudyLoading(false); }
                  }}
                  loading={studyLoading}
                >
                  Generar plan introductorio
                </Button>
              </>
            )}
            {learning && (
              <>
                <Text style={{ fontWeight: '700', color: violetTheme.colors.foreground, marginBottom: 8 }}>{learning.track}</Text>
                {learning.modules.map((m: any, i: number) => (
                  <ModuleCard
                    key={i}
                    title={m.title}
                    objectives={m.objectives || []}
                    topics={m.topics || []}
                    timeHours={m.time_hours || 8}
                    resources={(m.resources || []).slice(0, 4)}
                  />
                ))}
              </>
            )}
          </CardContent>
        </Card>

      {/* 2. Lessons (from plan) */}
      {learning && (
        <Card style={styles.card}>
          <CardHeader>
            <CardTitle>Lessons</CardTitle>
            <CardDescription>Start with the next modules in your plan</CardDescription>
          </CardHeader>
          <CardContent>
            {learning.modules.slice(0, 2).map((m: any, i: number) => (
              <ModuleCard
                key={i}
                title={m.title}
                objectives={m.objectives || []}
                topics={m.topics || []}
                timeHours={m.time_hours || 8}
                resources={(m.resources || []).slice(0, 3)}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* 3. Jobs */}
        <Card style={styles.card}>
          <CardHeader>
            <CardTitle>Job offers</CardTitle>
            <CardDescription>Curated roles aligned to your profile</CardDescription>
          </CardHeader>
          <CardContent>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
              <TouchableOpacity
                onPress={() => { setOnlyLinkedIn(v => !v); }}
                style={[styles.tab, onlyLinkedIn && styles.tabActive]}
              >
                <Ionicons name="logo-linkedin" size={16} color={onlyLinkedIn ? violetTheme.colors.primaryForeground : violetTheme.colors.primary} />
                <Text style={[styles.tabText, onlyLinkedIn && styles.tabTextActive]}>Solo LinkedIn</Text>
              </TouchableOpacity>
            </View>
            {jobsLoading && <Text style={styles.placeholder}>Cargando...</Text>}
            {!jobsLoading && jobs.map((job: any, idx: number) => (
              <View key={idx} style={styles.item}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{job.title}</Text>
                </View>
                {!!job.org && <Text style={styles.itemOrg}>{job.org}</Text>}
                {!!job.location && <Text style={styles.itemMeta}>{job.location}</Text>}
                {!!job.snippet && <Text style={styles.itemDesc}>{job.snippet}</Text>}
                <Button variant="outline" onPress={() => Linking.openURL(job.link)}>
                  <Ionicons name="open-outline" size={16} color={violetTheme.colors.primary} />
                  <Text style={{ marginLeft: 6, color: violetTheme.colors.primary }}>Open</Text>
                </Button>
              </View>
            ))}
          </CardContent>
        </Card>
      
      {/* 4. Volunteer */}
        <Card style={styles.card}>
          <CardHeader>
            <CardTitle>Volunteer opportunities</CardTitle>
            <CardDescription>Personalized with your categories</CardDescription>
          </CardHeader>
          <CardContent>
            {volsLoading && <Text style={styles.placeholder}>Cargando...</Text>}
            {!volsLoading && vols.map(op => (
              <View key={op.id} style={styles.item}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{op.title}</Text>
                  <Text style={styles.itemType}>{op.type}</Text>
                </View>
                <Text style={styles.itemOrg}>{op.organization}</Text>
                <Text style={styles.itemMeta}>{op.location} · {op.duration}</Text>
                <Text style={styles.itemDesc}>{op.description}</Text>
                <Button variant="outline" onPress={() => Linking.openURL(op.applicationLink)}>
                  <Ionicons name="open-outline" size={16} color={violetTheme.colors.primary} />
                  <Text style={{ marginLeft: 6, color: violetTheme.colors.primary }}>Apply</Text>
                </Button>
              </View>
            ))}
          </CardContent>
        </Card>
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: violetTheme.colors.background, padding: violetTheme.spacing.md },
  tabs: { flexDirection: 'row', gap: 8, marginBottom: violetTheme.spacing.md },
  tab: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: violetTheme.colors.violet200, backgroundColor: violetTheme.colors.violet50, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  tabActive: { backgroundColor: violetTheme.colors.primary, borderColor: violetTheme.colors.primary },
  tabText: { color: violetTheme.colors.primary, fontWeight: '600' },
  tabTextActive: { color: violetTheme.colors.primaryForeground },
  card: { marginBottom: violetTheme.spacing.lg },
  placeholder: { color: violetTheme.colors.muted },
  item: { borderWidth: 1, borderColor: violetTheme.colors.border, borderRadius: violetTheme.borderRadius.md, padding: violetTheme.spacing.md, marginBottom: violetTheme.spacing.md },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemTitle: { fontSize: 16, fontWeight: '700', color: violetTheme.colors.foreground },
  itemType: { fontSize: 12, fontWeight: '700', color: violetTheme.colors.primary, backgroundColor: violetTheme.colors.violet50, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  itemOrg: { color: violetTheme.colors.muted, marginTop: 2 },
  itemMeta: { color: violetTheme.colors.muted, marginTop: 4, fontSize: 12 },
  itemDesc: { color: violetTheme.colors.foreground, marginVertical: 8 },
});

export default ExploreScreen;


