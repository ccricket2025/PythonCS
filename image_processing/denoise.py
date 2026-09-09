"""
Denoising and Texture Smoothing
"""
import cv2
import numpy as np


def fast_denoise(image: np.ndarray, h: float = 7.0) -> np.ndarray:
    """
    Non-local means denoising for colored document scans.
    Removes camera sensor grain and paper texture artifacts.
    """
    if len(image.shape) == 3:
        return cv2.fastNlMeansDenoisingColored(image, None, h, h, 7, 21)
    return cv2.fastNlMeansDenoising(image, None, h, 7, 21)


def bilateral_smooth(image: np.ndarray, d: int = 7, sigma_color: float = 50.0, sigma_space: float = 50.0) -> np.ndarray:
    """
    Bilateral filter smoothing flat background regions while preserving crisp text edges.
    """
    return cv2.bilateralFilter(image, d, sigma_color, sigma_space)
