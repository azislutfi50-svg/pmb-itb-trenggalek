import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Sparkles, Flame, GraduationCap, CheckCircle, Smartphone, ArrowRight, RefreshCw, Search, Eye, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Import original assets
import BisnisDigitalFlyerImg from "../assets/images/bisnis_digital_flyer_1783819515807.jpg";
import IlmuKomputerFlyerImg from "../assets/images/ilmu_komputer_flyer_1783819527827.jpg";
import ManajemenRitelFlyerImg from "../assets/images/manajemen_ritel_flyer_1783819541058.jpg";
import ITBTrenggalekLogo from "../assets/images/itb_trenggalek_actual_logo_1783820066799.jpg";

interface InfoCampaignCarouselProps {
  onRegisterClick: () => void;
}

export default function InfoCampaignCarousel({ onRegisterClick }: InfoCampaignCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [autoplay, setAutoplay] = useState(true);
  const [activeProdi, setActiveProdi] = useState<"bisnis" | "ritel" | "komputer">("bisnis");
  const [zoomFlyerUrl, setZoomFlyerUrl] = useState<string | null>(null);

  const totalSlides = 6;

  useEffect(() => {
    if (!autoplay) return;
    const interval = setInterval(() => {
      handleNext();
    }, 8000);
    return () => clearInterval(interval);
  }, [currentSlide, autoplay]);

  const handleNext = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (idx: number) => {
    setDirection(idx > currentSlide ? 1 : -1);
    setCurrentSlide(idx);
    setAutoplay(false); // Stop autoplay when user manually interacts
  };

  // Student SVG Generator based on pose
  const StudentIllustration = ({ pose, className = "" }: { pose: string; className?: string }) => {
    // Orange Blazer Color: #f26522 / #ea580c, Hijab: Solid Black/Dark Slate, Skin: Warm Peach
    return (
      <svg
        viewBox="0 0 400 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full max-h-[380px] drop-shadow-2xl ${className}`}
      >
        {/* Abstract Background Ring */}
        <circle cx="200" cy="270" r="140" fill="url(#bgGrad)" opacity="0.15" />
        <circle cx="200" cy="270" r="110" stroke="url(#borderGrad)" strokeWidth="2" strokeDasharray="6 6" opacity="0.3" />

        {/* Gradients */}
        <defs>
          <linearGradient id="bgGrad" x1="0" y1="0" x2="400" y2="500">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
          <linearGradient id="borderGrad" x1="0" y1="0" x2="400" y2="500">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
          <linearGradient id="blazerGrad" x1="120" y1="280" x2="280" y2="500">
            <stop offset="0%" stopColor="#ff7a30" />
            <stop offset="50%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#c2410c" />
          </linearGradient>
          <linearGradient id="laptopGrad" x1="150" y1="350" x2="250" y2="450">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
        </defs>

        {/* --- POSE 1: Student Pointing Forward --- */}
        {pose === "pointing-forward" && (
          <g id="pointing-forward-illustration">
            {/* Body / Orange Blazer */}
            <path d="M100 480 C110 380 140 310 200 310 C260 310 290 380 300 480 Z" fill="url(#blazerGrad)" />
            <path d="M170 310 L200 380 L230 310 Z" fill="#ffffff" /> {/* White inner shirt */}
            <path d="M192 350 L208 350 L200 380 Z" fill="#0f172a" opacity="0.2" /> {/* Tie/shadow */}

            {/* Hijab (Head cover) */}
            <path d="M140 230 C140 140 260 140 260 230 C260 300 140 300 140 230 Z" fill="#1e293b" />
            <path d="M155 220 C155 150 245 150 245 220 C245 280 155 280 155 220 Z" fill="#0f172a" />

            {/* Face */}
            <path d="M165 210 C165 175 235 175 235 210 C235 250 165 250 165 210 Z" fill="#fbcfe8" /> {/* Skin */}
            <path d="M165 200 C175 195 225 195 235 200 C230 190 170 190 165 200 Z" fill="#0f172a" opacity="0.85" /> {/* Hijab inner forehead wrap */}

            {/* Eyes & Smile */}
            <circle cx="185" cy="205" r="3" fill="#0f172a" />
            <circle cx="215" cy="205" r="3" fill="#0f172a" />
            <path d="M182 198 C187 195 191 198 191 198" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M209 198 C214 195 218 198 218 198" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M192 222 C195 226 205 226 208 222" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" /> {/* Smile */}
            <ellipse cx="178" cy="214" rx="4" ry="2" fill="#fda4af" /> {/* Blush */}
            <ellipse cx="222" cy="214" rx="4" ry="2" fill="#fda4af" />

            {/* Orange Blazer Lapels / Details */}
            <path d="M150 330 L185 480 L140 480 Z" fill="#ea580c" opacity="0.8" />
            <path d="M250 330 L215 480 L260 480 Z" fill="#ea580c" opacity="0.8" />
            {/* ITB Trenggalek Logo Pin */}
            <circle cx="160" cy="350" r="5" fill="#38bdf8" />
            <circle cx="160" cy="350" r="3" fill="#ffffff" />

            {/* Hand pointing forward */}
            <path d="M240 370 C240 370 290 350 320 330 C330 325 340 330 335 340 C325 360 280 400 250 420 Z" fill="url(#blazerGrad)" />
            <path d="M315 328 C322 322 345 320 348 322 C352 325 345 332 335 338 Z" fill="#fbcfe8" /> {/* Pointing index finger */}
          </g>
        )}

        {/* --- POSE 2: Student Pointing Upwards --- */}
        {pose === "pointing-up" && (
          <g id="pointing-up-illustration">
            {/* Body / Orange Blazer */}
            <path d="M100 480 C110 380 140 310 200 310 C260 310 290 380 300 480 Z" fill="url(#blazerGrad)" />
            <path d="M170 310 L200 380 L230 310 Z" fill="#ffffff" />
            <path d="M150 330 L185 480 L140 480 Z" fill="#ea580c" opacity="0.8" />
            <path d="M250 330 L215 480 L260 480 Z" fill="#ea580c" opacity="0.8" />

            {/* Hijab */}
            <path d="M140 230 C140 140 260 140 260 230 C260 300 140 300 140 230 Z" fill="#334155" />
            <path d="M155 220 C155 150 245 150 245 220 C245 280 155 280 155 220 Z" fill="#1e293b" />

            {/* Face */}
            <path d="M165 210 C165 175 235 175 235 210 C235 250 165 250 165 210 Z" fill="#fbcfe8" />
            <path d="M165 200 C175 195 225 195 235 200 C230 190 170 190 165 200 Z" fill="#0f172a" opacity="0.85" />
            <circle cx="185" cy="205" r="3" fill="#0f172a" />
            <circle cx="215" cy="205" r="3" fill="#0f172a" />
            <path d="M192 222 C195 226 205 226 208 222" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" />
            <ellipse cx="178" cy="214" rx="4" ry="2" fill="#fda4af" />
            <ellipse cx="222" cy="214" rx="4" ry="2" fill="#fda4af" />
            <circle cx="160" cy="350" r="5" fill="#38bdf8" />

            {/* Arm & Hand Pointing Up */}
            <path d="M240 360 C250 330 270 230 290 180 C295 170 308 175 302 188 C285 240 265 340 260 410 Z" fill="url(#blazerGrad)" />
            <path d="M290 180 C290 180 292 140 294 130 C295 125 303 125 304 132 C305 145 302 170 300 180 Z" fill="#fbcfe8" /> {/* Pointing Finger Up */}
            <path d="M295 142 C295 142 305 145 308 148 C310 150 306 155 301 152 Z" fill="#fbcfe8" /> {/* Other curled fingers */}
            <path d="M296 152 C296 152 305 154 307 157 C309 159 305 163 300 160 Z" fill="#fbcfe8" />
          </g>
        )}

        {/* --- POSE 3: Student Surprised / Excited --- */}
        {pose === "surprised" && (
          <g id="surprised-illustration">
            {/* Body */}
            <path d="M100 480 C110 380 140 310 200 310 C260 310 290 380 300 480 Z" fill="url(#blazerGrad)" />
            <path d="M170 310 L200 380 L230 310 Z" fill="#ffffff" />
            <path d="M150 330 L185 480 L140 480 Z" fill="#ea580c" opacity="0.8" />
            <path d="M250 330 L215 480 L260 480 Z" fill="#ea580c" opacity="0.8" />

            {/* Hijab */}
            <path d="M140 230 C140 140 260 140 260 230 C260 300 140 300 140 230 Z" fill="#475569" />
            <path d="M155 220 C155 150 245 150 245 220 C245 280 155 280 155 220 Z" fill="#1e293b" />

            {/* Face */}
            <path d="M165 210 C165 175 235 175 235 210 C235 250 165 250 165 210 Z" fill="#fbcfe8" />
            <path d="M165 200 C175 195 225 195 235 200 C230 190 170 190 165 200 Z" fill="#0f172a" opacity="0.85" />
            
            {/* Surprised Eyes (O shape) & Big Open Smile */}
            <ellipse cx="185" cy="205" rx="4" ry="4" fill="#0f172a" />
            <ellipse cx="215" cy="205" rx="4" ry="4" fill="#0f172a" />
            <ellipse cx="200" cy="226" rx="8" ry="6" fill="#e11d48" /> {/* Big open mouth */}
            <path d="M195 224 C198 221 202 221 205 224 Z" fill="#ffffff" /> {/* Teeth */}
            
            <ellipse cx="178" cy="216" rx="6" ry="3" fill="#fda4af" />
            <ellipse cx="222" cy="216" rx="6" ry="3" fill="#fda4af" />
            <circle cx="160" cy="350" r="5" fill="#38bdf8" />

            {/* Hands on Cheeks */}
            {/* Left Hand */}
            <path d="M110 440 C110 440 120 330 140 250 C143 240 155 242 150 255 C135 300 125 390 125 450 Z" fill="url(#blazerGrad)" />
            <path d="M142 248 C144 240 152 220 155 212 C158 208 164 212 161 220 C156 235 148 250 144 256 Z" fill="#fbcfe8" />
            
            {/* Right Hand */}
            <path d="M290 440 C290 440 280 330 260 250 C257 240 245 242 250 255 C265 300 275 390 275 450 Z" fill="url(#blazerGrad)" />
            <path d="M258 248 C256 240 248 220 245 212 C242 208 236 212 239 220 C244 235 252 250 256 256 Z" fill="#fbcfe8" />
          </g>
        )}

        {/* --- POSE 4: Two Girls Pointing Sides --- */}
        {pose === "pointing-sides" && (
          <g id="pointing-sides-illustration">
            {/* Student Left */}
            <g transform="translate(-40, 20) scale(0.9)">
              <path d="M100 480 C110 380 140 310 200 310 C260 310 290 380 300 480 Z" fill="url(#blazerGrad)" />
              <path d="M170 310 L200 380 L230 310 Z" fill="#ffffff" />
              <path d="M140 230 C140 140 260 140 260 230 C260 300 140 300 140 230 Z" fill="#1e293b" />
              <path d="M155 220 C155 150 245 150 245 220 C245 280 155 280 155 220 Z" fill="#0f172a" />
              <path d="M165 210 C165 175 235 175 235 210 C235 250 165 250 165 210 Z" fill="#fbcfe8" />
              <circle cx="185" cy="205" r="3" fill="#0f172a" />
              <circle cx="215" cy="205" r="3" fill="#0f172a" />
              <path d="M192 222 C195 226 205 226 208 222" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" />
              {/* Hand Pointing Left */}
              <path d="M120 370 C120 370 70 350 40 330 C30 325 20 330 25 340 C35 360 80 400 110 420 Z" fill="url(#blazerGrad)" />
              <path d="M45 328 C38 322 15 320 12 322 C8 325 15 332 25 338 Z" fill="#fbcfe8" />
            </g>

            {/* Student Right */}
            <g transform="translate(80, 40) scale(0.85)">
              <path d="M100 480 C110 380 140 310 200 310 C260 310 290 380 300 480 Z" fill="url(#blazerGrad)" />
              <path d="M170 310 L200 380 L230 310 Z" fill="#ffffff" />
              <path d="M140 230 C140 140 260 140 260 230 C260 300 140 300 140 230 Z" fill="#334155" />
              <path d="M155 220 C155 150 245 150 245 220 C245 280 155 280 155 220 Z" fill="#1e293b" />
              <path d="M165 210 C165 175 235 175 235 210 C235 250 165 250 165 210 Z" fill="#fbcfe8" />
              <circle cx="185" cy="205" r="3" fill="#0f172a" />
              <circle cx="215" cy="205" r="3" fill="#0f172a" />
              <path d="M192 222 C195 226 205 226 208 222" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" />
              {/* Hand Pointing Right */}
              <path d="M240 370 C240 370 290 350 320 330 C330 325 340 330 335 340 C325 360 280 400 250 420 Z" fill="url(#blazerGrad)" />
              <path d="M315 328 C322 322 345 320 348 322 C352 325 345 332 335 338 Z" fill="#fbcfe8" />
            </g>
          </g>
        )}

        {/* --- POSE 5: Male Student Confident --- */}
        {pose === "male-confident" && (
          <g id="male-confident-illustration">
            {/* Body / Orange Blazer */}
            <path d="M100 480 C110 370 140 300 200 300 C260 300 290 370 300 480 Z" fill="url(#blazerGrad)" />
            <path d="M180 300 L200 370 L220 300 Z" fill="#ffffff" /> {/* White Shirt */}
            <path d="M194 320 L206 320 L200 370 Z" fill="#0284c7" /> {/* Blue tie */}
            <path d="M150 320 L185 480 L140 480 Z" fill="#ea580c" opacity="0.8" />
            <path d="M250 320 L215 480 L260 480 Z" fill="#ea580c" opacity="0.8" />
            <circle cx="160" cy="340" r="5" fill="#38bdf8" />

            {/* Neck */}
            <path d="M185 240 L215 240 L205 300 L195 300 Z" fill="#fbcfe8" />

            {/* Male Head & Hair */}
            <path d="M160 220 C160 160 240 160 240 220 C240 270 160 270 160 220 Z" fill="#fbcfe8" /> {/* Skin */}
            <path d="M155 190 C160 150 240 150 245 185 C250 170 230 150 200 155 C180 150 165 170 155 190 Z" fill="#0f172a" /> {/* Handsome short hairstyle */}
            <path d="M158 190 C155 200 158 215 162 215 Z" fill="#0f172a" /> {/* Sideburns */}
            <path d="M242 190 C245 200 242 215 238 215 Z" fill="#0f172a" />

            {/* Face details */}
            <circle cx="185" cy="210" r="3" fill="#0f172a" />
            <circle cx="215" cy="210" r="3" fill="#0f172a" />
            <path d="M180 202 C185 198 190 200 190 200" stroke="#0f172a" strokeWidth="1.5" />
            <path d="M220 202 C215 198 210 200 210 200" stroke="#0f172a" strokeWidth="1.5" />
            <path d="M190 228 C195 233 205 233 210 228" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" /> {/* Confident Smile */}

            {/* Arm Pointing Right */}
            <path d="M240 360 C240 360 290 340 330 320 C340 315 350 322 342 332 C325 355 280 400 250 420 Z" fill="url(#blazerGrad)" />
            <path d="M325 318 C332 312 355 310 358 312 C362 315 355 322 342 328 Z" fill="#fbcfe8" />
          </g>
        )}

        {/* --- POSE 6: Laptop Team --- */}
        {pose === "laptop" && (
          <g id="laptop-illustration">
            {/* Student 1 Left */}
            <g transform="translate(-20, 30) scale(0.95)">
              <path d="M100 480 C110 380 140 310 200 310 C260 310 290 380 300 480 Z" fill="url(#blazerGrad)" />
              <path d="M170 310 L200 380 L230 310 Z" fill="#ffffff" />
              <path d="M140 230 C140 140 260 140 260 230 C260 300 140 300 140 230 Z" fill="#1e293b" />
              <path d="M155 220 C155 150 245 150 245 220 C245 280 155 280 155 220 Z" fill="#0f172a" />
              <path d="M165 210 C165 175 235 175 235 210 C235 250 165 250 165 210 Z" fill="#fbcfe8" />
              <circle cx="185" cy="205" r="3" fill="#0f172a" />
              <circle cx="215" cy="205" r="3" fill="#0f172a" />
              <path d="M192 222 C195 226 205 226 208 222" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" />
            </g>

            {/* Student 2 Right */}
            <g transform="translate(100, 60) scale(0.85)">
              <path d="M100 480 C110 380 140 310 200 310 C260 310 290 380 300 480 Z" fill="url(#blazerGrad)" />
              <path d="M170 310 L200 380 L230 310 Z" fill="#ffffff" />
              <path d="M140 230 C140 140 260 140 260 230 C260 300 140 300 140 230 Z" fill="#475569" />
              <path d="M155 220 C155 150 245 150 245 220 C245 280 155 280 155 220 Z" fill="#1e293b" />
              <path d="M165 210 C165 175 235 175 235 210 C235 250 165 250 165 210 Z" fill="#fbcfe8" />
              <circle cx="185" cy="205" r="3" fill="#0f172a" />
              <circle cx="215" cy="205" r="3" fill="#0f172a" />
              <path d="M192 222 C195 226 205 226 208 222" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" />
            </g>

            {/* Laptop in Center Foreground */}
            <g transform="translate(130, 310)">
              {/* Laptop screen */}
              <rect x="15" y="10" width="110" height="70" rx="6" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
              {/* Laptop screen glow/content */}
              <rect x="22" y="16" width="96" height="52" rx="3" fill="#0f172a" />
              <circle cx="70" cy="42" r="14" fill="#f97316" opacity="0.3" />
              <path d="M60 42 L80 42 M70 32 L70 52" stroke="#38bdf8" strokeWidth="2" />
              <circle cx="35" cy="24" r="2" fill="#22c55e" />
              <rect x="42" y="23" width="20" height="2" fill="#64748b" />
              <rect x="26" y="56" width="40" height="4" rx="1" fill="#38bdf8" opacity="0.7" />
              <rect x="70" y="56" width="30" height="4" rx="1" fill="#ea580c" opacity="0.7" />
              
              {/* Laptop Keyboard / Base */}
              <path d="M5 80 L135 80 L125 96 L15 96 Z" fill="url(#laptopGrad)" stroke="#475569" strokeWidth="1.5" />
              <line x1="30" y1="88" x2="110" y2="88" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
            </g>
          </g>
        )}
      </svg>
    );
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-950 rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-10 md:p-12 relative overflow-hidden">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10 min-h-[440px]">
        
        {/* Left Side: Content Box with Slide Transitions */}
        <div className="flex-1 w-full space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            
            {/* Top Indicator badge with original ITB logo */}
            <div className="inline-flex items-center gap-2 bg-slate-900/90 border border-slate-800 text-slate-300 px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase font-mono shadow-inner">
              <div className="w-4 h-4 rounded-full overflow-hidden bg-white flex items-center justify-center p-0.5 border border-slate-700/80">
                <img src={ITBTrenggalekLogo} className="w-full h-full object-contain" alt="Original ITB Trenggalek Logo" />
              </div>
              <span>Info Interaktif PMB: Slide {currentSlide + 1} dari {totalSlides}</span>
            </div>

            {/* Slides Content */}
            <div className="min-h-[220px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: direction * 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -direction * 50 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="space-y-4"
                >
                  {/* SLIDE 1: Cover / Welcome */}
                  {currentSlide === 0 && (
                    <div className="space-y-4">
                      <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight">
                        KAMU GEN Z TAPI INGIN <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-300 to-sky-300">
                          PUNYA SKILL BISNIS?
                        </span>
                      </h2>
                      <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-xl">
                        Baca Informasi interaktif ini sampai selesai, mungkin ini adalah langkah kecil yang sangat penting bagi masa depan karir dan bisnismu!
                      </p>
                      <div className="pt-2 flex items-center gap-2 text-orange-400 font-semibold text-xs font-mono uppercase tracking-wider animate-bounce">
                        <span>Coba geser untuk membaca</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  )}

                  {/* SLIDE 2: Gen Z Problem */}
                  {currentSlide === 1 && (
                    <div className="space-y-4">
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                        BANYAK GEN Z INGIN:
                      </h2>
                      
                      {/* Chalkboard list styling */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
                        <div className="bg-slate-800/40 border border-slate-700/50 p-3.5 rounded-xl flex items-center gap-2.5 hover:bg-slate-800/60 transition duration-150">
                          <span className="text-orange-400 text-lg">🚀</span>
                          <span className="text-white font-medium text-xs sm:text-sm">Punya usaha sendiri</span>
                        </div>
                        <div className="bg-slate-800/40 border border-slate-700/50 p-3.5 rounded-xl flex items-center gap-2.5 hover:bg-slate-800/60 transition duration-150">
                          <span className="text-orange-400 text-lg">💻</span>
                          <span className="text-white font-medium text-xs sm:text-sm">Kerja remote anywhere</span>
                        </div>
                        <div className="bg-slate-800/40 border border-slate-700/50 p-3.5 rounded-xl flex items-center gap-2.5 hover:bg-slate-800/60 transition duration-150">
                          <span className="text-orange-400 text-lg">🎨</span>
                          <span className="text-white font-medium text-xs sm:text-sm">Jadi content creator</span>
                        </div>
                        <div className="bg-slate-800/40 border border-slate-700/50 p-3.5 rounded-xl flex items-center gap-2.5 hover:bg-slate-800/60 transition duration-150">
                          <span className="text-orange-400 text-lg">💰</span>
                          <span className="text-white font-medium text-xs sm:text-sm">Punya side income melimpah</span>
                        </div>
                      </div>

                      <p className="text-slate-300 text-xs sm:text-sm italic border-l-2 border-orange-500 pl-3 pt-1">
                        &ldquo;Masalahnya... Tidak semua orang tahu cara memulai bisnis itu harus dari mana.&rdquo;
                      </p>
                    </div>
                  )}

                  {/* SLIDE 3: Why Business skill is important */}
                  {currentSlide === 2 && (
                    <div className="space-y-4">
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                        PADAHAL ILMU BISNIS ITU <br />
                        <span className="text-orange-400">SANGAT PENTING</span> BUAT:
                      </h2>

                      {/* Bullet list */}
                      <div className="space-y-2.5 max-w-md">
                        <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-200">
                          <CheckCircle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                          <p><strong className="text-white font-semibold">Jualan Online:</strong> Memulai & mengelola e-commerce dengan benar tanpa bakar duit sia-sia.</p>
                        </div>
                        <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-200">
                          <CheckCircle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                          <p><strong className="text-white font-semibold">Bangun Brand Pribadi:</strong> Menarik pelanggan setia lewat personal & corporate branding.</p>
                        </div>
                        <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-200">
                          <CheckCircle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                          <p><strong className="text-white font-semibold">Membaca Peluang Pasar:</strong> Analisis tren agar bisnis tidak tenggelam tergilas zaman.</p>
                        </div>
                      </div>

                      <p className="text-orange-300 text-xs sm:text-sm font-semibold pt-1">
                        ⚡ Tanpa skill ini, banyak ide bagus tidak pernah jadi nyata...
                      </p>
                    </div>
                  )}

                  {/* SLIDE 4: Good News */}
                  {currentSlide === 3 && (
                    <div className="space-y-4">
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                        KABAR BAIKNYA... 🎉
                      </h2>
                      <p className="text-slate-200 text-xs sm:text-sm leading-relaxed max-w-xl">
                        Sekarang kamu <strong className="text-white">tidak harus kuliah jauh ke kota besar</strong> untuk belajar bisnis digital berkualitas.
                      </p>

                      <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-xl text-xs sm:text-sm text-orange-200 leading-relaxed">
                        <strong className="text-white block mb-1">Kuliah Bisnis di Trenggalek:</strong>
                        Di Trenggalek sudah ada kampus yang membuka program kuliah bisnis berbasis teknologi modern! Belajar dekat dengan rumah & keluarga, biaya hidup juga jauh lebih ringan.
                      </div>
                    </div>
                  )}

                  {/* SLIDE 5: ITB Trenggalek info */}
                  {currentSlide === 4 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2.5">
                        <img src={ITBTrenggalekLogo} className="w-10 h-10 object-contain rounded-full bg-white p-0.5 border border-slate-700 shadow" alt="ITB Trenggalek" />
                        <div>
                          <p className="text-xs uppercase tracking-wider text-orange-400 font-bold font-mono leading-none">Kampus Pilihan Terunggul:</p>
                          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1 leading-none">
                            ITB TRENGGALEK
                          </h2>
                        </div>
                      </div>
                      <p className="text-slate-300 text-xs leading-relaxed">
                        Kami menyediakan 3 Program Studi S1 unggulan masa kini. <span className="text-orange-400 font-bold">Pilih salah satu prodi di bawah ini</span> untuk melihat brosur aslinya secara interaktif di panel kanan!
                      </p>

                      <div className="space-y-2 pt-1 font-sans">
                        <div 
                          onClick={() => {
                            setActiveProdi("bisnis");
                            setAutoplay(false);
                          }}
                          className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border transition-all duration-300 cursor-pointer ${
                            activeProdi === "bisnis"
                              ? "bg-orange-500/15 border-orange-500 text-white shadow-lg shadow-orange-500/5"
                              : "bg-slate-800/40 hover:bg-slate-800/60 border-slate-700/50 text-slate-300"
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${activeProdi === "bisnis" ? "bg-orange-500 text-white" : "bg-sky-500 text-white"}`}>1</span>
                          <div className="text-left">
                            <p className="text-xs sm:text-sm font-black">S1 Bisnis Digital</p>
                            <p className="text-[10px] opacity-75">Fakultas Ekonomi &amp; Bisnis</p>
                          </div>
                          {activeProdi === "bisnis" && <span className="ml-auto text-[9px] font-mono bg-orange-500/25 text-orange-400 px-2 py-0.5 rounded border border-orange-500/30 font-bold uppercase animate-pulse">Aktif</span>}
                        </div>

                        <div 
                          onClick={() => {
                            setActiveProdi("ritel");
                            setAutoplay(false);
                          }}
                          className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border transition-all duration-300 cursor-pointer ${
                            activeProdi === "ritel"
                              ? "bg-emerald-500/15 border-emerald-500 text-white shadow-lg shadow-emerald-500/5"
                              : "bg-slate-800/40 hover:bg-slate-800/60 border-slate-700/50 text-slate-300"
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${activeProdi === "ritel" ? "bg-emerald-500 text-white" : "bg-emerald-500 text-white"}`}>2</span>
                          <div className="text-left">
                            <p className="text-xs sm:text-sm font-black">S1 Manajemen Ritel</p>
                            <p className="text-[10px] opacity-75">Fakultas Ekonomi &amp; Bisnis</p>
                          </div>
                          {activeProdi === "ritel" && <span className="ml-auto text-[9px] font-mono bg-emerald-500/25 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 font-bold uppercase animate-pulse">Aktif</span>}
                        </div>

                        <div 
                          onClick={() => {
                            setActiveProdi("komputer");
                            setAutoplay(false);
                          }}
                          className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border transition-all duration-300 cursor-pointer ${
                            activeProdi === "komputer"
                              ? "bg-indigo-500/15 border-indigo-500 text-white shadow-lg shadow-indigo-500/5"
                              : "bg-slate-800/40 hover:bg-slate-800/60 border-slate-700/50 text-slate-300"
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${activeProdi === "komputer" ? "bg-indigo-500 text-white" : "bg-indigo-500 text-white"}`}>3</span>
                          <div className="text-left">
                            <p className="text-xs sm:text-sm font-black">S1 Ilmu Komputer</p>
                            <p className="text-[10px] opacity-75">Fakultas Sains &amp; Teknologi</p>
                          </div>
                          {activeProdi === "komputer" && <span className="ml-auto text-[9px] font-mono bg-indigo-500/25 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/30 font-bold uppercase animate-pulse">Aktif</span>}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SLIDE 6: Call to Action */}
                  {currentSlide === 5 && (
                    <div className="space-y-4">
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                        PENDAFTARAN MAHASISWA <br />
                        <span className="text-orange-400">BARU SUDAH DIBUKA!</span>
                      </h2>
                      <p className="text-slate-200 text-xs sm:text-sm leading-relaxed max-w-lg">
                        Mulai langkah awal suksesmu hari ini. Bergabunglah bersama keluarga besar ITB Trenggalek di Gelombang III PMB Online secara instan!
                      </p>

                      <div className="flex flex-wrap gap-3 pt-2">
                        <button
                          onClick={onRegisterClick}
                          className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-lg hover:shadow-orange-500/20 transition transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                          Daftar Sekarang Juga
                        </button>
                        <button
                          onClick={() => {
                            setAutoplay(true);
                            setCurrentSlide(0);
                          }}
                          className="bg-teal-900 hover:bg-teal-850 text-white font-semibold px-4 py-2.5 rounded-xl text-xs border border-teal-700/50 flex items-center gap-1.5 transition"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          Ulangi Slide
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

          </div>

          {/* Bottom controls: Indicator dots, Prev/Next buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-teal-800/40">
            {/* Dots */}
            <div className="flex gap-2">
              {Array.from({ length: totalSlides }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className={`h-2.5 rounded-full transition-all duration-350 ${
                    idx === currentSlide
                      ? "w-7 bg-orange-500"
                      : "w-2.5 bg-teal-800 hover:bg-teal-700"
                  }`}
                  title={`Ke Slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Prev & Next Arrows */}
            <div className="flex gap-2.5">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full bg-teal-950 hover:bg-teal-900 border border-teal-800/80 text-white flex items-center justify-center transition active:scale-90"
                title="Sebelumnya"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition active:scale-90 shadow-md shadow-orange-600/20"
                title="Berikutnya"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>

        {/* Right Side: The Gorgeous Custom Pose Illustration or Interactive Flyer */}
        <div className="w-full lg:w-[320px] max-w-[340px] shrink-0 flex items-center justify-center bg-slate-950/40 rounded-2xl border border-slate-800 p-4 relative group">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide + (currentSlide === 4 ? `-${activeProdi}` : "")}
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full flex items-center justify-center"
            >
              {currentSlide === 4 ? (
                <div 
                  onClick={() => {
                    const imgMap = {
                      bisnis: BisnisDigitalFlyerImg,
                      ritel: ManajemenRitelFlyerImg,
                      komputer: IlmuKomputerFlyerImg
                    };
                    setZoomFlyerUrl(imgMap[activeProdi]);
                  }}
                  className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl cursor-pointer group/flyer"
                >
                  <img 
                    src={
                      activeProdi === "bisnis"
                        ? BisnisDigitalFlyerImg
                        : activeProdi === "ritel"
                          ? ManajemenRitelFlyerImg
                          : IlmuKomputerFlyerImg
                    } 
                    alt="Brosur Program Studi" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/flyer:scale-105"
                  />
                  <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover/flyer:opacity-100 transition duration-300 flex flex-col items-center justify-center gap-2">
                    <div className="bg-orange-500 text-white rounded-full p-2.5 shadow-lg shadow-orange-500/30 transform scale-90 group-hover/flyer:scale-100 transition duration-300">
                      <Search className="w-5 h-5" />
                    </div>
                    <span className="text-white text-xs font-bold font-mono tracking-wider bg-slate-950/80 px-2.5 py-1 rounded-md border border-slate-800 shadow">Perbesar Brosur</span>
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-slate-950/90 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-slate-800 text-[10px] text-slate-300 font-mono text-center leading-none">
                    Brosur S1 {activeProdi === "bisnis" ? "Bisnis Digital" : activeProdi === "ritel" ? "Manajemen Ritel" : "Ilmu Komputer"}
                  </div>
                </div>
              ) : (
                <>
                  {currentSlide === 0 && <StudentIllustration pose="pointing-forward" />}
                  {currentSlide === 1 && <StudentIllustration pose="pointing-up" />}
                  {currentSlide === 2 && <StudentIllustration pose="surprised" />}
                  {currentSlide === 3 && <StudentIllustration pose="pointing-sides" />}
                  {currentSlide === 5 && <StudentIllustration pose="laptop" />}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* Lightbox Zoom Modal for Flyers */}
      {zoomFlyerUrl && (
        <div 
          className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 transition-all duration-300 animate-in fade-in"
          onClick={() => setZoomFlyerUrl(null)}
        >
          <div 
            className="relative max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setZoomFlyerUrl(null)}
              className="absolute top-5 right-5 bg-slate-950/85 hover:bg-slate-900 text-slate-300 hover:text-white rounded-full p-2 border border-slate-800/80 transition shadow-lg z-10"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-slate-950 shadow-inner border border-slate-800/60">
              <img 
                src={zoomFlyerUrl} 
                alt="Brosur Program Studi Detail" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="pt-3 pb-1 text-center text-slate-400 text-[11px] font-mono flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
              <span>Klik luar area / tombol silang untuk kembali</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
