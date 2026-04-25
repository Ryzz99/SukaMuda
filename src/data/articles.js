export const categories = [
  { slug: "school", label: "School", group: "news" },
  { slug: "college", label: "College", group: "news" },
  { slug: "general", label: "General", group: "news" },
  { slug: "style", label: "Style", group: "lifestyle" },
  { slug: "culinary", label: "Culinary", group: "lifestyle" },
  { slug: "traveling", label: "Traveling", group: "lifestyle" },
  { slug: "sport", label: "Sport & E-Sport", group: "sport" },
  { slug: "music", label: "Music & Film", group: "music" },
  { slug: "otomotif", label: "Otomotif", group: "otomotif" },
  { slug: "science", label: "Science", group: "science" },
  { slug: "health", label: "Health", group: "health" },
  { slug: "podcast", label: "Podcast", group: "podcast" },
  { slug: "tech", label: "Tech", group: "tech" }
];

export const categoryGroups = [
  { slug: "news", label: "News", categorySlugs: ["school", "college", "general"] },
  { slug: "lifestyle", label: "Lifestyle", categorySlugs: ["style", "culinary", "traveling"] },
  { slug: "sport", label: "Sport & E-Sport", categorySlugs: ["sport"] },
  { slug: "music", label: "Music & Film", categorySlugs: ["music"] },
  { slug: "otomotif", label: "Otomotif", categorySlugs: ["otomotif"] },
  { slug: "science", label: "Science", categorySlugs: ["science"] },
  { slug: "health", label: "Health", categorySlugs: ["health"] },
  { slug: "podcast", label: "Podcast", categorySlugs: ["podcast"] },
  { slug: "tech", label: "Tech", categorySlugs: ["tech"] }
];

export const articles = [
  {
    id: 1,
    title: "Program OSIS Baru untuk Pengembangan Soft Skill",
    category: "school",
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=60"
  },
  {
    id: 2,
    title: "OSIS Kolaborasi dengan Komunitas Lokal",
    category: "school",
    image: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&w=900&q=60"
  },
  {
    id: 3,
    title: "Kampus Gelar Expo Inovasi Mahasiswa 2026",
    category: "college",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=60"
  },
  {
    id: 4,
    title: "Beasiswa Riset untuk Mahasiswa Berprestasi",
    category: "college",
    image: "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?auto=format&fit=crop&w=900&q=60"
  },
  {
    id: 5,
    title: "Perubahan Jadwal Akademik Semester Ganjil",
    category: "general",
    image: "https://images.unsplash.com/photo-1457694587812-e8bf29a43845?auto=format&fit=crop&w=900&q=60"
  },
  {
    id: 6,
    title: "Kampanye Literasi Digital untuk Pelajar",
    category: "general",
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=900&q=60"
  },
  {
    id: 27,
    title: "SMANDA Kota Sukabumi Peringkat 3 Nasional: 95 Murid Lolos SNBP 2026, Terbanyak ke IPB",
    category: "general",
    authorName: "Fitriansyah", 
    authorImage: "/src/assets/logo.png",
    image: "/images/smanda.png",
    link: "https://www.sukabumiupdate.com/nasional/172796/smanda-kota-sukabumi-peringkat-3-nasional-95-murid-lolos-snbp-2026-terbanyak-ke-ipb",
    tags: [
      "SMANDA Kota Sukabumi",
      "SMAN 2 Kota Sukabumi",
      "SNBP 2026",
      "SNPMB 2026",
      "pelajar sukabumi",
      "peringkat nasional SNBP 2026",
      "IPB"
    ],
    contentBlocks: [
      {
        type: "paragraph",
        lead: true,
        highlight: "SUKABUMIUPDATE.com",
        text: "SMANDA Sukabumi atau SMAN 2 Kota Sukabumi Jawa Barat menduduki peringkat 3 nasional sebagai sekolah menengah dan sederajat di Indonesia yang banyak meloloskan pelajarnya di Seleksi Nasional Berdasarkan Prestasi atau SNBP 2026 untuk SNPMB (Seleksi Nasional Penerimaan Mahasiswa Baru) 2026."
      },
      {
        type: "paragraph",
        text: "Data resmi SNPMB 2026, mencatat sebanyak 25.679 sekolah melakukan finalisasi data untuk mengikuti SNBP 2026. Angka ini meningkat dari tahun sebelumnya."
      },
      {
        type: "paragraph",
        text: "Dari jumlah tersebut, tercatat 806.242 siswa mendaftar sebagai peserta SNBP, dengan 178.981 peserta dinyatakan lolos seleksi. 155.543 siswa lolos di PTN akademik dan 23.438 lolos di PTN vokasi."
      },
      {
        type: "callout",
        text: "Baca Juga: CEK FAKTA: Sering Cium Kucing, Otak Bisa Dibajak Parasit itu Menyesatkan",
        url: "https://www.sukabumiupdate.com/nasional/172796/smanda-kota-sukabumi-peringkat-3-nasional-95-murid-lolos-snbp-2026-terbanyak-ke-ipb"
      },
      {
        type: "paragraph",
        text: "Ketua Tim seleksi, Prof Eduart Wolok, mengungkapkan jumlah pendaftar SNBP 2026 meningkat tajam. Total terdapat 806.242 siswa yang mendaftar, sementara daya tampung terbatas hanya 162.116 kursi untuk PTN akademik, ditambah kuota PTN vokasi."
      },
      {
        type: "quote",
        text: "Jurusan bidang teknik, kesehatan, dan hukum menjadi yang paling diminati pada SNBP tahun ini."
      },
      {
        type: "paragraph",
        text: "Dari puluhan ribu SMA sederajat yang mendaftar melalui jalur ini, SMANDA atau SMAN 2 Kota Sukabumi menduduki peringkat 3 nasional sebagai sekolah dengan pelajar terbanyak yang lolos SNPMB melalui jalur SNBP 2026. Sekolah yang berada di jalan Kamamat Gunungpuyuh Kota Sukabumi meloloskan 95 muridnya ke berbagai PTN dan Vokasi negeri di Indonesia."
      },
      {
        type: "callout",
        text: "Baca Juga: Sekda Jabar Puji Kemajuan Kota Sukabumi di HUT ke-112",
        url: "https://www.sukabumiupdate.com/"
      },
      {
        type: "paragraph",
        text: "Dari akun media sosial personal Humas SMAN 2 Kota Sukabumi @ Helmi Rachma Fandia, 95 pelajar diterima oleh 31 Universitas Negeri dan 3 politeknik negeri di Indonesia. Tahun ini, IPB adalah kampus negeri yang paling banyak menerima pelajar dari SMAN 2 Kota Sukabumi, yaitu 11 murid."
      },
      {
        type: "paragraph",
        text: "Secara nasional, 95 pelajar SMAN 2 Kota Sukabumi lolos SNBP 2026 sama dengan SMAN 3 Cilacap Jawa Tengah yang berada di posisi 4. Di posisi dua ada SMAN 2 Sidoarjo Jawa Timur dengan 99 pelajar, sementara di peringkat pertama adalah SMAN 7 Bandarlampung Provinsi Lampung dengan 105 pelajar."
      },
      {
        type: "callout",
        text: "Baca Juga: Rutin Konsumsi Madu? Ini Khasiatnya untuk Tubuh",
        url: "https://www.sukabumiupdate.com/"
      },
      {
        type: "paragraph",
        text: "Berikut daftar 20 besar SMA sederajat di Indonesia yang paling banyak meloloskan pelajarnya di SNBP 2026:"
      },
      {
        type: "list",
        ordered: true,
        items: [
          "SMAN 7 Bandarlampung 105",
          "SMAN 2 Sidoarjo 99",
          "SMAN 2 Kota Sukabumi 95",
          "SMAN 3 Cilacap 95",
          "SMA Darul Ulum 1 Peterongan Jombang 91",
          "SMAN 3 Bandar Lampung 89",
          "MAN 2 Gresik 87",
          "SMAN 5 Jember 87",
          "SMAN 1 Maos Cilacap 83",
          "MAN 3 Jakarta Pusat 82",
          "MAN Babakan Ciwaringin 81",
          "SMAN 1 Cilacap 80",
          "SMAN 1 Teladan Yogyakarta 76",
          "SMAN 3 Kota Blitar 75",
          "MAN 2 Kota Makassar 74",
          "SMAN 5 Tasikmalaya 74",
          "MAN 2 Kudus 72",
          "MAN 3 Jombang 72",
          "MAN 1 Kota Bukittinggi 71",
          "MAN 2 Kota Malang 68"
        ]
      },
      {
        type: "meta",
        text: "Editor: Fitriansyah"
      }
    ]
  },
  {
    id: 7,
    title: "Mix and Match Outfit untuk Kuliah",
    category: "style",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=60"
  },
  {
    id: 8,
    title: "Tren Warna Pakaian 2026",
    category: "style",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=60"
  },
  {
    id: 9,
    title: "Kuliner Malam Favorit Anak Kos",
    category: "culinary",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=60"
  },
  {
    id: 10,
    title: "Menu Sehat Praktis untuk Sarapan",
    category: "culinary",
    image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=900&q=60"
  },
  {
    id: 11,
    title: "Rute Traveling Budget di Jawa Barat",
    category: "traveling",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=60"
  },
  {
    id: 12,
    title: "Checklist Perjalanan Singkat yang Efisien",
    category: "traveling",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=60"
  },
  {
    id: 13,
    title: "Liga E-Sport Kampus Resmi Dimulai",
    category: "sport",
    image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=900&q=60"
  },
  {
    id: 14,
    title: "Persiapan Atlet Pelajar Menjelang Kejuaraan",
    category: "sport",
    image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=900&q=60"
  },
  {
    id: 15,
    title: "Film Lokal yang Wajib Ditonton Tahun Ini",
    category: "music",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=60"
  },
  {
    id: 16,
    title: "Rekomendasi Playlist Fokus Belajar",
    category: "music",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=900&q=60"
  },
  {
    id: 17,
    title: "Tren Motor Listrik di Kota Pelajar",
    category: "otomotif",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=60"
  },
  {
    id: 18,
    title: "Tips Merawat Mobil Harian",
    category: "otomotif",
    image: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=60"
  },
  {
    id: 19,
    title: "Eksperimen Sains Sederhana di Rumah",
    category: "science",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=60"
  },
  {
    id: 20,
    title: "Kenalan dengan AI di Dunia Pendidikan",
    category: "science",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=900&q=60"
  },
  {
    id: 21,
    title: "Rutinitas Olahraga Ringan untuk Pelajar",
    category: "health",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=60"
  },
  {
    id: 22,
    title: "Pola Tidur Sehat Saat Musim Ujian",
    category: "health",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=60"
  },
  {
    id: 23,
    title: "Hobi Fotografi untuk Pemula",
    category: "podcast",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=60"
  },
  {
    id: 24,
    title: "DIY Craft yang Bisa Dilakukan di Rumah",
    category: "podcast",
    image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=900&q=60"
  },
  {
    id: 25,
    title: "Gadget Hemat Baterai untuk Mahasiswa",
    category: "tech",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=60"
  },
  {
    id: 26,
    title: "Review Laptop Ringkas untuk Kuliah",
    category: "tech",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=60"
  }
];

export const initialArticles = [
  {
    id: 1,
    judul: "Tips Belajar React untuk Pemula",
    nama: "Insiyya Zakiyyatul",
    kategori: "Tech",
    isLiked: false,
    likes: 10,
    status: "published"
  },
  {
    id: 2,
    judul: "Belajar Laravel 11 itu Seru",
    nama: "Admin SukaMuda",
    kategori: "Tech",
    isLiked: true,
    likes: 5,
    status: "published"
  },
  {
    id: 3,
    judul: "Draft Artikel Saya",
    nama: "Insiyya Zakiyyatul",
    kategori: "Personal",
    isLiked: false,
    likes: 0,
    status: "draft",
    tanggalEdit: "2 jam yang lalu"
  }
];