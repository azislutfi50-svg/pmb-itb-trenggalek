import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON bodies with higher limits for document uploads and signature base64
app.use(express.json({ limit: "15mb" }));

const DB_FILE = path.join(process.cwd(), "db.json");

// Default initial data for PMB ITB Trenggalek
const DEFAULT_APPLICANTS = [
  {
    id: "ITB-2026-0001",
    name: "Aditya Pratama",
    email: "aditya.pratama@gmail.com",
    whatsapp: "081234567890",
    school: "SMAN 1 Trenggalek",
    prodi1: "S1 Ilmu Komputer (Fakultas Sains & Teknologi)",
    prodi2: "S1 Bisnis Digital (Fakultas Ekonomi & Bisnis)",
    createdAt: "2026-07-10T10:00:00.000Z",
    status: "Graduated_Ilmu_Komputer",
    payment: {
      method: "Virtual Account BNI",
      vaNumber: "9880856487301001",
      amount: 150000,
      status: "Paid",
      paidAt: "2026-07-10T10:15:00.000Z"
    },
    documents: {
      ijazah: { name: "ijazah_aditya.pdf", size: "1.2 MB", uploadedAt: "2026-07-10T10:30:00.000Z" },
      ktp: { name: "ktp_aditya.png", size: "350 KB", uploadedAt: "2026-07-10T10:31:00.000Z" },
      foto: { name: "foto_aditya.jpg", size: "420 KB", uploadedAt: "2026-07-10T10:32:00.000Z" }
    },
    signature: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    exam: {
      startedAt: "2026-07-10T11:00:00.000Z",
      completedAt: "2026-07-10T11:45:00.000Z",
      answers: {},
      score: 85,
      passed: true
    },
    interestTest: {
      recommendation: {
        primaryProdi: "S1 Ilmu Komputer (Fakultas Sains & Teknologi)",
        explanation: "Aditya menunjukkan minat yang sangat kuat pada pemrograman, algoritma dasar, dan pemecahan masalah teknis. Sangat cocok diletakkan di program studi Ilmu Komputer.",
        scores: {
          "Ilmu Komputer": 95,
          "Manajemen Ritel": 40,
          "Bisnis Digital": 65
        }
      }
    }
  },
  {
    id: "ITB-2026-0002",
    name: "Siti Rahmawati",
    email: "siti.rahma@yahoo.com",
    whatsapp: "082345678901",
    school: "SMKN 1 Pogalan",
    prodi1: "S1 Bisnis Digital (Fakultas Ekonomi & Bisnis)",
    prodi2: "S1 Manajemen Ritel (Fakultas Ekonomi & Bisnis)",
    createdAt: "2026-07-11T08:00:00.000Z",
    status: "ExamCompleted",
    payment: {
      method: "Virtual Account Mandiri",
      vaNumber: "8960856487301002",
      amount: 150000,
      status: "Paid",
      paidAt: "2026-07-11T08:12:00.000Z"
    },
    documents: {
      ijazah: { name: "skl_siti_rahma.pdf", size: "1.8 MB", uploadedAt: "2026-07-11T08:20:00.000Z" },
      ktp: { name: "ktp_siti.jpg", size: "410 KB", uploadedAt: "2026-07-11T08:22:00.000Z" },
      foto: { name: "foto_siti.png", size: "280 KB", uploadedAt: "2026-07-11T08:23:00.000Z" }
    },
    signature: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    exam: {
      startedAt: "2026-07-11T09:00:00.000Z",
      completedAt: "2026-07-11T09:40:00.000Z",
      score: 75,
      passed: true
    }
  },
  {
    id: "ITB-2026-0003",
    name: "Budi Santoso",
    email: "budi.santoso@outlook.com",
    whatsapp: "083456789012",
    school: "SMAN 2 Karangan",
    prodi1: "S1 Manajemen Ritel (Fakultas Ekonomi & Bisnis)",
    prodi2: "S1 Bisnis Digital (Fakultas Ekonomi & Bisnis)",
    createdAt: "2026-07-11T14:30:00.000Z",
    status: "Registered",
    payment: {
      method: "Virtual Account BRI",
      vaNumber: "1250856487301003",
      amount: 150000,
      status: "Pending"
    },
    documents: {}
  },
  {
    id: "ITB-2026-0004",
    name: "Indah Lestari",
    email: "indah.lestari@gmail.com",
    whatsapp: "084567890123",
    school: "MAN Trenggalek",
    prodi1: "S1 Bisnis Digital (Fakultas Ekonomi & Bisnis)",
    prodi2: "S1 Ilmu Komputer (Fakultas Sains & Teknologi)",
    createdAt: "2026-07-11T15:10:00.000Z",
    status: "DocumentUploaded",
    payment: {
      method: "Virtual Account BCA",
      vaNumber: "5720856487301004",
      amount: 150000,
      status: "Paid",
      paidAt: "2026-07-11T15:15:00.000Z"
    },
    documents: {
      ijazah: { name: "ijazah_indah.pdf", size: "1.5 MB", uploadedAt: "2026-07-11T15:30:00.000Z" },
      ktp: { name: "ktp_indah.pdf", size: "980 KB", uploadedAt: "2026-07-11T15:32:00.000Z" },
      foto: { name: "foto_indah.jpg", size: "510 KB", uploadedAt: "2026-07-11T15:35:00.000Z" }
    },
    signature: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
  }
];

const DEFAULT_NOTIFICATIONS = [
  {
    id: "notif-001",
    type: "WhatsApp",
    recipient: "081234567890",
    message: "[PMB ITB Trenggalek] Selamat Aditya Pratama, pendaftaran online Anda berhasil! No Pendaftaran: ITB-2026-0001. Silakan lakukan pembayaran Rp 150.000 ke VA BNI 9880856487301001.",
    timestamp: "2026-07-10T10:00:05.000Z",
    status: "Sent"
  },
  {
    id: "notif-002",
    type: "Email",
    recipient: "aditya.pratama@gmail.com",
    message: "Subjek: Pendaftaran PMB ITB Trenggalek Berhasil!\n\nHalo Aditya Pratama, terima kasih telah mendaftar di Institut Teknologi dan Bisnis Trenggalek. No pendaftaran Anda adalah ITB-2026-0001.",
    timestamp: "2026-07-10T10:00:10.000Z",
    status: "Sent"
  },
  {
    id: "notif-003",
    type: "WhatsApp",
    recipient: "081234567890",
    message: "[PMB ITB Trenggalek] Pembayaran pendaftaran untuk ITB-2026-0001 telah kami terima. Status pendaftaran Anda kini: PAID. Silakan unggah dokumen persyaratan di portal PMB.",
    timestamp: "2026-07-10T10:15:05.000Z",
    status: "Sent"
  },
  {
    id: "notif-004",
    type: "WhatsApp",
    recipient: "081234567890",
    message: "[PMB ITB Trenggalek] Selamat Aditya Pratama! Anda dinyatakan LULUS pada program studi S1 Ilmu Komputer (Fakultas Sains & Teknologi). Silakan lakukan daftar ulang.",
    timestamp: "2026-07-10T15:00:00.000Z",
    status: "Sent"
  }
];

const DEFAULT_MABA_ACCOUNTS = [
  { username: "aditya", password: "aditya123", name: "Aditya Pratama", email: "aditya.pratama@gmail.com", whatsapp: "081234567890", applicantId: "ITB-2026-0001" },
  { username: "siti", password: "siti123", name: "Siti Rahmawati", email: "siti.rahma@yahoo.com", whatsapp: "082345678901", applicantId: "ITB-2026-0002" },
  { username: "budi", password: "budi123", name: "Budi Santoso", email: "budi.santoso@outlook.com", whatsapp: "083456789012", applicantId: "ITB-2026-0003" },
  { username: "indah", password: "indah123", name: "Indah Lestari", email: "indah.lestari@gmail.com", whatsapp: "084567890123", applicantId: "ITB-2026-0004" }
];

const DEFAULT_CONTACTS = [
  {
    id: "contact-1",
    name: "Rizky Pratama",
    email: "rizky.pratama@gmail.com",
    phone: "081234567891",
    subject: "Kendala Pembayaran Virtual Account",
    message: "Selamat siang Admin PMB ITB Trenggalek. Saya sudah mencoba membayar biaya pendaftaran melalui Virtual Account Bank BNI, namun status di dashboard pendaftaran saya masih pending. Mohon bantuan untuk memverifikasinya. Terima kasih.",
    createdAt: "2026-07-11T09:15:00.000Z",
    status: "Unread"
  },
  {
    id: "contact-2",
    name: "Dina Kartika",
    email: "dina.kartika@yahoo.com",
    phone: "085698765432",
    subject: "Pertanyaan Batas Akhir Unggah Berkas",
    message: "Halo, saya ingin bertanya untuk Gelombang III ini, batas akhir pengunggahan berkas administrasi seperti ijazah dan tanda tangan elektronik sampai tanggal berapa ya? Terima kasih banyak.",
    createdAt: "2026-07-11T11:40:00.000Z",
    status: "Responded"
  }
];

const DEFAULT_FAQS = [
  {
    id: "faq-1",
    question: "Bagaimana cara mendaftar sebagai mahasiswa baru di ITB Trenggalek?",
    answer: "Pendaftaran dapat dilakukan sepenuhnya secara online melalui portal PMB ini. Pertama, klik tombol 'Daftar Sekarang' di Beranda untuk membuat akun. Setelah memiliki akun, silakan masuk ke Portal MABA untuk mengisi formulir pendaftaran, memilih program studi, membayar biaya pendaftaran, mengunggah berkas persyaratan, serta mengikuti ujian CBT dan tes minat bakat AI secara online.",
    category: "Pendaftaran",
    createdAt: "2026-07-11T12:00:00.000Z"
  },
  {
    id: "faq-2",
    question: "Berapa biaya pendaftaran dan bagaimana metode pembayarannya?",
    answer: "Biaya pendaftaran untuk mahasiswa baru adalah Rp 250.000. Pembayaran dapat dilakukan secara aman melalui Transfer Virtual Account Bank BNI yang akan didapatkan setelah Anda membuat akun pendaftaran. Setelah membayar, silakan unggah bukti pembayaran di menu Pembayaran di dalam Portal MABA.",
    category: "Biaya",
    createdAt: "2026-07-11T12:05:00.000Z"
  },
  {
    id: "faq-3",
    question: "Apa saja program studi yang tersedia di ITB Trenggalek?",
    answer: "ITB Trenggalek menawarkan tiga program studi Sarjana (S1) urusan yang sangat relevan dengan kebutuhan industri digital saat ini: S1 Bisnis Digital (E-Commerce, Digital Marketing, FinTech), S1 Manajemen Ritel (Retail Management, Supply Chain, Modern Store), dan S1 Ilmu Komputer (Software Engineering, AI & Machine Learning, Data Science).",
    category: "Akademik",
    createdAt: "2026-07-11T12:10:00.000Z"
  },
  {
    id: "faq-4",
    question: "Apakah tes minat bakat berbasis AI bersifat wajib?",
    answer: "Ya, tes minat bakat berbasis AI merupakan salah satu inovasi di ITB Trenggalek untuk membantu merekomendasikan program studi yang paling cocok berdasarkan profil minat, kepribadian, serta preferensi masa depan Anda. Tes ini sangat mudah diakses di dalam portal dan hanya memakan waktu sekitar 5-10 menit.",
    category: "Sistem Seleksi",
    createdAt: "2026-07-11T12:15:00.000Z"
  },
  {
    id: "faq-5",
    question: "Apakah tersedia beasiswa bagi calon mahasiswa baru?",
    answer: "Tentu saja! ITB Trenggalek menyediakan berbagai jalur beasiswa menarik, mulai dari Beasiswa KIP Kuliah (untuk mahasiswa kurang mampu yang berprestasi), Beasiswa Prestasi Akademik & Non-Akademik, Beasiswa Kemitraan Daerah, hingga Beasiswa Khusus Gelombang I. Informasi dan pendaftaran beasiswa dapat diakses setelah kelulusan seleksi administrasi.",
    category: "Beasiswa",
    createdAt: "2026-07-11T12:20:00.000Z"
  }
];

// Helper to load or initialize DB
function readDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      const data = JSON.parse(raw);
      let updated = false;
      if (!data.mabaAccounts) {
        data.mabaAccounts = DEFAULT_MABA_ACCOUNTS;
        updated = true;
      }
      if (!data.contacts) {
        data.contacts = DEFAULT_CONTACTS;
        updated = true;
      }
      if (!data.faqs) {
        data.faqs = DEFAULT_FAQS;
        updated = true;
      }
      if (updated) {
        saveDatabase(data);
      }
      return data;
    }
  } catch (err) {
    console.error("Error reading database file, resetting to default...", err);
  }
  
  const initialData = { 
    applicants: DEFAULT_APPLICANTS, 
    notifications: DEFAULT_NOTIFICATIONS,
    mabaAccounts: DEFAULT_MABA_ACCOUNTS,
    contacts: DEFAULT_CONTACTS,
    faqs: DEFAULT_FAQS
  };
  fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf-8");
  return initialData;
}

// Helper to save to DB
function saveDatabase(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving database file", err);
  }
}

// Lazy init Gemini AI
let geminiAI: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI | null {
  if (!geminiAI) {
    const key = process.env.GEMINI_API_KEY;
    if (key) {
      geminiAI = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
    }
  }
  return geminiAI;
}

// Simulated notification helper
function sendSimulatedNotification(db: any, type: "WhatsApp" | "Email", recipient: string, message: string) {
  const notif = {
    id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    type,
    recipient,
    message,
    timestamp: new Date().toISOString(),
    status: "Sent" as const
  };
  db.notifications.unshift(notif); // Put newest at the top
}

// API Routes
// Authentication Endpoints
// A. Maba Register
app.post("/api/maba/register", (req, res) => {
  const db = readDatabase();
  const { username, password, name, email, whatsapp, school, prodi1, prodi2 } = req.body;

  if (!username || !password || !name || !email || !whatsapp || !school || !prodi1 || !prodi2) {
    return res.status(400).json({ message: "Semua data pendaftaran akun Maba harus diisi secara lengkap." });
  }

  // Check if username already exists
  const exists = db.mabaAccounts.some((acc: any) => acc.username.toLowerCase() === username.toLowerCase());
  if (exists) {
    return res.status(400).json({ message: "Username sudah digunakan oleh pendaftar lain." });
  }

  // Generate unique registration ID
  const nextNum = db.applicants.length + 1;
  const padNum = String(nextNum).padStart(4, "0");
  const id = `ITB-2026-${padNum}`;

  // Generate simulated Bank Payment Info
  const banks = ["BNI", "Mandiri", "BRI", "BCA"];
  const bank = banks[Math.floor(Math.random() * banks.length)];
  const prefix = bank === "BNI" ? "988" : bank === "Mandiri" ? "896" : bank === "BRI" ? "125" : "572";
  const vaNumber = `${prefix}085648730${padNum}`;

  const newApplicant = {
    id,
    name,
    email,
    whatsapp,
    school,
    prodi1,
    prodi2,
    createdAt: new Date().toISOString(),
    status: "Registered" as const,
    payment: {
      method: `Virtual Account ${bank}`,
      vaNumber,
      amount: 150000,
      status: "Pending" as const
    },
    documents: {},
    interestTest: {}
  };

  db.applicants.unshift(newApplicant);

  // Create the Maba account
  const newAccount = {
    username,
    password,
    name,
    email,
    whatsapp,
    applicantId: id
  };
  db.mabaAccounts.push(newAccount);

  // Send WhatsApp Notification
  const waMsg = `[PMB ITB Trenggalek] Akun Maba Anda BERHASIL dibuat!\n\nNo. Pendaftaran PMB: ${id}\nUsername: ${username}\nBiaya Pendaftaran: Rp 150.000\nMetode: ${newApplicant.payment.method}\nNo. Virtual Account: ${vaNumber}\n\nSilakan masuk ke Portal PMB dan selesaikan pembayaran untuk lanjut ke tahap selanjutnya. Terima kasih.`;
  sendSimulatedNotification(db, "WhatsApp", whatsapp, waMsg);

  // Send Email Notification
  const emailMsg = `Subjek: Akun Maba & Pendaftaran PMB ITB Trenggalek Berhasil!\n\nHalo ${name},\n\nAkun Maba Anda berhasil dibuat!\n- Username: ${username}\n- No. Pendaftaran: ${id}\n- Pilihan 1: ${prodi1}\n- Pilihan 2: ${prodi2}\n\nUntuk melengkapi pendaftaran, silakan bayar biaya pendaftaran sebesar Rp 150.000 melalui ${newApplicant.payment.method} dengan nomor VA: ${vaNumber}.\n\nSalam Hangat,\nPanitia PMB ITB Trenggalek`;
  sendSimulatedNotification(db, "Email", email, emailMsg);

  saveDatabase(db);
  res.status(201).json({ account: newAccount, applicant: newApplicant });
});

// B. Maba Login
app.post("/api/maba/login", (req, res) => {
  const db = readDatabase();
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username dan password harus diisi." });
  }

  const account = db.mabaAccounts.find(
    (acc: any) => acc.username.toLowerCase() === username.toLowerCase() && acc.password === password
  );

  if (!account) {
    return res.status(411).json({ message: "Username atau password salah." });
  }

  const applicant = db.applicants.find((a: any) => a.id.toLowerCase() === account.applicantId.toLowerCase());
  res.json({ account, applicant: applicant || null });
});

// B2. Maba Forgot Password
app.post("/api/maba/forgot-password", (req, res) => {
  const db = readDatabase();
  const { searchKey } = req.body;

  if (!searchKey) {
    return res.status(400).json({ message: "Username atau Email wajib diisi." });
  }

  const account = db.mabaAccounts.find(
    (acc: any) =>
      acc.username.toLowerCase() === searchKey.trim().toLowerCase() ||
      acc.email.toLowerCase() === searchKey.trim().toLowerCase()
  );

  if (!account) {
    return res.status(404).json({ message: "Akun Maba dengan username atau email tersebut tidak ditemukan." });
  }

  // Send simulated notifications
  const waMsg = `[PMB ITB Trenggalek] Pemulihan Akun Maba Anda\n\nNama: ${account.name}\nUsername: ${account.username}\nPassword Anda: ${account.password}\n\nSilakan masuk kembali menggunakan informasi ini.`;
  sendSimulatedNotification(db, "WhatsApp", account.whatsapp, waMsg);

  const emailMsg = `Subjek: Lupa Password Akun Maba ITB Trenggalek\n\nHalo ${account.name},\n\nKami menerima permintaan pemulihan akun Maba Anda.\n\nBerikut rincian akun Anda:\n- Username: ${account.username}\n- Password: ${account.password}\n\nSilakan masuk kembali ke portal PMB.\n\nSalam,\nPanitia PMB ITB Trenggalek`;
  sendSimulatedNotification(db, "Email", account.email, emailMsg);

  saveDatabase(db);

  res.json({
    success: true,
    message: "Password Anda berhasil dipulihkan dan dikirim melalui WhatsApp & Email simulasi.",
    username: account.username,
    password: account.password,
    email: account.email,
    whatsapp: account.whatsapp
  });
});

// C. Admin Login
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username dan password harus diisi." });
  }

  if (username === "admin" && password === "admin123") {
    return res.json({ success: true, user: { username: "admin", role: "admin" } });
  } else {
    return res.status(411).json({ message: "Username atau password administrator salah." });
  }
});

// 1. Get all applicants
app.get("/api/applicants", (req, res) => {
  const db = readDatabase();
  res.json(db.applicants);
});

// 2. Get single applicant by ID
app.get("/api/applicant/:id", (req, res) => {
  const db = readDatabase();
  const applicant = db.applicants.find((a: any) => a.id.toLowerCase() === req.params.id.toLowerCase());
  if (!applicant) {
    return res.status(404).json({ message: "Nomor Pendaftaran tidak ditemukan." });
  }
  res.json(applicant);
});

// 3. Register a new applicant
app.post("/api/register", (req, res) => {
  const db = readDatabase();
  const { name, email, whatsapp, school, prodi1, prodi2 } = req.body;

  if (!name || !email || !whatsapp || !school || !prodi1 || !prodi2) {
    return res.status(400).json({ message: "Semua data pendaftaran harus diisi." });
  }

  // Generate unique registration ID
  const nextNum = db.applicants.length + 1;
  const padNum = String(nextNum).padStart(4, "0");
  const id = `ITB-2026-${padNum}`;

  // Generate simulated Bank Payment Info
  const banks = ["BNI", "Mandiri", "BRI", "BCA"];
  const bank = banks[Math.floor(Math.random() * banks.length)];
  const prefix = bank === "BNI" ? "988" : bank === "Mandiri" ? "896" : bank === "BRI" ? "125" : "572";
  const vaNumber = `${prefix}085648730${padNum}`;

  const newApplicant = {
    id,
    name,
    email,
    whatsapp,
    school,
    prodi1,
    prodi2,
    createdAt: new Date().toISOString(),
    status: "Registered" as const,
    payment: {
      method: `Virtual Account ${bank}`,
      vaNumber,
      amount: 150000,
      status: "Pending" as const
    },
    documents: {},
    interestTest: {}
  };

  db.applicants.unshift(newApplicant);

  // Send WhatsApp Notification
  const waMsg = `[PMB ITB Trenggalek] Halo ${name}, pendaftaran online Anda BERHASIL!\n\nNo. Pendaftaran: ${id}\nBiaya Pendaftaran: Rp 150.000\nMetode: ${newApplicant.payment.method}\nNo. Virtual Account: ${vaNumber}\n\nSilakan selesaikan pembayaran untuk lanjut ke tahap unggah dokumen & ujian CBT. Terima kasih.`;
  sendSimulatedNotification(db, "WhatsApp", whatsapp, waMsg);

  // Send Email Notification
  const emailMsg = `Subjek: Pendaftaran Online PMB ITB Trenggalek - Berhasil!\n\nHalo ${name},\n\nTerima kasih telah mendaftar di Institut Teknologi dan Bisnis Trenggalek.\n\nBerikut rincian pendaftaran Anda:\n- No. Pendaftaran: ${id}\n- Pilihan 1: ${prodi1}\n- Pilihan 2: ${prodi2}\n\nUntuk melengkapi pendaftaran, silakan bayar biaya pendaftaran sebesar Rp 150.000 melalui ${newApplicant.payment.method} dengan nomor VA: ${vaNumber}.\n\nSalam Hangat,\nPanitia PMB ITB Trenggalek`;
  sendSimulatedNotification(db, "Email", email, emailMsg);

  saveDatabase(db);
  res.status(201).json(newApplicant);
});

// 4. Simulate payment verification
app.post("/api/payment/simulate", (req, res) => {
  const db = readDatabase();
  const { id } = req.body;

  const applicant = db.applicants.find((a: any) => a.id.toLowerCase() === id.toLowerCase());
  if (!applicant) {
    return res.status(404).json({ message: "Pendaftar tidak ditemukan." });
  }

  if (applicant.payment.status === "Paid") {
    return res.status(400).json({ message: "Pendaftaran ini sudah dibayar." });
  }

  applicant.payment.status = "Paid";
  applicant.payment.paidAt = new Date().toISOString();
  applicant.status = "Paid";

  // Trigger automated notification
  const waMsg = `[PMB ITB Trenggalek] Pembayaran pendaftaran Anda sebesar Rp 150.000 untuk No. Pendaftaran ${applicant.id} telah TERVERIFIKASI.\n\nStatus Anda kini: LUNAS.\nSilakan masuk kembali ke Dashboard PMB untuk mengunggah dokumen persyaratan dan melakukan tanda tangan elektronik.`;
  sendSimulatedNotification(db, "WhatsApp", applicant.whatsapp, waMsg);

  const emailMsg = `Subjek: Pembayaran PMB ITB Trenggalek Terkonfirmasi!\n\nHalo ${applicant.name},\n\nPembayaran biaya pendaftaran Anda telah berhasil diverifikasi.\n\nNomor Pendaftaran: ${applicant.id}\nStatus Pembayaran: LUNAS\n\nSilakan unggah berkas administrasi dan melakukan tanda tangan digital di portal pendaftaran.\n\nTerima kasih.`;
  sendSimulatedNotification(db, "Email", applicant.email, emailMsg);

  saveDatabase(db);
  res.json(applicant);
});

// 4b. Upload payment receipt PDF
app.post("/api/payment/upload", (req, res) => {
  const db = readDatabase();
  const { id, fileName, fileSize, base64 } = req.body;

  if (!id || !fileName) {
    return res.status(400).json({ message: "Data bukti pembayaran tidak lengkap." });
  }

  const applicant = db.applicants.find((a: any) => a.id.toLowerCase() === id.toLowerCase());
  if (!applicant) {
    return res.status(404).json({ message: "Pendaftar tidak ditemukan." });
  }

  applicant.payment.status = "Paid";
  applicant.payment.paidAt = new Date().toISOString();
  applicant.payment.buktiBayar = {
    name: fileName,
    size: fileSize || "Unknown size",
    uploadedAt: new Date().toISOString(),
    base64: base64 || null
  };
  applicant.status = "Paid";

  // Trigger automated notification
  const waMsg = `[PMB ITB Trenggalek] Berkas bukti pembayaran pendaftaran Anda (${fileName}) telah berhasil diunggah dan terverifikasi.\n\nStatus pendaftaran Anda kini: LUNAS.\nSilakan lanjutkan mengunggah dokumen persyaratan administrasi di portal pendaftaran Anda.`;
  sendSimulatedNotification(db, "WhatsApp", applicant.whatsapp, waMsg);

  const emailMsg = `Subjek: Bukti Pembayaran PMB ITB Trenggalek Diterima!\n\nHalo ${applicant.name},\n\nTerima kasih, bukti pembayaran pendaftaran Anda (${fileName}) telah berhasil diunggah.\n\nNomor Pendaftaran: ${applicant.id}\nStatus Pembayaran: LUNAS (PAID)\n\nSilakan masuk kembali ke portal untuk mengunggah berkas administrasi dan melakukan tanda tangan elektronik.\n\nSalam,\nPanitia PMB ITB Trenggalek`;
  sendSimulatedNotification(db, "Email", applicant.email, emailMsg);

  saveDatabase(db);
  res.json(applicant);
});

// 5. Upload document metadata and update status
app.post("/api/upload-document", (req, res) => {
  const db = readDatabase();
  const { id, docType, docName, docSize, base64 } = req.body;

  if (!id || !docType || !docName || !docSize) {
    return res.status(400).json({ message: "Data dokumen tidak lengkap." });
  }

  const applicant = db.applicants.find((a: any) => a.id.toLowerCase() === id.toLowerCase());
  if (!applicant) {
    return res.status(404).json({ message: "Pendaftar tidak ditemukan." });
  }

  if (!applicant.documents) {
    applicant.documents = {};
  }

  applicant.documents[docType] = {
    name: docName,
    size: docSize,
    uploadedAt: new Date().toISOString(),
    base64: base64 || null
  };

  // Check if all 3 documents are uploaded
  const hasIjazah = !!applicant.documents.ijazah;
  const hasKtp = !!applicant.documents.ktp;
  const hasFoto = !!applicant.documents.foto;

  if (hasIjazah && hasKtp && hasFoto) {
    applicant.status = "DocumentUploaded";

    // Notification for documents uploaded
    const waMsg = `[PMB ITB Trenggalek] Terima kasih ${applicant.name}, seluruh dokumen persyaratan (Ijazah/SKL, KTP/KK, Pasfoto) telah berhasil diunggah.\n\nLangkah selanjutnya: Silakan lakukan Tanda Tangan Elektronik dan ikuti Ujian Seleksi CBT serta Tes Bakat Minat di portal pendaftaran Anda.`;
    sendSimulatedNotification(db, "WhatsApp", applicant.whatsapp, waMsg);
  }

  saveDatabase(db);
  res.json(applicant);
});

// 6. Save electronic signature
app.post("/api/signature", (req, res) => {
  const db = readDatabase();
  const { id, signature } = req.body;

  if (!id || !signature) {
    return res.status(400).json({ message: "ID dan tanda tangan wajib diisi." });
  }

  const applicant = db.applicants.find((a: any) => a.id.toLowerCase() === id.toLowerCase());
  if (!applicant) {
    return res.status(404).json({ message: "Pendaftar tidak ditemukan." });
  }

  applicant.signature = signature;
  
  // Update status if documents are also uploaded
  if (applicant.status === "Paid" && applicant.documents?.ijazah && applicant.documents?.ktp && applicant.documents?.foto) {
    applicant.status = "DocumentUploaded";
  }

  saveDatabase(db);
  res.json({ message: "Tanda tangan elektronik berhasil disimpan.", applicant });
});

// 7. Submit exam answers and score
app.post("/api/exam/submit", (req, res) => {
  const db = readDatabase();
  const { id, answers, score } = req.body;

  if (!id || answers === undefined || score === undefined) {
    return res.status(400).json({ message: "Data ujian tidak lengkap." });
  }

  const applicant = db.applicants.find((a: any) => a.id.toLowerCase() === id.toLowerCase());
  if (!applicant) {
    return res.status(404).json({ message: "Pendaftar tidak ditemukan." });
  }

  applicant.exam = {
    startedAt: applicant.exam?.startedAt || new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    completedAt: new Date().toISOString(),
    answers,
    score,
    passed: score >= 60
  };

  applicant.status = "ExamCompleted";

  // Notification for completing CBT exam
  const waMsg = `[PMB ITB Trenggalek] Selamat! Anda telah menyelesaikan Ujian Seleksi Masuk Berbasis Komputer (CBT) dengan Skor Akhir: ${score}/100.\n\nData kelulusan Anda sedang diproses oleh Panitia Seleksi secara real-time. Pantau terus dashboard PMB Anda!`;
  sendSimulatedNotification(db, "WhatsApp", applicant.whatsapp, waMsg);

  saveDatabase(db);
  res.json(applicant);
});

// 8. Call Gemini AI to analyze interest/talent test
app.post("/api/interest-test/submit", async (req, res) => {
  const db = readDatabase();
  const { id, answers } = req.body;

  if (!answers) {
    return res.status(400).json({ message: "Jawaban kuesioner wajib diisi." });
  }

  let applicant = null;
  if (id) {
    applicant = db.applicants.find((a: any) => a.id.toLowerCase() === id.toLowerCase());
    if (!applicant) {
      return res.status(404).json({ message: "Pendaftar tidak ditemukan." });
    }
  }

  // Default AI analysis recommendation if API Key isn't available
  let recommendation = {
    primaryProdi: "S1 Ilmu Komputer (Fakultas Sains & Teknologi)",
    explanation: "Berdasarkan minat kuat Anda dalam memecahkan masalah teknis, hobi mengulik program baru, dan keinginan bekerja di bidang teknologi, program studi S1 Ilmu Komputer adalah pilihan yang paling cocok untuk mengoptimalkan potensi Anda di era AI saat ini.",
    scores: {
      "Ilmu Komputer": 90,
      "Manajemen Ritel": 50,
      "Bisnis Digital": 75
    }
  };

  const ai = getGemini();
  if (ai) {
    try {
      const prompt = `Analisis minat bakat calon mahasiswa baru ITB Trenggalek berikut ini:
Nama pendaftar: ${applicant ? applicant.name : "Calon Mahasiswa"}
Jawaban kuesioner:
1. Impian Masa Depan: ${answers.q1 || "Tidak dijawab"}
2. Mata Pelajaran Disukai: ${answers.q2 || "Tidak dijawab"}
3. Cara Menyelesaikan Masalah: ${answers.q3 || "Tidak dijawab"}
4. Hobi Favorit: ${answers.q4 || "Tidak dijawab"}
5. Rencana Penggunaan Modal: ${answers.q5 || "Tidak dijawab"}
6. Gaya Kerja: ${answers.q6 || "Tidak dijawab"}

Berdasarkan jawaban di atas, tentukan rekomendasi dari 3 program studi yang ada di ITB Trenggalek:
1. S1 Ilmu Komputer (Fakultas Sains & Teknologi)
2. S1 Manajemen Ritel (Fakultas Ekonomi & Bisnis)
3. S1 Bisnis Digital (Fakultas Ekonomi & Bisnis)

Berikan output dalam format JSON objek dengan kunci persis seperti berikut:
{
  "primaryProdi": "Nama S1 Prodi Rekomendasi Utama (Pilih persis salah satu dari 3 nama prodi lengkap di atas)",
  "explanation": "Penjelasan singkat 2-3 kalimat dalam Bahasa Indonesia mengapa sangat cocok dengan prodi tersebut.",
  "scores": {
    "Ilmu Komputer": nilai_kecocokan_0_sampai_100,
    "Manajemen Ritel": nilai_kecocokan_0_sampai_100,
    "Bisnis Digital": nilai_kecocokan_0_sampai_100
  }
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              primaryProdi: { type: Type.STRING },
              explanation: { type: Type.STRING },
              scores: {
                type: Type.OBJECT,
                properties: {
                  "Ilmu Komputer": { type: Type.INTEGER },
                  "Manajemen Ritel": { type: Type.INTEGER },
                  "Bisnis Digital": { type: Type.INTEGER }
                },
                required: ["Ilmu Komputer", "Manajemen Ritel", "Bisnis Digital"]
              }
            },
            required: ["primaryProdi", "explanation", "scores"]
          }
        }
      });

      if (response.text) {
        recommendation = JSON.parse(response.text.trim());
      }
    } catch (err) {
      console.error("Failed to generate interest recommendation using Gemini AI:", err);
      // Fallback on weighted client-side calculation
      const scores = { "Ilmu Komputer": 60, "Manajemen Ritel": 60, "Bisnis Digital": 60 };
      if (answers.q1?.includes("Software") || answers.q1?.includes("Developer")) scores["Ilmu Komputer"] += 30;
      if (answers.q1?.includes("Toko") || answers.q1?.includes("Retailer")) scores["Manajemen Ritel"] += 30;
      if (answers.q1?.includes("Startup") || answers.q1?.includes("Digital")) scores["Bisnis Digital"] += 30;
      
      const maxScore = Math.max(scores["Ilmu Komputer"], scores["Manajemen Ritel"], scores["Bisnis Digital"]);
      let primaryProdi = "S1 Bisnis Digital (Fakultas Ekonomi & Bisnis)";
      if (maxScore === scores["Ilmu Komputer"]) {
        primaryProdi = "S1 Ilmu Komputer (Fakultas Sains & Teknologi)";
      } else if (maxScore === scores["Manajemen Ritel"]) {
        primaryProdi = "S1 Manajemen Ritel (Fakultas Ekonomi & Bisnis)";
      }

      recommendation = {
        primaryProdi,
        explanation: `Sesuai analisis minat, Anda cenderung memiliki ketertarikan yang tinggi pada bidang ${primaryProdi.split(" (")[0]}. Program ini sangat mendukung potensi karir masa depan Anda di industri industri modern.`,
        scores
      };
    }
  }

  if (applicant) {
    applicant.interestTest = {
      answers,
      recommendation
    };

    // Notification for completing interest test
    const waMsg = `[PMB ITB Trenggalek] Hasil Tes Bakat Minat AI Anda telah keluar!\n\nRekomendasi Utama: ${recommendation.primaryProdi}.\nPenjelasan: ${recommendation.explanation}\n\nHasil ini akan dipertimbangkan oleh tim penguji untuk seleksi kelulusan Anda.`;
    sendSimulatedNotification(db, "WhatsApp", applicant.whatsapp, waMsg);

    saveDatabase(db);
    res.json(applicant);
  } else {
    res.json({ recommendation });
  }
});

// 9. Admin update status manually
app.post("/api/admin/update-status", (req, res) => {
  const db = readDatabase();
  const { id, status } = req.body;

  if (!id || !status) {
    return res.status(400).json({ message: "ID dan status wajib ditentukan." });
  }

  const applicant = db.applicants.find((a: any) => a.id.toLowerCase() === id.toLowerCase());
  if (!applicant) {
    return res.status(404).json({ message: "Pendaftar tidak ditemukan." });
  }

  applicant.status = status;

  // Set up specific graduation text
  let statusIndo = status;
  let waMsg = "";
  let emailMsg = "";

  if (status.startsWith("Graduated_")) {
    const prodiName = status === "Graduated_Ilmu_Komputer" 
      ? "S1 Ilmu Komputer (Fakultas Sains & Teknologi)" 
      : status === "Graduated_Manajemen_Ritel"
      ? "S1 Manajemen Ritel (Fakultas Ekonomi & Bisnis)"
      : "S1 Bisnis Digital (Fakultas Ekonomi & Bisnis)";

    waMsg = `[PMB ITB Trenggalek] SELAMAT! Anda dinyatakan LULUS SELEKSI PMB ITB Trenggalek Tahun Akademik 2026/2027 di Program Studi:\n\n🎉 ${prodiName} 🎉\n\nSilakan masuk ke Dashboard kelulusan Anda untuk mencetak Surat Kelulusan resmi dan panduan melakukan daftar ulang secara digital. Selamat bergabung dengan civitas akademika ITB Trenggalek!`;
    emailMsg = `Subjek: Hasil Kelulusan Seleksi PMB ITB Trenggalek - SELAMAT!\n\nHalo ${applicant.name},\n\nSelamat! Berdasarkan hasil evaluasi berkas, nilai ujian CBT, dan tes minat bakat, Anda dinyatakan LULUS SELEKSI sebagai mahasiswa baru di Institut Teknologi dan Bisnis Trenggalek pada program studi:\n\n${prodiName}\n\nSilakan mengunduh Surat Keputusan Kelulusan resmi Anda di portal PMB dengan No. Pendaftaran: ${applicant.id}.\n\nSelamat berjuang menempuh jenjang pendidikan baru!`;
  } else if (status === "Verified") {
    waMsg = `[PMB ITB Trenggalek] Berkas administrasi untuk No. Pendaftaran ${applicant.id} telah DI-VERIFIKASI dan dinyatakan VALID.\n\nSilakan bersiap untuk mengikuti ujian online CBT jika belum melakukannya.`;
    emailMsg = `Subjek: Berkas Pendaftaran PMB ITB Trenggalek Terverifikasi!\n\nHalo ${applicant.name},\n\nBerkas administrasi Anda telah kami periksa dan dinyatakan LENGKAP & VALID.\n\nSalam,\nPanitia PMB ITB Trenggalek`;
  } else if (status === "Rejected") {
    waMsg = `[PMB ITB Trenggalek] Mohon maaf, berdasarkan hasil keputusan tim penguji, berkas atau seleksi ujian untuk No. Pendaftaran ${applicant.id} dinyatakan BELUM memenuhi kriteria masuk ITB Trenggalek. Tetap semangat!`;
    emailMsg = `Subjek: Pengumuman Seleksi PMB ITB Trenggalek\n\nHalo ${applicant.name},\n\nKami berterima kasih atas partisipasi Anda mendaftar di ITB Trenggalek. Mohon maaf, berdasarkan evaluasi akhir, Anda belum lolos dalam seleksi kali ini.\n\nTetap semangat menempuh cita-cita Anda di tempat lain!\n\nSalam,\nPanitia PMB`;
  }

  if (waMsg) {
    sendSimulatedNotification(db, "WhatsApp", applicant.whatsapp, waMsg);
  }
  if (emailMsg) {
    sendSimulatedNotification(db, "Email", applicant.email, emailMsg);
  }

  saveDatabase(db);
  res.json(applicant);
});

// 9b. View Document Inline
app.get("/api/document-view", (req, res) => {
  const db = readDatabase();
  const { id, type } = req.query;

  if (!id || !type) {
    return res.status(400).send("Parameter id dan type wajib diisi.");
  }

  const applicant = db.applicants.find((a: any) => a.id.toLowerCase() === (id as string).toLowerCase());
  if (!applicant) {
    return res.status(404).send("Pendaftar tidak ditemukan.");
  }

  let doc: any = null;
  if (type === "bukti_bayar") {
    doc = applicant.payment?.buktiBayar;
  } else if (type === "signature") {
    if (applicant.signature) {
      doc = {
        name: `signature_${applicant.id}.png`,
        base64: applicant.signature
      };
    }
  } else if (type === "ijazah" || type === "ktp" || type === "foto") {
    doc = applicant.documents?.[type as string];
  }

  if (!doc) {
    return res.status(404).send("Dokumen belum diunggah atau tidak tersedia.");
  }

  if (!doc.base64) {
    if (type === "foto" || type === "signature") {
      const dummyPng = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", "base64");
      res.setHeader("Content-Type", "image/png");
      res.setHeader("Content-Disposition", `inline; filename="${doc.name || 'placeholder.png'}"`);
      return res.send(dummyPng);
    } else {
      const dummyContent = `%PDF-1.4\n1 0 obj\n<<\n/Title (${doc.name || 'document'})\n/Author (PMB ITB Trenggalek)\n>>\nendobj\ntrailer\n<<\n/Root 1 0 R\n>>\n%%EOF`;
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; filename="${doc.name || 'placeholder.pdf'}"`);
      return res.send(Buffer.from(dummyContent));
    }
  }

  try {
    const base64Str = doc.base64;
    const matches = base64Str.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.*)$/);
    if (matches) {
      const mimeType = matches[1];
      const dataBuffer = Buffer.from(matches[2], "base64");
      res.setHeader("Content-Type", mimeType);
      res.setHeader("Content-Disposition", `inline; filename="${doc.name || 'document'}"`);
      return res.send(dataBuffer);
    } else {
      const dataBuffer = Buffer.from(base64Str, "base64");
      res.setHeader("Content-Type", "application/octet-stream");
      res.setHeader("Content-Disposition", `inline; filename="${doc.name || 'document'}"`);
      return res.send(dataBuffer);
    }
  } catch (error) {
    console.error("Error decoding document base64:", error);
    return res.status(500).send("Gagal mengurai dokumen.");
  }
});

// 10. Get all notifications log
app.get("/api/notifications", (req, res) => {
  const db = readDatabase();
  res.json(db.notifications);
});

// 10b. Contacts / Consultations endpoints
app.get("/api/contacts", (req, res) => {
  const db = readDatabase();
  res.json(db.contacts || []);
});

app.post("/api/contacts", (req, res) => {
  const db = readDatabase();
  if (!db.contacts) {
    db.contacts = [];
  }
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !phone || !subject || !message) {
    return res.status(400).json({ message: "Semua data formulir harus diisi." });
  }
  const newContact = {
    id: `contact-${Date.now()}`,
    name,
    email,
    phone,
    subject,
    message,
    createdAt: new Date().toISOString(),
    status: "Unread"
  };
  db.contacts.unshift(newContact);
  saveDatabase(db);
  res.status(201).json(newContact);
});

app.post("/api/contacts/update-status", (req, res) => {
  const db = readDatabase();
  const { id, status } = req.body;
  if (!id || !status) {
    return res.status(400).json({ message: "ID dan status wajib ditentukan." });
  }
  if (!db.contacts) {
    db.contacts = [];
  }
  const contact = db.contacts.find((c: any) => c.id === id);
  if (!contact) {
    return res.status(404).json({ message: "Pesan tidak ditemukan." });
  }
  contact.status = status;
  saveDatabase(db);
  res.json(contact);
});

// 10c. FAQ management endpoints
app.get("/api/faqs", (req, res) => {
  const db = readDatabase();
  res.json(db.faqs || []);
});

app.post("/api/faqs", (req, res) => {
  const db = readDatabase();
  if (!db.faqs) {
    db.faqs = [];
  }
  const { question, answer, category } = req.body;
  if (!question || !answer || !category) {
    return res.status(400).json({ message: "Pertanyaan, jawaban, dan kategori harus diisi." });
  }
  const newFaq = {
    id: `faq-${Date.now()}`,
    question,
    answer,
    category,
    createdAt: new Date().toISOString()
  };
  db.faqs.push(newFaq);
  saveDatabase(db);
  res.status(201).json(newFaq);
});

app.post("/api/faqs/update", (req, res) => {
  const db = readDatabase();
  const { id, question, answer, category } = req.body;
  if (!id || !question || !answer || !category) {
    return res.status(400).json({ message: "ID, pertanyaan, jawaban, dan kategori harus lengkap." });
  }
  if (!db.faqs) {
    db.faqs = [];
  }
  const faq = db.faqs.find((f: any) => f.id === id);
  if (!faq) {
    return res.status(404).json({ message: "FAQ tidak ditemukan." });
  }
  faq.question = question;
  faq.answer = answer;
  faq.category = category;
  saveDatabase(db);
  res.json(faq);
});

app.post("/api/faqs/delete", (req, res) => {
  const db = readDatabase();
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "ID FAQ wajib ditentukan." });
  }
  if (!db.faqs) {
    db.faqs = [];
  }
  const initialLength = db.faqs.length;
  db.faqs = db.faqs.filter((f: any) => f.id !== id);
  if (db.faqs.length === initialLength) {
    return res.status(404).json({ message: "FAQ tidak ditemukan." });
  }
  saveDatabase(db);
  res.json({ message: "FAQ berhasil dihapus." });
});

// 11. Sahabat ITB Chat AI Endpoint
const SAHABAT_ITB_SYSTEM_INSTRUCTION = `Anda adalah "Sahabat ITB", asisten virtual pintar dan ramah dari Institut Teknologi dan Bisnis (ITB) Trenggalek. Tugas utama Anda adalah membantu calon mahasiswa baru (PMB) memberikan informasi detail, panduan pendaftaran, serta menjawab pertanyaan seputar kampus ITB Trenggalek secara interaktif, sopan, dan penuh semangat.

Gunakan Bahasa Indonesia yang santun, bersahabat, informatif, dan komunikatif (gunakan sapaan seperti "Kak", "Kakak", "Halo Sahabat"). Jangan terlalu kaku, jadilah teman mengobrol yang ramah dan suportif ("sahabat").

Berikut adalah Informasi Resmi Kampus ITB Trenggalek:
1. Program Studi (Prodi) Jenjang S1:
   - S1 Ilmu Komputer (Fakultas Sains & Teknologi): Mempelajari pemrograman, kecerdasan buatan (AI), rekayasa perangkat lunak, jaringan komputer, dan keamanan siber. Sangat cocok bagi siswa yang menyukai teknologi, coding, pemecahan masalah, dan analisis data.
   - S1 Bisnis Digital (Fakultas Ekonomi & Bisnis): Menggabungkan ilmu bisnis dengan teknologi digital. Mempelajari e-commerce, digital marketing, start-up, fintech, dan analisis bisnis modern.
   - S1 Manajemen Ritel (Fakultas Ekonomi & Bisnis): Fokus pada pengelolaan bisnis ritel modern, supply chain management, teknologi ritel, manajemen toko, dan analisis pasar ritel/waralaba.

2. Alur Pendaftaran PMB (Penerimaan Mahasiswa Baru) Gelombang III:
   - Tahap 1: Pengisian Formulir Pendaftaran Online secara instan di portal.
   - Tahap 2: Pembayaran Biaya Pendaftaran Rp 150.000 melalui Virtual Account Bank (BNI, Mandiri, BRI, BCA).
   - Tahap 3: Pengunggahan Dokumen Persyaratan (Ijazah/SKL, KTP/KK, dan Pasfoto).
   - Tahap 4: Pengisian Tanda Tangan Elektronik secara digital di portal.
   - Tahap 5: Mengikuti Ujian CBT (Computer Based Test) Online di Portal.
   - Tahap 6: Mengikuti Tes Minat Bakat Interaktif berbasis AI di Portal.
   - Tahap 7: Pengumuman Kelulusan & Cetak Surat Kelulusan langsung di Dashboard PMB.

3. Lokasi & Hubungi Kami:
   - Kampus Utama ITB Trenggalek: Jl. Sukarno Hatta No. 1, Karangsoko, Trenggalek, Jawa Timur.
   - Fasilitas: Laboratorium Komputer modern, Smart Classroom, Ruang Ritel Simulasi, Free High-Speed Wi-Fi, Perpustakaan Digital, dan Auditorium.

Berikan jawaban singkat, jelas, terstruktur (gunakan bullet points jika perlu), dan selalu semangati calon mahasiswa untuk segera mendaftar di ITB Trenggalek!`;

app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ message: "Format request tidak valid. Diperlukan array messages." });
  }

  const ai = getGemini();
  if (ai) {
    try {
      // Map client-side messages to GoogleGenAI content parts
      const contents = messages.map((m: any) => ({
        role: m.role === "assistant" ? "model" : m.role,
        parts: [{ text: m.content }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction: SAHABAT_ITB_SYSTEM_INSTRUCTION
        }
      });

      res.json({ text: response.text || "" });
    } catch (error: any) {
      console.error("Gemini Chat AI Error:", error);
      res.status(500).json({ message: "Gagal memproses pesan Chat AI.", error: error.message });
    }
  } else {
    // Simulated fallback responses when Gemini API is not initialized or offline
    const lastMessage = messages[messages.length - 1]?.content || "";
    const lowerMsg = lastMessage.toLowerCase();
    let text = "Halo! Saya Sahabat ITB, asisten virtual Anda di ITB Trenggalek. Saat ini saya berjalan dalam mode asisten cerdas lokal. Ada yang bisa saya bantu terkait pilihan prodi S1 Ilmu Komputer, S1 Bisnis Digital, S1 Manajemen Ritel, atau alur pendaftaran PMB?";

    if (lowerMsg.includes("biaya") || lowerMsg.includes("bayar") || lowerMsg.includes("harga") || lowerMsg.includes("pendaftaran") || lowerMsg.includes("va") || lowerMsg.includes("virtual account")) {
      text = "Biaya pendaftaran di ITB Trenggalek sangat terjangkau, yaitu hanya sebesar Rp 150.000. Pembayaran dapat dilakukan dengan mudah melalui nomor Virtual Account Bank (BNI, Mandiri, BRI, atau BCA) yang diterbitkan secara instan setelah Kakak menyelesaikan pengisian formulir pendaftaran di Portal Calon Mahasiswa kami!";
    } else if (lowerMsg.includes("prodi") || lowerMsg.includes("jurusan") || lowerMsg.includes("program studi") || lowerMsg.includes("kuliah") || lowerMsg.includes("s1")) {
      text = "ITB Trenggalek memiliki 3 program studi S1 unggulan yang sangat dibutuhkan di era digital:\n\n1. 🖥️ **S1 Ilmu Komputer**: Fokus pada programming, AI, software development, dan big data.\n2. 💼 **S1 Bisnis Digital**: Memadukan manajemen bisnis dengan teknologi startup, e-commerce, dan digital marketing.\n3. 🛒 **S1 Manajemen Ritel**: Mempelajari tata kelola industri ritel modern, logistik, dan operasional waralaba digital.\n\nSemua prodi dirancang dengan kurikulum berbasis industri modern. Kakak paling tertarik pada bidang teknologi atau bisnis nih?";
    } else if (lowerMsg.includes("lokasi") || lowerMsg.includes("alamat") || lowerMsg.includes("dimana") || lowerMsg.includes("kampus") || lowerMsg.includes("jalan")) {
      text = "Kampus Utama ITB Trenggalek beralamat di **Jl. Sukarno Hatta No. 1, Karangsoko, Trenggalek, Jawa Timur**. Letaknya sangat strategis dan mudah diakses. Kakak juga bisa melihat peta lokasi interaktif kami di bagian bawah halaman ini!";
    } else if (lowerMsg.includes("syarat") || lowerMsg.includes("dokumen") || lowerMsg.includes("berkas") || lowerMsg.includes("ijazah") || lowerMsg.includes("ktp")) {
      text = "Untuk mendaftar, berkas administrasi yang wajib Kakak siapkan dan unggah di Portal sangat sederhana, yaitu:\n\n1. scan Ijazah terakhir atau Surat Keterangan Lulus (SKL) SMA/SMK/MA sederajat.\n2. scan Kartu Tanda Penduduk (KTP) atau Kartu Keluarga (KK).\n3. Pasfoto terbaru dengan latar belakang rapi.\n\nSemua berkas diunggah secara digital, jadi tidak perlu repot mengirimkan berkas fisik ke kampus!";
    } else if (lowerMsg.includes("alur") || lowerMsg.includes("daftar") || lowerMsg.includes("tahap") || lowerMsg.includes("cara")) {
      text = "Alur pendaftaran mahasiswa baru di ITB Trenggalek Gelombang III sangat cepat dan full online:\n\n1. **Isi Formulir**: Daftarkan diri di Portal Calon Mahasiswa.\n2. **Bayar VA**: Lakukan pembayaran biaya pendaftaran Rp 150.000.\n3. **Unggah Berkas**: Upload Ijazah, KTP, dan Pasfoto.\n4. **Tanda Tangan**: Berikan tanda tangan elektronik di sistem.\n5. **Ujian CBT & Tes Minat**: Ikuti ujian seleksi dan dapatkan rekomendasi minat bakat AI.\n6. **Pengumuman**: Cek kelulusan langsung di dashboard!\n\nProsesnya sangat transparan dan bisa dilakukan dari rumah!";
    } else if (lowerMsg.includes("halo") || lowerMsg.includes("hai") || lowerMsg.includes("siapa") || lowerMsg.includes("pagi") || lowerMsg.includes("siang") || lowerMsg.includes("sore") || lowerMsg.includes("malam")) {
      text = "Halo Kak! Selamat datang. Saya Sahabat ITB, siap menemani Kakak dalam perjalanan mendaftar di ITB Trenggalek. Apakah ada info tertentu tentang prodi atau jalur pendaftaran yang ingin Kakak ketahui?";
    }

    res.json({ text });
  }
});

// Setup Express and Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
