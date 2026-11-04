// Reconnaissance vocale du navigateur (API Web Speech), partagée par la dictée
// des avis et la recherche vocale. Absente de Firefox : les boutons micro se masquent.

export type RecognitionResult = { isFinal: boolean; 0: { transcript: string } };
export type RecognitionEvent = { resultIndex: number; results: ArrayLike<RecognitionResult> };
export type Recognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: RecognitionEvent) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};
type RecognitionCtor = new () => Recognition;

export function getRecognitionCtor(): RecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export const SPEECH_ERRORS: Record<string, string> = {
  "not-allowed": "Le micro est bloqué. Autorisez-le dans les réglages du navigateur, puis réessayez.",
  "service-not-allowed": "Le micro est bloqué. Autorisez-le dans les réglages du navigateur, puis réessayez.",
  "audio-capture": "Aucun micro détecté sur cet appareil.",
  "no-speech": "Aucune voix détectée. Touchez le micro et parlez près du téléphone.",
  network: "La dictée a besoin d'une connexion internet. Vérifiez votre connexion et réessayez.",
};
