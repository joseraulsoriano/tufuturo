import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker, Callout, Region } from 'react-native-maps';
import { violetTheme } from '../theme/colors';

type School = {
  name: string;
  type: string; // 'publica' | 'privada' | others
  position: { lat: number; lng: number };
  state?: string;
};

const API_URL = 'https://example.com/api/schools'; // Replace with your real endpoint

const sampleData: Record<string, School[]> = {
  // Minimal sample to ensure the screen renders if API is unavailable
  Mexico: [
    {
      name: 'Universidad Nacional Autónoma de México',
      type: 'publica',
      position: { lat: 19.3221533, lng: -99.1881455 },
    },
    {
      name: 'Tecnológico de Monterrey (Campus CDMX)',
      type: 'privada',
      position: { lat: 19.3622459, lng: -99.2623803 },
    },
  ],
};

function flattenSchoolsResponse(data: Record<string, any>): School[] {
  const flattened: School[] = [];
  if (!data || typeof data !== 'object') return flattened;
  Object.keys(data).forEach((stateName) => {
    const schools = Array.isArray(data[stateName]) ? data[stateName] : [];
    for (const school of schools) {
      if (!school || !school.position) continue;
      flattened.push({
        name: school.name,
        type: school.type,
        position: { lat: Number(school.position.lat), lng: Number(school.position.lng) },
        state: stateName,
      });
    }
  });
  return flattened;
}

const defaultRegion: Region = {
  latitude: 23.6345, // Mexico center approx
  longitude: -102.5528,
  latitudeDelta: 20,
  longitudeDelta: 20,
};

const SchoolsMapScreen: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const fetchSchools = async () => {
      try {
        const response = await fetch(API_URL, { headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const json = await response.json();
        const flattened = flattenSchoolsResponse(json);
        if (isMounted) setSchools(flattened);
      } catch (error) {
        console.log('Failed to load schools from API. Using sample data.', error);
        if (isMounted) setSchools(flattenSchoolsResponse(sampleData as any));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchSchools();
    return () => {
      isMounted = false;
    };
  }, []);

  const initialRegion: Region = useMemo(() => {
    if (!schools.length) return defaultRegion;
    const lat = schools.reduce((sum, s) => sum + s.position.lat, 0) / schools.length;
    const lng = schools.reduce((sum, s) => sum + s.position.lng, 0) / schools.length;
    return {
      latitude: lat,
      longitude: lng,
      latitudeDelta: 8,
      longitudeDelta: 8,
    };
  }, [schools]);

  const getPinColor = (type: string | undefined): string => {
    if (!type) return violetTheme.colors.primary;
    const normalized = type.toLowerCase();
    if (normalized === 'publica') return violetTheme.colors.primary;
    if (normalized === 'privada') return violetTheme.colors.violet700;
    return violetTheme.colors.primary;
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={violetTheme.colors.primary} />
          <Text style={styles.loaderText}>Loading map…</Text>
        </View>
      ) : (
        <View style={styles.mapWrapper}>
          <MapView style={styles.map} initialRegion={initialRegion}>
            {schools.map((school, index) => (
              <Marker
                key={`${school.name}-${index}`}
                coordinate={{ latitude: school.position.lat, longitude: school.position.lng }}
                title={school.name}
                pinColor={getPinColor(school.type)}
              >
                <Callout>
                  <View style={styles.callout}>
                    <Text style={styles.calloutTitle}>{school.name}</Text>
                    <Text style={styles.calloutSubtitle}>
                      {school.type ? school.type.charAt(0).toUpperCase() + school.type.slice(1) : ''}
                      {school.state ? ` • ${school.state}` : ''}
                    </Text>
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>

          <View style={styles.legend}>
            <Text style={styles.legendTitle}>Legend</Text>
            <View style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: violetTheme.colors.primary }]} />
              <Text style={styles.legendText}>Pública</Text>
            </View>
            <View style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: violetTheme.colors.violet700 }]} />
              <Text style={styles.legendText}>Privada</Text>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: violetTheme.colors.background,
  },
  mapWrapper: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderText: {
    marginTop: 8,
    color: violetTheme.colors.muted,
  },
  callout: {
    minWidth: 180,
  },
  calloutTitle: {
    fontWeight: '700',
    color: violetTheme.colors.foreground,
    marginBottom: 2,
  },
  calloutSubtitle: {
    color: violetTheme.colors.muted,
  },
  legend: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: violetTheme.colors.background,
    borderRadius: 12,
    padding: 12,
    shadowColor: violetTheme.shadows.md.shadowColor,
    shadowOffset: violetTheme.shadows.md.shadowOffset,
    shadowOpacity: violetTheme.shadows.md.shadowOpacity,
    shadowRadius: violetTheme.shadows.md.shadowRadius,
    elevation: violetTheme.shadows.md.elevation,
  },
  legendTitle: {
    fontWeight: '600',
    marginBottom: 6,
    color: violetTheme.colors.foreground,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    color: violetTheme.colors.foreground,
  },
});

export default SchoolsMapScreen;


