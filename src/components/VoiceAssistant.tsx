import { useEffect, useRef, useState } from "react";

const COMMANDS = [
  "Find nearest hospital",
  "Call ambulance",
  "Share my location",
  "Call police",
  "Start emergency mode",
];

export function VoiceAssistant({ onCommand }: { onCommand: (cmd: string) => void }) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [supported, setSupported] = useState(true);
  const recRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setSupported(false);
      return;
    }
    const r = new SR();
    r.continuous = false;
    r.interimResults = false;
    r.lang = "en-US";
    r.onresult = (e: any) => {
      const t = e.results[0][0].transcript;
      setTranscript(t);
      onCommand(t);
    };
    r.onend = () => setListening(false);
    recRef.current = r;
  }, [onCommand]);

  function toggle() {
    if (!supported || !recRef.current) return;
    if (listening) {
      recRef.current.stop();
    } else {
      setTranscript("");
      recRef.current.start();
      setListening(true);
    }
  }

  return (
    <div className="space-y-3">
      <button
        onClick={toggle}
        disabled={!supported}
        className={`w-full py-3 rounded-xl uppercase tracking-[0.3em] font-bold text-sm ${
          listening
            ? "neon-border-pink animate-flicker"
            : "neon-border-blue hover:bg-[oklch(0.85_0.18_220)/0.1]"
        } ${!supported ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        🎙 {listening ? "Listening…" : supported ? "Activate Voice" : "Not Supported"}
      </button>
      {transcript && (
        <p className="text-xs glass rounded-lg p-2">"{transcript}"</p>
      )}
      <div className="space-y-1">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Try saying:</p>
        {COMMANDS.map((c) => (
          <button
            key={c}
            onClick={() => onCommand(c)}
            className="block w-full text-left text-xs px-2 py-1 rounded hover:bg-[oklch(0.85_0.18_220)/0.1] text-muted-foreground hover:text-foreground"
          >
            › {c}
          </button>
        ))}
      </div>
    </div>
  );
}