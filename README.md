# BonBon Frontend

Aplikasi web untuk membagi tagihan (split bill) yang dibangun menggunakan Angular dengan desain modern dan responsif.

## 🚀 Teknologi yang Digunakan

### Frontend Framework
- **Angular 13.3.0** - Framework utama untuk membangun aplikasi web
- **TypeScript 4.6.2** - Bahasa pemrograman yang digunakan
- **SCSS** - Preprocessor CSS untuk styling yang lebih fleksibel

### UI Framework & Styling
- **Tailwind CSS 3.4.17** - Framework CSS utility-first untuk styling yang cepat dan konsisten
- **PostCSS 8.5.6** - Tool untuk memproses CSS
- **Autoprefixer 10.4.21** - Plugin untuk menambahkan vendor prefixes secara otomatis

### Testing & Development Tools
- **Angular CLI 13.0.0** - Command line interface untuk Angular
- **Karma 6.3.0** - Test runner untuk unit testing
- **Jasmine 4.0.0** - Testing framework
- **RxJS 7.5.0** - Library untuk reactive programming

### Build Tools
- **Angular DevKit Build Angular 13.3.11** - Build system untuk Angular
- **Zone.js 0.11.4** - Library untuk async operations

## 📋 Fitur Utama

- **Authentication** - Login dan register user
- **Dashboard** - Halaman utama aplikasi
- **Split Bill Management** - Manajemen pembagian tagihan
- **History Tracking** - Riwayat transaksi dan pembagian tagihan
- **Responsive Design** - Desain yang responsif untuk berbagai ukuran layar

## 🏗️ Struktur Project

```
src/
├── app/
│   ├── core/           # Services, guards, interceptors
│   ├── modules/        # Feature modules
│   │   ├── auth/       # Authentication module
│   │   └── dashboard/  # Dashboard module
│   └── shared/         # Shared components
├── assets/             # Static assets
└── environments/       # Environment configurations
```

## 🚀 Cara Menjalankan Project

### Prerequisites
- Node.js (versi 14 atau lebih tinggi)
- npm atau yarn

### Installation
```bash
# Clone repository
git clone <repository-url>
cd splitbill-frontend

# Install dependencies
npm install
```

### Development
```bash
# Jalankan development server
npm start
# atau
ng serve

# Buka browser dan akses http://localhost:4200
```

### Build
```bash
# Build untuk production
npm run build

# Build dengan watch mode
npm run watch
```

### Testing
```bash
# Jalankan unit tests
npm test
# atau
ng test
```

## 📱 PWA Features

Project ini dikonfigurasi sebagai Progressive Web App (PWA) dengan fitur:
- Service Worker untuk offline functionality
- Responsive design untuk mobile devices
- Fast loading dan caching

## 🎨 Design System

Project menggunakan Tailwind CSS dengan konfigurasi custom untuk:
- Color palette yang konsisten
- Typography system
- Spacing dan layout utilities
- Responsive breakpoints

## 📊 Project Architecture

Untuk melihat arsitektur project secara detail, silakan lihat diagram Whimsical:
**[SplitBill Project PWA Architecture](https://whimsical.com/splitbill-project-pwa-AkUxqyAPrFa78jadgeA1T1)**

## 🤝 Contributing

1. Fork project
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 License

Project ini dilisensikan di bawah MIT License.

## 📞 Support

Jika ada pertanyaan atau masalah, silakan buat issue di repository ini.
