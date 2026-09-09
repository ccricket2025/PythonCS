"""
Image Sharpening and Detail Accentuation
"""
import cv2
import numpy as np


def unsharp_mask(image: np.ndarray, sigma: float = 1.0, strength: float = 1.5) -> np.ndarray:
    """
    Unsharp masking technique to crisply boost text boundaries without noise amplification.
    """
    blurred = cv2.GaussianBlur(image, (0, 0), sigma)
    sharpened = cv2.addWeighted(image, 1.0 + strength, blurred, -strength, 0)
    return np.clip(sharpened, 0, 255).astype(np.uint8)


def kernel_sharpen(image: np.ndarray) -> np.ndarray:
    """Standard 3x3 high-pass laplacian sharpening filter."""
    kernel = np.array([
        [0, -1, 0],
        [-1, 5, -1],
        [0, -1, 0]
    ], dtype=np.float32)
    return cv2.filter2D(image, -1, kernel)
