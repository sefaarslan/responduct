"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SpeechRecorderProps {
  onResult: (text: string) => void;
  disabled?: boolean;
}

type RecordingState = "idle" | "starting" | "recording";
type SpeechError =
  | "not-allowed"
  | "network"
  | "no-speech"
  | "audio-capture"
  | "service-not-allowed"
  | "unknown";

const ERROR_MESSAGES: Record<SpeechError, string> = {
  "not-allowed":
    "Mikrofon izni reddedildi. Tarayıcı adres çubuğundaki kilit simgesinden izin verin.",
  network:
    "Ağ hatası. İnternet bağlantınızı kontrol edip tekrar deneyin.",
  "no-speech": "Ses algılanamadı. Mikrofona biraz daha yakın konuşun.",
  "audio-capture":
    "Mikrofona erişilemiyor. Başka bir uygulama mikrofonu kullanıyor olabilir.",
  "service-not-allowed":
    "Ses tanıma servisi kullanılamıyor. Chrome'da oturum açık olduğundan emin olun.",
  unknown: "Beklenmedik bir hata oluştu",
};

export function SpeechRecorder({ onResult, disabled }: SpeechRecorderProps) {
  const [recState, setRecState] = useState<RecordingState>("idle");
  const [interim, setInterim] = useState("");
  const [error, setError] = useState<SpeechError | null>(null);
  const [errorCode, setErrorCode] = useState<string>("");
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

    setError(null);
    setRecState("starting");
    interimRef.current = "";
    setInterim("");

    const recognition = new SpeechRec();
    recognition.lang = "tr-TR";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setRecState("recording");
    };

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
      setRecState("idle");
      if (interimRef.current) {
        onResult(interimRef.current);
      }
      interimRef.current = "";
      setInterim("");
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      setRecState("idle");
      interimRef.current = "";
      setInterim("");

      const code: string = event.error ?? "";
      console.error("[SpeechRecognition] hata kodu:", code, event);

      if (code === "not-allowed" || code === "permission-denied") {
        setError("not-allowed");
      } else if (code === "network") {
        setError("network");
      } else if (code === "no-speech") {
        setError("no-speech");
      } else if (code === "audio-capture") {
        setError("audio-capture");
      } else if (code === "service-not-allowed") {
        setError("service-not-allowed");
      } else {
        setErrorCode(code || "bilinmiyor");
        setError("unknown");
      }
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
    } catch {
      setRecState("idle");
      setError("unknown");
    }
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
        variant={recState === "recording" ? "destructive" : "outline"}
        size="sm"
        onClick={recState === "recording" ? stop : start}
        disabled={disabled || supported === null || recState === "starting"}
        className="gap-2"
      >
        {recState === "starting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Başlatılıyor…
          </>
        ) : recState === "recording" ? (
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

      {recState === "recording" && interim && (
        <p className="text-xs text-zinc-400 italic truncate max-w-sm">
          {interim}…
        </p>
      )}

      {error && (
        <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          <span>
            {ERROR_MESSAGES[error]}
            {error === "unknown" && errorCode && (
              <span className="text-red-400"> (kod: {errorCode})</span>
            )}
          </span>
        </div>
      )}
    </div>
  );
}
