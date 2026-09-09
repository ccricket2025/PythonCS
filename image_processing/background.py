"""
Background Whitening and Illumination Uniformity
Whitens aged paper, eliminates yellow tones, and cleans up document margins.
"""
import cv2
import numpy as np


def whiten_paper_background(image: np.ndarray, cutoff_percentile: float = 85.0) -> np.ndarray:
    """
    Identifies dominant paper background color and smoothly stretches it to pure white (255).
    Keeps ink, diagrams, and colored stamps vibrant.
    """
    if len(image.shape) == 3:
        hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        v_channel = hsv[:, :, 2]
        high_val = np.percentile(v_channel, cutoff_percentile)
        
        # Scale value channel
        scale = 255.0 / max(high_val, 120.0)
        hsv[:, :, 2] = np.clip(hsv[:, :, 2] * scale, 0, 255).astype(np.uint8)

        # Desaturate near-white paper regions
        mask = hsv[:, :, 2] > 220
        hsv[:, :, 1][mask] = (hsv[:, :, 1][mask] * 0.4).astype(np.uint8)

        return cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)
    else:
        high_val = np.percentile(image, cutoff_percentile)
        scale = 255.0 / max(high_val, 120.0)
        return np.clip(image * scale, 0, 255).astype(np.uint8)
