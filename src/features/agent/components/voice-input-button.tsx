"use client";

import * as React from "react";
import { Mic, MicOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { AppButton } from "@/components/shared/app-button";

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult:
    | ((event: {
        results: ArrayLike<ArrayLike<{ transcript: string }>>;
      }) => void)
    | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

function getSpeechRecognitionCtor():
  | (new () => SpeechRecognitionLike)
  | undefined {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition;
}

export function VoiceInputButton({
  onTranscript,
  disabled,
}: {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}) {
  const t = useTranslations("agent");
  const [listening, setListening] = React.useState(false);
  const supported = React.useSyncExternalStore(
    () => () => undefined,
    () => Boolean(getSpeechRecognitionCtor()),
    () => false,
  );
  const recognitionRef = React.useRef<SpeechRecognitionLike | null>(null);
  const onTranscriptRef = React.useRef(onTranscript);

  React.useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  React.useEffect(() => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) return;

    const recognition = new Ctor();
    recognition.lang = "tr-TR";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (transcript) onTranscriptRef.current(transcript);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;

    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
    };
  }, []);

  function toggle() {
    if (!supported || !recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }
    recognitionRef.current.start();
    setListening(true);
  }

  return (
    <AppButton
      type="button"
      variant={listening ? "primary" : "secondary"}
      size="icon"
      disabled={disabled || !supported}
      aria-label={supported ? t("voice") : t("voiceUnsupported")}
      title={
        supported
          ? listening
            ? t("voiceListening")
            : t("voice")
          : t("voiceUnsupported")
      }
      onClick={toggle}
    >
      {listening ? <MicOff className="size-4" /> : <Mic className="size-4" />}
    </AppButton>
  );
}
