import { useState, useRef, useEffect } from "react";
import { 
  MessageSquare, 
  Send, 
  X, 
  RotateCcw, 
  Sparkles, 
  Smile, 
  HelpCircle, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2,
  BookOpen,
  ArrowRight,
  Sparkle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ITBTrenggalekLogo from "../assets/images/itb_trenggalek_actual_logo_1783820066799.jpg";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestedActions?: { label: string; query: string }[];
}

export default function SahabatITBChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Premium responsive audio & voice toggles
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeSpeech, setActiveSpeech] = useState<SpeechSynthesisUtterance | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const suggestionChips = [
    { label: "🖥️ Info S1 Ilmu Komputer", query: "Bisa jelaskan detail tentang program studi S1 Ilmu Komputer di ITB Trenggalek?" },
    { label: "💼 Info S1 Bisnis Digital", query: "Apa saja yang dipelajari di S1 Bisnis Digital?" },
    { label: "🛒 Info S1 Manajemen Ritel", query: "Bagaimana prospek dan info tentang S1 Manajemen Ritel?" },
    { label: "📝 Syarat & Berkas Pendaftaran", query: "Apa saja syarat dan berkas dokumen yang perlu saya siapkan untuk mendaftar?" },
    { label: "💰 Biaya & Virtual Account", query: "Berapa biaya pendaftaran PMB dan bagaimana cara bayarnya?" },
    { label: "📍 Lokasi Kampus & Fasilitas", query: "Dimana lokasi kampus ITB Trenggalek dan fasilitas apa saja yang tersedia?" }
  ];

  // Auto-suggestions list as user types
  const [autocompleteList, setAutocompleteList] = useState<{ label: string; query: string }[]>([]);

  // Synthesize UI sound feedback using pure Web Audio API
  const playChatSound = (type: "send" | "receive" | "click" | "listen") => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (type === "send") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(450, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === "receive") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(250, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(550, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else if (type === "listen") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(350, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === "click") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(500, ctx.currentTime);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      }
    } catch (e) {
      // Browser autoplay policy block safeguard
    }
  };

  // Text to Speech voice assistant in Indonesian
  const speakMessage = (text: string) => {
    if (!voiceEnabled) return;
    try {
      window.speechSynthesis.cancel(); // Stop any active reading
      
      // Remove markdown characters, bullet symbols, and emojis for smooth pronunciation
      const cleanText = text
        .replace(/\*\*([^*]+)\*\*/g, "$1")
        .replace(/[\-*#_•]/g, " ")
        .replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDC00-\uDFFF]/g, "");

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "id-ID";
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      
      // Match high quality Indonesian speaker if available
      const voices = window.speechSynthesis.getVoices();
      const idVoice = voices.find(v => v.lang.startsWith("id") || v.lang.includes("indonesia") || v.lang.includes("ID"));
      if (idVoice) {
        utterance.voice = idVoice;
      }

      utterance.onend = () => {
        setActiveSpeech(null);
      };
      
      setActiveSpeech(utterance);
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error("Speech Synthesis Error:", e);
    }
  };

  // Stop text-to-speech
  const stopSpeaking = () => {
    try {
      window.speechSynthesis.cancel();
      setActiveSpeech(null);
    } catch (e) {}
  };

  // Initialize Speech Recognition (Voice Typing)
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.lang = "id-ID";
      rec.continuous = false;
      rec.interimResults = false;

      rec.onstart = () => {
        setIsListening(true);
        playChatSound("listen");
      };

      rec.onerror = (e: any) => {
        console.error("Speech Recognition Error:", e);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => prev + (prev ? " " : "") + transcript);
        playChatSound("receive");
      };

      recognitionRef.current = rec;
    }
  }, [soundEnabled]);

  const toggleVoiceListening = () => {
    if (!recognitionRef.current) {
      alert("Maaf, fitur pengetikan suara (Speech to Text) tidak didukung pada browser Anda. Silakan coba menggunakan Google Chrome atau Safari.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      stopSpeaking();
      recognitionRef.current.start();
    }
  };

  // Auto-generate Suggested Smart Actions inside bot bubbles depending on context
  const getSuggestedActions = (text: string): { label: string; query: string }[] => {
    const lower = text.toLowerCase();
    const actions: { label: string; query: string }[] = [];

    if (lower.includes("ilmu komputer") || lower.includes("komputer")) {
      actions.push({ label: "🖥️ Kurikulum S1 Ilmu Komputer", query: "Boleh infokan mata kuliah unggulan di S1 Ilmu Komputer?" });
    }
    if (lower.includes("bisnis digital") || lower.includes("digital")) {
      actions.push({ label: "💼 Karir Bisnis Digital", query: "Bagaimana prospek kerja lulusan S1 Bisnis Digital?" });
    }
    if (lower.includes("ritel") || lower.includes("manajemen ritel")) {
      actions.push({ label: "🛒 Keunggulan Manajemen Ritel", query: "Mengapa harus memilih S1 Manajemen Ritel ITB Trenggalek?" });
    }
    if (lower.includes("biaya") || lower.includes("bayar") || lower.includes("rupiah") || lower.includes("va")) {
      actions.push({ label: "💳 Hubungi Admin Keuangan", query: "Apakah ada cicilan untuk biaya kuliah di ITB Trenggalek?" });
    }
    if (lower.includes("syarat") || lower.includes("dokumen") || lower.includes("berkas")) {
      actions.push({ label: "📁 Jalur Prestasi", query: "Apakah ada jalur pendaftaran menggunakan jalur prestasi atau beasiswa?" });
    }

    return actions.slice(0, 2); // Max 2 context suggestions per message
  };

  // Initialize with welcome message on mount
  useEffect(() => {
    const savedChat = sessionStorage.getItem("sahabat_itb_chat_history");
    if (savedChat) {
      try {
        const parsed = JSON.parse(savedChat);
        const formatted = parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
        setMessages(formatted);
      } catch (e) {
        setInitialMessage();
      }
    } else {
      setInitialMessage();
    }

    // Force load speech synthesis voices asynchronously
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  const setInitialMessage = () => {
    setMessages([
      {
        role: "assistant",
        content: "Halo Kak! 👋 Selamat datang di portal ITB Trenggalek. Saya **Sahabat ITB**, asisten virtual pintar Anda.\n\nSaya siap membantu menjelaskan seputar program studi **S1 Ilmu Komputer**, **S1 Bisnis Digital**, **S1 Manajemen Ritel**, serta mendampingi Kakak dalam alur pendaftaran PMB online ini. Ada yang bisa saya bantu hari ini?",
        timestamp: new Date(),
        suggestedActions: [
          { label: "🖥️ S1 Ilmu Komputer", query: "Bisa jelaskan detail tentang program studi S1 Ilmu Komputer di ITB Trenggalek?" },
          { label: "💼 S1 Bisnis Digital", query: "Apa saja yang dipelajari di S1 Bisnis Digital?" },
          { label: "📝 Syarat Pendaftaran", query: "Apa saja syarat dan berkas dokumen yang perlu saya siapkan untuk mendaftar?" }
        ]
      }
    ]);
  };

  // Sync autocomplete as user types
  useEffect(() => {
    if (input.trim().length >= 2) {
      const queryLower = input.toLowerCase();
      const filtered = suggestionChips.filter(chip => 
        chip.label.toLowerCase().includes(queryLower) || 
        chip.query.toLowerCase().includes(queryLower)
      );
      setAutocompleteList(filtered);
    } else {
      setAutocompleteList([]);
    }
  }, [input]);

  // Save chat history to sessionStorage
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem("sahabat_itb_chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  // Scroll to bottom smoothly
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, isOpen, isExpanded]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    // Stop active reading of previous message
    stopSpeaking();

    const userMsg: Message = {
      role: "user",
      content: textToSend,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setAutocompleteList([]);
    setIsLoading(true);
    playChatSound("send");

    try {
      const historyPayload = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: historyPayload })
      });

      if (!response.ok) {
        throw new Error("Failed to communicate with Sahabat ITB AI");
      }

      const data = await response.json();
      const botText = data.text || "Mohon maaf Kak, terjadi kendala jaringan saat saya memikirkan jawaban. Bisa diulangi?";
      
      const assistantMsg: Message = {
        role: "assistant",
        content: botText,
        timestamp: new Date(),
        suggestedActions: getSuggestedActions(botText)
      };

      setMessages((prev) => [...prev, assistantMsg]);
      playChatSound("receive");
      speakMessage(botText);
    } catch (error) {
      console.error("Chat error:", error);
      const errorText = "Mohon maaf Kak, koneksi sedang tidak stabil. Saya tetap siap membantu Kakak, silakan kirim pesan kembali atau tanyakan seputar prodi!";
      const errorMsg: Message = {
        role: "assistant",
        content: errorText,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMsg]);
      playChatSound("receive");
      speakMessage(errorText);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    if (window.confirm("Apakah Kakak ingin menghapus riwayat obrolan dengan Sahabat ITB?")) {
      stopSpeaking();
      sessionStorage.removeItem("sahabat_itb_chat_history");
      setInitialMessage();
      playChatSound("click");
    }
  };

  // Render message content with markdown highlights (**text**), bullet lists, and numbered lists
  const renderMessageContent = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, i) => {
      const parts = line.split(/\*\*([^*]+)\*\*/g);
      const renderedLine = parts.map((part, index) => {
        if (index % 2 === 1) {
          return <strong key={index} className="font-bold text-sky-300">{part}</strong>;
        }
        return part;
      });

      if (line.trim().startsWith("- ") || line.trim().startsWith("* ") || line.trim().startsWith("• ")) {
        const cleanText = line.replace(/^[\s*\-•]+/, "").trim();
        const partsLi = cleanText.split(/\*\*([^*]+)\*\*/g);
        const renderedLi = partsLi.map((part, index) => {
          if (index % 2 === 1) {
            return <strong key={index} className="font-bold text-sky-300">{part}</strong>;
          }
          return part;
        });
        return (
          <li key={i} className="ml-4 list-disc text-slate-300 leading-relaxed text-[13px] my-1 font-sans">
            {renderedLi}
          </li>
        );
      }

      const numMatch = line.match(/^\d+\.\s(.*)/);
      if (numMatch) {
        const cleanText = numMatch[1];
        const partsLi = cleanText.split(/\*\*([^*]+)\*\*/g);
        const renderedLi = partsLi.map((part, index) => {
          if (index % 2 === 1) {
            return <strong key={index} className="font-bold text-sky-300">{part}</strong>;
          }
          return part;
        });
        return (
          <li key={i} className="ml-4 list-decimal text-slate-300 leading-relaxed text-[13px] my-1 font-sans">
            {renderedLi}
          </li>
        );
      }

      return (
        <p key={i} className="text-slate-200 leading-relaxed text-[13px] font-sans min-h-[4px]">
          {renderedLine}
        </p>
      );
    });
  };

  return (
    <>
      {/* Floating Interactive Toggle Button */}
      <button
        id="btn-sahabat-itb"
        onClick={() => {
          setIsOpen(!isOpen);
          playChatSound("click");
        }}
        className="fixed bottom-[88px] right-6 md:right-6 right-4 z-50 flex items-center gap-2 bg-gradient-to-r from-sky-500 via-sky-600 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white p-3.5 md:px-5 md:py-3.5 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 font-semibold cursor-pointer border border-sky-400/25"
        title="Tanya Sahabat ITB AI"
      >
        <span className="relative flex h-5 w-5 items-center justify-center shrink-0">
          <span className="absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-40 animate-ping"></span>
          <MessageSquare className="w-5 h-5 text-white" />
        </span>
        <span className="hidden md:inline text-xs tracking-wide">Sahabat ITB AI</span>
      </button>

      {/* Highly Responsive Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className={`fixed z-50 overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex flex-col transition-all duration-300 ${
              isExpanded 
                ? "inset-4 md:inset-10 md:right-10 md:left-auto md:w-[600px] md:h-[calc(100vh-80px)] rounded-3xl"
                : "bottom-0 right-0 left-0 top-0 sm:top-auto sm:right-6 sm:bottom-[156px] sm:left-auto w-full sm:w-[420px] h-full sm:h-[580px] rounded-none sm:rounded-3xl"
            }`}
          >
            {/* Ambient Background Glow Accent */}
            <div className="absolute top-0 left-1/4 w-1/2 h-40 bg-sky-500/10 blur-[80px] pointer-events-none rounded-full" />
            <div className="absolute bottom-0 right-1/4 w-1/2 h-40 bg-indigo-500/10 blur-[80px] pointer-events-none rounded-full" />

            {/* Premium Header */}
            <div className="relative bg-slate-900/90 backdrop-blur-md p-4 border-b border-slate-800/80 flex items-center justify-between z-10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white p-0.5 border border-sky-500/30 shadow flex items-center justify-center overflow-hidden">
                    <img 
                      src={ITBTrenggalekLogo} 
                      alt="Sahabat ITB Avatar" 
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-950 rounded-full animate-pulse"></span>
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white flex items-center gap-1.5 font-sans">
                    Sahabat ITB
                    <Sparkles className="w-3.5 h-3.5 text-sky-400 fill-sky-400 animate-pulse shrink-0" />
                  </h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                    <span className="text-emerald-400 font-semibold">Online</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <Sparkle className="w-2.5 h-2.5 text-indigo-400" />
                      Gemini AI Engine
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                {/* Voice Speaker (TTS) toggle button */}
                <button
                  onClick={() => {
                    const next = !voiceEnabled;
                    setVoiceEnabled(next);
                    playChatSound("click");
                    if (!next) stopSpeaking();
                  }}
                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                    voiceEnabled 
                      ? "bg-sky-500/10 text-sky-400 border border-sky-500/20" 
                      : "hover:bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                  title={voiceEnabled ? "Bisukan Suara AI" : "Aktifkan Suara AI"}
                >
                  {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                {/* Reset chat button */}
                <button
                  onClick={handleResetChat}
                  className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition cursor-pointer"
                  title="Mulai Ulang Percakapan"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Desktop Expand/Minimize Toggle Button */}
                <button
                  onClick={() => {
                    setIsExpanded(!isExpanded);
                    playChatSound("click");
                  }}
                  className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition hidden sm:inline-block cursor-pointer"
                  title={isExpanded ? "Perkecil Tampilan" : "Perbesar Tampilan"}
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                {/* Close Button */}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    stopSpeaking();
                    playChatSound("click");
                  }}
                  className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-rose-400 rounded-lg transition cursor-pointer"
                  title="Tutup Chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/20 custom-scrollbar z-10">
              {messages.map((msg, idx) => (
                <div key={idx} className="space-y-2">
                  <div
                    className={`flex gap-3 max-w-[85%] ${
                      msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                    }`}
                  >
                    {/* Bot Portrait mini avatar */}
                    {msg.role === "assistant" && (
                      <div className="w-7 h-7 rounded-full bg-white p-0.5 border border-slate-800 flex items-center justify-center overflow-hidden shrink-0 shadow-md">
                        <img 
                          src={ITBTrenggalekLogo} 
                          alt="Sahabat ITB Avatar Mini" 
                          className="w-full h-full object-contain rounded-full"
                        />
                      </div>
                    )}

                    {/* Chat Bubble with interactive styling */}
                    <div className="space-y-1">
                      <div
                        className={`px-3.5 py-2.5 rounded-2xl text-[13px] ${
                          msg.role === "user"
                            ? "bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-tr-none shadow-md"
                            : "bg-slate-900/90 border border-slate-800/60 text-slate-300 rounded-tl-none shadow-inner"
                        }`}
                      >
                        {msg.role === "user" ? (
                          <p className="leading-relaxed whitespace-pre-wrap font-sans">{msg.content}</p>
                        ) : (
                          <div className="space-y-1.5 whitespace-pre-wrap font-sans">
                            {renderMessageContent(msg.content)}
                          </div>
                        )}
                      </div>
                      
                      <p className={`text-[9px] text-slate-500 font-mono ${msg.role === "user" ? "text-right" : "text-left ml-1"}`}>
                        {msg.timestamp.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>

                  {/* Contextual Smart Action suggestions parsed inside the bubble */}
                  {msg.role === "assistant" && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="pl-10 flex flex-wrap gap-1.5">
                      {msg.suggestedActions.map((act, aIdx) => (
                        <button
                          key={aIdx}
                          onClick={() => {
                            handleSendMessage(act.query);
                            playChatSound("click");
                          }}
                          disabled={isLoading}
                          className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-850 text-sky-400 hover:text-sky-300 border border-slate-800/80 px-2.5 py-1 rounded-full text-[10px] font-semibold transition active:scale-95 disabled:opacity-50 cursor-pointer"
                        >
                          <HelpCircle className="w-3 h-3 shrink-0" />
                          <span>{act.label}</span>
                          <ArrowRight className="w-2.5 h-2.5 shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Bot Typing Loader Indicator */}
              {isLoading && (
                <div className="flex gap-3 mr-auto max-w-[85%]">
                  <div className="w-7 h-7 rounded-full bg-white p-0.5 border border-slate-800 flex items-center justify-center overflow-hidden shrink-0 animate-bounce">
                    <img 
                      src={ITBTrenggalekLogo} 
                      alt="Sahabat ITB Avatar Loading" 
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800/60 p-3 rounded-2xl rounded-tl-none shadow-inner flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Autocomplete suggestions dropdown while writing */}
            <AnimatePresence>
              {autocompleteList.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-slate-900 border-t border-slate-800/80 px-3 py-2 z-20 shrink-0 max-h-36 overflow-y-auto"
                >
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1 px-1">Saran Pertanyaan:</p>
                  <div className="space-y-1">
                    {autocompleteList.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          handleSendMessage(item.query);
                          playChatSound("click");
                        }}
                        className="w-full text-left text-xs bg-slate-950/50 hover:bg-slate-950 hover:text-sky-400 border border-slate-850 px-2.5 py-1.5 rounded-lg text-slate-300 transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <BookOpen className="w-3 h-3 text-sky-500 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Floating active Voice Recognition overlay */}
            <AnimatePresence>
              {isListening && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-sky-950/80 backdrop-blur-md border-t border-sky-800/40 p-3 flex flex-col items-center justify-center gap-2 z-20 shrink-0"
                >
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-4 bg-sky-400 rounded animate-pulse" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-1.5 h-6 bg-sky-400 rounded animate-pulse" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-1.5 h-8 bg-sky-400 rounded animate-pulse" style={{ animationDelay: "300ms" }}></span>
                    <span className="w-1.5 h-5 bg-sky-400 rounded animate-pulse" style={{ animationDelay: "450ms" }}></span>
                    <span className="w-1.5 h-3 bg-sky-400 rounded animate-pulse" style={{ animationDelay: "600ms" }}></span>
                  </div>
                  <p className="text-xs font-semibold text-sky-200">Sahabat ITB sedang mendengarkan ucapan Anda...</p>
                  <button 
                    onClick={toggleVoiceListening}
                    className="text-[10px] uppercase font-mono tracking-wider bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 px-3 py-1 rounded-full border border-rose-500/20 cursor-pointer"
                  >
                    Hentikan
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick suggestions row panel */}
            <div className="px-3 py-2 border-t border-slate-900 bg-slate-950 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none scroll-smooth shrink-0 z-10 select-none">
              {suggestionChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    handleSendMessage(chip.query);
                    playChatSound("click");
                  }}
                  disabled={isLoading}
                  className="px-3 py-1.5 rounded-full text-[11px] font-semibold bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition active:scale-95 disabled:opacity-50 shrink-0 cursor-pointer"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Interactive Footer Chat Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(input);
              }}
              className="p-3.5 border-t border-slate-800/60 bg-slate-900 flex items-center gap-2 shrink-0 z-10"
            >
              {/* Voice dictation (Speech to Text) button */}
              <button
                type="button"
                onClick={toggleVoiceListening}
                disabled={isLoading}
                className={`p-2.5 rounded-xl transition flex items-center justify-center shrink-0 active:scale-95 disabled:opacity-50 cursor-pointer border ${
                  isListening 
                    ? "bg-rose-500 text-white border-rose-400 animate-pulse" 
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-sky-400 hover:border-sky-500/40"
                }`}
                title={isListening ? "Hentikan Suara" : "Dikte Suara (Speech to Text)"}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tanyakan prodi, biaya, atau syarat PMB..."
                disabled={isLoading}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition disabled:opacity-50 font-sans"
              />
              
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-sky-500 hover:bg-sky-600 disabled:bg-slate-800 text-white p-2.5 rounded-xl transition flex items-center justify-center shrink-0 active:scale-95 disabled:scale-100 disabled:opacity-50 cursor-pointer shadow-lg shadow-sky-500/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
