export enum StudyProgram {
  ILMU_KOMPUTER = "S1 Ilmu Komputer (Fakultas Sains & Teknologi)",
  MANAJEMEN_RITEL = "S1 Manajemen Ritel (Fakultas Ekonomi & Bisnis)",
  BISNIS_DIGITAL = "S1 Bisnis Digital (Fakultas Ekonomi & Bisnis)"
}

export type ApplicantStatus =
  | "Registered"
  | "Paid"
  | "DocumentUploaded"
  | "ExamCompleted"
  | "Verified"
  | "Graduated_Ilmu_Komputer"
  | "Graduated_Manajemen_Ritel"
  | "Graduated_Bisnis_Digital"
  | "Rejected";

export interface DocumentInfo {
  name: string;
  size: string;
  uploadedAt?: string;
  base64?: string;
}

export interface Applicant {
  id: string; // Nomor Pendaftaran, e.g., ITB-2026-0001
  name: string;
  email: string;
  whatsapp: string;
  school: string;
  prodi1: string;
  prodi2: string;
  createdAt: string;
  status: ApplicantStatus;
  payment: {
    method: string;
    vaNumber: string;
    amount: number;
    status: "Pending" | "Paid";
    paidAt?: string;
    buktiBayar?: DocumentInfo;
  };
  documents: {
    ijazah?: DocumentInfo;
    ktp?: DocumentInfo;
    foto?: DocumentInfo;
  };
  signature?: string; // base64 signature
  exam?: {
    startedAt?: string;
    completedAt?: string;
    answers?: Record<string, string>;
    score?: number;
    passed?: boolean;
  };
  interestTest?: {
    answers?: Record<string, string>;
    recommendation?: {
      primaryProdi: string;
      explanation: string;
      scores: {
        "Ilmu Komputer": number;
        "Manajemen Ritel": number;
        "Bisnis Digital": number;
      };
    };
  };
}

export interface NotificationLog {
  id: string;
  type: "WhatsApp" | "Email";
  recipient: string;
  message: string;
  timestamp: string;
  status: "Sent";
}

export interface Question {
  id: string;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: string;
  category: string;
}

export interface InterestQuestion {
  id: string;
  question: string;
  options: Array<{
    value: string;
    label: string;
    weight: {
      ilmuKomputer: number;
      manajemenRitel: number;
      bisnisDigital: number;
    };
  }>;
}
