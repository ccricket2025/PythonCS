"""
Edge Detection & Image Preprocessing Pipeline for Document Scanning
Uses OpenCV for bilateral filtering, Gaussian blur, Canny edge detection, and morphological dilation.
"""
import cv2
import numpy as np


class EdgeDetector:
    """Prepares camera frames and extracts document boundary edges."""

    def __init__(self, canny_low: int = 50, canny_high: int = 150, blur_ksize: int = 5):
        self.canny_low = canny_low
        self.canny_high = canny_high
        self.blur_ksize = blur_ksize

    def preprocess_for_detection(self, image: np.ndarray, target_width: int = 640) -> tuple[np.ndarray, float]:
        """
        Resize image to a fixed detection width while preserving aspect ratio.
        Returns scaled image and scaling ratio.
        """
        h, w = image.shape[:2]
        ratio = h / float(target_width) if target_width > 0 else 1.0
        new_height = int(h / ratio) if ratio > 0 else h
        resized = cv2.resize(image, (target_width, new_height), interpolation=cv2.INTER_AREA)
        return resized, ratio

    def get_edges(self, frame: np.ndarray) -> np.ndarray:
        """
        Transforms color frame to clean binary edge map.
        Pipeline: Grayscale -> Bilateral Filter / Gaussian Blur -> Canny -> Dilate / Close
        """
        # Convert to grayscale
        if len(frame.shape) == 3:
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        else:
            gray = frame

        # Noise reduction while preserving edges
        blurred = cv2.GaussianBlur(gray, (self.blur_ksize, self.blur_ksize), 0)

        # Canny edge detector
        edges = cv2.Canny(blurred, self.canny_low, self.canny_high)

        # Morphological close to bridge tiny gaps in document boundaries
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
        dilated = cv2.dilate(edges, kernel, iterations=1)
        closed = cv2.morphologyEx(dilated, cv2.MORPH_CLOSE, kernel, iterations=1)

        return closed

    def get_adaptive_edges(self, frame: np.ndarray) -> np.ndarray:
        """Alternative edge detector for low-contrast documents against similar backgrounds."""
        if len(frame.shape) == 3:
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        else:
            gray = frame

        blurred = cv2.medianBlur(gray, 5)
        thresh = cv2.adaptiveThreshold(
            blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY_INV, 11, 2
        )
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
        return cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
