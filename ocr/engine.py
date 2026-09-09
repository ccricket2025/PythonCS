"""
Unified OCR Engine with Multi-Layer Fallback Architecture
Prioritizes Google ML Kit on Android devices, followed by Tesseract OCR,
with zero-crash fault tolerance if OCR models are temporarily unavailable.
"""
import os
import cv2
import numpy as np
from typing import Optional, Dict, Any
from .mlkit_bridge import MLKitBridge
from .text_processor import TextProcessor


class OCREngine:
    """Manages document text recognition across platforms."""

    def __init__(self):
        self.mlkit = MLKitBridge()
        self.processor = TextProcessor()
        self.has_tesseract = False
        self._check_tesseract()

    def _check_tesseract(self):
        try:
            import pytesseract
            self.has_tesseract = True
        except ImportError:
            self.has_tesseract = False

    def recognize_document_page(self, image_path: str, lang: str = "eng+ben") -> Dict[str, Any]:
        """
        Runs OCR on given page image.
        Returns dictionary with text, engine used, and success status.
        Never throws exceptions to avoid UI crashes.
        """
        if not os.path.exists(image_path):
            return {
                "success": False,
                "text": "",
                "engine": "none",
                "error": "Image file not found"
            }

        # Step 1: Try Google ML Kit if running on Android
        if self.mlkit.is_android:
            try:
                raw_text = self.mlkit.recognize_text_from_file(image_path)
                if raw_text is not None:
                    cleaned = self.processor.clean_text(raw_text)
                    return {
                        "success": True,
                        "text": cleaned,
                        "engine": "Google ML Kit",
                        "error": None
                    }
            except Exception as e:
                print(f"ML Kit failure, attempting fallback: {e}")

        # Step 2: Try desktop/local Tesseract if installed
        if self.has_tesseract:
            try:
                import pytesseract
                from PIL import Image
                with Image.open(image_path) as img:
                    # Try multilingual eng+ben or fallback to eng
                    try:
                        raw_text = pytesseract.image_to_string(img, lang=lang)
                    except Exception:
                        raw_text = pytesseract.image_to_string(img, lang="eng")
                    
                    cleaned = self.processor.clean_text(raw_text)
                    return {
                        "success": True,
                        "text": cleaned,
                        "engine": "Tesseract OCR",
                        "error": None
                    }
            except Exception as e:
                print(f"Tesseract OCR failure: {e}")

        # Step 3: Graceful fallback message (Zero crash)
        return {
            "success": False,
            "text": "",
            "engine": "fallback",
            "error": "OCR engine not available in this environment. Text recognition requires ML Kit on Android device or Tesseract."
        }
