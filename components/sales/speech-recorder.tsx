"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SpeechRecorderProps {
  onResult: (text: string) => void;
  disabled?: boolean;
}

export function SpeechRecorder({ onResult, disabled }: SpeechRecorderProps) {
  const [recording, setRecording] = useState(false);
  const [interim, setInterim] = useState("");
  const [supported, setSupported] = useState<boolean | null>(null);
  const interimRef = useRef("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRec = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    setSupported(!!SpeechRec);
  }, []);

  const start = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRec = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    if (!SpeechRec) return;

    const recognition = new SpeechRec();
    recognition.lang = "tr-TR";
    recognition.continuous = false;
    recognition.interimResults = true;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transcript = Array.from(event.results as any[])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((r: any) => r[0].transcript)
        .join("");
      interimRef.current = transcript;
      setInterim(transcript);
    };

    recognition.onend = () => {
      setRecording(false);
      if (interimRef.current) {
        onResult(interimRef.current);
      }
      interimRef.current = "";
      setInterim("");
    };

    recognition.onerror = () => {
      setRecording(false);
      interimRef.current = "";
      setInterim("");
    };

    recognition.start();
    recognitionRef.current = recognition;
    setRecording(true);
  };

  const stop = () => {
    recognitionRef.current?.stop();
  };

  if (supported === false) {
    return (
      <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
        Sesli giriş yalnızca Chrome tarayıcısında desteklenmektedir.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant={recording ? "destructive" : "outline"}
        size="sm"
        onClick={recording ? stop : start}
        disabled={disabled || supported === null}
        className="gap-2"
      >
        {recording ? (
          <>
            <MicOff className="h-4 w-4" />
            Kaydı Durdur
          </>
        ) : (
          <>
            <Mic className="h-4 w-4" />
            Sesli Yanıtla
          </>
        )}
      </Button>
      {recording && interim && (
        <p className="text-xs text-zinc-400 italic truncate max-w-sm">
          {interim}…
        </p>
      )}
    </div>
  );
}
