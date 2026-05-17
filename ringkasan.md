# Ringkasan Projek: Platform E-Commerce UMKM Lampung

Projek ini adalah platform e-commerce berbasis web yang dirancang khusus untuk mendukung Usaha Mikro, Kecil, dan Menengah (UMKM) di wilayah Lampung. Platform ini memungkinkan pengusaha lokal untuk mengelola toko dan produk mereka secara digital dengan sistem moderasi yang terintegrasi.

## 👥 Peran dan Alur Kerja (User Flow)

Sistem ini memiliki tiga peran utama dengan tanggung jawab yang berbeda:

### 1. Admin (Moderator & Mentor)
*   **Tanggung Jawab:** Menjaga kualitas platform dan memberikan bimbingan.
*   **Alur Kerja:**
    *   Menerima notifikasi saat ada toko atau produk baru yang didaftarkan.
    *   Melakukan verifikasi (Approval/Rejection) terhadap toko dan produk.
    *   Memberikan **Mentoring Notes** (catatan bimbingan) kepada pengusaha jika ada data yang perlu diperbaiki.
    *   Memantau statistik klik WhatsApp untuk melihat performa platform.

### 2. Pengusaha (Penjual/Seller)
*   **Tanggung Jawab:** Mengelola toko dan memasarkan produk.
*   **Alur Kerja:**
    *   Mendaftar akun dan membuat profil toko (maksimal 5 toko).
    *   Mengunggah produk ke toko yang sudah aktif.
    *   Melihat status moderasi di dashboard. Jika ditolak, pengusaha dapat melihat catatan dari Admin untuk melakukan perbaikan.
    *   Mengelola inventaris dan memperbarui informasi produk.

### 3. Customer (Pembeli)
*   **Tanggung Jawab:** Menjelajahi dan mencari produk UMKM.
*   **Alur Kerja:**
    *   Menjelajahi katalog produk berdasarkan kategori atau lokasi.
    *   Melihat detail produk dan foto-fotonya.
    *   Menghubungi penjual secara langsung melalui tombol WhatsApp (sistem akan mencatat klik ini sebagai analytics).

---

## 🌟 Penjelasan Fitur Lengkap

Platform ini dilengkapi dengan fitur-fitur berikut:

1.  **Moderasi Bertingkat:** Sistem "Pending-Active" memastikan hanya toko dan produk yang valid dan sesuai standar yang tampil di publik.
2.  **Sistem Notifikasi:** Pengusaha akan mendapatkan notifikasi real-time ketika status produk atau tokonya diperbarui oleh Admin.
3.  **Manajemen Media:** Mendukung unggah banyak gambar untuk satu produk dengan fitur pemilihan gambar utama (Primary Image). Gambar disimpan secara aman di Supabase.
4.  **Integrasi Wilayah Lampung:** Form alamat menggunakan API wilayah yang dikunci pada Provinsi Lampung, memudahkan pengisian Kabupaten, Kecamatan, hingga Desa secara akurat.
5.  **Analytics Klik WhatsApp:** Fitur tracking untuk menghitung berapa kali tombol hubungi penjual diklik, membantu Admin dan Pengusaha mengetahui minat pasar.
6.  **Pencarian & Filter:** Navigasi produk berdasarkan kategori dan pencarian berbasis teks untuk memudahkan pembeli menemukan apa yang mereka butuhkan.
7.  **Visualisasi 3D & Animasi:** Halaman utama dilengkapi dengan elemen 3D dan animasi halus untuk memberikan pengalaman pengguna yang modern dan profesional.
8.  **Keamanan Autentikasi:** Menggunakan NextAuth v5 dengan strategi JWT untuk memastikan data pengguna dan akses dashboard tetap aman.

---

## 🛠 Teknologi Utama
*   **Next.js 16 (App Router):** Performa cepat dengan Server Components.
*   **Drizzle ORM & PostgreSQL:** Manajemen data yang efisien dan aman.
*   **Framer Motion & Three.js:** Visual interaktif.
*   **Supabase:** Media storage berskala besar.
