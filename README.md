<div align="center">

# Color Playground

Sebuah *browser-based color utility* minimalis dan modern untuk merancang, memvisualisasikan, dan mengelola palet warna antarmuka pengguna secara real-time.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)

</div>

---

<div align="center">
  <a href="#-pengenalan">🚀 Pengenalan</a> •
  <a href="#-fitur-utama">✨ Fitur</a> •
  <a href="#-desain--ux">🎨 Desain & UX</a> •
  <a href="#-tech-stack">🛠️ Tech Stack</a> •
  <a href="#-menjalankan-secara-lokal">🚀 Getting Started</a>
</div>

---

## 🚀 Pengenalan

**Color Playground** (juga dikenal sebagai PaletteLab) adalah alat desain warna interaktif yang dibuat untuk memudahkan developer dan desainer dalam menyusun *color scheme* (skema warna) aplikasi. 

Daripada harus menebak-nebak bagaimana sebuah warna akan terlihat saat digabungkan dalam elemen UI sesungguhnya, Color Playground menyediakan pratinjau antarmuka (dashboard) yang langsung bereaksi terhadap setiap perubahan warna yang Anda buat. Aplikasi ini sangat ringan, responsif, dan bekerja sepenuhnya di dalam browser.

## 💡 Kenapa Color Playground?

Bekerja dengan warna sering kali mengharuskan kita berpindah-pindah antara banyak alat kecil: satu untuk mencari *hex code*, satu untuk menguji kontras, dan yang lain untuk menerapkannya ke CSS. Desainer dan developer membutuhkan tempat di mana mereka bisa:
- Memilih dan mengubah warna.
- Melihatnya diterapkan dalam konteks komponen UI (seperti tombol, *badge*, dan teks).
- Menghasilkan kode CSS yang siap disalin.

Proyek ini menyatukan semua interaksi tersebut ke dalam satu antarmuka yang bersih, cepat, dan tanpa friksi.

## ✨ Fitur Utama

| Fitur | Deskripsi |
| --- | --- |
| 👀 **Live UI Preview** | Lihat warna Anda diterapkan seketika pada *mock dashboard* interaktif, lengkap dengan teks, *badge* status, dan tombol. |
| 🎨 **Color Editing** | Sesuaikan warna satu per satu menggunakan *native color picker* atau input teks HEX yang presisi. |
| 🌓 **Light / Dark Mode** | Ubah tema antarmuka aplikasi dari terang ke gelap untuk kenyamanan mendesain dalam berbagai lingkungan pencahayaan. |
| 🧩 **Bulk Color Input** | Punya daftar warna? *Paste* format `Label #HEX` (misal: `Primary #E05AA6`) dan terapkan seluruh palet sekaligus. |
| ⚡ **Quick Color Preview** | Uji daftar kode HEX acak secara cepat untuk memvisualisasikan kumpulan *swatch* warna tanpa memodifikasi palet utama Anda. |
| 📋 **CSS Export** | Ekspor palet Anda menjadi blok variabel CSS `:root` yang siap di-*copy-paste* ke proyek Anda. |
| 🔄 **Reset & Validasi** | Kembali ke palet default kapan saja, dilengkapi dengan validasi input HEX yang mencegah kesalahan format. |

## 🎨 Desain & UX

Color Playground dirancang dengan filosofi visual yang bersih, minimalis, dan bergaya *premium SaaS*:

- **Gaya Visual:** Menggunakan pendekatan ruang kosong (*whitespace*) yang elegan dengan kartu (panel) membulat dan batas (*border*) yang halus. Tidak menggunakan terlalu banyak garis kotak untuk mencegah *cognitive overload*.
- **Tipografi:** Memanfaatkan font **Inter** untuk keterbacaan yang tajam, sangat cocok untuk antarmuka yang penuh data atau alat developer.
- **Interaksi & Mikro-animasi:** Terdapat efek *hover* yang lembut pada input dan tombol, serta transisi warna saat memodifikasi palet secara real-time.
- **Responsivitas:** Layout berbasis *CSS Grid* dan *Flexbox* yang secara otomatis menumpuk panel kontrol dan pratinjau secara vertikal pada perangkat seluler atau layar yang lebih kecil.
- **Blending Warna Dinamis:** Memanfaatkan kemampuan standar web modern `color-mix()` untuk menghasilkan pewarnaan latar belakang *badge* secara dinamis dan efisien (contoh: 15% warna transparan dari warna utama).

## 🛠️ Tech Stack

Proyek ini dibangun secara murni tanpa *framework*, *library*, atau konfigurasi *build* yang rumit:

| Layer | Teknologi |
| --- | --- |
| 🧱 **Structure** | HTML5 |
| 🎨 **Styling** | CSS3 (Custom Properties, Grid, Flexbox, `color-mix()`) |
| ⚙️ **Logic** | Vanilla JavaScript (ES6+) |
| 📦 **Dependencies**| Tidak ada (Zero dependencies) |

## 📁 Struktur Proyek

Arsitektur aplikasi memisahkan logika ke dalam tiga pilar utama:

```text
ColorPlayground/
├── index.html     # Layout struktur semantik, elemen UI, dan ikon SVG inline
├── style.css      # Desain responsif, styling tema terang/gelap, dan mikro-animasi
├── script.js      # Logika manipulasi warna, sinkronisasi DOM, dan parser bulk-input
├── README.md      # Dokumentasi proyek (file ini)
└── LICENSE        # Lisensi proyek open-source
```

## 🧠 Cara Kerja

1. **Inisialisasi:** Saat aplikasi dimuat, JavaScript membaca dan menerapkan profil warna *default*.
2. **Update Status:** Ketika pengguna berinteraksi melalui *color picker*, mengetik nilai HEX baru, atau mem-*paste* daftar warna, *event listener* akan mengevaluasi input tersebut.
3. **Validasi:** JavaScript segera memvalidasi apakah kode warna tersebut adalah format HEX valid. Jika salah, elemen input akan ditandai dengan peringatan (visual warna merah).
4. **Sinkronisasi Otomatis:** Nilai HEX baru segera ditulis ke dalam *Custom Properties* milik CSS (`--pv-primary`, `--pv-surface`, dsb) di tingkat dokumen (`<html>`).
5. **UI Reaktif:** Semua elemen di bagian *Live Preview* yang terhubung ke variabel-variabel tersebut otomatis ter-render ulang oleh browser tanpa perlu logika modifikasi DOM per-elemen.

## 🚀 Menjalankan Secara Lokal

Karena proyek ini berjalan penuh sebagai file *frontend* statis, persiapannya sangatlah instan:

1. *Clone* repositori ke sistem lokal Anda:
   ```bash
   git clone <repository-url>
   cd check_color
   ```
2. Anda bisa langsung menjalankan aplikasi ini tanpa konfigurasi tambahan. 
3. Buka file `index.html` dengan *browser* modern apapun (Chrome, Firefox, Safari, Edge). Cukup klik dua kali pada file tersebut, dan aplikasi siap digunakan.

Tidak perlu `npm install` atau menjalankan *local server* (meskipun *extension* seperti Live Server sangat disarankan untuk pengalaman *development*).

## 🖱️ Cara Menggunakan

- **Mendesain Palet:** Gunakan panel di sebelah kiri. Klik pada ikon kotak warna untuk membuka palet visual bawaan OS, atau ubah angka langsung pada kolom input teks 6-digit HEX di sebelahnya.
- **Bulk Input:** Coba *copy* daftar teks dengan format `NamaLabel #hex`, rekatkan pada *text-area* **Bulk Input**, dan tekan **Apply Colors**. Semua baris valid akan diaplikasikan otomatis.
- **Quick Test:** Masukkan deretan angka HEX murni pada panel **Quick Color Preview** (satu baris satu HEX) untuk mengevaluasi warna secara mentah dan cepat, tanpa mengubah *mock UI*.
- **Melihat Hasil:** Segala interaksi yang valid langsung tampak jelas pada area **Live Preview** sebelah kanan.
- **Ekspor & Simpan:** Ingin memindahkan tema yang dibuat ke kode nyata? Klik tombol **Export CSS** untuk meng-generate format variabel CSS.

## 🌐 Browser Support

Aplikasi sangat dioptimalkan untuk browser modern yang *up-to-date*. Sebagian besar performa *styling* mengandalkan:
- **CSS Custom Properties (Variables)**
- **CSS `color-mix()` API**

> **Catatan:** Seluruh kalkulasi, *parsing*, dan pemrosesan berjalan sepenuhnya secara lokal dari tab *browser* tanpa permintaan jaringan.

## 🔒 Privasi

Aplikasi *Color Playground* beroperasi penuh pada lapisan *client-side*. Anda tidak perlu masuk ke akun, dan aplikasi tidak menggunakan *database* atau komunikasi server di luar aplikasi. Aktivitas eksplorasi warna Anda 100% aman dan lokal.

## 🗺️ Rencana Pengembangan

Beberapa fitur yang dipertimbangkan (*Future Ideas*):
- [ ] Generator Skema Harmoni Warna (*Complementary*, *Analogous*, *Triadic*, dll).
- [ ] Implementasi pemeriksa tingkat kontras teks untuk menyesuaikan pedoman aksesibilitas standar WCAG.
- [ ] Fitur simpan palet ke penyimpanan internal browser (`Local Storage`) agar status desain tersimpan otomatis.
- [ ] Pilihan format *export* baru, seperti untuk *Tailwind CSS config* atau berkas *JSON*.

## 👨‍💻 Author

Dibuat dengan ☕ dan dedikasi penuh untuk memudahkan rutinitas desainer dan developer.

---

<div align="center">

🎨 **Color Playground**
<br>
Eksplorasi warna antarmuka kini jauh lebih mudah dan reaktif. 
<br>
Ditenagai sepenuhnya oleh HTML, CSS, dan JavaScript murni.

© 2026 Color Playground

</div>