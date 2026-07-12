import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  UserPlus,
  Search,
  CheckCircle,
  FileText,
  CreditCard,
  PenTool,
  Clock,
  Shield,
  Phone,
  Instagram,
  Youtube,
  FileDown,
  ChevronRight,
  Sparkles,
  Award,
  AlertTriangle,
  Upload,
  RefreshCw,
  TrendingUp,
  MapPin,
  Send,
  Users,
  CheckSquare,
  HelpCircle,
  X,
  PlusCircle,
  Building,
  DollarSign,
  LogOut,
  Key,
  Calendar,
  Mail,
  ArrowLeft,
  ArrowRight,
  Cpu
} from "lucide-react";
import { Applicant, StudyProgram, ApplicantStatus } from "./types";
import { CBT_QUESTIONS, INTEREST_QUESTIONS } from "./data/questions";
import SahabatITBChat from "./components/SahabatITBChat";
import InfoCampaignCarousel from "./components/InfoCampaignCarousel";

// Import generated program studi flyer images
import BisnisDigitalFlyerImg from "./assets/images/bisnis_digital_flyer_1783819515807.jpg";
import IlmuKomputerFlyerImg from "./assets/images/ilmu_komputer_flyer_1783819527827.jpg";
import ManajemenRitelFlyerImg from "./assets/images/manajemen_ritel_flyer_1783819541058.jpg";
import ITBTrenggalekLogo from "./assets/images/itb_trenggalek_actual_logo_1783820066799.jpg";

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<"home" | "portal" | "prodi" | "berita" | "calendar" | "contact" | "admin">("home");
  const [activeFlyerUrl, setActiveFlyerUrl] = useState<string | null>(null);

  // --- Authentication State ---
  // Maba Auth State
  const [mabaUser, setMabaUser] = useState<{ username: string; name: string; email: string; whatsapp: string; applicantId: string } | null>(() => {
    const saved = localStorage.getItem("mabaUser");
    return saved ? JSON.parse(saved) : null;
  });

  // Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("isAdminLoggedIn") === "true";
  });

  // Custom Logout Confirmation Modals
  const [showMabaLogoutConfirm, setShowMabaLogoutConfirm] = useState(false);
  const [showAdminLogoutConfirm, setShowAdminLogoutConfirm] = useState(false);

  // Maba Login Form State
  const [mabaUsernameLogin, setMabaUsernameLogin] = useState("");
  const [mabaPasswordLogin, setMabaPasswordLogin] = useState("");
  const [mabaLoginError, setMabaLoginError] = useState("");
  const [isLoggingInMaba, setIsLoggingInMaba] = useState(false);

  // Maba Register Form State
  const [mabaUsernameReg, setMabaUsernameReg] = useState("");
  const [mabaPasswordReg, setMabaPasswordReg] = useState("");
  const [mabaNameReg, setMabaNameReg] = useState("");
  const [mabaEmailReg, setMabaEmailReg] = useState("");
  const [mabaWhatsappReg, setMabaWhatsappReg] = useState("");
  const [mabaSchoolReg, setMabaSchoolReg] = useState("");
  const [mabaProdi1Reg, setMabaProdi1Reg] = useState<StudyProgram>(StudyProgram.ILMU_KOMPUTER);
  const [mabaProdi2Reg, setMabaProdi2Reg] = useState<StudyProgram>(StudyProgram.BISNIS_DIGITAL);
  const [mabaRegError, setMabaRegError] = useState("");
  const [isRegisteringMaba, setIsRegisteringMaba] = useState(false);
  const [mabaAuthTab, setMabaAuthTab] = useState<"login" | "register">("login");

  // Admin Login Form State
  const [adminUsernameInput, setAdminUsernameInput] = useState("");
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [adminLoginError, setAdminLoginError] = useState("");
  const [isLoggingInAdmin, setIsLoggingInAdmin] = useState(false);
  
  // Registration Form State
  const [regForm, setRegForm] = useState({
    name: "",
    email: "",
    whatsapp: "",
    school: "",
    prodi1: StudyProgram.ILMU_KOMPUTER,
    prodi2: StudyProgram.BISNIS_DIGITAL
  });
  const [isSubmittingReg, setIsSubmittingReg] = useState(false);
  const [successRegId, setSuccessRegId] = useState<string | null>(null);

  // Search State (for Portal Login)
  const [searchId, setSearchId] = useState("");
  const [currentApplicant, setCurrentApplicant] = useState<Applicant | null>(null);
  const [searchError, setSearchError] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // CBT Exam State
  const [examAnswers, setExamAnswers] = useState<Record<string, string>>({});
  const [examActive, setExamActive] = useState(false);
  const [examTimeLeft, setExamTimeLeft] = useState(600); // 10 minutes
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examSubmitting, setExamSubmitting] = useState(false);

  // Interest Test State
  const [interestAnswers, setInterestAnswers] = useState<Record<string, string>>({});
  const [interestSubmitted, setInterestSubmitted] = useState(false);
  const [interestSubmitting, setInterestSubmitting] = useState(false);

  // Public Interest Test State (Beranda)
  const [publicInterestAnswers, setPublicInterestAnswers] = useState<Record<string, string>>({});
  const [publicInterestSubmitted, setPublicInterestSubmitted] = useState(false);
  const [publicInterestSubmitting, setPublicInterestSubmitting] = useState(false);
  const [publicInterestRecommendation, setPublicInterestRecommendation] = useState<any>(null);
  const [publicInterestStep, setPublicInterestStep] = useState(0);

  // Document Upload State
  const [uploadDocType, setUploadDocType] = useState<"ijazah" | "ktp" | "foto">("ijazah");
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});
  const [uploadingDoc, setUploadingDoc] = useState(false);

  // Signature Pad State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  // Admin Dashboard State
  const [adminApplicants, setAdminApplicants] = useState<Applicant[]>([]);
  const [adminSearch, setAdminSearch] = useState("");
  const [adminFilterProdi, setAdminFilterProdi] = useState("All");
  const [adminFilterStatus, setAdminFilterStatus] = useState("All");
  const [selectedAdminApplicant, setSelectedAdminApplicant] = useState<Applicant | null>(null);
  const [updatingAdminStatus, setUpdatingAdminStatus] = useState(false);
  const [loadingAdminData, setLoadingAdminData] = useState(false);

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    examCompleted: 0,
    graduated: 0,
    pendingPayment: 0
  });

  // Social Media Hub & Contact Form States
  const [socialLiked, setSocialLiked] = useState<Record<string, boolean>>({});
  const [socialLikesOffset, setSocialLikesOffset] = useState<Record<string, number>>({});
  const [socialFilter, setSocialFilter] = useState<"all" | "tiktok" | "instagram" | "youtube">("all");
  const [selectedVideo, setSelectedVideo] = useState<{ title: string; embedUrl: string } | null>(null);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [successContactMsg, setSuccessContactMsg] = useState(false);

  // Fetch individual applicant by ID helper
  const refreshApplicantData = async (id: string) => {
    try {
      const res = await fetch(`/api/applicant/${id}`);
      if (res.ok) {
        const data = await res.json();
        setCurrentApplicant(data);
        // Sync uploaded files from db
        const files: Record<string, string> = {};
        if (data.documents?.ijazah) files.ijazah = data.documents.ijazah.name;
        if (data.documents?.ktp) files.ktp = data.documents.ktp.name;
        if (data.documents?.foto) files.foto = data.documents.foto.name;
        setUploadedFiles(files);
      }
    } catch (err) {
      console.error("Error refreshing applicant data:", err);
    }
  };

  const toggleSocialLike = (postId: string) => {
    setSocialLiked(prev => {
      const isLiked = !!prev[postId];
      setSocialLikesOffset(offsetPrev => ({
        ...offsetPrev,
        [postId]: (offsetPrev[postId] || 0) + (isLiked ? -1 : 1)
      }));
      return {
        ...prev,
        [postId]: !isLiked
      };
    });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingContact(true);
    setTimeout(() => {
      setIsSubmittingContact(false);
      setSuccessContactMsg(true);
      setContactName("");
      setContactEmail("");
      setContactPhone("");
      setContactSubject("");
      setContactMessage("");
    }, 1200);
  };

  // Fetch Admin Data
  const fetchAdminApplicants = async () => {
    setLoadingAdminData(true);
    try {
      const res = await fetch("/api/applicants");
      if (res.ok) {
        const data = await res.json();
        setAdminApplicants(data);
        calculateStats(data);
        
        // Sync currently viewed admin applicant if open
        if (selectedAdminApplicant) {
          const updated = data.find((a: Applicant) => a.id === selectedAdminApplicant.id);
          if (updated) setSelectedAdminApplicant(updated);
        }
      }
    } catch (err) {
      console.error("Error fetching admin data", err);
    } finally {
      setLoadingAdminData(false);
    }
  };

  const calculateStats = (applicants: Applicant[]) => {
    const total = applicants.length;
    const paid = applicants.filter(a => a.payment?.status === "Paid").length;
    const examCompleted = applicants.filter(a => a.exam?.completedAt).length;
    const graduated = applicants.filter(a => a.status.startsWith("Graduated_")).length;
    const pendingPayment = applicants.filter(a => a.payment?.status === "Pending").length;

    setStats({ total, paid, examCompleted, graduated, pendingPayment });
  };

  useEffect(() => {
    if (activeTab === "admin" && isAdminLoggedIn) {
      fetchAdminApplicants();
    }
  }, [activeTab, isAdminLoggedIn]);

  // Sync currentApplicant based on logged-in Maba user
  useEffect(() => {
    if (mabaUser && mabaUser.applicantId) {
      refreshApplicantData(mabaUser.applicantId);
    } else {
      setCurrentApplicant(null);
    }
  }, [mabaUser]);

  // --- Auth Handlers ---
  // Maba Login handler
  const handleMabaLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mabaUsernameLogin.trim() || !mabaPasswordLogin.trim()) return;
    setIsLoggingInMaba(true);
    setMabaLoginError("");
    try {
      const res = await fetch("/api/maba/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: mabaUsernameLogin.trim(), password: mabaPasswordLogin.trim() })
      });
      if (res.ok) {
        const data = await res.json();
        setMabaUser(data.account);
        localStorage.setItem("mabaUser", JSON.stringify(data.account));
        if (data.applicant) {
          setCurrentApplicant(data.applicant);
          setSearchId(data.applicant.id);
        }
        setMabaUsernameLogin("");
        setMabaPasswordLogin("");
      } else {
        const err = await res.json();
        setMabaLoginError(err.message || "Username atau password salah.");
      }
    } catch (err) {
      console.error(err);
      setMabaLoginError("Gagal menghubungkan ke server.");
    } finally {
      setIsLoggingInMaba(false);
    }
  };

  // Maba Register handler
  const handleMabaRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mabaUsernameReg.trim() || !mabaPasswordReg.trim() || !mabaNameReg.trim() || !mabaEmailReg.trim() || !mabaWhatsappReg.trim() || !mabaSchoolReg.trim()) {
      setMabaRegError("Harap isi semua data pendaftaran dengan lengkap.");
      return;
    }
    setIsRegisteringMaba(true);
    setMabaRegError("");
    try {
      const res = await fetch("/api/maba/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: mabaUsernameReg.trim(),
          password: mabaPasswordReg.trim(),
          name: mabaNameReg.trim(),
          email: mabaEmailReg.trim(),
          whatsapp: mabaWhatsappReg.trim(),
          school: mabaSchoolReg.trim(),
          prodi1: mabaProdi1Reg,
          prodi2: mabaProdi2Reg
        })
      });
      if (res.ok) {
        const data = await res.json();
        alert(`Selamat! Akun Maba & Pendaftaran PMB Anda berhasil dibuat.\nNomor Pendaftaran: ${data.applicant.id}`);
        setMabaUser(data.account);
        localStorage.setItem("mabaUser", JSON.stringify(data.account));
        if (data.applicant) {
          setCurrentApplicant(data.applicant);
          setSearchId(data.applicant.id);
        }
        setMabaUsernameReg("");
        setMabaPasswordReg("");
        setMabaNameReg("");
        setMabaEmailReg("");
        setMabaWhatsappReg("");
        setMabaSchoolReg("");
      } else {
        const err = await res.json();
        setMabaRegError(err.message || "Gagal membuat akun.");
      }
    } catch (err) {
      console.error(err);
      setMabaRegError("Gagal menghubungkan ke server.");
    } finally {
      setIsRegisteringMaba(false);
    }
  };

  // Maba Logout handler
  const handleMabaLogout = () => {
    setShowMabaLogoutConfirm(true);
  };

  const confirmMabaLogout = () => {
    setMabaUser(null);
    setCurrentApplicant(null);
    setSearchId("");
    localStorage.removeItem("mabaUser");
    setShowMabaLogoutConfirm(false);
    setActiveTab("home"); // Redirect to Beranda for smooth flow
  };

  // Admin Login handler
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUsernameInput.trim() || !adminPasswordInput.trim()) return;
    setIsLoggingInAdmin(true);
    setAdminLoginError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: adminUsernameInput.trim(), password: adminPasswordInput.trim() })
      });
      if (res.ok) {
        setIsAdminLoggedIn(true);
        localStorage.setItem("isAdminLoggedIn", "true");
        setAdminUsernameInput("");
        setAdminPasswordInput("");
        // Load admin data instantly
        fetchAdminApplicants();
      } else {
        const err = await res.json();
        setAdminLoginError(err.message || "Username atau password salah.");
      }
    } catch (err) {
      console.error(err);
      setAdminLoginError("Gagal menghubungkan ke server.");
    } finally {
      setIsLoggingInAdmin(false);
    }
  };

  // Admin Logout handler
  const handleAdminLogout = () => {
    setShowAdminLogoutConfirm(true);
  };

  const confirmAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem("isAdminLoggedIn");
    setAdminApplicants([]);
    setShowAdminLogoutConfirm(false);
    setActiveTab("home"); // Redirect to Beranda for smooth flow
  };

  // Handle CBT Exam Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (examActive && examTimeLeft > 0) {
      timer = setInterval(() => {
        setExamTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (examTimeLeft === 0 && examActive) {
      handleExamSubmit(true);
    }
    return () => clearInterval(timer);
  }, [examActive, examTimeLeft]);

  // Format exam time
  const formatTimeLeft = () => {
    const min = Math.floor(examTimeLeft / 60);
    const sec = examTimeLeft % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  // Submit registration form
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReg(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(regForm)
      });
      if (res.ok) {
        const data = await res.json();
        setSuccessRegId(data.id);
        setSearchId(data.id);
        setCurrentApplicant(data);
        setActiveTab("portal");
        // Clear form
        setRegForm({
          name: "",
          email: "",
          whatsapp: "",
          school: "",
          prodi1: StudyProgram.ILMU_KOMPUTER,
          prodi2: StudyProgram.BISNIS_DIGITAL
        });
      } else {
        const err = await res.json();
        alert(err.message || "Gagal melakukan pendaftaran.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi server.");
    } finally {
      setIsSubmittingReg(false);
    }
  };

  // Check Application Status
  const handleSearchStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    setIsSearching(true);
    setSearchError("");
    try {
      const res = await fetch(`/api/applicant/${searchId.trim()}`);
      if (res.ok) {
        const data = await res.json();
        setCurrentApplicant(data);
        // Sync files
        const files: Record<string, string> = {};
        if (data.documents?.ijazah) files.ijazah = data.documents.ijazah.name;
        if (data.documents?.ktp) files.ktp = data.documents.ktp.name;
        if (data.documents?.foto) files.foto = data.documents.foto.name;
        setUploadedFiles(files);
      } else {
        const err = await res.json();
        setSearchError(err.message || "Nomor pendaftaran tidak cocok.");
        setCurrentApplicant(null);
      }
    } catch (err) {
      console.error(err);
      setSearchError("Gagal terhubung ke database.");
      setCurrentApplicant(null);
    } finally {
      setIsSearching(false);
    }
  };

  // Simulate instant payment
  const handleSimulatePayment = async () => {
    if (!currentApplicant) return;
    try {
      const res = await fetch("/api/payment/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: currentApplicant.id })
      });
      if (res.ok) {
        const updated = await res.json();
        setCurrentApplicant(updated);
        alert("Simulasi pembayaran berhasil! Status pendaftaran diperbarui menjadi LUNAS (PAID).");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle mock file uploads
  const handleFileUploadMock = (docType: "ijazah" | "ktp" | "foto", fileName: string) => {
    if (!currentApplicant) return;
    setUploadingDoc(true);
    
    setTimeout(async () => {
      try {
        const res = await fetch("/api/upload-document", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: currentApplicant.id,
            docType,
            docName: fileName,
            docSize: "1.4 MB",
            base64: "dummy_file_uploaded"
          })
        });
        if (res.ok) {
          const updated = await res.json();
          setCurrentApplicant(updated);
          setUploadedFiles(prev => ({ ...prev, [docType]: fileName }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setUploadingDoc(false);
      }
    }, 1200);
  };

  // Signature canvas handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";

    let clientX, clientY;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let clientX, clientY;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const saveSignature = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !currentApplicant || !hasSignature) return;
    
    const signatureBase64 = canvas.toDataURL("image/png");
    try {
      const res = await fetch("/api/signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: currentApplicant.id, signature: signatureBase64 })
      });
      if (res.ok) {
        alert("Tanda tangan elektronik Anda berhasil disimpan untuk verifikasi keabsahan dokumen!");
        refreshApplicantData(currentApplicant.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Exam CBT Answers
  const handleExamSubmit = async (auto = false) => {
    if (!currentApplicant) return;
    setExamSubmitting(true);
    
    // Grade the test
    let score = 0;
    CBT_QUESTIONS.forEach(q => {
      if (examAnswers[q.id] === q.correctAnswer) {
        score += 12.5; // 8 questions, each 12.5 points = 100 max
      }
    });

    try {
      const res = await fetch("/api/exam/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: currentApplicant.id,
          answers: examAnswers,
          score
        })
      });
      if (res.ok) {
        const updated = await res.json();
        setCurrentApplicant(updated);
        setExamActive(false);
        setExamSubmitted(true);
        if (auto) {
          alert("Waktu habis! Ujian seleksi Anda telah dikirimkan secara otomatis.");
        } else {
          alert(`Ujian berhasil dikirim! Skor Anda: ${score}/100.`);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setExamSubmitting(false);
    }
  };

  // Submit AI Interest Test
  const handleInterestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentApplicant) return;
    setInterestSubmitting(true);

    try {
      const res = await fetch("/api/interest-test/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: currentApplicant.id,
          answers: interestAnswers
        })
      });
      if (res.ok) {
        const updated = await res.json();
        setCurrentApplicant(updated);
        setInterestSubmitted(true);
        alert("Tes bakat & minat Anda berhasil dianalisis menggunakan Gemini AI secara real-time!");
      }
    } catch (err) {
      console.error(err);
      alert("Gagal melakukan analisis AI.");
    } finally {
      setInterestSubmitting(false);
    }
  };

  // Submit Public AI Interest Test (Beranda)
  const handlePublicInterestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPublicInterestSubmitting(true);

    try {
      const res = await fetch("/api/interest-test/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: publicInterestAnswers
        })
      });
      if (res.ok) {
        const data = await res.json();
        setPublicInterestRecommendation(data.recommendation);
        setPublicInterestSubmitted(true);
        alert("Tes bakat & minat Anda berhasil dianalisis menggunakan Gemini AI secara real-time!");
      } else {
        alert("Gagal melakukan analisis AI.");
      }
    } catch (err) {
      console.error(err);
      alert("Gagal melakukan analisis AI.");
    } finally {
      setPublicInterestSubmitting(false);
    }
  };

  // Admin Update Applicant Status
  const handleAdminUpdateStatus = async (status: ApplicantStatus) => {
    if (!selectedAdminApplicant) return;
    setUpdatingAdminStatus(true);
    try {
      const res = await fetch("/api/admin/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedAdminApplicant.id, status })
      });
      if (res.ok) {
        await fetchAdminApplicants();
        alert(`Status pendaftar ${selectedAdminApplicant.name} berhasil diperbarui menjadi: ${status}. Notifikasi otomatis terkirim.`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingAdminStatus(false);
    }
  };

  const handleAdminSimulatePayment = async (applicantId: string) => {
    try {
      const res = await fetch("/api/payment/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: applicantId })
      });
      if (res.ok) {
        await fetchAdminApplicants();
        alert("Simulasi pembayaran lunas terverifikasi.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered applicants for Admin
  const filteredApplicants = adminApplicants.filter(app => {
    const matchesSearch = 
      app.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
      app.id.toLowerCase().includes(adminSearch.toLowerCase()) ||
      app.school.toLowerCase().includes(adminSearch.toLowerCase());

    const matchesProdi = 
      adminFilterProdi === "All" ||
      app.prodi1 === adminFilterProdi ||
      app.prodi2 === adminFilterProdi;

    const matchesStatus = 
      adminFilterStatus === "All" ||
      (adminFilterStatus === "Paid" && app.payment?.status === "Paid") ||
      (adminFilterStatus === "Pending" && app.payment?.status === "Pending") ||
      (adminFilterStatus === "Graduated" && app.status.startsWith("Graduated_")) ||
      app.status === adminFilterStatus;

    return matchesSearch && matchesProdi && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Professional Branding Header */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-40 shadow-xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Institute Name */}
          <div className="flex items-center gap-3.5 group cursor-pointer" onClick={() => setActiveTab("home")}>
            <div className="w-12 h-12 rounded-full overflow-hidden bg-white border border-slate-700/80 shadow-lg flex items-center justify-center p-0.5 shrink-0 transition-all duration-300 group-hover:scale-105 group-hover:shadow-sky-500/10">
              <img 
                src={ITBTrenggalekLogo} 
                alt="ITB Trenggalek Logo" 
                className="w-full h-full object-contain rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-wide bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300">
                  ITB TRENGGALEK
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-sky-950 to-teal-950 text-sky-400 border border-sky-850 shadow-inner">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  PMB 2026/2027
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-semibold tracking-wider uppercase font-mono mt-0.5">
                Institut Teknologi dan Bisnis Trenggalek
              </p>
            </div>
          </div>

          {/* Top Header Quick Contacts / Status */}
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/6285648730190"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/20 text-emerald-400 text-xs font-bold transition duration-150"
            >
              <Phone className="w-3.5 h-3.5 shrink-0 animate-bounce" />
              <span>CS PMB: 0856-4873-0190</span>
            </a>
            <div className="flex items-center gap-2 bg-slate-950/60 px-3.5 py-1.5 rounded-xl border border-slate-800/80 text-[11px] font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="hidden xs:inline">Server PMB:</span> <span className="text-emerald-400 font-bold">ONLINE</span>
            </div>
          </div>
        </div>

        {/* Bottom Tab Navigation Bar */}
        <div className="bg-slate-950/45 border-t border-slate-800/60 py-2.5 overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-3">
              {/* Modern Segmented Rounded Nav Controller */}
              <nav className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800/80 shadow-inner w-full overflow-x-auto scrollbar-none gap-1">
                <button
                  onClick={() => setActiveTab("home")}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 shrink-0 ${
                    activeTab === "home"
                      ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-md font-bold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span>Beranda</span>
                </button>
                
                <button
                  onClick={() => setActiveTab("portal")}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 shrink-0 ${
                    activeTab === "portal"
                      ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-md font-bold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <UserPlus className="w-4 h-4 shrink-0" />
                  <span>Pendaftaran</span>
                </button>

                <button
                  onClick={() => setActiveTab("prodi")}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 shrink-0 ${
                    activeTab === "prodi"
                      ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-md font-bold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <Award className="w-4 h-4 shrink-0" />
                  <span>Prodi</span>
                </button>

                <button
                  onClick={() => setActiveTab("berita")}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 shrink-0 ${
                    activeTab === "berita"
                      ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-md font-bold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <TrendingUp className="w-4 h-4 shrink-0" />
                  <span>Berita</span>
                </button>

                <button
                  onClick={() => setActiveTab("calendar")}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 shrink-0 ${
                    activeTab === "calendar"
                      ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-md font-bold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span>Kalender</span>
                </button>

                <button
                  onClick={() => setActiveTab("contact")}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 shrink-0 ${
                    activeTab === "contact"
                      ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-md font-bold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <Mail className="w-4 h-4 shrink-0" />
                  <span>Kontak</span>
                </button>

                <button
                  onClick={() => setActiveTab("admin")}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 shrink-0 ${
                    activeTab === "admin"
                      ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-md font-bold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <Shield className="w-4 h-4 shrink-0" />
                  <span>Admin</span>
                </button>
              </nav>

              {/* Status Indicator */}
              <div className="hidden md:flex items-center gap-2.5 text-[11px] font-mono text-slate-400 bg-slate-900/60 border border-slate-800/80 px-3.5 py-1.5 rounded-full shadow-inner">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0"></span>
                <span>Pendaftaran Online Terbuka 24 Jam</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* 1. HOME TAB: INFORMATION, ACCREDITATION & STUDY PROGRAMS */}
        {activeTab === "home" && (
          <div className="space-y-12">
            
            {/* Hero Section Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 sm:p-12 md:p-16 shadow-2xl flex flex-col md:flex-row items-center gap-8">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-gradient-to-bl from-sky-500/20 to-indigo-500/0 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 bg-gradient-to-tr from-emerald-500/10 to-indigo-500/0 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 bg-sky-950/80 text-sky-400 px-3 py-1.5 rounded-full text-xs font-semibold border border-sky-900/60 shadow-lg">
                  <div className="w-5 h-5 rounded-full overflow-hidden bg-white flex items-center justify-center p-0.5 border border-sky-500/30 shrink-0">
                    <img 
                      src={ITBTrenggalekLogo} 
                      alt="ITB Trenggalek Mini Logo" 
                      className="w-full h-full object-contain rounded-full"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span>Penerimaan Mahasiswa Baru Gelombang III</span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-none">
                  Unggul, Kreatif, <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-teal-300 to-indigo-400">
                    Berjiwa Sociopreneur
                  </span>
                </h1>
                <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
                  Gabung bersama Institut Teknologi dan Bisnis Trenggalek untuk masa depan cerah di industri teknologi dan manajemen ritel modern. Pendaftaran online sangat mudah dengan tes CBT mandiri serta tes bakat minat berbasis AI.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => {
                      setActiveTab("portal");
                      const formSection = document.getElementById("pendaftaran-form-anchor");
                      if (formSection) formSection.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
                  >
                    Daftar Sekarang
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Graphic Feature Cards */}
              <div className="w-full md:w-auto shrink-0 grid grid-cols-2 gap-4 max-w-sm">
                <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
                  <Award className="w-8 h-8 text-sky-400 mb-3" />
                  <h4 className="font-bold text-white text-sm">Akreditasi</h4>
                  <p className="text-xs text-slate-400 mt-1 font-mono">Sangat Baik</p>
                </div>
                <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
                  <CheckSquare className="w-8 h-8 text-emerald-400 mb-3" />
                  <h4 className="font-bold text-white text-sm">Beasiswa</h4>
                  <p className="text-xs text-slate-400 mt-1 font-mono">KIP-K / Prestasi</p>
                </div>
                <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
                  <TrendingUp className="w-8 h-8 text-indigo-400 mb-3" />
                  <h4 className="font-bold text-white text-sm">Kurikulum</h4>
                  <p className="text-xs text-slate-400 mt-1 font-mono">MBKM Terapan</p>
                </div>
                <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
                  <Sparkles className="w-8 h-8 text-amber-400 mb-3" />
                  <h4 className="font-bold text-white text-sm">Fasilitas</h4>
                  <p className="text-xs text-slate-400 mt-1 font-mono">Lab Komputer & AC</p>
                </div>
              </div>
            </div>

            {/* Interactive Marketing Campaign Slides (Carousel) */}
            <InfoCampaignCarousel 
              onRegisterClick={() => {
                setActiveTab("portal");
                setTimeout(() => {
                  const formSection = document.getElementById("pendaftaran-form-anchor");
                  if (formSection) formSection.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
            />

            {/* 3 Study Programs Showcase */}
            <div className="space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Pilihan Program Studi Unggulan</h2>
                <p className="text-slate-400 text-xs sm:text-sm">
                  Institut Teknologi dan Bisnis Trenggalek memiliki 3 program studi sarjana (S1) modern yang diselaraskan dengan kebutuhan dunia digital global.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Prodi 1: Ilmu Komputer */}
                <div id="prodi-ilmu-komputer" className="bg-slate-900 border border-slate-800 hover:border-sky-500/50 transition duration-300 rounded-2xl p-5 flex flex-col justify-between space-y-5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 bg-sky-950 text-sky-400 text-[10px] font-bold px-3 py-1 rounded-bl-xl border-l border-b border-sky-900 z-10">
                    Sains & Teknologi
                  </div>
                  
                  <div className="space-y-4">
                    {/* Flyer Image Container */}
                    <div 
                      onClick={() => setActiveFlyerUrl(IlmuKomputerFlyerImg)}
                      className="relative h-56 w-full overflow-hidden rounded-xl bg-slate-950 cursor-pointer shadow-inner border border-slate-800/80"
                    >
                      <img 
                        src={IlmuKomputerFlyerImg} 
                        alt="Brosur S1 Ilmu Komputer" 
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 opacity-90 group-hover:opacity-100"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-40"></div>
                      <div className="absolute bottom-3 left-3 bg-slate-900/95 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-700/80 flex items-center gap-1.5 text-[10px] text-sky-400 font-bold shadow-md transform translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <Search className="w-3 h-3 text-sky-400" />
                        <span>Perbesar Brosur</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-sky-950/80 w-10 h-10 rounded-xl flex items-center justify-center text-sky-400 border border-sky-900/55">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg">S1 Ilmu Komputer</h3>
                        <p className="text-xs text-slate-400">Fakultas Sains dan Teknologi</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Mempelajari rekayasa perangkat lunak, pemrograman web & mobile, artificial intelligence (AI), machine learning, cybersecurity, serta sistem basis data berskala enterprise.
                    </p>
                  </div>

                  <div className="border-t border-slate-800 pt-4 space-y-4">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Karir Terkait:</span>
                      <div className="flex flex-wrap gap-1.5 text-[10px] mt-1">
                        <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">Software Developer</span>
                        <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">Data Scientist</span>
                        <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">Network Admin</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setRegForm(prev => ({ ...prev, prodi1: StudyProgram.ILMU_KOMPUTER }));
                        setActiveTab("portal");
                        setTimeout(() => {
                          const formSection = document.getElementById("pendaftaran-form-anchor");
                          if (formSection) formSection.scrollIntoView({ behavior: "smooth" });
                        }, 100);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1.5"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      Daftar Sekarang
                    </button>
                  </div>
                </div>

                {/* Prodi 2: Manajemen Ritel */}
                <div id="prodi-manajemen-ritel" className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition duration-300 rounded-2xl p-5 flex flex-col justify-between space-y-5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 bg-emerald-950/50 text-emerald-400 text-[10px] font-bold px-3 py-1 rounded-bl-xl border-l border-b border-emerald-900 z-10">
                    Ekonomi & Bisnis
                  </div>

                  <div className="space-y-4">
                    {/* Flyer Image Container */}
                    <div 
                      onClick={() => setActiveFlyerUrl(ManajemenRitelFlyerImg)}
                      className="relative h-56 w-full overflow-hidden rounded-xl bg-slate-950 cursor-pointer shadow-inner border border-slate-800/80"
                    >
                      <img 
                        src={ManajemenRitelFlyerImg} 
                        alt="Brosur S1 Manajemen Ritel" 
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 opacity-90 group-hover:opacity-100"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-40"></div>
                      <div className="absolute bottom-3 left-3 bg-slate-900/95 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-700/80 flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold shadow-md transform translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <Search className="w-3 h-3 text-emerald-400" />
                        <span>Perbesar Brosur</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-950/80 w-10 h-10 rounded-xl flex items-center justify-center text-emerald-400 border border-emerald-900/55">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg">S1 Manajemen Ritel</h3>
                        <p className="text-xs text-slate-400">Fakultas Ekonomi dan Bisnis</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Menguasai strategi pemasaran ritel, optimasi supply chain, tata kelola waralaba modern, perilaku konsumen, serta integrasi operasional gerai ritel modern offline dan online.
                    </p>
                  </div>

                  <div className="border-t border-slate-800 pt-4 space-y-4">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Karir Terkait:</span>
                      <div className="flex flex-wrap gap-1.5 text-[10px] mt-1">
                        <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">Retail Manager</span>
                        <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">Merchandiser</span>
                        <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">Supply Chain Analyst</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setRegForm(prev => ({ ...prev, prodi1: StudyProgram.MANAJEMEN_RITEL }));
                        setActiveTab("portal");
                        setTimeout(() => {
                          const formSection = document.getElementById("pendaftaran-form-anchor");
                          if (formSection) formSection.scrollIntoView({ behavior: "smooth" });
                        }, 100);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1.5"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      Daftar Sekarang
                    </button>
                  </div>
                </div>

                {/* Prodi 3: Bisnis Digital */}
                <div id="prodi-bisnis-digital" className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition duration-300 rounded-2xl p-5 flex flex-col justify-between space-y-5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 bg-indigo-950/50 text-indigo-400 text-[10px] font-bold px-3 py-1 rounded-bl-xl border-l border-b border-indigo-900 z-10">
                    Ekonomi & Bisnis
                  </div>

                  <div className="space-y-4">
                    {/* Flyer Image Container */}
                    <div 
                      onClick={() => setActiveFlyerUrl(BisnisDigitalFlyerImg)}
                      className="relative h-56 w-full overflow-hidden rounded-xl bg-slate-950 cursor-pointer shadow-inner border border-slate-800/80"
                    >
                      <img 
                        src={BisnisDigitalFlyerImg} 
                        alt="Brosur S1 Bisnis Digital" 
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 opacity-90 group-hover:opacity-100"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-40"></div>
                      <div className="absolute bottom-3 left-3 bg-slate-900/95 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-700/80 flex items-center gap-1.5 text-[10px] text-indigo-400 font-bold shadow-md transform translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <Search className="w-3 h-3 text-indigo-400" />
                        <span>Perbesar Brosur</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-950/80 w-10 h-10 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-900/55">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg">S1 Bisnis Digital</h3>
                        <p className="text-xs text-slate-400">Fakultas Ekonomi dan Bisnis</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Mempelajari perancangan startup digital, strategi e-commerce, digital marketing (SEO, SEM, Ads), fintech, analisis big data untuk bisnis, serta inovasi bisnis berbasis komputasi.
                    </p>
                  </div>

                  <div className="border-t border-slate-800 pt-4 space-y-4">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Karir Terkait:</span>
                      <div className="flex flex-wrap gap-1.5 text-[10px] mt-1">
                        <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">Startup Founder</span>
                        <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">Digital Strategist</span>
                        <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">E-commerce Specialist</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setRegForm(prev => ({ ...prev, prodi1: StudyProgram.BISNIS_DIGITAL }));
                        setActiveTab("portal");
                        setTimeout(() => {
                          const formSection = document.getElementById("pendaftaran-form-anchor");
                          if (formSection) formSection.scrollIntoView({ behavior: "smooth" });
                        }, 100);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-600 hover:to-teal-600 shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1.5"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      Daftar Sekarang
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Interactive AI Talent & Interest Test Section (Beranda) */}
            <div id="tes-minat-bakat-beranda" className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-indigo-900/45 p-6 sm:p-8 md:p-10 shadow-2xl space-y-6">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-gradient-to-bl from-indigo-500/15 to-purple-500/0 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-slate-800">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-[11px] font-bold border border-indigo-500/20 shadow-inner">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    <span>Fitur Unggulan Calon Mahasiswa</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Tes Bakat & Minat Mahasiswa Baru
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                    Tes ini dirancang khusus untuk mengetahui potensi calon pendaftar sebelum melangkah ke dunia perkuliahan. Setelah kuesioner singkat ini diisi, hasil analisis cerdas <strong>Gemini AI Analyzer</strong> secara real-time akan membantu Anda mengetahui prodi apa yang paling cocok untuk Anda pilih!
                  </p>
                </div>
                <div className="shrink-0">
                  <div className="bg-indigo-950/80 border border-indigo-800 p-4 rounded-2xl flex items-center gap-3">
                    <div className="bg-indigo-900/60 p-2.5 rounded-xl border border-indigo-700/50">
                      <Cpu className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs font-mono">Gemini AI Engine</h4>
                      <p className="text-[10px] text-indigo-300 mt-0.5">Analisis Personal Instan</p>
                    </div>
                  </div>
                </div>
              </div>

              {!publicInterestSubmitted ? (
                <div className="space-y-6">
                  {/* Step Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
                      <span>Pertanyaan {publicInterestStep + 1} dari {INTEREST_QUESTIONS.length}</span>
                      <span className="font-bold text-indigo-400">
                        {Math.round(((publicInterestStep) / INTEREST_QUESTIONS.length) * 100)}% Selesai
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-sky-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${((publicInterestStep + 1) / INTEREST_QUESTIONS.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Active Question Card */}
                  <div className="bg-slate-950/85 p-6 rounded-2xl border border-slate-800/80 space-y-4 animate-in fade-in duration-200">
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      {publicInterestStep + 1}. {INTEREST_QUESTIONS[publicInterestStep].question}
                    </h3>

                    <div className="space-y-3">
                      {INTEREST_QUESTIONS[publicInterestStep].options.map((opt) => {
                        const isSelected = publicInterestAnswers[INTEREST_QUESTIONS[publicInterestStep].id] === opt.value;
                        return (
                          <div
                            key={opt.value}
                            onClick={() => {
                              setPublicInterestAnswers(prev => ({
                                ...prev,
                                [INTEREST_QUESTIONS[publicInterestStep].id]: opt.value
                              }));
                            }}
                            className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer text-xs sm:text-sm transition-all duration-200 ${
                              isSelected
                                ? "bg-indigo-950/40 border-indigo-500 text-white shadow-lg font-medium"
                                : "bg-slate-900 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700 text-slate-300"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`public-interest-${INTEREST_QUESTIONS[publicInterestStep].id}`}
                              value={opt.value}
                              checked={isSelected}
                              onChange={() => {}} // handled by parent div click
                              className="accent-indigo-500 mt-1"
                            />
                            <div className="space-y-1">
                              <p className="font-bold text-white">{opt.value}</p>
                              <p className="text-[11px] text-slate-400 leading-relaxed">{opt.label}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between items-center pt-2">
                    <button
                      type="button"
                      disabled={publicInterestStep === 0}
                      onClick={() => setPublicInterestStep(prev => prev - 1)}
                      className="bg-slate-850 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none text-slate-300 font-semibold py-2.5 px-5 rounded-xl text-xs transition flex items-center gap-1.5 border border-slate-800"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Kembali</span>
                    </button>

                    {publicInterestStep < INTEREST_QUESTIONS.length - 1 ? (
                      <button
                        type="button"
                        disabled={!publicInterestAnswers[INTEREST_QUESTIONS[publicInterestStep].id]}
                        onClick={() => setPublicInterestStep(prev => prev + 1)}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:pointer-events-none text-white font-semibold py-2.5 px-5 rounded-xl text-xs transition flex items-center gap-1.5 shadow-md"
                      >
                        <span>Lanjut</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={
                          publicInterestSubmitting || 
                          Object.keys(publicInterestAnswers).length < INTEREST_QUESTIONS.length
                        }
                        onClick={handlePublicInterestSubmit}
                        className="bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-600 hover:to-sky-600 disabled:opacity-50 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition flex items-center gap-2 shadow-lg"
                      >
                        {publicInterestSubmitting ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Menganalisis Potensi (Gemini AI)...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                            <span>Kirim Jawaban Ke AI</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* RESULTS RENDERING */
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                  <div className="bg-indigo-950/15 border border-indigo-900/35 p-5 sm:p-6 rounded-2xl space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-900/40 p-2 rounded-xl border border-indigo-800">
                        <Award className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-white text-sm sm:text-base">
                          Rekomendasi Program Studi Berdasarkan Potensi Anda:
                        </h4>
                        <p className="text-[10px] sm:text-xs text-slate-400">Dianalisis secara objektif menggunakan kecerdasan buatan Gemini AI</p>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-indigo-900/20 text-center sm:text-left">
                      <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider font-mono">Rekomendasi Utama:</span>
                      <h3 className="text-base sm:text-lg font-black text-indigo-300 mt-1">
                        {publicInterestRecommendation?.primaryProdi}
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Mengapa Pilihan ini Cocok untuk Anda?</span>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic bg-slate-950 p-4 rounded-xl border border-slate-850">
                        "{publicInterestRecommendation?.explanation || "Penjelasan kecocokan sedang disiapkan."}"
                      </p>
                    </div>

                    {/* Compatibility percentages bar chart */}
                    <div className="space-y-3 pt-2">
                      <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider block">
                        Presentase Kecocokan Seluruh Jurusan:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-900 space-y-2">
                          <div className="flex justify-between text-xs font-mono text-slate-300">
                            <span className="font-bold">S1 Ilmu Komputer</span>
                            <span className="text-sky-400 font-black">{publicInterestRecommendation?.scores?.["Ilmu Komputer"] || 60}%</span>
                          </div>
                          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-sky-500 h-full rounded-full transition-all duration-500" 
                              style={{ width: `${publicInterestRecommendation?.scores?.["Ilmu Komputer"] || 60}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-900 space-y-2">
                          <div className="flex justify-between text-xs font-mono text-slate-300">
                            <span className="font-bold">S1 Bisnis Digital</span>
                            <span className="text-indigo-400 font-black">{publicInterestRecommendation?.scores?.["Bisnis Digital"] || 50}%</span>
                          </div>
                          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
                              style={{ width: `${publicInterestRecommendation?.scores?.["Bisnis Digital"] || 50}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-900 space-y-2">
                          <div className="flex justify-between text-xs font-mono text-slate-300">
                            <span className="font-bold">S1 Manajemen Ritel</span>
                            <span className="text-emerald-400 font-black">{publicInterestRecommendation?.scores?.["Manajemen Ritel"] || 40}%</span>
                          </div>
                          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                              style={{ width: `${publicInterestRecommendation?.scores?.["Manajemen Ritel"] || 40}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setPublicInterestAnswers({});
                        setPublicInterestSubmitted(false);
                        setPublicInterestStep(0);
                        setPublicInterestRecommendation(null);
                      }}
                      className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-5 py-3 rounded-xl text-xs transition border border-slate-700 flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Ulangi Tes Minat</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        let targetProdi = StudyProgram.ILMU_KOMPUTER;
                        const recommendedStr = publicInterestRecommendation?.primaryProdi || "";
                        if (recommendedStr.includes("Manajemen Ritel")) {
                          targetProdi = StudyProgram.MANAJEMEN_RITEL;
                        } else if (recommendedStr.includes("Bisnis Digital")) {
                          targetProdi = StudyProgram.BISNIS_DIGITAL;
                        }
                        
                        setRegForm(prev => ({ ...prev, prodi1: targetProdi }));
                        setActiveTab("portal");
                        setTimeout(() => {
                          const formSection = document.getElementById("pendaftaran-form-anchor");
                          if (formSection) formSection.scrollIntoView({ behavior: "smooth" });
                        }, 150);
                      }}
                      className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold px-6 py-3 rounded-xl text-xs transition shadow-lg flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Daftar di Prodi ini Sekarang!</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Application Flow Details Card */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-8">
              <div className="max-w-xl">
                <h3 className="text-xl font-bold text-white mb-2">Alur Pendaftaran Digital PMB</h3>
                <p className="text-xs text-slate-400">
                  Kami mengintegrasikan seluruh alur pendaftaran secara full digital untuk kenyamanan maksimal Anda.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="bg-sky-950 w-8 h-8 rounded-full flex items-center justify-center text-sky-400 font-bold text-xs">1</div>
                  <h4 className="font-bold text-white text-xs">Pendaftaran Online</h4>
                  <p className="text-[11px] text-slate-400">Isi formulir pendaftaran diri Anda secara instan di portal calon mahasiswa.</p>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="bg-indigo-950 w-8 h-8 rounded-full flex items-center justify-center text-indigo-400 font-bold text-xs">2</div>
                  <h4 className="font-bold text-white text-xs">Pembayaran Bank</h4>
                  <p className="text-[11px] text-slate-400">Dapatkan nomor Virtual Account Bank untuk transfer aman biaya pendaftaran.</p>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="bg-emerald-950 w-8 h-8 rounded-full flex items-center justify-center text-emerald-400 font-bold text-xs">3</div>
                  <h4 className="font-bold text-white text-xs">Unggah Syarat & TTE</h4>
                  <p className="text-[11px] text-slate-400">Unggah file persyaratan (KTP, Ijazah, Foto) & tanda tangan digital instan.</p>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="bg-amber-950/50 w-8 h-8 rounded-full flex items-center justify-center text-amber-400 font-bold text-xs">4</div>
                  <h4 className="font-bold text-white text-xs">Ujian Seleksi CBT & AI</h4>
                  <p className="text-[11px] text-slate-400">Ikuti ujian tulis CBT online serta tes minat bakat berbasis teknologi AI.</p>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="bg-rose-950/50 w-8 h-8 rounded-full flex items-center justify-center text-rose-400 font-bold text-xs">5</div>
                  <h4 className="font-bold text-white text-xs">Hasil Kelulusan</h4>
                  <p className="text-[11px] text-slate-400">Pantau pengumuman kelulusan real-time & download SK secara digital.</p>
                </div>
              </div>
            </div>

            {/* Google Maps & Contact Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Google Maps Embed Location */}
              <div className="md:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex flex-col h-72">
                <div className="bg-slate-800/80 px-4 py-2 flex justify-between items-center text-xs font-mono">
                  <span className="text-white font-bold flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-rose-400" />
                    Lokasi Kampus Utama ITB Trenggalek
                  </span>
                  <a
                    href="https://maps.app.goo.gl/9KRpAqY6uLjuNxtg6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-400 hover:underline"
                  >
                    Buka di Google Maps
                  </a>
                </div>
                <iframe
                  title="Lokasi Kampus ITB Trenggalek"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3949.1228!2d111.714394!3d-8.0377469!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e791ad60c1dcb71%3s0x303ea13ba811b714!2sInstitut%20Teknologi%20dan%20Bisnis%20Trenggalek%20(ITB%20Trenggalek)!5e0!3m2!1sid!2sid!4v1710000000000!5m2!1sid!2sid"
                  className="flex-1 w-full border-none opacity-95 hover:opacity-100 transition duration-300"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>

              {/* Contact Info Widget */}
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm mb-3">Pusat Informasi PMB</h4>
                  <div className="space-y-4 text-xs text-slate-300">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <p>Jl. Soekarno-Hatta RT 014 / RW 005 Kelutan, Kec. Trenggalek, Jawa Timur, Indonesia</p>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                      <p>+62 856-4873-0190</p>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Instagram className="w-4 h-4 text-slate-400 shrink-0" />
                      <p>@itb_trenggalek</p>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Youtube className="w-4 h-4 text-slate-400 shrink-0 text-red-500" />
                      <a 
                        href="https://www.youtube.com/@itbtrenggalek6211" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:text-red-400 hover:underline transition"
                      >
                        ITB Trenggalek (YouTube)
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-800 pt-4">
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Punya pertanyaan? Chat admin WhatsApp langsung untuk respon cepat selama hari & jam kerja.
                  </p>
                  <a
                    href="https://wa.me/6285648730190"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg text-center block text-xs shadow transition"
                  >
                    Hubungi via WhatsApp
                  </a>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* 2. PORTAL CALON MAHASISWA TAB */}
        {activeTab === "portal" && (
          <div className="space-y-8">
            {!mabaUser ? (
              /* MABA AUTHENTICATION SYSTEM (LOGIN / REGISTRATION) */
              <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="text-center space-y-2">
                  <div className="inline-flex bg-sky-950/60 p-3 rounded-full text-sky-400 border border-sky-800 mb-2">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-white tracking-tight">Portal PMB ITB Trenggalek</h2>
                  <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                    Selamat datang di sistem Penerimaan Mahasiswa Baru. Silakan masuk ke akun Maba Anda atau buat akun baru terlebih dahulu untuk melanjutkan proses seleksi.
                  </p>
                </div>

                {/* Sub-Tabs Selector */}
                <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-850">
                  <button
                    onClick={() => { setMabaAuthTab("login"); setMabaLoginError(""); setMabaRegError(""); }}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition duration-200 ${
                      mabaAuthTab === "login"
                        ? "bg-sky-600 text-white shadow"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Masuk Akun Maba
                  </button>
                  <button
                    onClick={() => { setMabaAuthTab("register"); setMabaLoginError(""); setMabaRegError(""); }}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition duration-200 ${
                      mabaAuthTab === "register"
                        ? "bg-emerald-600 text-white shadow"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Buat Akun Maba Baru
                  </button>
                </div>

                {mabaAuthTab === "login" ? (
                  /* MABA LOGIN FORM */
                  <form onSubmit={handleMabaLogin} className="space-y-4">
                    <div className="space-y-1">
                      <label className="block text-[11px] text-slate-400 uppercase tracking-wider font-mono">Username</label>
                      <input
                        type="text"
                        placeholder="Masukkan username Anda"
                        value={mabaUsernameLogin}
                        onChange={(e) => setMabaUsernameLogin(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-sky-500 text-white font-mono"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] text-slate-400 uppercase tracking-wider font-mono">Password</label>
                      <input
                        type="password"
                        placeholder="Masukkan password Anda"
                        value={mabaPasswordLogin}
                        onChange={(e) => setMabaPasswordLogin(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-sky-500 text-white"
                        required
                      />
                    </div>

                    {mabaLoginError && (
                      <p className="text-xs text-rose-400 flex items-center gap-1 bg-rose-950/20 px-3 py-2 rounded-lg border border-rose-900/30">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {mabaLoginError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isLoggingInMaba}
                      className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-sky-800 text-white font-bold py-2.5 rounded-xl text-xs transition duration-200 flex items-center justify-center gap-2 shadow-lg"
                    >
                      {isLoggingInMaba ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Shield className="w-3.5 h-3.5" />}
                      <span>Masuk ke Portal PMB</span>
                    </button>


                  </form>
                ) : (
                  /* MABA REGISTRATION FORM */
                  <form onSubmit={handleMabaRegister} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[11px] text-slate-400 uppercase tracking-wider font-mono">Username Maba</label>
                        <input
                          type="text"
                          placeholder="Buat username"
                          value={mabaUsernameReg}
                          onChange={(e) => setMabaUsernameReg(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 text-white font-mono"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[11px] text-slate-400 uppercase tracking-wider font-mono">Password Maba</label>
                        <input
                          type="password"
                          placeholder="Buat password"
                          value={mabaPasswordReg}
                          onChange={(e) => setMabaPasswordReg(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 text-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] text-slate-400 uppercase tracking-wider font-mono">Nama Lengkap</label>
                      <input
                        type="text"
                        placeholder="Contoh: Aditya Pratama"
                        value={mabaNameReg}
                        onChange={(e) => setMabaNameReg(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-emerald-500 text-white"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[11px] text-slate-400 uppercase tracking-wider font-mono">Email Aktif</label>
                        <input
                          type="email"
                          placeholder="contoh@gmail.com"
                          value={mabaEmailReg}
                          onChange={(e) => setMabaEmailReg(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 text-white"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[11px] text-slate-400 uppercase tracking-wider font-mono">No. WhatsApp</label>
                        <input
                          type="tel"
                          placeholder="Contoh: 081234567890"
                          value={mabaWhatsappReg}
                          onChange={(e) => setMabaWhatsappReg(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 text-white font-mono"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] text-slate-400 uppercase tracking-wider font-mono">Sekolah Asal (SMA/SMK/MA)</label>
                      <input
                        type="text"
                        placeholder="Contoh: SMAN 1 Trenggalek"
                        value={mabaSchoolReg}
                        onChange={(e) => setMabaSchoolReg(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-emerald-500 text-white"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[11px] text-slate-400 uppercase tracking-wider font-mono">Pilihan Program Studi 1</label>
                        <select
                          value={mabaProdi1Reg}
                          onChange={(e) => setMabaProdi1Reg(e.target.value as StudyProgram)}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 text-white"
                        >
                          <option value={StudyProgram.ILMU_KOMPUTER}>{StudyProgram.ILMU_KOMPUTER}</option>
                          <option value={StudyProgram.MANAJEMEN_RITEL}>{StudyProgram.MANAJEMEN_RITEL}</option>
                          <option value={StudyProgram.BISNIS_DIGITAL}>{StudyProgram.BISNIS_DIGITAL}</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[11px] text-slate-400 uppercase tracking-wider font-mono">Pilihan Program Studi 2</label>
                        <select
                          value={mabaProdi2Reg}
                          onChange={(e) => setMabaProdi2Reg(e.target.value as StudyProgram)}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 text-white"
                        >
                          <option value={StudyProgram.BISNIS_DIGITAL}>{StudyProgram.BISNIS_DIGITAL}</option>
                          <option value={StudyProgram.MANAJEMEN_RITEL}>{StudyProgram.MANAJEMEN_RITEL}</option>
                          <option value={StudyProgram.ILMU_KOMPUTER}>{StudyProgram.ILMU_KOMPUTER}</option>
                        </select>
                      </div>
                    </div>

                    {mabaRegError && (
                      <p className="text-xs text-rose-400 flex items-center gap-1 bg-rose-950/20 px-3 py-2 rounded-lg border border-rose-900/30">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {mabaRegError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isRegisteringMaba}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-xs transition duration-200 flex items-center justify-center gap-2 shadow-lg"
                    >
                      {isRegisteringMaba ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                      <span>Kirim Data & Buat Akun Maba</span>
                    </button>
                  </form>
                )}
              </div>
            ) : (
              /* PORTAL MAIN AREA - DISPLAYED ONLY WHEN MABA LOGGED IN */
              <div className="space-y-6 animate-fade-in">
                {/* 1. Welcoming Status Ribbon & Logout Widget */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-black text-white uppercase text-base font-mono shadow">
                      {mabaUser.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                        <span>Halo, {mabaUser.name}!</span>
                        <span className="text-[10px] bg-sky-950/80 text-sky-400 border border-sky-800/60 px-2 py-0.5 rounded font-mono font-bold tracking-wide uppercase">AKUN MABA</span>
                      </h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        Username: <span className="text-slate-200">{mabaUser.username}</span> • No. Pendaftaran: <span className="text-sky-400">{mabaUser.applicantId}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleMabaLogout}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-950/30 hover:bg-rose-900/40 border border-rose-500/20 text-rose-400 hover:text-rose-300 text-xs font-bold transition duration-150 shrink-0"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar Portal</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column: Read-Only PMB Registration Detail Card */}
                  <div className="space-y-6">
                    <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-sm">
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <CheckSquare className="w-4 h-4 text-sky-400" />
                          Informasi Pendaftaran Anda
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                          Data di bawah ini terekam secara sah di sistem panitia PMB ITB Trenggalek.
                        </p>
                      </div>

                      {currentApplicant ? (
                        <div className="space-y-3 pt-2 text-xs">
                          <div className="border-b border-slate-800/60 pb-2">
                            <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">Nama Lengkap</span>
                            <p className="text-slate-200 font-bold mt-0.5">{currentApplicant.name}</p>
                          </div>
                          <div className="border-b border-slate-800/60 pb-2">
                            <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">Email Terdaftar</span>
                            <p className="text-slate-200 font-bold mt-0.5">{currentApplicant.email}</p>
                          </div>
                          <div className="border-b border-slate-800/60 pb-2">
                            <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider font-semibold">No. WhatsApp</span>
                            <p className="text-slate-200 font-mono font-bold mt-0.5">{currentApplicant.whatsapp}</p>
                          </div>
                          <div className="border-b border-slate-800/60 pb-2">
                            <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">Sekolah Asal</span>
                            <p className="text-slate-200 font-bold mt-0.5">{currentApplicant.school || "Belum Diisi"}</p>
                          </div>
                          <div className="border-b border-slate-800/60 pb-2">
                            <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider font-semibold">Program Studi Pilihan 1</span>
                            <p className="text-sky-400 font-bold mt-0.5">{currentApplicant.prodi1}</p>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider font-semibold">Program Studi Pilihan 2</span>
                            <p className="text-teal-400 font-bold mt-0.5">{currentApplicant.prodi2}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <RefreshCw className="w-5 h-5 text-sky-400 animate-spin mx-auto" />
                          <p className="text-[10px] text-slate-400 mt-2 font-mono">Memuat detail pendaftaran...</p>
                        </div>
                      )}
                    </div>

                    {/* Support card */}
                    <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-sm">
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <Phone className="w-4 h-4 text-emerald-400" />
                          Hubungi Layanan PMB
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                          Butuh bantuan teknis atau informasi pendaftaran? Hubungi Admin WhatsApp PMB kami.
                        </p>
                      </div>
                      <div className="text-xs text-slate-300 font-mono space-y-3">
                        <p className="text-slate-400 font-sans">Jam Operasional: 08:00 - 16:00 WIB</p>
                        <a
                          href="https://wa.me/6285648730190"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-center block text-xs shadow transition duration-200"
                        >
                          Hubungi via WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Portal Details / Active Applicant Status Dashboard */}
                  <div className="lg:col-span-2 space-y-8">
                
                {currentApplicant ? (
                  /* PORTAL DASHBOARD FOR ACTIVE APPLICANT */
                  <div className="space-y-8">
                    
                    {/* Applicant Profile Ribbon */}
                    <div className="bg-gradient-to-r from-slate-900 to-slate-850 rounded-2xl border border-slate-800 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] text-sky-400 font-mono font-bold uppercase tracking-wider">
                          Selamat Datang di Portal Calon Mahasiswa
                        </span>
                        <h2 className="text-xl font-bold text-white mt-1">{currentApplicant.name}</h2>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 mt-2 font-mono">
                          <span>No: {currentApplicant.id}</span>
                          <span>•</span>
                          <span>Sekolah: {currentApplicant.school}</span>
                        </div>
                      </div>

                      {/* Top Status Tag */}
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-slate-400 font-mono">Status Saat Ini:</span>
                        <span className={`mt-1 text-xs font-bold px-3 py-1 rounded-full ${
                          currentApplicant.status.startsWith("Graduated")
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-900"
                            : currentApplicant.status === "ExamCompleted"
                            ? "bg-purple-950 text-purple-400 border border-purple-900"
                            : currentApplicant.status === "DocumentUploaded"
                            ? "bg-indigo-950 text-indigo-400 border border-indigo-900"
                            : currentApplicant.status === "Paid"
                            ? "bg-sky-950 text-sky-400 border border-sky-900"
                            : "bg-slate-800 text-slate-300 border border-slate-700"
                        }`}>
                          {currentApplicant.status.startsWith("Graduated")
                            ? "LULUS SELEKSI 🎉"
                            : currentApplicant.status === "ExamCompleted"
                            ? "Ujian Selesai (Menunggu Kelulusan)"
                            : currentApplicant.status === "DocumentUploaded"
                            ? "Berkas Lengkap (Siap Ujian CBT)"
                            : currentApplicant.status === "Paid"
                            ? "Lunas (Wajib Lengkapi Berkas)"
                            : "Terdaftar (Menunggu Pembayaran)"}
                        </span>
                      </div>
                    </div>

                    {/* Step-by-Step Registration Progress Flow */}
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-6">
                      <h3 className="font-bold text-white text-base">Alur Pengisian Berkas & Seleksi</h3>
                      
                      <div className="space-y-6">

                        {/* STEP 1: PAYMENT SYSTEM (Virtual Account) */}
                        <div className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                              currentApplicant.payment.status === "Paid"
                                ? "bg-emerald-600 text-white"
                                : "bg-slate-800 text-slate-400 border border-slate-700"
                            }`}>
                              {currentApplicant.payment.status === "Paid" ? "✓" : "1"}
                            </div>
                            <div className="w-0.5 h-full bg-slate-800"></div>
                          </div>
                          
                          <div className="flex-1 bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-bold text-white text-xs">Biaya Pendaftaran PMB (Rp 150.000)</h4>
                                <p className="text-[11px] text-slate-400 mt-0.5">Biaya seleksi administrasi, ujian CBT, dan tes minat bakat AI.</p>
                              </div>
                              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                                currentApplicant.payment.status === "Paid"
                                  ? "bg-emerald-950 text-emerald-400 border border-emerald-900"
                                  : "bg-amber-950 text-amber-400 border border-amber-900 animate-pulse"
                              }`}>
                                {currentApplicant.payment.status === "Paid" ? "LUNAS (PAID)" : "MENUNGGU PEMBAYARAN"}
                              </span>
                            </div>

                            {currentApplicant.payment.status === "Pending" ? (
                              <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800 space-y-3">
                                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                                  <div>
                                    <span className="text-slate-500">Metode Bayar:</span>
                                    <p className="text-slate-200 font-bold">{currentApplicant.payment.method}</p>
                                  </div>
                                  <div>
                                    <span className="text-slate-500">Nomor VA Bank:</span>
                                    <p className="text-sky-400 font-bold tracking-wider">{currentApplicant.payment.vaNumber}</p>
                                  </div>
                                </div>
                                <div className="bg-amber-950/30 border border-amber-900/50 p-2.5 rounded text-[11px] text-amber-300 leading-normal">
                                  <strong>Cara Pembayaran:</strong> Transfer sebesar Rp 150.000 ke rekening Virtual Account di atas menggunakan ATM, m-Banking, atau Internet Banking.
                                </div>
                                <div className="flex justify-end pt-1">
                                  <button
                                    onClick={handleSimulatePayment}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg text-[11px] transition shadow"
                                  >
                                    Simulasikan Pembayaran Instan via Bank
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-emerald-950/20 border border-emerald-900/30 p-3 rounded-lg text-[11px] text-emerald-400 font-mono">
                                Pembayaran lunas diterima pada: {new Date(currentApplicant.payment.paidAt || "").toLocaleString("id-ID")}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* STEP 2: DOCUMENTS UPLOADER & SIGNATURE */}
                        <div className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                              currentApplicant.status !== "Registered" && currentApplicant.documents?.ijazah && currentApplicant.documents?.ktp && currentApplicant.signature
                                ? "bg-emerald-600 text-white"
                                : "bg-slate-800 text-slate-400 border border-slate-700"
                            }`}>
                              {currentApplicant.documents?.ijazah && currentApplicant.documents?.ktp && currentApplicant.signature ? "✓" : "2"}
                            </div>
                            <div className="w-0.5 h-full bg-slate-800"></div>
                          </div>
                          
                          <div className="flex-1 bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-4">
                            <div>
                              <h4 className="font-bold text-white text-xs">Unggah Dokumen Persyaratan & Tanda Tangan Elektronik</h4>
                              <p className="text-[11px] text-slate-400 mt-0.5">Wajib dilengkapi untuk proses verifikasi keabsahan data administrasi Anda.</p>
                            </div>

                            {currentApplicant.payment.status === "Pending" ? (
                              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 text-center text-xs text-slate-500 font-mono">
                                🔒 Kunci: Selesaikan pembayaran pendaftaran terlebih dahulu untuk membuka form berkas.
                              </div>
                            ) : (
                              <div className="space-y-4">
                                
                                {/* Uploaders Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                  
                                  {/* Doc 1: Ijazah */}
                                  <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 text-center space-y-2">
                                    <span className="text-[10px] text-slate-400 uppercase font-mono">Ijazah / SKL (PDF)</span>
                                    {uploadedFiles.ijazah ? (
                                      <p className="text-xs text-emerald-400 font-semibold truncate">✓ {uploadedFiles.ijazah}</p>
                                    ) : (
                                      <button
                                        onClick={() => handleFileUploadMock("ijazah", `ijazah_${currentApplicant.name.toLowerCase().replace(/\s/g, "_")}.pdf`)}
                                        disabled={uploadingDoc}
                                        className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-1.5 rounded text-[10px] transition flex items-center justify-center gap-1"
                                      >
                                        <Upload className="w-3 h-3" /> Unggah PDF
                                      </button>
                                    )}
                                  </div>

                                  {/* Doc 2: KTP / KK */}
                                  <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 text-center space-y-2">
                                    <span className="text-[10px] text-slate-400 uppercase font-mono">KTP / Kartu Keluarga</span>
                                    {uploadedFiles.ktp ? (
                                      <p className="text-xs text-emerald-400 font-semibold truncate">✓ {uploadedFiles.ktp}</p>
                                    ) : (
                                      <button
                                        onClick={() => handleFileUploadMock("ktp", `ktp_${currentApplicant.name.toLowerCase().replace(/\s/g, "_")}.pdf`)}
                                        disabled={uploadingDoc}
                                        className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-1.5 rounded text-[10px] transition flex items-center justify-center gap-1"
                                      >
                                        <Upload className="w-3 h-3" /> Unggah PDF
                                      </button>
                                    )}
                                  </div>

                                  {/* Doc 3: Pasfoto */}
                                  <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 text-center space-y-2">
                                    <span className="text-[10px] text-slate-400 uppercase font-mono">Pasfoto 3x4 (Image)</span>
                                    {uploadedFiles.foto ? (
                                      <p className="text-xs text-emerald-400 font-semibold truncate">✓ {uploadedFiles.foto}</p>
                                    ) : (
                                      <button
                                        onClick={() => handleFileUploadMock("foto", `foto_formal_${currentApplicant.name.toLowerCase().replace(/\s/g, "_")}.jpg`)}
                                        disabled={uploadingDoc}
                                        className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-1.5 rounded text-[10px] transition flex items-center justify-center gap-1"
                                      >
                                        <Upload className="w-3 h-3" /> Unggah JPG/PNG
                                      </button>
                                    )}
                                  </div>

                                </div>

                                {/* Electronic Signature Section */}
                                <div className="border-t border-slate-800 pt-4 space-y-3">
                                  <div className="flex items-center gap-1.5">
                                    <PenTool className="w-4 h-4 text-sky-400" />
                                    <span className="text-xs font-bold text-white">Tanda Tangan Elektronik Verifikasi Keaslian</span>
                                  </div>

                                  {currentApplicant.signature ? (
                                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 flex items-center gap-3">
                                      <img
                                        src={currentApplicant.signature}
                                        alt="Tanda tangan tersimpan"
                                        className="h-12 bg-white rounded border p-1"
                                      />
                                      <div>
                                        <p className="text-xs text-emerald-400 font-semibold">Tanda Tangan Terverifikasi Digital</p>
                                        <p className="text-[10px] text-slate-500 font-mono">Keaslian berkas dinyatakan sah secara hukum.</p>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="space-y-2">
                                      <p className="text-[11px] text-slate-400">
                                        Silakan buat tanda tangan Anda langsung di dalam kotak canvas berikut:
                                      </p>
                                      
                                      <div className="flex flex-col sm:flex-row items-center gap-4">
                                        <div className="bg-white rounded-lg overflow-hidden border border-slate-700">
                                          <canvas
                                            ref={canvasRef}
                                            width={320}
                                            height={120}
                                            className="cursor-crosshair block"
                                            onMouseDown={startDrawing}
                                            onMouseMove={draw}
                                            onMouseUp={stopDrawing}
                                            onMouseLeave={stopDrawing}
                                            onTouchStart={startDrawing}
                                            onTouchMove={draw}
                                            onTouchEnd={stopDrawing}
                                          ></canvas>
                                        </div>
                                        
                                        <div className="space-y-2 w-full sm:w-auto">
                                          <button
                                            onClick={clearSignature}
                                            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-1.5 px-3 rounded text-[11px] transition"
                                          >
                                            Hapus Tanda Tangan
                                          </button>
                                          <button
                                            onClick={saveSignature}
                                            disabled={!hasSignature}
                                            className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-slate-800 text-white font-semibold py-1.5 px-3 rounded text-[11px] transition shadow"
                                          >
                                            Simpan Tanda Tangan
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>

                              </div>
                            )}
                          </div>
                        </div>

                        {/* STEP 3: CBT WRITTEN SELECTION EXAM */}
                        <div className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                              currentApplicant.exam?.completedAt
                                ? "bg-emerald-600 text-white"
                                : "bg-slate-800 text-slate-400 border border-slate-700"
                            }`}>
                              {currentApplicant.exam?.completedAt ? "✓" : "3"}
                            </div>
                            <div className="w-0.5 h-full bg-slate-800"></div>
                          </div>
                          
                          <div className="flex-1 bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-bold text-white text-xs">Ujian Masuk Berbasis Komputer (CBT Mandiri)</h4>
                                <p className="text-[11px] text-slate-400 mt-0.5">Ujian online mencakup materi logika, pengetahuan dasar IT, dan penalaran ritel digital.</p>
                              </div>
                              {currentApplicant.exam?.completedAt && (
                                <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-900 px-2 py-0.5 rounded font-bold">
                                  SKOR CBT: {currentApplicant.exam.score}/100
                                </span>
                              )}
                            </div>

                            {currentApplicant.payment.status === "Pending" ? (
                              <p className="text-xs text-slate-500 font-mono text-center py-2">
                                🔒 Kunci: Selesaikan pendaftaran & pembayaran terlebih dahulu.
                              </p>
                            ) : currentApplicant.exam?.completedAt ? (
                              <div className="bg-emerald-950/20 border border-emerald-900/30 p-3 rounded-lg text-[11px] text-emerald-400 font-mono">
                                Ujian CBT selesai pada: {new Date(currentApplicant.exam.completedAt).toLocaleString("id-ID")} • Status Ujian: {currentApplicant.exam.passed ? "LULUS PASSING GRADE" : "BELUM LULUS"}
                              </div>
                            ) : examActive ? (
                              
                              /* CBT EXAM INTERACTIVE PANEL */
                              <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 space-y-4">
                                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5 animate-pulse" />
                                    Sisa Waktu: {formatTimeLeft()}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono">8 Soal Pilihan Ganda</span>
                                </div>

                                <div className="space-y-6">
                                  {CBT_QUESTIONS.map((q, idx) => (
                                    <div key={q.id} className="space-y-3 border-b border-slate-800/40 pb-4">
                                      <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                                        {idx + 1}. {q.question}
                                      </p>
                                      
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                                        {Object.entries(q.options).map(([key, value]) => (
                                          <label
                                            key={key}
                                            className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition ${
                                              examAnswers[q.id] === key
                                                ? "bg-sky-950/50 border-sky-600 text-white"
                                                : "bg-slate-950 border-slate-800 hover:bg-slate-800 text-slate-300"
                                            }`}
                                          >
                                            <input
                                              type="radio"
                                              name={`question-${q.id}`}
                                              value={key}
                                              checked={examAnswers[q.id] === key}
                                              onChange={() => setExamAnswers(prev => ({ ...prev, [q.id]: key }))}
                                              className="accent-sky-500"
                                            />
                                            <span><strong>{key}.</strong> {value}</span>
                                          </label>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                <div className="flex justify-end pt-2">
                                  <button
                                    onClick={() => handleExamSubmit(false)}
                                    disabled={examSubmitting}
                                    className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-5 rounded-lg text-xs transition"
                                  >
                                    {examSubmitting ? "Mengirimkan..." : "Selesaikan & Kirim Jawaban CBT"}
                                  </button>
                                </div>
                              </div>

                            ) : (
                              <div className="flex justify-between items-center bg-slate-900 p-4 rounded-lg border border-slate-800">
                                <p className="text-[11px] text-slate-300 font-mono">
                                  Ujian siap dimulai. Durasi: 10 menit.
                                </p>
                                <button
                                  onClick={() => {
                                    setExamActive(true);
                                    setExamTimeLeft(600);
                                  }}
                                  className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-4 py-2 rounded-lg text-[11px] transition shadow"
                                >
                                  Mulai Ujian CBT Mandiri
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* STEP 4: DIGITAL GRADUATION ANNOUNCEMENT */}
                        <div className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                              currentApplicant.status.startsWith("Graduated_")
                                ? "bg-emerald-500 text-white"
                                : "bg-slate-800 text-slate-400 border border-slate-700"
                            }`}>
                              {currentApplicant.status.startsWith("Graduated_") ? "✓" : "4"}
                            </div>
                          </div>
                          
                          <div className="flex-1 bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-4">
                            <div>
                              <h4 className="font-bold text-white text-xs">Pemberitahuan Hasil Seleksi Akhir Kelulusan</h4>
                              <p className="text-[11px] text-slate-400 mt-0.5">Sistem pengumuman kelulusan real-time terintegrasi.</p>
                            </div>

                            {currentApplicant.status.startsWith("Graduated_") ? (
                              
                              /* GRADUATION CARD WITH DIGITAL CERTIFICATE */
                              <div className="bg-gradient-to-r from-emerald-950/40 to-teal-950/20 border border-emerald-500/30 p-6 rounded-2xl text-center space-y-4">
                                <div className="inline-flex bg-emerald-900/30 p-3 rounded-full text-emerald-400 border border-emerald-800 animate-bounce">
                                  <Award className="w-10 h-10" />
                                </div>
                                <div className="space-y-1">
                                  <h4 className="text-lg font-bold text-white">🎉 SELAMAT, ANDA DINYATAKAN LULUS SELEKSI! 🎉</h4>
                                  <p className="text-xs text-slate-300">
                                    Institut Teknologi dan Bisnis Trenggalek menyatakan bahwa Anda lolos di program studi:
                                  </p>
                                  <p className="text-sm font-bold text-emerald-400 mt-2">
                                    {currentApplicant.status === "Graduated_Ilmu_Komputer" 
                                      ? "S1 Ilmu Komputer (Fakultas Sains & Teknologi)" 
                                      : currentApplicant.status === "Graduated_Manajemen_Ritel"
                                      ? "S1 Manajemen Ritel (Fakultas Ekonomi & Bisnis)"
                                      : "S1 Bisnis Digital (Fakultas Ekonomi & Bisnis)"}
                                  </p>
                                </div>

                                <div className="border-t border-slate-800 pt-4 max-w-sm mx-auto space-y-3">
                                  <p className="text-[10px] text-slate-400 font-mono">
                                    Surat Keputusan (SK) Kelulusan Anda telah diterbitkan secara sah oleh panitia PMB.
                                  </p>
                                  <button
                                    onClick={() => {
                                      alert(`Membuka berkas SK Kelulusan Digital...\nNo Surat: 042/PMB/ITB-TR/2026\nNama: ${currentApplicant.name}\nProgram Studi: ${currentApplicant.status.split("Graduated_")[1]?.replace(/_/g, " ")}\n\n(Simulasi Unduhan PDF Sukses)`);
                                    }}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg text-xs transition flex items-center justify-center gap-1.5 shadow"
                                  >
                                    <FileText className="w-4 h-4" />
                                    <span>Unduh Surat Kelulusan Resmi (PDF)</span>
                                  </button>
                                </div>
                              </div>

                            ) : currentApplicant.status === "Rejected" ? (
                              <div className="bg-rose-950/20 border border-rose-900/30 p-5 rounded-xl text-center space-y-2">
                                <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto" />
                                <p className="text-xs text-slate-300 font-bold">MOHON MAAF, SELEKSI BELUM LOLOS</p>
                                <p className="text-[11px] text-slate-400 max-w-sm mx-auto leading-relaxed">
                                  Berdasarkan hasil evaluasi dokumen administrasi dan hasil ujian, Anda belum memenuhi kriteria penerimaan tahun ini. Tetap semangat menggapai cita-cita Anda!
                                </p>
                              </div>
                            ) : (
                              <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 text-center text-[11px] text-slate-400 font-mono leading-relaxed">
                                ⌛ Menunggu keputusan kelulusan. <br />
                                Pastikan Anda telah mengunggah berkas, melakukan TTE, serta mengikuti CBT & Tes Minat Bakat.
                              </div>
                            )}
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>
                ) : (
                  /* WELCOME BANNER FOR GUEST IN PORTAL */
                  <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 text-center space-y-6 flex flex-col items-center justify-center min-h-[400px]">
                    <div className="bg-sky-950/60 p-4 rounded-full text-sky-400 border border-sky-900">
                      <BookOpen className="w-12 h-12" />
                    </div>
                    <div className="space-y-2 max-w-md">
                      <h3 className="text-xl font-bold text-white">Silakan Daftarkan Diri Anda atau Masuk Portal</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Jika Anda pendaftar baru, silakan gunakan form di sebelah kiri untuk meregistrasi data awal pendaftaran online PMB. Jika sudah mendaftar, masukkan nomor pendaftaran Anda untuk masuk ke sistem ujian & kelulusan.
                      </p>
                    </div>
                  </div>
                )}

              </div>

            </div>
          </div>
        )}

          </div>
        )}

        {/* 2.1 PRODI (STUDY PROGRAM) TAB */}
        {activeTab === "prodi" && (
          <div className="space-y-12 animate-fade-in">
            {/* Title */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-950 text-sky-400 border border-sky-850">
                <Award className="w-3.5 h-3.5 text-sky-400" />
                Program Studi Unggulan (S1)
              </span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                Temukan Masa Depan Anda Disini
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
                Kurikulum adaptif industri global, didukung fasilitas modern, dosen praktisi berpengalaman, serta jaminan kompetensi sociopreneur di era digital.
              </p>
            </div>

            {/* Detailed Cards for 3 study programs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* S1 Ilmu Komputer */}
              <div id="prodi-detail-ilkom" className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-sky-500/30 transition-all duration-300">
                <div className="absolute top-0 right-0 bg-sky-950/80 text-sky-400 text-[10px] font-bold px-3 py-1 rounded-bl-xl border-l border-b border-sky-900">
                  SAINS & TEKNOLOGI
                </div>
                <div className="space-y-5">
                  <div 
                    onClick={() => setActiveFlyerUrl(IlmuKomputerFlyerImg)}
                    className="relative h-48 w-full overflow-hidden rounded-2xl bg-slate-950 cursor-pointer border border-slate-800/80"
                  >
                    <img 
                      src={IlmuKomputerFlyerImg} 
                      alt="Brosur S1 Ilmu Komputer" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 opacity-90 group-hover:opacity-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-700/80 flex items-center gap-1.5 text-[10px] text-sky-400 font-bold shadow-md">
                      <Search className="w-3 h-3" />
                      <span>Buka Brosur</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-sky-400 transition-colors">S1 Ilmu Komputer</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Mencetak sarjana komputer ahli rekayasa perangkat lunak, pemrograman web & mobile, cyber security, serta penerapan teknologi Artificial Intelligence (AI) yang solutif.
                    </p>
                  </div>

                  <div className="border-t border-slate-800/80 pt-4 space-y-3">
                    <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Prospek Karir & Kompetensi:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {["Fullstack Web Dev", "AI & Data Scientist", "Mobile Dev (Android/iOS)", "Network Administrator", "System Analyst"].map(tag => (
                        <span key={tag} className="text-[9px] bg-slate-950/80 border border-slate-850 px-2 py-0.5 rounded-md text-slate-300 font-mono">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-850 space-y-2 text-xs">
                    <p className="text-[10px] text-sky-400 font-mono uppercase tracking-wider font-bold">Mata Kuliah Unggulan:</p>
                    <ul className="grid grid-cols-2 gap-1 text-slate-400 text-[11px] font-mono list-disc list-inside">
                      <li>Pemrograman Web</li>
                      <li>Kecerdasan Buatan</li>
                      <li>Keamanan Jaringan</li>
                      <li>Cloud Computing</li>
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveTab("portal");
                    setTimeout(() => {
                      const formSection = document.getElementById("pendaftaran-form-anchor");
                      if (formSection) formSection.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }}
                  className="w-full bg-slate-950 hover:bg-sky-950/20 text-slate-300 hover:text-sky-400 border border-slate-800 hover:border-sky-800/50 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <span>Daftar S1 Ilmu Komputer</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* S1 Bisnis Digital */}
              <div id="prodi-detail-bisnis" className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-sky-500/30 transition-all duration-300">
                <div className="absolute top-0 right-0 bg-sky-950/80 text-sky-400 text-[10px] font-bold px-3 py-1 rounded-bl-xl border-l border-b border-sky-900">
                  EKONOMI & BISNIS
                </div>
                <div className="space-y-5">
                  <div 
                    onClick={() => setActiveFlyerUrl(BisnisDigitalFlyerImg)}
                    className="relative h-48 w-full overflow-hidden rounded-2xl bg-slate-950 cursor-pointer border border-slate-800/80"
                  >
                    <img 
                      src={BisnisDigitalFlyerImg} 
                      alt="Brosur S1 Bisnis Digital" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 opacity-90 group-hover:opacity-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-700/80 flex items-center gap-1.5 text-[10px] text-sky-400 font-bold shadow-md">
                      <Search className="w-3 h-3" />
                      <span>Buka Brosur</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-sky-400 transition-colors">S1 Bisnis Digital</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Sinergi sains komputer dan ilmu bisnis modern untuk mencetak entrepreneur digital tangguh, analis pemasaran, e-commerce strategist, dan technopreneur terkemuka.
                    </p>
                  </div>

                  <div className="border-t border-slate-800/80 pt-4 space-y-3">
                    <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Prospek Karir & Kompetensi:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {["Digital Marketer", "E-commerce Manager", "Startup Founder", "Business Intelligence", "Growth Hacker"].map(tag => (
                        <span key={tag} className="text-[9px] bg-slate-950/80 border border-slate-850 px-2 py-0.5 rounded-md text-slate-300 font-mono">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-850 space-y-2 text-xs">
                    <p className="text-[10px] text-sky-400 font-mono uppercase tracking-wider font-bold">Mata Kuliah Unggulan:</p>
                    <ul className="grid grid-cols-2 gap-1 text-slate-400 text-[11px] font-mono list-disc list-inside">
                      <li>E-Commerce Tech</li>
                      <li>Digital Marketing</li>
                      <li>Analitika Bisnis</li>
                      <li>Desain Startup</li>
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveTab("portal");
                    setTimeout(() => {
                      const formSection = document.getElementById("pendaftaran-form-anchor");
                      if (formSection) formSection.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }}
                  className="w-full bg-slate-950 hover:bg-sky-950/20 text-slate-300 hover:text-sky-400 border border-slate-800 hover:border-sky-800/50 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <span>Daftar S1 Bisnis Digital</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* S1 Manajemen Ritel */}
              <div id="prodi-detail-ritel" className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-sky-500/30 transition-all duration-300">
                <div className="absolute top-0 right-0 bg-sky-950/80 text-sky-400 text-[10px] font-bold px-3 py-1 rounded-bl-xl border-l border-b border-sky-900">
                  EKONOMI & BISNIS
                </div>
                <div className="space-y-5">
                  <div 
                    onClick={() => setActiveFlyerUrl(ManajemenRitelFlyerImg)}
                    className="relative h-48 w-full overflow-hidden rounded-2xl bg-slate-950 cursor-pointer border border-slate-800/80"
                  >
                    <img 
                      src={ManajemenRitelFlyerImg} 
                      alt="Brosur S1 Manajemen Ritel" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 opacity-90 group-hover:opacity-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-700/80 flex items-center gap-1.5 text-[10px] text-sky-400 font-bold shadow-md">
                      <Search className="w-3 h-3" />
                      <span>Buka Brosur</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-sky-400 transition-colors">S1 Manajemen Ritel</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Satu-satunya di kawasan selatan Jawa Timur, melahirkan manajer dan ahli operasional retail modern, analis perilaku konsumen, serta supervisor rantai pasok waralaba global.
                    </p>
                  </div>

                  <div className="border-t border-slate-800/80 pt-4 space-y-3">
                    <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Prospek Karir & Kompetensi:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {["Retail Store Manager", "Supply Chain Supervisor", "Franchise Developer", "Visual Merchandiser", "Retail Buyer/Analyst"].map(tag => (
                        <span key={tag} className="text-[9px] bg-slate-950/80 border border-slate-850 px-2 py-0.5 rounded-md text-slate-300 font-mono">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-850 space-y-2 text-xs">
                    <p className="text-[10px] text-sky-400 font-mono uppercase tracking-wider font-bold">Mata Kuliah Unggulan:</p>
                    <ul className="grid grid-cols-2 gap-1 text-slate-400 text-[11px] font-mono list-disc list-inside">
                      <li>Manajemen Waralaba</li>
                      <li>Perilaku Konsumen</li>
                      <li>Sistem Rantai Pasok</li>
                      <li>Merchandising</li>
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveTab("portal");
                    setTimeout(() => {
                      const formSection = document.getElementById("pendaftaran-form-anchor");
                      if (formSection) formSection.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }}
                  className="w-full bg-slate-950 hover:bg-sky-950/20 text-slate-300 hover:text-sky-400 border border-slate-800 hover:border-sky-800/50 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <span>Daftar S1 Manajemen Ritel</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2.2 BERITA (SOCIAL MEDIA HUB) TAB */}
        {activeTab === "berita" && (
          <div className="space-y-8 animate-fade-in">
            {/* Title */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-950 text-rose-400 border border-rose-850">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                Social Media Hub ITB Trenggalek
              </span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                Kabar Terbaru & Aktivitas Kampus
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
                Kumpulan kabar terupdate yang diintegrasikan langsung dari seluruh media sosial resmi ITB Trenggalek: TikTok, Instagram, dan YouTube.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => setSocialFilter("all")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition duration-200 flex items-center gap-1.5 border ${
                  socialFilter === "all"
                    ? "bg-slate-100 text-slate-900 border-white shadow-lg"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Semua Media</span>
              </button>
              <button
                onClick={() => setSocialFilter("tiktok")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition duration-200 flex items-center gap-1.5 border ${
                  socialFilter === "tiktok"
                    ? "bg-teal-500 text-white border-teal-400 shadow-lg"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>TikTok Reels</span>
              </button>
              <button
                onClick={() => setSocialFilter("instagram")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition duration-200 flex items-center gap-1.5 border ${
                  socialFilter === "instagram"
                    ? "bg-pink-600 text-white border-pink-500 shadow-lg"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Instagram Feed</span>
              </button>
              <button
                onClick={() => setSocialFilter("youtube")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition duration-200 flex items-center gap-1.5 border ${
                  socialFilter === "youtube"
                    ? "bg-rose-600 text-white border-rose-500 shadow-lg"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                <Youtube className="w-3.5 h-3.5" />
                <span>YouTube Videos</span>
              </button>
            </div>

            {/* Social Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* TIKTOK ITEM 1 */}
              {(socialFilter === "all" || socialFilter === "tiktok") && (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:border-teal-500/30 transition duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center font-bold text-teal-400 text-xs border border-teal-900/60 font-mono">
                        TT
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">@itbtrenggalek</p>
                        <p className="text-[9px] text-slate-400">TikTok • Baru saja</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-teal-950/60 text-teal-400 font-bold px-2.5 py-0.5 rounded-full border border-teal-900">
                      Reels
                    </span>
                  </div>

                  <div className="relative aspect-[9/16] max-h-96 w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-850 group">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-slate-950/60 z-10 flex flex-col justify-between p-4 pointer-events-none">
                      <div className="flex justify-between items-start">
                        <span className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 text-[9px] text-slate-300 font-mono px-2 py-0.5 rounded flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 text-teal-400 animate-pulse" />
                          <span>01:30</span>
                        </span>
                        <span className="text-[10px] text-white font-mono bg-slate-900/60 px-2 py-0.5 rounded">18.4K views</span>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-xs text-white leading-relaxed font-medium">
                          Doa Bersama Pelepasan 9 Mahasiswi Hebat ITB Trenggalek untuk Program Internship (Magang Kerja) di Jepang! ✈️🇯🇵 Selamat berjuang di Negeri Sakura!
                        </p>
                        <p className="text-[10px] text-teal-400 font-mono flex items-center gap-1">
                          🎵 original sound - ITB Trenggalek
                        </p>
                      </div>
                    </div>

                    <video 
                      className="w-full h-full object-cover" 
                      src="https://assets.mixkit.co/videos/preview/mixkit-man-working-on-a-laptop-in-a-workspace-42173-large.mp4"
                      controls
                      playsInline
                      loop
                      muted
                    />
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
                    <button 
                      onClick={() => toggleSocialLike("tiktok_1")}
                      className={`flex items-center gap-1.5 text-xs font-bold transition duration-150 ${socialLiked["tiktok_1"] ? "text-rose-500" : "text-slate-400 hover:text-slate-200"}`}
                    >
                      <CheckSquare className={`w-4 h-4 ${socialLiked["tiktok_1"] ? "fill-current" : ""}`} />
                      <span>{1205 + (socialLikesOffset["tiktok_1"] || 0)} Suka</span>
                    </button>
                    <a 
                      href="https://www.tiktok.com/@itb_trenggalek" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[11px] text-teal-400 hover:underline flex items-center gap-1"
                    >
                      Tonton di TikTok
                      <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}

              {/* TIKTOK ITEM 2 */}
              {(socialFilter === "all" || socialFilter === "tiktok") && (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:border-teal-500/30 transition duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center font-bold text-teal-400 text-xs border border-teal-900/60 font-mono">
                        TT
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">@itbtrenggalek</p>
                        <p className="text-[9px] text-slate-400">TikTok • 2 hari lalu</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-teal-950/60 text-teal-400 font-bold px-2.5 py-0.5 rounded-full border border-teal-900">
                      Reels
                    </span>
                  </div>

                  <div className="relative aspect-[9/16] max-h-96 w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-850 group">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-slate-950/60 z-10 flex flex-col justify-between p-4 pointer-events-none">
                      <div className="flex justify-between items-start">
                        <span className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 text-[9px] text-slate-300 font-mono px-2 py-0.5 rounded flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 text-teal-400 animate-pulse" />
                          <span>01:12</span>
                        </span>
                        <span className="text-[10px] text-white font-mono bg-slate-900/60 px-2 py-0.5 rounded">14.2K views</span>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-xs text-white leading-relaxed font-medium">
                          Aktivitas seru mahasiswa/i ITB Trenggalek di sela perkuliahan! 💻✨ Serunya ngerjain project pemrograman & sharing session bareng di lab!
                        </p>
                        <p className="text-[10px] text-teal-400 font-mono flex items-center gap-1">
                          🎵 original sound - ITB Trenggalek Media
                        </p>
                      </div>
                    </div>

                    <video 
                      className="w-full h-full object-cover" 
                      src="https://assets.mixkit.co/videos/preview/mixkit-hand-holding-a-smartphone-in-vertical-position-42284-large.mp4"
                      controls
                      playsInline
                      loop
                      muted
                    />
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
                    <button 
                      onClick={() => toggleSocialLike("tiktok_2")}
                      className={`flex items-center gap-1.5 text-xs font-bold transition duration-150 ${socialLiked["tiktok_2"] ? "text-rose-500" : "text-slate-400 hover:text-slate-200"}`}
                    >
                      <CheckSquare className={`w-4 h-4 ${socialLiked["tiktok_2"] ? "fill-current" : ""}`} />
                      <span>{942 + (socialLikesOffset["tiktok_2"] || 0)} Suka</span>
                    </button>
                    <a 
                      href="https://www.tiktok.com/@itb_trenggalek" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[11px] text-teal-400 hover:underline flex items-center gap-1"
                    >
                      Tonton di TikTok
                      <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}

              {/* INSTAGRAM ITEM 1 */}
              {(socialFilter === "all" || socialFilter === "instagram") && (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:border-pink-500/30 transition duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold border border-slate-800">
                        IG
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">@itb_trenggalek</p>
                        <p className="text-[9px] text-slate-400">Instagram • 1 hari lalu</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-pink-950/60 text-pink-400 font-bold px-2.5 py-0.5 rounded-full border border-pink-900">
                      Post
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-850">
                      {/* Simulated Instagram Image */}
                      <div className="absolute inset-0 bg-slate-850 flex flex-col items-center justify-center p-6 text-center space-y-3">
                        <Award className="w-12 h-12 text-amber-400 animate-pulse" />
                        <p className="text-xs font-bold text-white font-sans uppercase tracking-wider">Prestasi Terbaik Mahasiswi</p>
                        <p className="text-[10px] text-slate-400">Terbaik 1 Putri se-Kabupaten Trenggalek pada Kursus Pembina Pramuka Mahir Tingkat Dasar (KMD) 2026.</p>
                      </div>
                      <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-800 text-[9px] text-slate-400 font-mono">
                        ❤️ Slide 1/2
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Selamat dan sukses kepada mahasiswi ITB Trenggalek yang telah meraih prestasi luar biasa sebagai Terbaik 1 Putri KMD se-Kabupaten Trenggalek! Terus menginspirasi dan berkontribusi nyata! 🏆🌟
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
                    <button 
                      onClick={() => toggleSocialLike("ig_1")}
                      className={`flex items-center gap-1.5 text-xs font-bold transition duration-150 ${socialLiked["ig_1"] ? "text-rose-500" : "text-slate-400 hover:text-slate-200"}`}
                    >
                      <CheckSquare className={`w-4 h-4 ${socialLiked["ig_1"] ? "fill-current" : ""}`} />
                      <span>{412 + (socialLikesOffset["ig_1"] || 0)} Suka</span>
                    </button>
                    <a 
                      href="https://www.instagram.com/itb_trenggalek" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[11px] text-pink-400 hover:underline flex items-center gap-1"
                    >
                      Buka Instagram
                      <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}

              {/* INSTAGRAM ITEM 2 */}
              {(socialFilter === "all" || socialFilter === "instagram") && (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:border-pink-500/30 transition duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold border border-slate-800">
                        IG
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">@itb_trenggalek</p>
                        <p className="text-[9px] text-slate-400">Instagram • 4 hari lalu</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-pink-950/60 text-pink-400 font-bold px-2.5 py-0.5 rounded-full border border-pink-900">
                      Post
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-850">
                      <div className="absolute inset-0 bg-slate-850 flex flex-col items-center justify-center p-6 text-center space-y-3">
                        <Users className="w-12 h-12 text-teal-400" />
                        <p className="text-xs font-bold text-white font-sans uppercase tracking-wider">Sosialisasi Anti Korupsi</p>
                        <p className="text-[10px] text-slate-400">BEM ITB Trenggalek Bersama Organisasi Kepemudaan Kabupaten Trenggalek mewujudkan integritas pemuda.</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Pengurus Badan Eksekutif Mahasiswa (BEM) ITB Trenggalek menghadiri Sosialisasi Anti Korupsi. Bersama bersinergi membangun moralitas dan kredibilitas pemuda bangsa! 🇮🇩✨
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
                    <button 
                      onClick={() => toggleSocialLike("ig_2")}
                      className={`flex items-center gap-1.5 text-xs font-bold transition duration-150 ${socialLiked["ig_2"] ? "text-rose-500" : "text-slate-400 hover:text-slate-200"}`}
                    >
                      <CheckSquare className={`w-4 h-4 ${socialLiked["ig_2"] ? "fill-current" : ""}`} />
                      <span>{318 + (socialLikesOffset["ig_2"] || 0)} Suka</span>
                    </button>
                    <a 
                      href="https://www.instagram.com/itb_trenggalek" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[11px] text-pink-400 hover:underline flex items-center gap-1"
                    >
                      Buka Instagram
                      <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}

              {/* YOUTUBE ITEM 1 */}
              {(socialFilter === "all" || socialFilter === "youtube") && (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:border-rose-500/30 transition duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center text-white text-[10px] font-bold border border-slate-800">
                        YT
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">ITB Trenggalek Official</p>
                        <p className="text-[9px] text-slate-400">YouTube • 1 minggu lalu</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-rose-950/60 text-rose-400 font-bold px-2.5 py-0.5 rounded-full border border-rose-900">
                      Video
                    </span>
                  </div>

                  <div className="space-y-3">
                    <a
                      href="https://youtu.be/iKgdEmj9NPQ?si=q9YFE2Kn1hSeze8I"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative block aspect-video w-full rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-rose-950/20 to-slate-950 border border-slate-800 hover:border-rose-500/50 transition-all duration-300 shadow-lg shadow-black/40"
                    >
                      {/* Background Visual Graphic representation of Profile */}
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-950/30 via-transparent to-slate-950/90 group-hover:scale-105 transition-transform duration-500" />
                      
                      {/* Grid overlay lines */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
                      
                      {/* Center Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-rose-600/90 group-hover:bg-rose-600 border border-rose-500 flex items-center justify-center shadow-lg shadow-rose-600/30 transform group-hover:scale-110 transition-all duration-300">
                          <Youtube className="w-7 h-7 text-white fill-current animate-pulse" />
                        </div>
                      </div>

                      {/* Video Duration Badge */}
                      <div className="absolute bottom-3 right-3 bg-slate-950/90 backdrop-blur-sm text-[10px] text-slate-300 font-mono px-2.5 py-1 rounded-md border border-slate-800 shadow">
                        02:45 • HD
                      </div>

                      {/* Video Quick Title Overlay on Bottom Left */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-sm px-2.5 py-1 rounded-md border border-slate-800/80 text-[10px] text-rose-400 font-bold font-mono tracking-wider uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                        Tonton di YouTube
                      </div>
                    </a>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      Kenali lebih dekat visi, misi, pimpinan, dan kemegahan fasilitas gedung kuliah ITB Trenggalek di dalam profil cinematic terbaru!
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
                    <button 
                      onClick={() => toggleSocialLike("yt_1")}
                      className={`flex items-center gap-1.5 text-xs font-bold transition duration-150 ${socialLiked["yt_1"] ? "text-rose-500" : "text-slate-400 hover:text-slate-200"}`}
                    >
                      <CheckSquare className={`w-4 h-4 ${socialLiked["yt_1"] ? "fill-current" : ""}`} />
                      <span>{542 + (socialLikesOffset["yt_1"] || 0)} Suka</span>
                    </button>
                  </div>
                </div>
              )}

              {/* YOUTUBE ITEM 2 */}
              {(socialFilter === "all" || socialFilter === "youtube") && (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:border-rose-500/30 transition duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center text-white text-[10px] font-bold border border-slate-800">
                        YT
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">ITB Trenggalek Official</p>
                        <p className="text-[9px] text-slate-400">YouTube • 2 minggu lalu</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-rose-950/60 text-rose-400 font-bold px-2.5 py-0.5 rounded-full border border-rose-900">
                      Video
                    </span>
                  </div>

                  <div className="space-y-3">
                    <a
                      href="https://youtu.be/iKgdEmj9NPQ?si=q9YFE2Kn1hSeze8I"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative block aspect-video w-full rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-rose-950/20 to-slate-950 border border-slate-800 hover:border-rose-500/50 transition-all duration-300 shadow-lg shadow-black/40"
                    >
                      {/* Background Visual Graphic representation of Profile */}
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-950/30 via-transparent to-slate-950/90 group-hover:scale-105 transition-transform duration-500" />
                      
                      {/* Grid overlay lines */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
                      
                      {/* Center Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-rose-600/90 group-hover:bg-rose-600 border border-rose-500 flex items-center justify-center shadow-lg shadow-rose-600/30 transform group-hover:scale-110 transition-all duration-300">
                          <Youtube className="w-7 h-7 text-white fill-current animate-pulse" />
                        </div>
                      </div>

                      {/* Video Duration Badge */}
                      <div className="absolute bottom-3 right-3 bg-slate-950/90 backdrop-blur-sm text-[10px] text-slate-300 font-mono px-2.5 py-1 rounded-md border border-slate-800 shadow">
                        04:12 • HD
                      </div>

                      {/* Video Quick Title Overlay on Bottom Left */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-sm px-2.5 py-1 rounded-md border border-slate-800/80 text-[10px] text-rose-400 font-bold font-mono tracking-wider uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                        Tonton di YouTube
                      </div>
                    </a>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      Tim Monev Hibah Program Penguatan Perguruan Tinggi Swasta (PP PTS) Kemitraan menyambangi Kampus ITB Trenggalek. Simak liputan lengkap kunjungan evaluasi & komitmen peningkatan mutu!
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
                    <button 
                      onClick={() => toggleSocialLike("yt_2")}
                      className={`flex items-center gap-1.5 text-xs font-bold transition duration-150 ${socialLiked["yt_2"] ? "text-rose-500" : "text-slate-400 hover:text-slate-200"}`}
                    >
                      <CheckSquare className={`w-4 h-4 ${socialLiked["yt_2"] ? "fill-current" : ""}`} />
                      <span>{284 + (socialLikesOffset["yt_2"] || 0)} Suka</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* 2.3 KALENDER (SCHEDULE) TAB */}
        {activeTab === "calendar" && (
          <div className="space-y-12 animate-fade-in">
            {/* Title */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-950 text-sky-400 border border-sky-850">
                <Calendar className="w-3.5 h-3.5 text-sky-400" />
                Kalender Akademik PMB 2026/2027
              </span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                Alur & Agenda Penting Pendaftaran
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
                Jangan lewatkan batas tanggal krusial pendaftaran. Pantau jadwal Gelombang III (Gelombang Terakhir) yang sedang aktif saat ini.
              </p>
            </div>

            {/* Timeline Row of PMB Waves */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 relative overflow-hidden opacity-60">
                <div className="absolute top-3 right-3 text-[10px] font-mono text-slate-400 uppercase font-bold">LALU</div>
                <h4 className="text-base font-bold text-slate-300">Gelombang I</h4>
                <p className="text-xs text-slate-400 mt-1 font-mono">Desember 2025 - Maret 2026</p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-[11px] text-emerald-500 font-mono bg-emerald-950/20 border border-emerald-900 px-2.5 py-1 rounded-full">
                  <CheckCircle className="w-3.5 h-3.5 animate-pulse" />
                  <span>Selesai Terlaksana</span>
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 relative overflow-hidden opacity-60">
                <div className="absolute top-3 right-3 text-[10px] font-mono text-slate-400 uppercase font-bold">LALU</div>
                <h4 className="text-base font-bold text-slate-300">Gelombang II</h4>
                <p className="text-xs text-slate-400 mt-1 font-mono">April 2026 - Juni 2026</p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-[11px] text-emerald-500 font-mono bg-emerald-950/20 border border-emerald-900 px-2.5 py-1 rounded-full">
                  <CheckCircle className="w-3.5 h-3.5 animate-pulse" />
                  <span>Selesai Terlaksana</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-sky-900/45 rounded-3xl p-6 relative overflow-hidden shadow-xl shadow-sky-500/5 ring-1 ring-sky-500/20">
                <div className="absolute top-3 right-3 text-[10px] font-mono text-sky-400 uppercase font-black animate-pulse">SEDANG AKTIF</div>
                <h4 className="text-base font-bold text-white">Gelombang III</h4>
                <p className="text-xs text-slate-300 mt-1 font-mono">Juli 2026 - Agustus 2026</p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-[11px] text-sky-400 font-mono bg-sky-950/80 border border-sky-850 px-2.5 py-1 rounded-full">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Segera Daftarkan Diri</span>
                </div>
              </div>
            </div>

            {/* Calendar & Details Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Event Schedule List (Left Side) */}
              <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <h3 className="text-lg font-bold text-white">Timeline Pendaftaran Gelombang III</h3>
                
                <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-[15px] before:w-0.5 before:bg-slate-800">
                  
                  {/* Event 1 */}
                  <div className="flex items-start gap-4 relative">
                    <div className="w-8 h-8 rounded-full bg-sky-500/10 border border-sky-500/40 text-sky-400 flex items-center justify-center font-bold font-mono text-xs z-10 shrink-0">
                      1
                    </div>
                    <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-850/80 flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-white text-sm">Pembukaan Pendaftaran Online</h4>
                        <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded">01 Juli 2026</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Pengisian formulir pendaftaran melalui Portal Calon Mahasiswa secara online mandiri 24 jam.
                      </p>
                    </div>
                  </div>

                  {/* Event 2 */}
                  <div className="flex items-start gap-4 relative">
                    <div className="w-8 h-8 rounded-full bg-sky-500/10 border border-sky-500/40 text-sky-400 flex items-center justify-center font-bold font-mono text-xs z-10 shrink-0">
                      2
                    </div>
                    <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-850/80 flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-white text-sm">Batas Akhir Pendaftaran & Upload</h4>
                        <span className="text-[10px] text-rose-400 font-mono bg-rose-950/30 px-2 py-0.5 rounded border border-rose-900/30">25 Agustus 2026</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Batas akhir submit berkas administrasi (Ijazah, KTP, Pasfoto) serta penyelesaian TTE (Tanda Tangan Elektronik).
                      </p>
                    </div>
                  </div>

                  {/* Event 3 */}
                  <div className="flex items-start gap-4 relative">
                    <div className="w-8 h-8 rounded-full bg-sky-500/10 border border-sky-500/40 text-sky-400 flex items-center justify-center font-bold font-mono text-xs z-10 shrink-0">
                      3
                    </div>
                    <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-850/80 flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-white text-sm">Ujian CBT Mandiri & Tes Minat Bakat AI</h4>
                        <span className="text-[10px] text-sky-400 font-mono bg-slate-900 px-2 py-0.5 rounded">Fleksibel ( s/d 26 Agt )</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Pelaksanaan ujian tulis berbasis komputer mandiri serta pengerjaan tes minat bakat AI setelah akun terverifikasi melakukan pembayaran pendaftaran.
                      </p>
                    </div>
                  </div>

                  {/* Event 4 */}
                  <div className="flex items-start gap-4 relative">
                    <div className="w-8 h-8 rounded-full bg-sky-500/10 border border-sky-500/40 text-sky-400 flex items-center justify-center font-bold font-mono text-xs z-10 shrink-0">
                      4
                    </div>
                    <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-850/80 flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-white text-sm">Pengumuman Kelulusan Seleksi</h4>
                        <span className="text-[10px] text-amber-400 font-mono bg-amber-950/30 px-2 py-0.5 rounded border border-amber-900/30">28 Agustus 2026</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Hasil seleksi kelulusan dapat dicek instan pada portal akun maba masing-masing pendaftar dan unduh Surat Keputusan Kelulusan resmi.
                      </p>
                    </div>
                  </div>

                  {/* Event 5 */}
                  <div className="flex items-start gap-4 relative">
                    <div className="w-8 h-8 rounded-full bg-sky-500/10 border border-sky-500/40 text-sky-400 flex items-center justify-center font-bold font-mono text-xs z-10 shrink-0">
                      5
                    </div>
                    <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-850/80 flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-white text-sm">Daftar Ulang & Registrasi Akademik</h4>
                        <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded">29 Agt - 05 Sep 2026</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Pembayaran herregistrasi, penyerahan berkas fisik asli, cetak KTM (Kartu Tanda Mahasiswa), serta persiapan PKKMB.
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Monthly Grid Calendar (Right Side) */}
              <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-sky-400" />
                    <span>Agustus 2026</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Hari Penting PMB ditandai warna khusus</p>
                </div>

                <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-semibold text-slate-400 font-mono border-b border-slate-800/80 pb-2">
                  <span>S</span><span>S</span><span>R</span><span>K</span><span>J</span><span>S</span><span>M</span>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center font-mono text-[11px]">
                  {/* Empty cells for starting offset of August 2026 (starts on Saturday) */}
                  <span className="text-slate-700 p-2"></span>
                  <span className="text-slate-700 p-2"></span>
                  <span className="text-slate-700 p-2"></span>
                  <span className="text-slate-700 p-2"></span>
                  <span className="text-slate-700 p-2"></span>
                  <span className="text-slate-300 p-2 hover:bg-slate-800 rounded-lg">1</span>
                  <span className="text-slate-500 p-2 font-bold hover:bg-slate-800 rounded-lg text-rose-500">2</span>

                  <span className="text-slate-300 p-2 hover:bg-slate-800 rounded-lg">3</span>
                  <span className="text-slate-300 p-2 hover:bg-slate-800 rounded-lg">4</span>
                  <span className="text-slate-300 p-2 hover:bg-slate-800 rounded-lg">5</span>
                  <span className="text-slate-300 p-2 hover:bg-slate-800 rounded-lg">6</span>
                  <span className="text-slate-300 p-2 hover:bg-slate-800 rounded-lg">7</span>
                  <span className="text-slate-300 p-2 hover:bg-slate-800 rounded-lg">8</span>
                  <span className="text-slate-500 p-2 font-bold hover:bg-slate-800 rounded-lg text-rose-500">9</span>

                  <span className="text-slate-300 p-2 hover:bg-slate-800 rounded-lg">10</span>
                  <span className="text-slate-300 p-2 hover:bg-slate-800 rounded-lg">11</span>
                  <span className="text-slate-300 p-2 hover:bg-slate-800 rounded-lg">12</span>
                  <span className="text-slate-300 p-2 hover:bg-slate-800 rounded-lg">13</span>
                  <span className="text-slate-300 p-2 hover:bg-slate-800 rounded-lg">14</span>
                  <span className="text-slate-300 p-2 hover:bg-slate-800 rounded-lg">15</span>
                  <span className="text-slate-500 p-2 font-bold hover:bg-slate-800 rounded-lg text-rose-500">16</span>

                  <span className="text-slate-300 p-2 hover:bg-slate-800 rounded-lg">17</span>
                  <span className="text-slate-300 p-2 hover:bg-slate-800 rounded-lg">18</span>
                  <span className="text-slate-300 p-2 hover:bg-slate-800 rounded-lg">19</span>
                  <span className="text-slate-300 p-2 hover:bg-slate-800 rounded-lg">20</span>
                  <span className="text-slate-300 p-2 hover:bg-slate-800 rounded-lg">21</span>
                  <span className="text-slate-300 p-2 hover:bg-slate-800 rounded-lg">22</span>
                  <span className="text-slate-500 p-2 font-bold hover:bg-slate-800 rounded-lg text-rose-500">23</span>

                  <span className="text-slate-300 p-2 hover:bg-slate-800 rounded-lg">24</span>
                  
                  <span className="bg-rose-500 text-white font-black p-2 rounded-lg relative group cursor-help">
                    25
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-32 bg-slate-950 text-white text-[9px] p-2 rounded border border-slate-800 hidden group-hover:block z-10 font-sans shadow-lg">
                      Batas Akhir Submit Berkas
                    </div>
                  </span>
                  
                  <span className="bg-sky-500 text-white font-black p-2 rounded-lg relative group cursor-help">
                    26
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-32 bg-slate-950 text-white text-[9px] p-2 rounded border border-slate-800 hidden group-hover:block z-10 font-sans shadow-lg">
                      Batas Akhir CBT & Minat AI
                    </div>
                  </span>
                  <span className="text-slate-300 p-2 hover:bg-slate-800 rounded-lg">27</span>
                  
                  <span className="bg-amber-500 text-slate-950 font-black p-2 rounded-lg relative group cursor-help">
                    28
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-32 bg-slate-950 text-white text-[9px] p-2 rounded border border-slate-800 hidden group-hover:block z-10 font-sans shadow-lg">
                      Pengumuman Kelulusan Seleksi
                    </div>
                  </span>
                  
                  <span className="bg-emerald-600 text-white font-black p-2 rounded-lg relative group cursor-help">
                    29
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-32 bg-slate-950 text-white text-[9px] p-2 rounded border border-slate-800 hidden group-hover:block z-10 font-sans shadow-lg">
                      Pembukaan Daftar Ulang
                    </div>
                  </span>
                  <span className="text-slate-500 p-2 font-bold hover:bg-slate-800 rounded-lg text-rose-500">30</span>

                  <span className="text-slate-300 p-2 hover:bg-slate-800 rounded-lg">31</span>
                  <span className="text-slate-700 p-2"></span>
                  <span className="text-slate-700 p-2"></span>
                  <span className="text-slate-700 p-2"></span>
                  <span className="text-slate-700 p-2"></span>
                  <span className="text-slate-700 p-2"></span>
                  <span className="text-slate-700 p-2"></span>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-850/80 space-y-2.5 text-xs">
                  <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider font-bold">Keterangan Penanda:</p>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-rose-500 inline-block shrink-0"></span>Batas Berkas</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-sky-500 inline-block shrink-0"></span>Batas Ujian/CBT</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block shrink-0"></span>Pengumuman</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-600 inline-block shrink-0"></span>Daftar Ulang</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 2.4 KONTAK (CONTACT) TAB */}
        {activeTab === "contact" && (
          <div className="space-y-12 animate-fade-in">
            {/* Title */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-950 text-sky-400 border border-sky-850">
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                Layanan Informasi PMB
              </span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                Hubungi Kami Kapan Saja
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
                Tim Admisi PMB ITB Trenggalek siap membantu menjelaskan kendala Anda seputar pendaftaran, beasiswa, program studi, maupun teknis portal.
              </p>
            </div>

            {/* Split grid for cards vs form */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Contact Info cards & Map (Left Side) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Help Desk Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                  <h3 className="text-lg font-bold text-white">Sekretariat Pendaftaran</h3>
                  <div className="space-y-4 text-xs">
                    
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-850 text-sky-400 shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-300">Lokasi Kampus</p>
                        <p className="text-slate-400 leading-relaxed">
                          Jl. Pattimura No. 12, Kel. Sumbergedong, Kec. Trenggalek, Kabupaten Trenggalek, Jawa Timur 66315.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-850 text-emerald-400 shrink-0">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-300">WhatsApp Admisi (Fast Response)</p>
                        <a 
                          href="https://wa.me/6285648730190" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-emerald-400 font-mono hover:underline block"
                        >
                          +62 856-4873-0190
                        </a>
                        <p className="text-[10px] text-slate-400">Aktif Senin - Sabtu: 08:00 - 16:00 WIB</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-850 text-rose-400 shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-300">E-mail Admisi</p>
                        <a 
                          href="mailto:pmb@itbtrenggalek.ac.id" 
                          className="text-rose-400 font-mono hover:underline block"
                        >
                          pmb@itbtrenggalek.ac.id
                        </a>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Campus Map Placeholder */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
                  <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400">Peta Lokasi Kampus</h4>
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-850 flex flex-col items-center justify-center p-4 text-center">
                    <MapPin className="w-8 h-8 text-rose-500 animate-bounce mb-1" />
                    <p className="text-xs font-bold text-white">ITB Trenggalek Campus Map</p>
                    <p className="text-[10px] text-slate-400 mt-1 max-w-[220px]">
                      Pusat Kabupaten Trenggalek (Samping Alun-Alun, Jalan Pattimura)
                    </p>
                    <a 
                      href="https://maps.google.com" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="mt-3 bg-slate-900 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-xl text-[10px] text-sky-400 font-bold flex items-center gap-1 shadow animate-pulse"
                    >
                      <span>Buka di Google Maps</span>
                      <ChevronRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>

              </div>

              {/* Inquiry Form (Right Side) */}
              <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white">Form Pertanyaan & Konsultasi</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Kirimkan kendala atau pertanyaan administrasi/pendaftaran di bawah. Hub admisi akan segera membalas email atau nomor WA Anda dalam 1x24 jam kerja.
                  </p>
                </div>

                {successContactMsg ? (
                  <div className="bg-emerald-950/20 border border-emerald-900/30 p-6 rounded-2xl text-center space-y-3 animate-fade-in">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                      <CheckCircle className="w-6 h-6 animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-white text-sm">Pesan Berhasil Terkirim!</h4>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                        Terima kasih atas pesan Anda. Tim Admisi ITB Trenggalek akan menghubungi Anda secepatnya. Hubungi terus WhatsApp kami untuk tanggapan instan.
                      </p>
                    </div>
                    <button
                      onClick={() => setSuccessContactMsg(false)}
                      className="bg-slate-950 hover:bg-slate-850 text-slate-300 font-bold py-2 px-4 rounded-xl text-xs transition border border-slate-850 mt-1"
                    >
                      Kirim Pesan Lainnya
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[11px] text-slate-400 uppercase tracking-wider font-mono">Nama Lengkap</label>
                        <input
                          type="text"
                          required
                          placeholder="Masukkan nama Anda"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] text-slate-400 uppercase tracking-wider font-mono">E-mail</label>
                        <input
                          type="email"
                          required
                          placeholder="alamat@email.com"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[11px] text-slate-400 uppercase tracking-wider font-mono">No. WhatsApp</label>
                        <input
                          type="tel"
                          required
                          placeholder="08xxxxxxxxxx"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] text-slate-400 uppercase tracking-wider font-mono">Subjek / Topik</label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Info Beasiswa Gel. III"
                          value={contactSubject}
                          onChange={(e) => setContactSubject(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] text-slate-400 uppercase tracking-wider font-mono">Pesan / Masalah</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Tuliskan kendala pendaftaran atau pertanyaan Anda secara rinci disini..."
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingContact}
                      className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold py-3 rounded-xl text-xs transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-sky-500/10 disabled:opacity-50"
                    >
                      {isSubmittingContact ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      <span>Kirim Formulir Konsultasi</span>
                    </button>
                  </form>
                )}
              </div>

            </div>
          </div>
        )}

        {/* 3. ADMIN DASHBOARD TAB */}
        {activeTab === "admin" && (
          <div className="space-y-8">
            {!isAdminLoggedIn ? (
              /* ADMIN LOGIN FORM */
              <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 animate-fade-in">
                <div className="text-center space-y-2">
                  <div className="inline-flex bg-amber-950/60 p-3 rounded-full text-amber-400 border border-amber-800 mb-2">
                    <Key className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-white tracking-tight">Login Administrator</h2>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Khusus untuk Panitia PMB ITB Trenggalek. Silakan masukkan kredensial administrator untuk mengelola data pendaftar dan kelulusan seleksi.
                  </p>
                </div>

                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-[11px] text-slate-400 uppercase tracking-wider font-mono">Username Admin</label>
                    <input
                      type="text"
                      placeholder="Masukkan username admin"
                      value={adminUsernameInput}
                      onChange={(e) => setAdminUsernameInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-amber-500 text-white font-mono"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] text-slate-400 uppercase tracking-wider font-mono">Password Admin</label>
                    <input
                      type="password"
                      placeholder="Masukkan password admin"
                      value={adminPasswordInput}
                      onChange={(e) => setAdminPasswordInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-amber-500 text-white"
                      required
                    />
                  </div>

                  {adminLoginError && (
                    <p className="text-xs text-rose-400 flex items-center gap-1 bg-rose-950/20 px-3 py-2 rounded-lg border border-rose-900/30">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {adminLoginError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isLoggingInAdmin}
                    className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-800 text-white font-bold py-2.5 rounded-xl text-xs transition duration-200 flex items-center justify-center gap-2 shadow-lg"
                  >
                    {isLoggingInAdmin ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Shield className="w-4 h-4" />}
                    <span>Masuk ke Panel Admin</span>
                  </button>


                </form>
              </div>
            ) : (
              /* REAL-TIME ADMIN DASHBOARD (IF LOGGED IN) */
              <div className="space-y-8 animate-fade-in">
                {/* Admin Header with Logout Button */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-600/10 border border-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-white">Panel Administrator PMB</h3>
                      <p className="text-xs text-slate-400 font-mono">
                        Akses Sistem: <span className="text-amber-400 font-bold uppercase">ADMIN UTAMA</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleAdminLogout}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-950/30 hover:bg-rose-900/40 border border-rose-500/20 text-rose-400 hover:text-rose-300 text-xs font-bold transition duration-150 shrink-0"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar Panel Admin</span>
                  </button>
                </div>

                {/* Real-time statistics counters */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Pendaftar</span>
                <p className="text-2xl font-black text-white mt-1 font-mono">{stats.total}</p>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-mono">Lunas (Paid)</span>
                <p className="text-2xl font-black text-emerald-400 mt-1 font-mono">{stats.paid}</p>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <span className="text-[10px] text-purple-400 uppercase tracking-wider font-mono">Ujian Selesai</span>
                <p className="text-2xl font-black text-purple-400 mt-1 font-mono">{stats.examCompleted}</p>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <span className="text-[10px] text-sky-400 uppercase tracking-wider font-mono">Lulus Seleksi</span>
                <p className="text-2xl font-black text-sky-400 mt-1 font-mono">{stats.graduated}</p>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <span className="text-[10px] text-amber-400 uppercase tracking-wider font-mono">Menunggu Bayar</span>
                <p className="text-2xl font-black text-amber-400 mt-1 font-mono">{stats.pendingPayment}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Applicants List Table */}
              <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
                
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                      <Users className="w-5 h-5 text-sky-400" />
                      Daftar Calon Mahasiswa Terdaftar
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">Real-time database pendaftaran & hasil seleksi.</p>
                  </div>

                  <button
                    onClick={fetchAdminApplicants}
                    className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition"
                    title="Refresh Data"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>

                {/* Filter and Search controls */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Cari nama, ID, atau sekolah..."
                    value={adminSearch}
                    onChange={(e) => setAdminSearch(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-xs px-3 py-2 rounded-lg text-white"
                  />
                  <select
                    value={adminFilterProdi}
                    onChange={(e) => setAdminFilterProdi(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-xs px-3 py-2 rounded-lg text-white"
                  >
                    <option value="All">Semua Prodi Pilihan</option>
                    <option value={StudyProgram.ILMU_KOMPUTER}>Ilmu Komputer</option>
                    <option value={StudyProgram.BISNIS_DIGITAL}>Bisnis Digital</option>
                    <option value={StudyProgram.MANAJEMEN_RITEL}>Manajemen Ritel</option>
                  </select>
                  <select
                    value={adminFilterStatus}
                    onChange={(e) => setAdminFilterStatus(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-xs px-3 py-2 rounded-lg text-white"
                  >
                    <option value="All">Semua Status</option>
                    <option value="Registered">Registered (Pendaftar Baru)</option>
                    <option value="Paid">Lunas (Paid)</option>
                    <option value="DocumentUploaded">Berkas Lengkap</option>
                    <option value="ExamCompleted">Ujian Selesai</option>
                    <option value="Graduated">Dinyatakan Lulus</option>
                    <option value="Rejected">Belum Lulus</option>
                  </select>
                </div>

                {/* Applicants Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                        <th className="py-2.5 px-3">No. ID</th>
                        <th className="py-2.5 px-3">Nama Lengkap & Sekolah</th>
                        <th className="py-2.5 px-3">CBT Skor</th>
                        <th className="py-2.5 px-3">Bayar</th>
                        <th className="py-2.5 px-3">Status PMB</th>
                        <th className="py-2.5 px-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {loadingAdminData ? (
                        <tr>
                          <td colSpan={6} className="text-center py-8 font-mono text-slate-500">
                            Memuat data pendaftar...
                          </td>
                        </tr>
                      ) : filteredApplicants.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-8 font-mono text-slate-500">
                            Tidak ada pendaftar yang cocok dengan filter pencarian.
                          </td>
                        </tr>
                      ) : (
                        filteredApplicants.map((app) => (
                          <tr
                            key={app.id}
                            onClick={() => setSelectedAdminApplicant(app)}
                            className={`hover:bg-slate-800/40 cursor-pointer transition ${
                              selectedAdminApplicant?.id === app.id ? "bg-slate-850" : ""
                            }`}
                          >
                            <td className="py-3 px-3 font-mono text-sky-400 font-bold">{app.id}</td>
                            <td className="py-3 px-3">
                              <p className="font-semibold text-slate-100">{app.name}</p>
                              <p className="text-[10px] text-slate-500">{app.school}</p>
                            </td>
                            <td className="py-3 px-3 font-mono font-bold">
                              {app.exam?.score !== undefined ? `${app.exam.score}/100` : "-"}
                            </td>
                            <td className="py-3 px-3">
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold font-mono ${
                                app.payment?.status === "Paid" ? "bg-emerald-950 text-emerald-400 border border-emerald-900" : "bg-amber-950 text-amber-400 border border-amber-900"
                              }`}>
                                {app.payment?.status}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                app.status.startsWith("Graduated_") 
                                  ? "bg-emerald-950 text-emerald-400" 
                                  : app.status === "ExamCompleted"
                                  ? "bg-purple-950 text-purple-400"
                                  : app.status === "DocumentUploaded"
                                  ? "bg-indigo-950 text-indigo-400"
                                  : "bg-slate-800 text-slate-400"
                              }`}>
                                {app.status.startsWith("Graduated_") ? "LULUS" : app.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedAdminApplicant(app);
                                }}
                                className="bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 px-2.5 py-1 rounded transition border border-slate-700"
                              >
                                Detail
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

              </div>

              {/* Right Column: Applicant Detailed Action & Manual Selection Verdict */}
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-6">
                {selectedAdminApplicant ? (
                  <div className="space-y-6">
                    <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                      <div>
                        <span className="text-[10px] text-sky-400 font-mono font-bold">{selectedAdminApplicant.id}</span>
                        <h4 className="font-bold text-white text-base mt-1">{selectedAdminApplicant.name}</h4>
                        <p className="text-[10px] text-slate-500 font-mono">{selectedAdminApplicant.email}</p>
                      </div>
                      <button
                        onClick={() => setSelectedAdminApplicant(null)}
                        className="text-slate-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-3 text-[11px]">
                      <div>
                        <span className="text-slate-500 font-mono">Pilihan 1:</span>
                        <p className="text-slate-200 font-bold truncate">{selectedAdminApplicant.prodi1}</p>
                      </div>
                      <div>
                        <span className="text-slate-500 font-mono">Pilihan 2:</span>
                        <p className="text-slate-200 font-bold truncate">{selectedAdminApplicant.prodi2}</p>
                      </div>
                    </div>

                    {/* Documents Checked */}
                    <div className="space-y-2 border-t border-slate-800 pt-3">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Pengecekan Dokumen Persyaratan:</span>
                      <div className="grid grid-cols-3 gap-2 text-[10px]">
                        <div className={`p-2 rounded border text-center ${selectedAdminApplicant.documents?.ijazah ? "bg-emerald-950/20 border-emerald-900 text-emerald-400" : "bg-slate-950 border-slate-800 text-slate-600"}`}>
                          Ijazah/SKL
                        </div>
                        <div className={`p-2 rounded border text-center ${selectedAdminApplicant.documents?.ktp ? "bg-emerald-950/20 border-emerald-900 text-emerald-400" : "bg-slate-950 border-slate-800 text-slate-600"}`}>
                          KTP/KK
                        </div>
                        <div className={`p-2 rounded border text-center ${selectedAdminApplicant.documents?.foto ? "bg-emerald-950/20 border-emerald-900 text-emerald-400" : "bg-slate-950 border-slate-800 text-slate-600"}`}>
                          Pasfoto
                        </div>
                      </div>
                    </div>

                    {/* Signature Check */}
                    {selectedAdminApplicant.signature && (
                      <div className="space-y-2 border-t border-slate-800 pt-3">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Tanda Tangan Elektronik:</span>
                        <div className="bg-white p-2 rounded-lg border border-slate-800">
                          <img
                            src={selectedAdminApplicant.signature}
                            alt="Tanda Tangan"
                            className="h-10 mx-auto bg-white"
                          />
                        </div>
                      </div>
                    )}

                    {/* CBT Selection Score Details */}
                    {selectedAdminApplicant.exam?.completedAt && (
                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5 text-xs">
                        <span className="text-[10px] text-slate-500 font-mono">Hasil Ujian CBT Online:</span>
                        <div className="flex justify-between font-mono font-bold">
                          <span>Nilai Kelulusan:</span>
                          <span className={selectedAdminApplicant.exam.score >= 60 ? "text-emerald-400" : "text-rose-400"}>
                            {selectedAdminApplicant.exam.score}/100 ({selectedAdminApplicant.exam.score >= 60 ? "LULUS" : "TIDAK LULUS"})
                          </span>
                        </div>
                      </div>
                    )}

                    {/* AI Gemini Recommendation Check */}
                    {selectedAdminApplicant.interestTest?.recommendation ? (
                      <div className="bg-indigo-950/20 border border-indigo-900/40 p-3 rounded-lg space-y-1.5 text-[11px]">
                        <span className="font-bold text-indigo-400 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" /> Rekomendasi Minat AI:
                        </span>
                        <p className="text-white font-bold">{selectedAdminApplicant.interestTest.recommendation.primaryProdi}</p>
                        <p className="text-slate-300 italic">"{selectedAdminApplicant.interestTest.recommendation.explanation}"</p>
                      </div>
                    ) : (
                      <div className="bg-slate-950 p-3 rounded-lg text-center text-[10px] text-slate-500 font-mono">
                        Belum menyelesaikan Tes Bakat Minat AI.
                      </div>
                    )}

                    {/* Action Panel for manual verification of Payment & Graduation */}
                    <div className="border-t border-slate-800 pt-4 space-y-3">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Update Status Kelulusan (Kirim Notifikasi Otomatis):</span>
                      
                      {selectedAdminApplicant.payment.status === "Pending" && (
                        <button
                          onClick={() => handleAdminSimulatePayment(selectedAdminApplicant.id)}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg text-[11px] transition shadow"
                        >
                          Sahkan Pembayaran VA (Paid)
                        </button>
                      )}

                      <div className="grid grid-cols-1 gap-2 pt-1">
                        <button
                          onClick={() => handleAdminUpdateStatus("Graduated_Ilmu_Komputer")}
                          disabled={updatingAdminStatus}
                          className="w-full bg-slate-950 hover:bg-slate-800 text-emerald-400 border border-emerald-900/60 font-bold py-1.5 rounded-lg text-[10px] transition"
                        >
                          Luluskan di S1 Ilmu Komputer 💻
                        </button>
                        <button
                          onClick={() => handleAdminUpdateStatus("Graduated_Bisnis_Digital")}
                          disabled={updatingAdminStatus}
                          className="w-full bg-slate-950 hover:bg-slate-800 text-indigo-400 border border-indigo-900/60 font-bold py-1.5 rounded-lg text-[10px] transition"
                        >
                          Luluskan di S1 Bisnis Digital 🚀
                        </button>
                        <button
                          onClick={() => handleAdminUpdateStatus("Graduated_Manajemen_Ritel")}
                          disabled={updatingAdminStatus}
                          className="w-full bg-slate-950 hover:bg-slate-800 text-teal-400 border border-teal-900/60 font-bold py-1.5 rounded-lg text-[10px] transition"
                        >
                          Luluskan di S1 Manajemen Ritel 🏪
                        </button>
                        
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <button
                            onClick={() => handleAdminUpdateStatus("Verified")}
                            disabled={updatingAdminStatus}
                            className="w-full bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold py-1.5 rounded-lg text-[10px] transition"
                          >
                            Sahkan Dokumen Valid
                          </button>
                          <button
                            onClick={() => handleAdminUpdateStatus("Rejected")}
                            disabled={updatingAdminStatus}
                            className="w-full bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-900/60 font-bold py-1.5 rounded-lg text-[10px] transition"
                          >
                            Tolak Pendaftaran
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="text-center py-16 text-slate-500 font-mono text-xs flex flex-col items-center justify-center">
                    <UserPlus className="w-10 h-10 mb-2 text-slate-700" />
                    <span>Pilih salah satu pendaftar di daftar tabel untuk memeriksa berkas, nilai ujian CBT, dan mengonfirmasi kelulusan.</span>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

          </div>
        )}

      </main>

      {/* Footer Section */}
      <footer className="bg-slate-900 border-t border-slate-800/80 pt-16 pb-12 text-xs text-slate-400 relative overflow-hidden">
        {/* Subtle radial glow background effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(14,58,61,0.15),transparent_60%)] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          {/* Top 4-column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            
            {/* Column 1: Tentang Kampus */}
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-white p-0.5 flex items-center justify-center shadow-md shrink-0">
                  <img 
                    src={ITBTrenggalekLogo} 
                    alt="Logo ITB Trenggalek" 
                    className="w-full h-full object-contain rounded-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <span className="font-extrabold text-sm text-white tracking-wider block">ITB TRENGGALEK</span>
                  <span className="text-[10px] text-slate-400 block font-mono font-bold leading-none">INSTITUT TEKNOLOGI & BISNIS</span>
                </div>
              </div>
              
              <p className="text-slate-300 leading-relaxed text-[11px] sm:text-xs">
                Institut Teknologi dan Bisnis Trenggalek adalah kampus pilihan terunggul di Trenggalek yang berfokus melahirkan wirausahawan digital, profesional retail modern, dan ahli ilmu komputer siap kerja di era global.
              </p>

              <div className="flex items-center gap-2.5 bg-[#0e3a3d]/40 border border-teal-900/60 p-2.5 rounded-xl">
                <Award className="w-5 h-5 text-orange-400 shrink-0" />
                <div>
                  <p className="text-white font-extrabold text-[10px] uppercase leading-none font-sans">Terakreditasi Baik</p>
                  <p className="text-slate-400 text-[9px] font-mono leading-none mt-1">Oleh BAN-PT Republik Indonesia</p>
                </div>
              </div>
            </div>

            {/* Column 2: Program Studi S1 */}
            <div className="space-y-4 text-left">
              <h4 className="text-white font-extrabold text-sm tracking-wider uppercase font-sans border-b border-slate-800 pb-2">
                Program Studi S1
              </h4>
              <ul className="space-y-3 font-sans">
                <li>
                  <button 
                    onClick={() => {
                      setActiveTab("home");
                      setTimeout(() => {
                        const sec = document.getElementById("prodi-bisnis-digital");
                        if (sec) sec.scrollIntoView({ behavior: "smooth" });
                      }, 100);
                    }}
                    className="group flex items-start gap-2 hover:text-white text-left transition w-full"
                  >
                    <span className="bg-sky-500/15 group-hover:bg-sky-500 text-sky-400 group-hover:text-white w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 transition-all">
                      BD
                    </span>
                    <div>
                      <p className="text-slate-200 font-bold text-[11px] sm:text-xs group-hover:text-sky-400 transition-colors">S1 Bisnis Digital</p>
                      <p className="text-slate-400 text-[10px]">Fakultas Ekonomi &amp; Bisnis</p>
                    </div>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      setActiveTab("home");
                      setTimeout(() => {
                        const sec = document.getElementById("prodi-manajemen-ritel");
                        if (sec) sec.scrollIntoView({ behavior: "smooth" });
                      }, 100);
                    }}
                    className="group flex items-start gap-2 hover:text-white text-left transition w-full"
                  >
                    <span className="bg-emerald-500/15 group-hover:bg-emerald-500 text-emerald-400 group-hover:text-white w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 transition-all">
                      MR
                    </span>
                    <div>
                      <p className="text-slate-200 font-bold text-[11px] sm:text-xs group-hover:text-emerald-400 transition-colors">S1 Manajemen Ritel</p>
                      <p className="text-slate-400 text-[10px]">Fakultas Ekonomi &amp; Bisnis</p>
                    </div>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      setActiveTab("home");
                      setTimeout(() => {
                        const sec = document.getElementById("prodi-ilmu-komputer");
                        if (sec) sec.scrollIntoView({ behavior: "smooth" });
                      }, 100);
                    }}
                    className="group flex items-start gap-2 hover:text-white text-left transition w-full"
                  >
                    <span className="bg-indigo-500/15 group-hover:bg-indigo-500 text-indigo-400 group-hover:text-white w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 transition-all">
                      IK
                    </span>
                    <div>
                      <p className="text-slate-200 font-bold text-[11px] sm:text-xs group-hover:text-indigo-400 transition-colors">S1 Ilmu Komputer</p>
                      <p className="text-slate-400 text-[10px]">Fakultas Sains &amp; Teknologi</p>
                    </div>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Pusat Kontak */}
            <div className="space-y-4 text-left">
              <h4 className="text-white font-extrabold text-sm tracking-wider uppercase font-sans border-b border-slate-800 pb-2">
                Pusat Kontak
              </h4>
              <div className="space-y-3 text-slate-300">
                <div className="flex gap-2.5 items-start">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <p className="leading-relaxed text-[11px] sm:text-xs">
                    <strong className="text-white block font-semibold">Kampus Utama:</strong>
                    Jl. Supriyadi No. 22, Kel. Kutanegara, Kec. Trenggalek, Kab. Trenggalek, Jawa Timur 66311.
                  </p>
                </div>
                <div className="flex gap-2.5 items-center">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <p className="text-[11px] sm:text-xs">
                    <strong className="text-white block font-semibold">WhatsApp PMB:</strong>
                    <a href="https://wa.me/6285648730190" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline transition">0856-4873-0190</a>
                  </p>
                </div>
                <div className="flex gap-2.5 items-center">
                  <Building className="w-4 h-4 text-sky-400 shrink-0" />
                  <p className="text-[11px] sm:text-xs">
                    <strong className="text-white block font-semibold">Situs Resmi:</strong>
                    <a href="https://www.itbtrenggalek.ac.id/" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline transition">itbtrenggalek.ac.id</a>
                  </p>
                </div>
              </div>
            </div>

            {/* Column 4: Navigasi Cepat & Sosial */}
            <div className="space-y-4 text-left">
              <h4 className="text-white font-extrabold text-sm tracking-wider uppercase font-sans border-b border-slate-800 pb-2">
                Tautan Cepat
              </h4>
              <div className="grid grid-cols-2 gap-2 text-[11px] sm:text-xs font-medium">
                <button onClick={() => setActiveTab("home")} className="hover:text-white text-left transition flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-sky-400" /> Informasi
                </button>
                <button onClick={() => setActiveTab("portal")} className="hover:text-white text-left transition flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-sky-400" /> Portal PMB
                </button>
                <button onClick={() => setActiveTab("admin")} className="hover:text-white text-left transition flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-sky-400" /> Dashboard
                </button>
                <a href="https://maps.app.goo.gl/9KRpAqY6uLjuNxtg6" target="_blank" rel="noopener noreferrer" className="hover:text-white transition flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-sky-400" /> Rute Maps
                </a>
              </div>

              <div className="pt-2 space-y-2">
                <p className="text-white font-extrabold text-[11px] tracking-wider uppercase font-sans">Temukan Kami di Sosmed:</p>
                <div className="flex gap-2">
                  <a 
                    href="https://www.instagram.com/itb_trenggalek?igsh=NDBiM3N0MHZtbjVj" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-pink-950/40 border border-slate-700/60 hover:border-pink-500/30 text-slate-300 hover:text-pink-400 flex items-center justify-center transition"
                    title="Instagram ITB Trenggalek"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a 
                    href="https://www.tiktok.com/@itb_trenggalek?_r=1&_t=ZS-97xTRNAKF1k" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-indigo-950/40 border border-slate-700/60 hover:border-indigo-500/30 text-slate-300 hover:text-indigo-400 flex items-center justify-center transition"
                    title="TikTok ITB Trenggalek"
                  >
                    <span className="font-extrabold font-mono text-xs text-indigo-400">T</span>
                  </a>
                  <a 
                    href="https://www.youtube.com/@itbtrenggalek6211" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-red-950/40 border border-slate-700/60 hover:border-red-500/30 text-slate-300 hover:text-red-500 flex items-center justify-center transition"
                    title="YouTube ITB Trenggalek"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                  <a 
                    href="https://wa.me/6285648730190" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-emerald-950/40 border border-slate-700/60 hover:border-emerald-500/30 text-slate-300 hover:text-emerald-400 flex items-center justify-center transition"
                    title="WhatsApp PMB"
                  >
                    <Phone className="w-4 h-4 text-emerald-400" />
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Copyright & Badges */}
          <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-[11px] text-slate-500">
            <p className="max-w-xl leading-relaxed">
              Sistem Informasi Penerimaan Mahasiswa Baru (PMB) Mandiri &amp; Online © 2026 <strong className="text-slate-400 font-semibold">Institut Teknologi dan Bisnis Trenggalek</strong>. Seluruh hak cipta dilindungi undang-undang.
            </p>
            <div className="flex items-center gap-2 bg-slate-950/40 border border-slate-850 px-3 py-1.5 rounded-full text-[10px] font-mono text-slate-400 shadow-inner shrink-0 justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse"></span>
              <span>Online PMB Server: Active &amp; Secured</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Sahabat ITB AI Chat Widget */}
      <SahabatITBChat />

      {/* Interactive Lightbox Flyer Viewer */}
      {activeFlyerUrl && (
        <div 
          className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all duration-300"
          onClick={() => setActiveFlyerUrl(null)}
        >
          <div 
            className="relative max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-3 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setActiveFlyerUrl(null)}
              className="absolute top-5 right-5 bg-slate-950/85 hover:bg-slate-900 text-slate-300 hover:text-white rounded-full p-2 border border-slate-800/80 transition shadow-lg z-10"
            >
              <X className="w-4.5 h-4.5" />
            </button>
            
            {/* Flyer Image */}
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-slate-950 shadow-inner">
              <img 
                src={activeFlyerUrl} 
                alt="Brosur Program Studi Detail" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Information footer */}
            <div className="pt-3 pb-1 text-center text-slate-400 text-[11px] font-mono flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
              <span>Klik area luar untuk kembali</span>
            </div>
          </div>
        </div>
      )}

      {/* Social Media Video Player Modal */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all duration-300"
          onClick={() => setSelectedVideo(null)}
        >
          <div 
            className="relative max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-3 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedVideo(null)}
              className="absolute top-5 right-5 bg-slate-950/85 hover:bg-slate-900 text-slate-300 hover:text-white rounded-full p-2 border border-slate-800/80 transition shadow-lg z-10"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            <div className="p-2 space-y-3">
              <h3 className="text-sm font-bold text-white pr-10">{selectedVideo.title}</h3>
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                <iframe
                  className="w-full h-full"
                  src={selectedVideo.embedUrl}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="text-center text-slate-400 text-[10px] font-mono">
                ITB Trenggalek Official Youtube Channel • Klik luar video untuk kembali
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Maba Logout Confirmation Modal */}
      {showMabaLogoutConfirm && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4 transition-all duration-300 animate-in fade-in"
          onClick={() => setShowMabaLogoutConfirm(false)}
        >
          <div 
            className="relative max-w-sm w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
                <LogOut className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-white">Keluar dari Portal PMB</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Apakah Anda yakin ingin keluar dari Portal PMB? Anda harus masuk kembali untuk melihat status kelulusan Anda.
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowMabaLogoutConfirm(false)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 rounded-xl text-xs transition border border-slate-700"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmMabaLogout}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-md"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Admin Logout Confirmation Modal */}
      {showAdminLogoutConfirm && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4 transition-all duration-300 animate-in fade-in"
          onClick={() => setShowAdminLogoutConfirm(false)}
        >
          <div 
            className="relative max-w-sm w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
                <LogOut className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-white">Keluar Panel Admin</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Apakah Anda yakin ingin keluar dari Dashboard Administrator? Sesi admin Anda akan diakhiri.
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAdminLogoutConfirm(false)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 rounded-xl text-xs transition border border-slate-700"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmAdminLogout}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-md"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
