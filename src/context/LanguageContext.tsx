import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation data
const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.login': 'Login',
    'nav.form': 'Assessment',
    'nav.results': 'Results',
    
    // Home Screen
    'home.welcome': 'Welcome to Your Future',
    'home.subtitle': 'Discover your career path with AI-powered insights',
    'home.stats.title': 'Your Progress',
    'home.stats.assessments': 'Assessments',
    'home.stats.recommendations': 'Recommendations',
    'home.stats.saved': 'Saved',
    'home.quickActions.title': 'Quick Actions',
    'home.quickActions.newAssessment': 'New Assessment',
    'home.quickActions.viewResults': 'View Results',
    'home.quickActions.settings': 'Settings',
    'home.volunteer.title': 'Volunteer Opportunities',
    'home.volunteer.subtitle': 'Make a difference in your community',
    'home.volunteer.apply': 'Apply Now',
    
    // Login Screen
    'login.title': 'Welcome Back',
    'login.subtitle': 'Sign in to continue your journey',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.forgotPassword': 'Forgot Password?',
    'login.signIn': 'Sign In',
    'login.or': 'or',
    'login.google': 'Continue with Google',
    'login.apple': 'Continue with Apple',
    'login.noAccount': "Don't have an account?",
    'login.signUp': 'Sign Up',
    
    // Form Screen
    'form.title': 'Career Assessment',
    'form.subtitle': 'Help us understand your career profile',
    'form.professional.title': 'Professional Information',
    'form.professional.currentRole': 'Current Role',
    'form.professional.currentRolePlaceholder': 'e.g., Student, Developer, Manager',
    'form.professional.experience': 'Years of Experience',
    'form.professional.experiencePlaceholder': 'e.g., 2 years, 5+ years',
    'form.professional.education': 'Education Level',
    'form.professional.educationPlaceholder': 'e.g., High School, Bachelor\'s, Master\'s',
    'form.skills.title': 'Skills & Interests',
    'form.skills.skills': 'Key Skills',
    'form.skills.skillsPlaceholder': 'e.g., Programming, Communication, Leadership',
    'form.skills.interests': 'Career Interests',
    'form.skills.interestsPlaceholder': 'e.g., Technology, Healthcare, Business',
    'form.workStyle.title': 'Work Style & Goals',
    'form.workStyle.workStyle': 'Preferred Work Style',
    'form.workStyle.workStylePlaceholder': 'e.g., Team-based, Independent, Remote',
    'form.workStyle.goals': 'Career Goals',
    'form.workStyle.goalsPlaceholder': 'e.g., Leadership role, Technical expertise, Entrepreneurship',
    'form.submit': 'Get Career Recommendations',
    
    // Results Screen
    'results.title': 'Your Career Matches',
    'results.subtitle': 'Most compatible careers for you',
    'results.filter.all': 'All',
    'results.filter.high': 'High Match',
    'results.filter.nearby': 'Nearby',
    'results.count': 'career recommendations',
    'results.basedOn': 'Based on your career assessment profile',
    'results.growth': 'High growth potential with excellent salary progression.',
    'results.explore': 'Explore',
    'results.loadMore': 'Discover More Careers',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.close': 'Close',
  },
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.login': 'Iniciar Sesión',
    'nav.form': 'Evaluación',
    'nav.results': 'Resultados',
    
    // Home Screen
    'home.welcome': 'Bienvenido a Tu Futuro',
    'home.subtitle': 'Descubre tu camino profesional con insights impulsados por IA',
    'home.stats.title': 'Tu Progreso',
    'home.stats.assessments': 'Evaluaciones',
    'home.stats.recommendations': 'Recomendaciones',
    'home.stats.saved': 'Guardados',
    'home.quickActions.title': 'Acciones Rápidas',
    'home.quickActions.newAssessment': 'Nueva Evaluación',
    'home.quickActions.viewResults': 'Ver Resultados',
    'home.quickActions.settings': 'Configuración',
    'home.volunteer.title': 'Oportunidades de Voluntariado',
    'home.volunteer.subtitle': 'Haz la diferencia en tu comunidad',
    'home.volunteer.apply': 'Aplicar Ahora',
    
    // Login Screen
    'login.title': 'Bienvenido de Vuelta',
    'login.subtitle': 'Inicia sesión para continuar tu viaje',
    'login.email': 'Correo Electrónico',
    'login.password': 'Contraseña',
    'login.forgotPassword': '¿Olvidaste tu contraseña?',
    'login.signIn': 'Iniciar Sesión',
    'login.or': 'o',
    'login.google': 'Continuar con Google',
    'login.apple': 'Continuar con Apple',
    'login.noAccount': '¿No tienes una cuenta?',
    'login.signUp': 'Registrarse',
    
    // Form Screen
    'form.title': 'Evaluación de Carrera',
    'form.subtitle': 'Ayúdanos a entender tu perfil profesional',
    'form.professional.title': 'Información Profesional',
    'form.professional.currentRole': 'Rol Actual',
    'form.professional.currentRolePlaceholder': 'ej., Estudiante, Desarrollador, Gerente',
    'form.professional.experience': 'Años de Experiencia',
    'form.professional.experiencePlaceholder': 'ej., 2 años, 5+ años',
    'form.professional.education': 'Nivel de Educación',
    'form.professional.educationPlaceholder': 'ej., Secundaria, Licenciatura, Maestría',
    'form.skills.title': 'Habilidades e Intereses',
    'form.skills.skills': 'Habilidades Clave',
    'form.skills.skillsPlaceholder': 'ej., Programación, Comunicación, Liderazgo',
    'form.skills.interests': 'Intereses Profesionales',
    'form.skills.interestsPlaceholder': 'ej., Tecnología, Salud, Negocios',
    'form.workStyle.title': 'Estilo de Trabajo y Metas',
    'form.workStyle.workStyle': 'Estilo de Trabajo Preferido',
    'form.workStyle.workStylePlaceholder': 'ej., En equipo, Independiente, Remoto',
    'form.workStyle.goals': 'Metas Profesionales',
    'form.workStyle.goalsPlaceholder': 'ej., Rol de liderazgo, Experticia técnica, Emprendimiento',
    'form.submit': 'Obtener Recomendaciones de Carrera',
    
    // Results Screen
    'results.title': 'Tus Coincidencias de Carrera',
    'results.subtitle': 'Las carreras más compatibles para ti',
    'results.filter.all': 'Todas',
    'results.filter.high': 'Alta Coincidencia',
    'results.filter.nearby': 'Cercanas',
    'results.count': 'recomendaciones de carrera',
    'results.basedOn': 'Basado en tu perfil de evaluación profesional',
    'results.growth': 'Alto potencial de crecimiento con excelente progresión salarial.',
    'results.explore': 'Explorar',
    'results.loadMore': 'Descubrir Más Carreras',
    
    // Common
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.cancel': 'Cancelar',
    'common.save': 'Guardar',
    'common.edit': 'Editar',
    'common.delete': 'Eliminar',
    'common.yes': 'Sí',
    'common.no': 'No',
    'common.close': 'Cerrar',
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
