"""
Adaptive Thresholding and Document Binarization
Produces ultra-crisp Black & White scans for contracts, receipts, and book pages.
"""
import cv2
import numpy as np


def adaptive_threshold_bw(image: np.ndarray, block_size: int = 21, c_constant: int = 10) -> np.ndarray:
    """
    Adaptive Gaussian thresholding tailored for document binarization.
    Normalizes local page shadows and renders text pure black (#000000) on white paper (#FFFFFF).
    """
    if len(image.shape) == 3:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    else:
        gray = image

    # Light gaussian filter to eliminate salt-and-pepper noise
    smoothed = cv2.GaussianBlur(gray, (3, 3), 0)
    bw = cv2.adaptiveThreshold(
        smoothed, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY, block_size, c_constant
    )
    return cv2.cvtColor(bw, cv2.COLOR_GRAY2BGR)


def otsu_threshold_bw(image: np.ndarray) -> np.ndarray:
    """
    Otsu optimal threshold binarization for uniform lighting documents.
    """
    if len(image.shape) == 3:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    else:
        gray = image

    _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    return cv2.cvtColor(thresh, cv2.COLOR_GRAY2BGR)
