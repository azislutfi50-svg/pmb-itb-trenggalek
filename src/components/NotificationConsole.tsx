import { useState, useEffect } from "react";
import { MessageSquare, Mail, Bell, Smartphone, Clock, CheckCheck, Trash2, ShieldAlert } from "lucide-react";
import { NotificationLog } from "../types";

export default function NotificationConsole() {
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);
  const [activeTab, setActiveTab] = useState<"whatsapp" | "email">("whatsapp");
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 4 seconds to catch real-time registrations and status updates
    const interval = setInterval(fetchNotifications, 4000);
    return () => clearInterval(interval);
  }, []);

  // Update unread count based on notifications length changes
  useEffect(() => {
    if (!isOpen && notifications.length > 0) {
      setUnreadCount((prev) => prev + 1);
    }
  }, [notifications.length]);

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const formatTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  };

  const whatsappNotifs = notifications.filter((n) => n.type === "WhatsApp");
  const emailNotifs = notifications.filter((n) => n.type === "Email");

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        id="btn-notif-console"
        onClick={() => {
          setIsOpen(!isOpen);
          setUnreadCount(0);
        }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-sky-600 text-white px-5 py-3.5 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 font-medium"
      >
        <span className="relative flex h-5 w-5 items-center justify-center">
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
          )}
          <Bell className="w-5 h-5 animate-pulse" />
        </span>
        <span>Simulasi Notifikasi</span>
        {unreadCount > 0 && (
          <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {unreadCount} Baru
          </span>
        )}
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 transition-all duration-300">
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-300">
            
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-white text-sm">Simulasi Notifikasi Otomatis</h3>
                  <p className="text-xs text-slate-400 font-mono">WhatsApp & Email Gateway</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {notifications.length > 0 && (
                  <button
                    onClick={clearNotifications}
                    className="p-2 text-slate-400 hover:text-rose-400 transition-colors rounded"
                    title="Bersihkan log"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white text-sm font-semibold px-3 py-1 bg-slate-800 rounded hover:bg-slate-700 transition"
                >
                  Tutup
                </button>
              </div>
            </div>

            {/* Note alert */}
            <div className="bg-emerald-950/40 border-b border-emerald-900/50 p-3 flex gap-2 items-start text-xs text-emerald-300">
              <ShieldAlert className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
              <p>
                <strong>Demo Mode:</strong> Sistem menyimulasikan pengiriman WhatsApp & Email otomatis secara real-time ke nomor & email pendaftar untuk melacak alur PMB secara instan!
              </p>
            </div>

            {/* Switch Tabs */}
            <div className="flex bg-slate-900 p-1.5 border-b border-slate-800">
              <button
                onClick={() => setActiveTab("whatsapp")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-md transition-all ${
                  activeTab === "whatsapp"
                    ? "bg-emerald-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                WhatsApp ({whatsappNotifs.length})
              </button>
              <button
                onClick={() => setActiveTab("email")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-md transition-all ${
                  activeTab === "email"
                    ? "bg-sky-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Mail className="w-4 h-4" />
                Email Inbox ({emailNotifs.length})
              </button>
            </div>

            {/* Simulated Content */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-900/20">
              
              {activeTab === "whatsapp" ? (
                /* WHATSAPP CONTAINER (SMARTPHONE LOOK) */
                <div className="max-w-sm mx-auto bg-slate-950 rounded-3xl border-4 border-slate-800 overflow-hidden shadow-inner aspect-[9/16] flex flex-col">
                  {/* Status Bar */}
                  <div className="bg-emerald-800 text-white text-[10px] px-4 py-2 flex justify-between items-center font-mono">
                    <span className="font-bold">ITB Trenggalek Bot</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  
                  {/* Chat Header */}
                  <div className="bg-emerald-700 text-white p-3 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs text-emerald-100">
                      ITB
                    </div>
                    <div>
                      <h4 className="font-bold text-xs">ITB Trenggalek Official</h4>
                      <p className="text-[10px] text-emerald-200">Online • Layanan Otomatis PMB</p>
                    </div>
                  </div>

                  {/* Chat Body */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-950 flex flex-col justify-end">
                    {whatsappNotifs.length === 0 ? (
                      <div className="my-auto text-center p-4">
                        <MessageSquare className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                        <p className="text-xs text-slate-500 font-mono">Belum ada pesan WhatsApp yang terkirim.</p>
                        <p className="text-[10px] text-slate-600 mt-1">Daftarkan diri Anda atau simulasikan pembaruan untuk melihat notifikasi instan.</p>
                      </div>
                    ) : (
                      whatsappNotifs.map((notif) => (
                        <div key={notif.id} className="bg-emerald-900/30 border border-emerald-800/40 text-slate-200 p-2.5 rounded-lg text-xs max-w-[85%] self-start shadow-sm relative">
                          <p className="whitespace-pre-wrap font-sans text-[11px] leading-relaxed">{notif.message}</p>
                          <div className="text-right text-[9px] text-slate-400 mt-1 flex items-center justify-end gap-1 font-mono">
                            <span>{formatTime(notif.timestamp)}</span>
                            <CheckCheck className="w-3 h-3 text-sky-400" />
                          </div>
                        </div>
                      )).reverse() // Show newest last in the chat layout
                    )}
                  </div>
                </div>
              ) : (
                /* EMAIL CONTAINER (DESKTOP INBOX LOOK) */
                <div className="space-y-3">
                  {emailNotifs.length === 0 ? (
                    <div className="text-center py-12 p-4">
                      <Mail className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                      <p className="text-xs text-slate-500 font-mono">Belum ada email yang terkirim.</p>
                      <p className="text-[10px] text-slate-600 mt-1">Status dan pembaruan berkas akan dikirim ke email pendaftar.</p>
                    </div>
                  ) : (
                    emailNotifs.map((notif) => {
                      const lines = notif.message.split("\n\n");
                      const subject = lines[0] || "No Subject";
                      const body = lines.slice(1).join("\n\n") || "";
                      return (
                        <div key={notif.id} className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 hover:border-sky-500/50 transition">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] text-sky-400 font-mono px-2 py-0.5 bg-sky-950/50 rounded border border-sky-900/50">
                              INCOMING EMAIL
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {new Date(notif.timestamp).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                            </span>
                          </div>
                          <div className="text-slate-200 text-xs font-semibold mb-1">
                            Ke: {notif.recipient}
                          </div>
                          <div className="text-slate-100 text-xs font-bold border-b border-slate-800 pb-1.5 mb-2 font-mono">
                            {subject}
                          </div>
                          <p className="text-slate-400 text-xs whitespace-pre-wrap leading-relaxed font-sans">
                            {body}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 text-center border-t border-slate-800 bg-slate-950">
              <p className="text-[10px] text-slate-500 font-mono">
                PMB ITB Trenggalek © 2026 • Real-time Notification Engine
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
