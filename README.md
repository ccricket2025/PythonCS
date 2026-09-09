# CamScanner Python - Android Document Scanner

একটি সম্পূর্ণ পাইথন এবং OpenCV ভিত্তিক Android Document Scanner অ্যাপ্লিকেশন (Kivy/KivyMD, OpenCV, Google ML Kit, SQLite, ReportLab এবং Buildozer দিয়ে তৈরি)।

---

## 📁 প্রজেক্ট স্ট্রাকচার (Project Structure)

```text
CamScannerPython/
├── main.py                        # KivyMD App Lifecycle & Permissions
├── requirements.txt               # Dependencies
├── buildozer.spec                 # Android Packaging & Permissions
├── README.md                      # Documentation
│
├── scanner/                       # Real-time Document Detection
│   ├── __init__.py
│   ├── camera.py                  # Threaded Camera Frame Streamer
│   ├── edge_detection.py          # Canny, Gaussian & Morphological Pipeline
│   ├── document_detector.py       # 4-Corner Contour & Polygon Validation
│   ├── perspective.py             # 4-Point Homography & Warp Transform
│   ├── auto_capture.py            # Frame Stability Metric & Auto Trigger
│   └── quality.py                 # Laplacian Sharpness & Exposure Check
│
├── image_processing/              # 10 Document Enhancement Filters
│   ├── __init__.py
│   ├── enhance.py                 # Brightness, Contrast & Shadow Removal
│   ├── filters.py                 # Magic Color, B&W, HD, Sharpen, Clean, etc.
│   ├── sharpen.py                 # Unsharp Mask & High-Pass Kernel
│   ├── denoise.py                 # Non-Local Means & Bilateral Smooth
│   ├── threshold.py               # Adaptive Gaussian & Otsu Binarization
│   └── background.py              # Paper Background Whitening
│
├── ocr/                           # Text Recognition (English + Bengali)
│   ├── __init__.py
│   ├── engine.py                  # Multi-layer Fallback OCR Engine
│   ├── mlkit_bridge.py            # Google ML Kit PyJNIus Bridge (Android)
│   └── text_processor.py          # Unicode Bengali Cleaning & Keyword Index
│
├── pdf/                           # PDF Generator & Export
│   ├── __init__.py
│   ├── generator.py               # ReportLab Multi-Page PDF Engine (A4/Letter)
│   └── exporter.py                # JPG, PNG, PDF & Android Share Intent
│
├── database/                      # SQLite Persistence
│   ├── __init__.py
│   └── database.py                # Schema, Documents & Pages CRUD
│
├── storage/                       # Storage Scopes
│   ├── __init__.py
│   └── manager.py                 # Raw, Enhanced & Thumbnail Path Isolation
│
├── ui/                            # KivyMD Screens
│   ├── __init__.py
│   ├── home.py                    # Documents Library & SpeedDial FAB
│   ├── scanner.py                 # Viewfinder & Live CV Corner Overlay
│   ├── preview.py                 # Manual 4-Corner Crop & Rotation
│   ├── editor.py                  # Filter Carousel, Tone Sliders & OCR
│   ├── documents.py               # Multi-Page Manager & PDF Exporter
│   └── settings.py                # Scanner & Language Settings
│
└── .github/workflows/
    └── build-apk.yml              # GitHub Actions Automatic APK Pipeline
```

---

## 🚀 লোকাল ডেভেলপমেন্ট ও রান করার নিয়ম (Local Run)

### ১. Virtual Environment তৈরি ও চালু করুন
```bash
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

### ২. ডিপেন্ডেন্সি ইনস্টল করুন
```bash
pip install -r requirements.txt
```

### ৩. অ্যাপ্লিকেশন রান করুন
```bash
python main.py
```

---

## 📱 Android APK তৈরি করার নিয়ম (Buildozer / WSL / Ubuntu)

### প্রয়োজনীয় টুলস ইনস্টল করুন:
```bash
sudo apt update && sudo apt install -y \
  python3-pip python3-venv git zip unzip openjdk-17-jdk \
  autoconf automake libtool pkg-config zlib1g-dev \
  libncurses5-dev cmake libffi-dev libssl-dev libsqlite3-dev
```

### Buildozer দিয়ে APK বিল্ড করুন:
```bash
pip install buildozer cython==0.29.36
buildozer android debug
```
বিল্ড হওয়া APK ফাইলটি `bin/` ফোল্ডারে পাওয়া যাবে (যেমন: `bin/camscannerpython-1.0.0-arm64-v8a_armeabi-v7a-debug.apk`)।

---

## ☁️ GitHub Actions দিয়ে Automatic APK বিল্ড

প্রজেক্টের `.github/workflows/build-apk.yml` ফাইলটি সংযুক্ত রয়েছে। আপনি এই কোডটি GitHub-এ push করলেই GitHub Actions স্বয়ংক্রিয়ভাবে APK বিল্ড করে Artifact হিসেবে ডাউনলোড লিংক প্রদান করবে!

```bash
git init
git add .
git commit -m "Initial CamScanner Python"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```
GitHub রেপোজিটরির **Actions** ট্যাবে গিয়ে বিল্ড কমপ্লিট হলে `CamScanner-Android-APK` জিপ ফাইল ডাউনলোড করতে পারবেন।
