import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as Speech from 'expo-speech';

type Recognition = any;

export interface UseVoiceAssistantOptions {
  language?: string; // e.g., 'es-MX'
}

export function useVoiceAssistant(options?: UseVoiceAssistantOptions) {
  const language = options?.language || 'es-MX';
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<Recognition | null>(null);

  const supportsListening = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const W: any = window as any;
    return !!(W.SpeechRecognition || W.webkitSpeechRecognition);
  }, []);

  const speak = useCallback((text: string) => {
    if (!text) return;
    try {
      Speech.stop();
      setIsSpeaking(true);
      Speech.speak(text, {
        language,
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    } catch (_e) {
      setIsSpeaking(false);
    }
  }, [language]);

  const stop = useCallback(() => {
    try { Speech.stop(); } catch {}
    setIsSpeaking(false);
  }, []);

  const listenOnce = useCallback(async (): Promise<string | null> => {
    if (!supportsListening) return null;
    return new Promise((resolve) => {
      try {
        const W: any = window as any;
        const Rec = W.SpeechRecognition || W.webkitSpeechRecognition;
        const rec: any = new Rec();
        recognitionRef.current = rec;
        rec.lang = language;
        rec.maxAlternatives = 3;
        rec.interimResults = false;
        setIsListening(true);
        rec.onresult = (event: any) => {
          const transcript = event?.results?.[0]?.[0]?.transcript as string;
          setIsListening(false);
          resolve(transcript || '');
        };
        rec.onerror = () => { setIsListening(false); resolve(''); };
        rec.onend = () => { setIsListening(false); };
        rec.start();
      } catch (_e) {
        setIsListening(false);
        resolve(null);
      }
    });
  }, [language, supportsListening]);

  useEffect(() => () => { try { Speech.stop(); } catch {} }, []);

  return { speak, stop, isSpeaking, listenOnce, isListening, supportsListening };
}

export default useVoiceAssistant;


