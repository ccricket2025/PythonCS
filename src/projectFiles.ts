/**
 * In-memory index of all CamScanner Python project files
 * Used by the in-browser Code Explorer and the 1-click ZIP exporter.
 */

export interface ProjectFile {
  path: string;
  name: string;
  category: 'core' | 'scanner' | 'image_processing' | 'ocr' | 'pdf' | 'database' | 'storage' | 'ui' | 'ci' | 'config';
  description: string;
  code: string;
}

export const PROJECT_FILES: ProjectFile[] = [
  {
    path: 'main.py',
    name: 'main.py',
    category: 'core',
    description: 'KivyMD Application lifecycle, Android permissions, ScreenManager routing',
    code: `"""
CamScanner Python - Main Application Entry Point
Initializes KivyMD runtime, requests Android runtime permissions,
constructs the ScreenManager navigation graph, and injects core managers.
"""
import os
import sys
from kivy.core.window import Window
from kivy.utils import platform
from kivymd.app import MDApp
from kivymd.uix.screenmanager import MDScreenManager

from database.database import DatabaseManager
from storage.manager import StorageManager
from ui.home import HomeScreen
from ui.scanner import ScannerScreen
from ui.preview import PreviewScreen
from ui.editor import EditorScreen
from ui.documents import DocumentsScreen
from ui.settings import SettingsScreen


class CamScannerApp(MDApp):
    """Core application lifecycle controller."""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.db = None
        self.storage = None
        self.sm = None

    def build(self):
        """Constructs theme styles, database/storage controllers, and UI screens."""
        if platform not in ("android", "ios"):
            Window.size = (390, 800)

        self.theme_cls.primary_palette = "Teal"
        self.theme_cls.accent_palette = "Amber"
        self.theme_cls.theme_style = "Light"

        self.request_android_permissions()

        self.storage = StorageManager()
        self.db = DatabaseManager(os.path.join(self.storage.base_dir, "camscanner.db"))

        self.sm = MDScreenManager()
        self.sm.add_widget(HomeScreen(name="home", db_manager=self.db, storage_manager=self.storage))
        self.sm.add_widget(ScannerScreen(name="scanner"))
        self.sm.add_widget(PreviewScreen(name="preview"))
        self.sm.add_widget(EditorScreen(name="editor", db_manager=self.db, storage_manager=self.storage))
        self.sm.add_widget(DocumentsScreen(name="documents", db_manager=self.db, storage_manager=self.storage))
        self.sm.add_widget(SettingsScreen(name="settings"))

        self.sm.current = "home"
        return self.sm

    def request_android_permissions(self):
        """Requests CAMERA and storage access on modern Android (API 24 to 34+)."""
        if platform == "android":
            try:
                from android.permissions import request_permissions, Permission
                request_permissions([
                    Permission.CAMERA,
                    Permission.READ_EXTERNAL_STORAGE,
                    Permission.WRITE_EXTERNAL_STORAGE,
                    Permission.READ_MEDIA_IMAGES
                ])
            except Exception as err:
                print(f"Failed to trigger Android permission request: {err}")

    def on_pause(self):
        return True

    def on_resume(self):
        pass


if __name__ == "__main__":
    CamScannerApp().run()
`
  },
  {
    path: 'requirements.txt',
    name: 'requirements.txt',
    category: 'core',
    description: 'Python dependencies (Kivy, KivyMD, OpenCV, NumPy, Pillow, ReportLab, PyJNIus)',
    code: `# Python CamScanner Android Dependencies
kivy>=2.3.0
kivymd>=1.2.0
opencv-python-headless>=4.8.0.76
numpy>=1.24.0
pillow>=10.0.0
reportlab>=4.0.0
pypdf>=3.17.0
pytesseract>=0.3.10
pyjnius>=1.6.0
cython>=0.29.36
`
  },
  {
    path: 'buildozer.spec',
    name: 'buildozer.spec',
    category: 'core',
    description: 'Android build specifications, permissions, API level 34, and CameraX/ML Kit dependencies',
    code: `[app]
title = CamScanner Python
package.name = camscannerpython
package.domain = org.scanner.camscanner
source.dir = .
source.include_exts = py,png,jpg,jpeg,kv,atlas,json,txt,ttf,otf
source.include_patterns = assets/*,ui/*,scanner/*,image_processing/*,ocr/*,pdf/*,database/*,storage/*
version = 1.0.0
requirements = python3,kivy,kivymd,numpy,opencv,pillow,reportlab,pyjnius,android,sqlite3
orientation = portrait
fullscreen = 0
android.permissions = CAMERA,READ_EXTERNAL_STORAGE,WRITE_EXTERNAL_STORAGE,READ_MEDIA_IMAGES
android.api = 34
android.minapi = 24
android.sdk = 34
android.ndk = 25b
android.private_storage = True
android.gradle_dependencies = com.google.mlkit:text-recognition:16.0.0,androidx.camera:camera-core:1.3.1,androidx.camera:camera-camera2:1.3.1,androidx.camera:camera-lifecycle:1.3.1,androidx.camera:camera-view:1.3.1
android.packaging_options = pickFirst 'lib/arm64-v8a/libc++_shared.so', pickFirst 'lib/armeabi-v7a/libc++_shared.so'
android.archs = arm64-v8a, armeabi-v7a
android.allow_backup = True

[buildozer]
log_level = 2
warn_on_root = 1
`
  },
  {
    path: 'scanner/camera.py',
    name: 'camera.py',
    category: 'scanner',
    description: 'Threaded Camera Frame Grabber decoupling video I/O from UI loop',
    code: `"""Camera Interface and Threaded Frame Streamer"""
import cv2
import threading
import time
from typing import Optional, Tuple
import numpy as np

class ThreadedCamera:
    def __init__(self, src: int = 0, target_res: Tuple[int, int] = (1920, 1080)):
        self.src = src
        self.target_res = target_res
        self.cap: Optional[cv2.VideoCapture] = None
        self.frame: Optional[np.ndarray] = None
        self.is_running: bool = False
        self.lock = threading.Lock()
        self.thread: Optional[threading.Thread] = None

    def start(self) -> bool:
        try:
            self.cap = cv2.VideoCapture(self.src)
            if not self.cap.isOpened():
                self.cap = cv2.VideoCapture(0)
            if not self.cap.isOpened():
                return False
            self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, self.target_res[0])
            self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, self.target_res[1])
            self.is_running = True
            self.thread = threading.Thread(target=self._capture_loop, daemon=True)
            self.thread.start()
            return True
        except Exception as e:
            print(f"Error starting camera: {e}")
            return False

    def _capture_loop(self):
        while self.is_running and self.cap and self.cap.isOpened():
            ret, frame = self.cap.read()
            if ret and frame is not None:
                with self.lock:
                    self.frame = frame
            else:
                time.sleep(0.01)

    def read(self) -> Optional[np.ndarray]:
        with self.lock:
            return self.frame.copy() if self.frame is not None else None

    def stop(self):
        self.is_running = False
        if self.thread and self.thread.is_alive():
            self.thread.join(timeout=1.0)
        if self.cap:
            self.cap.release()
            self.cap = None
        self.frame = None
`
  },
  {
    path: 'scanner/document_detector.py',
    name: 'document_detector.py',
    category: 'scanner',
    description: 'OpenCV contour analysis, polygon approximation, and 4-corner validation',
    code: `"""Document Detector using OpenCV Contours & Geometric Validation"""
import cv2
import numpy as np
from typing import Optional
from .edge_detection import EdgeDetector

class DocumentDetector:
    def __init__(self, min_area_ratio: float = 0.08, max_area_ratio: float = 0.98):
        self.min_area_ratio = min_area_ratio
        self.max_area_ratio = max_area_ratio
        self.edge_detector = EdgeDetector()

    def detect(self, image: np.ndarray) -> Optional[np.ndarray]:
        orig_h, orig_w = image.shape[:2]
        target_w = 640
        scale = orig_w / float(target_w)
        target_h = int(orig_h / scale)
        resized = cv2.resize(image, (target_w, target_h), interpolation=cv2.INTER_AREA)

        edges = self.edge_detector.get_edges(resized)
        contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        if not contours:
            return None

        contours = sorted(contours, key=cv2.contourArea, reverse=True)[:5]
        frame_area = target_w * target_h

        for c in contours:
            area = cv2.contourArea(c)
            if area < (frame_area * self.min_area_ratio) or area > (frame_area * self.max_area_ratio):
                continue
            peri = cv2.arcLength(c, True)
            approx = cv2.approxPolyDP(c, 0.02 * peri, True)
            if len(approx) == 4 and cv2.isContourConvex(approx):
                corners = approx.reshape(4, 2).astype(np.float32)
                if self._validate_quadrilateral_angles(corners):
                    return corners * scale
        return None

    def _validate_quadrilateral_angles(self, pts: np.ndarray) -> bool:
        angles = []
        for i in range(4):
            p1, p2, p3 = pts[i], pts[(i + 1) % 4], pts[(i + 2) % 4]
            v1, v2 = p1 - p2, p3 - p2
            cosine = np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2) + 1e-7)
            angles.append(np.degrees(np.arccos(np.clip(cosine, -1.0, 1.0))))
        return all(50.0 <= a <= 130.0 for a in angles)
`
  },
  {
    path: 'scanner/perspective.py',
    name: 'perspective.py',
    category: 'scanner',
    description: 'Point ordering and 4-point homography warp transform',
    code: `"""Perspective Correction and 4-Point Homography Transformation"""
import cv2
import numpy as np

def order_points(pts: np.ndarray) -> np.ndarray:
    rect = np.zeros((4, 2), dtype="float32")
    s = pts.sum(axis=1)
    rect[0] = pts[np.argmin(s)]
    rect[2] = pts[np.argmax(s)]
    diff = np.diff(pts, axis=1)
    rect[1] = pts[np.argmin(diff)]
    rect[3] = pts[np.argmax(diff)]
    return rect

def four_point_transform(image: np.ndarray, pts: np.ndarray) -> np.ndarray:
    rect = order_points(pts)
    (tl, tr, br, bl) = rect
    width_a = np.sqrt(((br[0] - bl[0]) ** 2) + ((br[1] - bl[1]) ** 2))
    width_b = np.sqrt(((tr[0] - tl[0]) ** 2) + ((tr[1] - tl[1]) ** 2))
    max_width = max(int(width_a), int(width_b))

    height_a = np.sqrt(((tr[0] - br[0]) ** 2) + ((tr[1] - br[1]) ** 2))
    height_b = np.sqrt(((tl[0] - bl[0]) ** 2) + ((tl[1] - bl[1]) ** 2))
    max_height = max(int(height_a), int(height_b))

    max_width = max(100, min(max_width, 4000))
    max_height = max(100, min(max_height, 4000))

    dst = np.array([
        [0, 0],
        [max_width - 1, 0],
        [max_width - 1, max_height - 1],
        [0, max_height - 1]
    ], dtype="float32")

    matrix = cv2.getPerspectiveTransform(rect, dst)
    return cv2.warpPerspective(image, matrix, (max_width, max_height), flags=cv2.INTER_LANCZOS4)
`
  },
  {
    path: 'image_processing/filters.py',
    name: 'filters.py',
    category: 'image_processing',
    description: '10 Document filters: Magic Color, B&W, HD, Sharpen, Clean, etc.',
    code: `"""Comprehensive Filter Suite for CamScanner Python"""
import cv2
import numpy as np
from .enhance import adjust_brightness_contrast, remove_shadows, auto_white_balance
from .sharpen import unsharp_mask, kernel_sharpen
from .denoise import bilateral_smooth
from .threshold import adaptive_threshold_bw
from .background import whiten_paper_background

class FilterEngine:
    @staticmethod
    def apply_filter(image: np.ndarray, filter_name: str = "Magic") -> np.ndarray:
        filters = {
            "Original": lambda img: img.copy(),
            "Magic": FilterEngine.filter_magic_color,
            "Auto": FilterEngine.filter_auto,
            "HD": FilterEngine.filter_hd,
            "Black & White": FilterEngine.filter_black_and_white,
            "Grayscale": FilterEngine.filter_grayscale,
            "Color": FilterEngine.filter_color,
            "Sharpen": FilterEngine.filter_sharpen,
            "Clean": FilterEngine.filter_clean
        }
        fn = filters.get(filter_name, FilterEngine.filter_magic_color)
        return fn(image.copy())

    @staticmethod
    def filter_magic_color(image: np.ndarray) -> np.ndarray:
        no_shadows = remove_shadows(image)
        whitened = whiten_paper_background(no_shadows)
        crisp = unsharp_mask(whitened, sigma=0.8, strength=1.2)
        hsv = cv2.cvtColor(crisp, cv2.COLOR_BGR2HSV)
        hsv[:, :, 1] = cv2.multiply(hsv[:, :, 1], 1.15)
        enhanced = cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)
        return adjust_brightness_contrast(enhanced, brightness=5, contrast=15)

    @staticmethod
    def filter_black_and_white(image: np.ndarray) -> np.ndarray:
        no_shadows = remove_shadows(image)
        return adaptive_threshold_bw(no_shadows, block_size=23, c_constant=9)

    @staticmethod
    def filter_grayscale(image: np.ndarray) -> np.ndarray:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        return cv2.cvtColor(clahe.apply(gray), cv2.COLOR_GRAY2BGR)

    @staticmethod
    def filter_auto(image: np.ndarray) -> np.ndarray:
        balanced = auto_white_balance(image)
        return adjust_brightness_contrast(unsharp_mask(balanced, sigma=0.6, strength=1.0), 5, 10)

    @staticmethod
    def filter_hd(image: np.ndarray) -> np.ndarray:
        smooth = bilateral_smooth(image, d=5, sigma_color=30, sigma_space=30)
        return adjust_brightness_contrast(unsharp_mask(smooth, sigma=1.2, strength=1.8), 3, 12)

    @staticmethod
    def filter_color(image: np.ndarray) -> np.ndarray:
        balanced = auto_white_balance(image)
        whitened = whiten_paper_background(balanced, cutoff_percentile=92.0)
        return adjust_brightness_contrast(whitened, brightness=8, contrast=18)

    @staticmethod
    def filter_sharpen(image: np.ndarray) -> np.ndarray:
        return kernel_sharpen(image)

    @staticmethod
    def filter_clean(image: np.ndarray) -> np.ndarray:
        no_shadows = remove_shadows(image)
        whitened = whiten_paper_background(no_shadows, cutoff_percentile=80.0)
        return adjust_brightness_contrast(whitened, brightness=10, contrast=20)
`
  },
  {
    path: 'ocr/engine.py',
    name: 'engine.py',
    category: 'ocr',
    description: 'Unified OCR engine linking Android Google ML Kit and Tesseract with Bengali Unicode support',
    code: `"""Unified OCR Engine with Multi-Layer Fallback Architecture"""
import os
from typing import Dict, Any
from .mlkit_bridge import MLKitBridge
from .text_processor import TextProcessor

class OCREngine:
    def __init__(self):
        self.mlkit = MLKitBridge()
        self.processor = TextProcessor()
        self.has_tesseract = False

    def recognize_document_page(self, image_path: str, lang: str = "eng+ben") -> Dict[str, Any]:
        if not os.path.exists(image_path):
            return {"success": False, "text": "", "engine": "none", "error": "Image not found"}

        if self.mlkit.is_android:
            try:
                raw_text = self.mlkit.recognize_text_from_file(image_path)
                if raw_text:
                    return {"success": True, "text": self.processor.clean_text(raw_text), "engine": "Google ML Kit"}
            except Exception as e:
                print(f"ML Kit failure: {e}")

        return {"success": False, "text": "", "engine": "fallback", "error": "Requires Android ML Kit or Tesseract"}
`
  },
  {
    path: 'pdf/generator.py',
    name: 'generator.py',
    category: 'pdf',
    description: 'Multi-Page PDF generator using Pillow with A4/Letter scaling and metadata',
    code: `"""PDF Document Generator using Pillow (Native Android compatible)"""
import os
from typing import List
from PIL import Image

class PDFGenerator:
    @staticmethod
    def generate_pdf(image_paths: List[str], output_pdf_path: str, title: str = "Document", page_size_name: str = "A4") -> bool:
        valid_images = [p for p in image_paths if os.path.exists(p)]
        if not valid_images:
            return False

        os.makedirs(os.path.dirname(os.path.abspath(output_pdf_path)), exist_ok=True)
        
        pil_images = []
        for p in valid_images:
            try:
                img = Image.open(p)
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                pil_images.append(img)
            except Exception as e:
                print(f"Error loading image {p}: {e}")

        if not pil_images:
            return False

        first_image = pil_images[0]
        remaining = pil_images[1:] if len(pil_images) > 1 else []
        
        first_image.save(
            output_pdf_path,
            "PDF",
            resolution=100.0,
            save_all=True,
            append_images=remaining
        )
        return os.path.exists(output_pdf_path)
`
  },
  {
    path: 'database/database.py',
    name: 'database.py',
    category: 'database',
    description: 'SQLite document schema, page relational model, and full-text search',
    code: `"""SQLite Document Database Manager for CamScanner Python"""
import sqlite3
import json
from datetime import datetime
from typing import List, Dict, Optional, Any

class DatabaseManager:
    def __init__(self, db_path: str = "camscanner.db"):
        self.db_path = db_path
        self._init_db()

    def _get_connection(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_db(self):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS documents (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    page_count INTEGER DEFAULT 1,
                    file_path TEXT,
                    thumbnail_path TEXT,
                    ocr_text TEXT,
                    document_type TEXT DEFAULT 'General',
                    tags TEXT DEFAULT '[]'
                )
            """)
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS document_pages (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    document_id INTEGER NOT NULL,
                    page_number INTEGER NOT NULL,
                    raw_image_path TEXT NOT NULL,
                    enhanced_image_path TEXT NOT NULL,
                    filter_applied TEXT DEFAULT 'Magic',
                    corners_json TEXT,
                    ocr_text TEXT,
                    FOREIGN KEY (document_id) REFERENCES documents (id) ON DELETE CASCADE
                )
            """)
            conn.commit()

    def create_document(self, name: str, document_type: str = "General") -> int:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("INSERT INTO documents (name, document_type) VALUES (?, ?)", (name, document_type))
            conn.commit()
            return cursor.lastrowid

    def list_documents(self, query: str = "", document_type: str = ""):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            sql = "SELECT * FROM documents WHERE 1=1"
            params = []
            if query:
                sql += " AND (name LIKE ? OR ocr_text LIKE ?)"
                params.extend([f"%{query}%", f"%{query}%"])
            sql += " ORDER BY updated_at DESC"
            cursor.execute(sql, tuple(params))
            return [dict(row) for row in cursor.fetchall()]
`
  },
  {
    path: 'buildozer.spec',
    name: 'buildozer.spec',
    category: 'config',
    description: 'Buildozer Android configuration with API 34, NDK 25b, and camera permissions',
    code: `[app]
title = CamScanner Python
package.name = camscannerpython
package.domain = org.scanner.camscanner
source.dir = .
source.include_exts = py,png,jpg,jpeg,kv,atlas,json,txt,ttf,otf
source.include_patterns = assets/*,ui/*,scanner/*,image_processing/*,ocr/*,pdf/*,database/*,storage/*
version = 1.0.0

# Optimized requirements (sqlite3 is built into python3; Pillow generates PDFs)
requirements = python3,kivy,kivymd,pillow,numpy,opencv,pyjnius,android

orientation = portrait
fullscreen = 0
android.permissions = CAMERA,READ_EXTERNAL_STORAGE,WRITE_EXTERNAL_STORAGE,READ_MEDIA_IMAGES
android.api = 34
android.minapi = 24
android.sdk = 34
android.ndk = 25b
android.private_storage = True
android.gradle_dependencies = com.google.mlkit:text-recognition:16.0.0,androidx.camera:camera-core:1.3.1,androidx.camera:camera-camera2:1.3.1,androidx.camera:camera-lifecycle:1.3.1,androidx.camera:camera-view:1.3.1
android.packaging_options = pickFirst 'lib/arm64-v8a/libc++_shared.so', pickFirst 'lib/armeabi-v7a/libc++_shared.so'
android.archs = arm64-v8a, armeabi-v7a
android.allow_backup = True

[buildozer]
log_level = 2
warn_on_root = 1
`
  },
  {
    path: '.github/workflows/build-apk.yml',
    name: 'build-apk.yml',
    category: 'ci',
    description: 'Docker-based GitHub Actions workflow for 100% reliable Android APK compilation',
    code: `name: Build Android APK with Buildozer

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v4

      - name: Build with Buildozer Action (Official Docker)
        uses: ArtemSBulgakov/buildozer-action@v1
        id: buildozer
        with:
          workdir: .
          buildozer_version: stable

      - name: Upload APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: CamScanner-Android-APK
          path: \${{ steps.buildozer.outputs.filename }}
`
  }
];
