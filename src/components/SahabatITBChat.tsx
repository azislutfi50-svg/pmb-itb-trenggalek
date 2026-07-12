import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, RotateCcw, Sparkles, Smile, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ITBTrenggalekLogo from "../assets/images/itb_trenggalek_actual_logo_1783820066799.jpg";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function SahabatITBChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize with a welcome message on first mount
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
  }, []);

  const setInitialMessage = () => {
    setMessages([
      {
        role: "assistant",
        content: "Halo Kak! 👋 Selamat datang di portal ITB Trenggalek. Saya **Sahabat ITB**, asisten virtual pintar Anda.\n\nSaya siap membantu menjelaskan seputar program studi **S1 Ilmu Komputer**, **S1 Bisnis Digital**, **S1 Manajemen Ritel**, serta mendampingi Kakak dalam alur pendaftaran PMB online ini. Ada yang bisa saya bantu hari ini?",
        timestamp: new Date()
      }
    ]);
  };

  // Save chat history to sessionStorage
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem("sahabat_itb_chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  // Scroll to bottom helper
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, isOpen]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      role: "user",
      content: textToSend,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

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
      const assistantMsg: Message = {
        role: "assistant",
        content: data.text || "Mohon maaf Kak, terjadi kendala jaringan saat saya memikirkan jawaban. Bisa diulangi?",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg: Message = {
        role: "assistant",
        content: "Mohon maaf Kak, koneksi sedang tidak stabil. Saya tetap siap membantu Kakak, silakan kirim pesan kembali atau tanyakan seputar prodi!",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    if (window.confirm("Apakah Kakak ingin menghapus riwayat obrolan dengan Sahabat ITB?")) {
      sessionStorage.removeItem("sahabat_itb_chat_history");
      setInitialMessage();
    }
  };

  // Basic custom markdown-like renderer to parse bold statements (**text**) and newlines
  const renderMessageContent = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, i) => {
      // Parse strong/bold text (**text**)
      const parts = line.split(/\*\*([^*]+)\*\*/g);
      const renderedLine = parts.map((part, index) => {
        if (index % 2 === 1) {
          return <strong key={index} className="font-bold text-white">{part}</strong>;
        }
        return part;
      });

      // Render line as list item if it starts with bullets like "- " or "* "
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        const cleanText = line.replace(/^[\s*-]+/, "").trim();
        const partsLi = cleanText.split(/\*\*([^*]+)\*\*/g);
        const renderedLi = partsLi.map((part, index) => {
          if (index % 2 === 1) {
            return <strong key={index} className="font-bold text-white">{part}</strong>;
          }
          return part;
        });
        return (
          <li key={i} className="ml-4 list-disc text-slate-300 leading-relaxed text-[13px] my-1">
            {renderedLi}
          </li>
        );
      }

      // Check if it's numbered list
      const numMatch = line.match(/^\d+\.\s(.*)/);
      if (numMatch) {
        const cleanText = numMatch[1];
        const partsLi = cleanText.split(/\*\*([^*]+)\*\*/g);
        const renderedLi = partsLi.map((part, index) => {
          if (index % 2 === 1) {
            return <strong key={index} className="font-bold text-white">{part}</strong>;
          }
          return part;
        });
        return (
          <li key={i} className="ml-4 list-decimal text-slate-300 leading-relaxed text-[13px] my-1">
            {renderedLi}
          </li>
        );
      }

      return (
        <p key={i} className="text-slate-300 leading-relaxed text-[13px] min-h-[4px]">
          {renderedLine}
        </p>
      );
    });
  };

  const suggestionChips = [
    { label: "🖥️ Info S1 Ilmu Komputer", query: "Bisa jelaskan detail tentang program studi S1 Ilmu Komputer di ITB Trenggalek?" },
    { label: "💼 Info S1 Bisnis Digital", query: "Apa saja yang dipelajari di S1 Bisnis Digital?" },
    { label: "🛒 Info S1 Manajemen Ritel", query: "Bagaimana prospek dan info tentang S1 Manajemen Ritel?" },
    { label: "📝 Syarat & Berkas Pendaftaran", query: "Apa saja syarat dan berkas dokumen yang perlu saya siapkan untuk mendaftar?" },
    { label: "💰 Biaya & Virtual Account", query: "Berapa biaya pendaftaran PMB dan bagaimana cara bayarnya?" },
    { label: "📍 Lokasi Kampus & Fasilitas", query: "Dimana lokasi kampus ITB Trenggalek dan fasilitas apa saja yang tersedia?" }
  ];

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        id="btn-sahabat-itb"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-[88px] md:bottom-[88px] bottom-[80px] right-6 md:right-6 right-4 z-50 flex items-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-600 text-white p-3.5 md:px-5 md:py-3.5 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 font-semibold"
        title="Tanya Sahabat ITB AI"
      >
        <span className="relative flex h-5 w-5 items-center justify-center shrink-0">
          <span className="absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-30 animate-ping"></span>
          <MessageSquare className="w-5 h-5" />
        </span>
        <span className="hidden md:inline">Sahabat ITB AI</span>
      </button>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-[156px] md:bottom-[156px] bottom-[140px] right-6 md:right-6 right-4 w-[calc(100vw-32px)] sm:w-[410px] h-[520px] bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-950 p-4 border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white p-0.5 border border-slate-800 shadow flex items-center justify-center overflow-hidden">
                    <img 
                      src={ITBTrenggalekLogo} 
                      alt="Sahabat ITB Avatar" 
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-950 rounded-full animate-pulse"></span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    Sahabat ITB
                    <Sparkles className="w-3.5 h-3.5 text-sky-400 fill-sky-400 animate-pulse" />
                  </h4>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                    <span className="text-emerald-400 font-semibold">Online</span>
                    <span>•</span>
                    <span>Asisten PMB</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                {/* Reset button */}
                <button
                  onClick={handleResetChat}
                  className="p-1.5 hover:bg-slate-900 text-slate-400 hover:text-white rounded-lg transition"
                  title="Mulai Ulang Obrolan"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-slate-900 text-slate-400 hover:text-rose-400 rounded-lg transition"
                  title="Tutup"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* Messages List Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/40 custom-scrollbar">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2.5 max-w-[85%] ${
                    msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                  }`}
                >
                  {/* Avatar for AI */}
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-white p-0.5 border border-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                      <img 
                        src={ITBTrenggalekLogo} 
                        alt="Sahabat ITB Avatar Mini" 
                        className="w-full h-full object-contain rounded-full"
                      />
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div className="space-y-1">
                    <div
                      className={`px-3.5 py-2.5 rounded-2xl text-[13px] ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-tr-none shadow-md"
                          : "bg-slate-900/90 border border-slate-800/60 text-slate-300 rounded-tl-none shadow-inner"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      ) : (
                        <div className="space-y-1.5 whitespace-pre-wrap">
                          {renderMessageContent(msg.content)}
                        </div>
                      )}
                    </div>
                    
                    {/* Timestamp */}
                    <p className={`text-[10px] text-slate-500 font-mono ${msg.role === "user" ? "text-right" : "text-left ml-1"}`}>
                      {msg.timestamp.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}

              {/* Typing Loader State */}
              {isLoading && (
                <div className="flex gap-2.5 mr-auto max-w-[85%]">
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

            {/* Quick Suggestion Chips Container */}
            <div className="px-3 py-2 border-t border-slate-900 bg-slate-950 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none scroll-smooth">
              {suggestionChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip.query)}
                  disabled={isLoading}
                  className="px-3 py-1.5 rounded-full text-[11px] font-medium bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition active:scale-95 disabled:opacity-50 shrink-0"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Footer Input Area */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(input);
              }}
              className="p-3 border-t border-slate-800/60 bg-slate-900 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tanyakan sesuatu pada Sahabat ITB..."
                disabled={isLoading}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-sky-500 hover:bg-sky-600 disabled:bg-slate-800 text-white p-2 rounded-xl transition flex items-center justify-center shrink-0 active:scale-95 disabled:scale-100 disabled:opacity-50"
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
