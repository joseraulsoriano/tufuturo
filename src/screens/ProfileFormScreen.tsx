import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { violetTheme } from '../theme/colors';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import * as Location from 'expo-location';
import { useAuth } from '../context/AuthContext';
import { useOnboarding } from '../context/OnboardingContext';

const ProfileFormScreen: React.FC = () => {
  const { user } = useAuth();
  const { setProfile, setProfileCompleted, location, setLocation } = useOnboarding();
  const [fullName, setFullName] = useState<string>(user?.name || '');
  const [email] = useState<string>(user?.email || '');
  const [education, setEducation] = useState<string>('');
  const [birthYear, setBirthYear] = useState<string>('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [loc, setLoc] = useState<string>(location || '');
  const [disabilities, setDisabilities] = useState<string[]>([]);
  const [sectors, setSectors] = useState<string[]>([]);
  const [generalInterests, setGeneralInterests] = useState<string[]>([]);
  const [zone, setZone] = useState<'local' | 'external'>('local');

  const getCurrentLocation = async () => {
    try {
      setIsLoadingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso de ubicación', 'Activa el acceso a ubicación para detectar ciudad y país.');
        return;
      }
      const current = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const rev = await Location.reverseGeocodeAsync({ latitude: current.coords.latitude, longitude: current.coords.longitude });
      if (rev.length > 0) {
        const a = rev[0];
        const city = a.city || a.subregion || a.region || '';
        const country = a.country || '';
        const s = [city, country].filter(Boolean).join(', ');
        setLoc(s);
      }
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const onSave = async () => {
    if (!fullName || !email) {
      Alert.alert('Faltan datos', 'Completa tu nombre.');
      return;
    }
    await setProfile({ name: fullName, email, education, birthYear, disabilities, sectors, interests: generalInterests, zonePreference: zone });
    await setLocation(loc);
    await setProfileCompleted(true);
    Alert.alert('Listo', 'Tu perfil básico fue guardado. Ahora completa tus aptitudes.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.step}>Paso 1 de 2</Text>
          <Text style={styles.title}>Tu información básica</Text>
          <Text style={styles.subtitle}>Estos datos ayudan a personalizar recomendaciones.</Text>
        </View>

        <Input
          label="Nombre completo"
          placeholder="Tu nombre"
          value={fullName}
          onChangeText={setFullName}
          leftIcon={<Ionicons name="person" size={20} color={violetTheme.colors.muted} />}
        />

        <View style={{ height: 10 }} />
        <Input
          label="Email"
          placeholder="email"
          value={email}
          editable={false}
          leftIcon={<Ionicons name="mail" size={20} color={violetTheme.colors.muted} />}
        />

        <View style={{ height: 10 }} />
        <Input
          label="Nivel educativo"
          placeholder="Ej. Licenciatura"
          value={education}
          onChangeText={setEducation}
          leftIcon={<Ionicons name="school" size={20} color={violetTheme.colors.muted} />}
        />

        <View style={{ height: 10 }} />
        <Input
          label="Año de nacimiento"
          placeholder="1998"
          value={birthYear}
          onChangeText={setBirthYear}
          keyboardType="number-pad"
          leftIcon={<Ionicons name="calendar" size={20} color={violetTheme.colors.muted} />}
        />

        <View style={{ height: 10 }} />
        <Input
          label="Ubicación"
          placeholder="Ciudad, País"
          value={loc}
          onChangeText={setLoc}
          leftIcon={<Ionicons name="location" size={20} color={violetTheme.colors.muted} />}
          rightIcon={
            <TouchableOpacity onPress={getCurrentLocation} disabled={isLoadingLocation}>
              {isLoadingLocation ? (
                <ActivityIndicator size="small" color={violetTheme.colors.primary} />
              ) : (
                <Ionicons name="navigate" size={20} color={violetTheme.colors.primary} />
              )}
            </TouchableOpacity>
          }
        />

        <View style={{ height: 16 }} />
        <Text style={{ color: violetTheme.colors.muted, fontWeight: '600', marginBottom: 6 }}>Ubicación</Text>
        <Button variant="default" size="lg" onPress={onSave}>
          <Ionicons name="save" size={20} color={violetTheme.colors.primaryForeground} />
          <Text style={{ marginLeft: 8, color: violetTheme.colors.primaryForeground, fontWeight: '600' }}>Guardar y continuar</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: violetTheme.colors.background },
  scroll: { flex: 1, padding: violetTheme.spacing.md },
  header: { marginBottom: violetTheme.spacing.md },
  step: { color: violetTheme.colors.muted, fontWeight: '600', marginBottom: 4 },
  title: { fontSize: 22, fontWeight: '700', color: violetTheme.colors.foreground },
  subtitle: { color: violetTheme.colors.muted },
});

export default ProfileFormScreen;


