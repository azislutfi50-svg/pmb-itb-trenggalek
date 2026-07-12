import { Question, InterestQuestion } from "../types";

export const CBT_QUESTIONS: Question[] = [
  {
    id: "cbt-1",
    question: "Sistem bilangan yang menggunakan basis 16 disebut...",
    options: {
      A: "Biner",
      B: "Oktal",
      C: "Desimal",
      D: "Heksadesimal"
    },
    correctAnswer: "D",
    category: "Ilmu Komputer"
  },
  {
    id: "cbt-2",
    question: "Mana di antara pilihan berikut yang merupakan bahasa pemrograman tingkat tinggi?",
    options: {
      A: "Assembly",
      B: "Machine Code",
      C: "Python",
      D: "Binary"
    },
    correctAnswer: "C",
    category: "Ilmu Komputer"
  },
  {
    id: "cbt-3",
    question: "Dalam manajemen bisnis, apa yang dimaksud dengan istilah 'Retailing'?",
    options: {
      A: "Penjualan barang dalam jumlah besar langsung dari pabrik",
      B: "Penjualan barang atau jasa secara eceran langsung ke konsumen akhir",
      C: "Sistem ekspor impor barang antar negara",
      D: "Penyimpanan stok barang di gudang pusat"
    },
    correctAnswer: "B",
    category: "Manajemen Ritel"
  },
  {
    id: "cbt-4",
    question: "Manakah konsep retail modern yang berfokus pada integrasi penjualan online dan fisik?",
    options: {
      A: "Monochannel Marketing",
      B: "Multilevel Marketing",
      C: "Omnichannel Retailing",
      D: "Direct Wholesaling"
    },
    correctAnswer: "C",
    category: "Manajemen Ritel"
  },
  {
    id: "cbt-5",
    question: "Apa singkatan dari SEO yang sangat krusial dalam dunia Bisnis Digital?",
    options: {
      A: "System Electronic Office",
      B: "Search Engine Optimization",
      C: "Sales Executive Organization",
      D: "Software Engine Operator"
    },
    correctAnswer: "B",
    category: "Bisnis Digital"
  },
  {
    id: "cbt-6",
    question: "Model bisnis e-commerce Tokopedia atau Shopee di mana transaksi terjadi antar konsumen difasilitasi platform disebut...",
    options: {
      A: "B2B (Business to Business)",
      B: "B2C (Business to Consumer)",
      C: "C2C (Consumer to Consumer)",
      D: "G2C (Government to Consumer)"
    },
    correctAnswer: "C",
    category: "Bisnis Digital"
  },
  {
    id: "cbt-7",
    question: "Hasil pembagian dari 150 - (20 x 4) + 30 adalah...",
    options: {
      A: "100",
      B: "110",
      C: "120",
      D: "130"
    },
    correctAnswer: "A",
    category: "Logika Matematika"
  },
  {
    id: "cbt-8",
    question: "Jika seekor elang dapat terbang 120 km/jam, berapa jarak yang ditempuhnya dalam waktu 15 menit?",
    options: {
      A: "15 km",
      B: "20 km",
      C: "30 km",
      D: "45 km"
    },
    correctAnswer: "C",
    category: "Logika Matematika"
  }
];

export const INTEREST_QUESTIONS: InterestQuestion[] = [
  {
    id: "q1",
    question: "Apa impian karir masa depan yang paling menarik bagi Anda?",
    options: [
      {
        value: "Software Engineer / System Administrator",
        label: "Membuat aplikasi mobile, mengamankan server, atau menjadi ahli cybersecurity.",
        weight: { ilmuKomputer: 10, manajemenRitel: 2, bisnisDigital: 5 }
      },
      {
        value: "Manajer Operasional Ritel / Supervisor Toko",
        label: "Mengelola toko retail modern, memimpin tim sales, dan merancang tata letak display produk.",
        weight: { ilmuKomputer: 2, manajemenRitel: 10, bisnisDigital: 6 }
      },
      {
        value: "Digital Entrepreneur / Digital Marketer",
        label: "Mendirikan startup teknologi, mengelola toko online, atau menguasai strategi iklan digital.",
        weight: { ilmuKomputer: 5, manajemenRitel: 6, bisnisDigital: 10 }
      }
    ]
  },
  {
    id: "q2",
    question: "Mata pelajaran/topik apa yang paling Anda sukai selama sekolah?",
    options: [
      {
        value: "Matematika / TIK (Komputer)",
        label: "Memecahkan rumus logika, coding sederhana, atau merakit hardware.",
        weight: { ilmuKomputer: 10, manajemenRitel: 1, bisnisDigital: 4 }
      },
      {
        value: "Ekonomi / IPS / Kewirausahaan",
        label: "Mempelajari perilaku konsumen, cara kerja pasar, dan manajemen keuangan dasar.",
        weight: { ilmuKomputer: 2, manajemenRitel: 9, bisnisDigital: 8 }
      },
      {
        value: "Bahasa / Seni Grafis / Desain",
        label: "Membuat konten kreatif, presentasi menarik, atau menganalisis tren sosial media.",
        weight: { ilmuKomputer: 5, manajemenRitel: 5, bisnisDigital: 10 }
      }
    ]
  },
  {
    id: "q3",
    question: "Bagaimana cara Anda menyelesaikan masalah yang rumit?",
    options: [
      {
        value: "Menganalisis data & mencari algoritma terstruktur",
        label: "Membagi masalah menjadi bagian-bagian kecil dan menyelesaikannya secara sistematis menggunakan logika.",
        weight: { ilmuKomputer: 10, manajemenRitel: 3, bisnisDigital: 5 }
      },
      {
        value: "Mengoptimalkan sumber daya & koordinasi tim",
        label: "Berdialog dengan orang lain, merancang rencana operasional, dan mengefisienkan stok yang ada.",
        weight: { ilmuKomputer: 2, manajemenRitel: 10, bisnisDigital: 5 }
      },
      {
        value: "Mencari inovasi baru & memanfaatkan tren digital",
        label: "Memakai aplikasi atau platform digital baru untuk mempercepat solusi secara kreatif.",
        weight: { ilmuKomputer: 5, manajemenRitel: 4, bisnisDigital: 10 }
      }
    ]
  },
  {
    id: "q4",
    question: "Kegiatan apa yang paling sering Anda lakukan saat waktu senggang?",
    options: [
      {
        value: "Mengulik software / Bermain game taktik",
        label: "Mencoba OS baru, kustomisasi komputer, atau bermain game yang butuh strategi tinggi.",
        weight: { ilmuKomputer: 10, manajemenRitel: 2, bisnisDigital: 5 }
      },
      {
        value: "Mengunjungi mall/supermarket, mengamati bisnis orang lain",
        label: "Senang melihat bagaimana toko mendisplay barang dagangan atau merancang promo diskon.",
        weight: { ilmuKomputer: 1, manajemenRitel: 10, bisnisDigital: 6 }
      },
      {
        value: "Browsing ide startup / Belanja online di e-commerce",
        label: "Suka menonton konten tentang kisah sukses CEO muda atau membandingkan harga & review produk online.",
        weight: { ilmuKomputer: 4, manajemenRitel: 5, bisnisDigital: 10 }
      }
    ]
  },
  {
    id: "q5",
    question: "Jika Anda memiliki modal 100 juta rupiah, bisnis apa yang akan Anda mulai?",
    options: [
      {
        value: "Software House / Jasa IT",
        label: "Membeli peralatan server dan merekrut programmer untuk membuat jasa pembuatan website & aplikasi.",
        weight: { ilmuKomputer: 10, manajemenRitel: 2, bisnisDigital: 6 }
      },
      {
        value: "Minimarket Waralaba / Toko Grosir Modern",
        label: "Menyewa ruko untuk membuat bisnis ritel kebutuhan harian dengan mesin kasir canggih.",
        weight: { ilmuKomputer: 2, manajemenRitel: 10, bisnisDigital: 5 }
      },
      {
        value: "Brand Kosmetik / Fashion khusus E-Commerce",
        label: "Memproduksi barang unik, lalu fokus melakukan branding & iklan berbayar penuh di TikTok Shop/Shopee.",
        weight: { ilmuKomputer: 4, manajemenRitel: 5, bisnisDigital: 10 }
      }
    ]
  },
  {
    id: "q6",
    question: "Gaya kerja seperti apa yang membuat Anda merasa paling produktif?",
    options: [
      {
        value: "Fokus mandiri di depan layar komputer",
        label: "Menyukai ketenangan, konsentrasi tinggi, dan memprogram baris kode secara detail.",
        weight: { ilmuKomputer: 10, manajemenRitel: 2, bisnisDigital: 4 }
      },
      {
        value: "Berinteraksi langsung dengan pelanggan atau staf",
        label: "Menyukai kerja lapangan, bernegosiasi dengan distributor, dan memimpin tim kerja fisik.",
        weight: { ilmuKomputer: 1, manajemenRitel: 10, bisnisDigital: 5 }
      },
      {
        value: "Berkolaborasi secara digital (Work from Anywhere)",
        label: "Mendesain kampanye iklan, menganalisis statistik visitor web, dan berdiskusi lewat Zoom/Meet.",
        weight: { ilmuKomputer: 5, manajemenRitel: 5, bisnisDigital: 10 }
      }
    ]
  }
];
