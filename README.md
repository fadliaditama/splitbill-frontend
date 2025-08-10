# Nobon - Aplikasi Split Bill Cerdas

Nobon adalah sebuah Progressive Web App (PWA) yang dirancang untuk mempermudah proses pembagian tagihan (split bill). Dengan memanfaatkan teknologi OCR dan AI, pengguna dapat dengan mudah mengunggah foto struk belanja, dan aplikasi akan secara otomatis mengekstrak item, harga, serta biaya tambahan seperti pajak dan servis.

Aplikasi ini dibangun dengan arsitektur modern, memisahkan antara frontend dan backend untuk skalabilitas dan kemudahan pengelolaan.

## Fitur Utama

- **Login & Registrasi Pengguna:** Sistem autentikasi aman untuk melindungi data transaksi.
- **Upload Struk via Gambar:** Pengguna dapat mengunggah foto struk dari galeri atau kamera.
- **Ekstraksi Data Otomatis:** Ditenagai oleh AI (Google Gemini) untuk membaca dan menstrukturkan data dari struk, termasuk item, harga, kuantitas, pajak, dan biaya servis.
- **Koreksi Manual:** Pengguna memiliki kendali penuh untuk mengoreksi hasil ekstraksi AI jika terjadi ketidakakuratan.
- **Pembagian Tagihan Interaktif:** Antarmuka yang mudah digunakan untuk menambah anggota dan mengalokasikan setiap item belanja.
- **Pembagian Biaya Tambahan:** Opsi untuk membagi pajak dan biaya servis secara adil (rata atau proporsional).
- **Riwayat Transaksi:** Semua transaksi dan hasil pembagiannya disimpan, lengkap dengan gambar struk asli untuk referensi di kemudian hari.
- **Desain Responsif & PWA:** Pengalaman pengguna yang optimal di desktop maupun mobile, serta kemampuan untuk di-install di layar utama perangkat seperti aplikasi native.

## Tech Stack & Arsitektur

Aplikasi ini dibangun menggunakan tumpukan teknologi berbasis TypeScript yang modern dan efisien.

### Frontend (Repositori Ini)

- **Framework:** **Angular 13**
- **Styling:** **Tailwind CSS 3**
- **Manajemen State:** RxJS & Angular Services
- **Fitur Tambahan:**
  - **Progressive Web App (PWA):** Menggunakan `@angular/pwa` untuk fungsionalitas offline dan *installable*.
  - **HTTP Client:** `HttpClientModule` dengan `HttpInterceptor` untuk manajemen token JWT.
  - **Routing:** `@angular/router` dengan *lazy loading* untuk performa optimal.
- **Deployment:** **Netlify**

### Backend

- **Framework:** **NestJS** (Node.js)
- **Database:** **PostgreSQL** (disediakan oleh Supabase)
- **Penyimpanan File:** **Supabase Storage**
- **Autentikasi:** JWT (JSON Web Tokens) dengan Passport.js
- **OCR (Optical Character Recognition):** **OCR.space API**
- **AI (Pemrosesan Bahasa):** **Google Gemini 1.5 Flash API**
- **Deployment:** **Vercel** (sebagai *Serverless Functions*)

## Instalasi & Menjalankan Lokal

1.  **Clone repositori ini:**
    ```bash
    git clone [URL_REPOSITORI_ANDA]
    cd splitbill-frontend
    ```

2.  **Install dependensi:**
    ```bash
    npm install
    ```

3.  **Siapkan Environment Variables:**
    Buat file `src/environments/environment.ts` dan pastikan berisi `apiUrl` yang menunjuk ke backend lokal Anda.
    ```typescript
    // src/environments/environment.ts
    export const environment = {
      production: false,
      apiUrl: 'http://localhost:3000'
    };
    ```

4.  **Jalankan aplikasi:**
    Pastikan backend Anda sudah berjalan, lalu jalankan frontend:
    ```bash
    ng serve
    ```
    Buka `http://localhost:4200/` di browser Anda.

---
