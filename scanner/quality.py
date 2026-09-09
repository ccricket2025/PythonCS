"""
Frame Quality Assessment for Document Capture
Detects motion blur, out-of-focus camera conditions, and poor lighting.
"""
import cv2
import numpy as np
from typing import Tuple, Dict, Any


class QualityChecker:
    """Evaluates sharpness and illumination to prevent blurry or dark captures."""

    def __init__(self, blur_threshold: float = 85.0, min_brightness: float = 40.0, max_brightness: float = 245.0):
        self.blur_threshold = blur_threshold
        self.min_brightness = min_brightness
        self.max_brightness = max_brightness

    def get_blur_score(self, image: np.ndarray) -> float:
        """
        Calculates sharpness using the variance of the Laplacian operator.
        Higher values mean sharper details; lower values mean blurred.
        """
        if len(image.shape) == 3:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        else:
            gray = image
        return float(cv2.Laplacian(gray, cv2.CV_64F).var())

    def get_brightness_score(self, image: np.ndarray) -> float:
        """Calculates the average luminance of the frame."""
        if len(image.shape) == 3:
            hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
            return float(np.mean(hsv[:, :, 2]))
        return float(np.mean(image))

    def evaluate_frame(self, image: np.ndarray) -> Dict[str, Any]:
        """Runs full quality diagnostic."""
        blur_score = self.get_blur_score(image)
        brightness = self.get_brightness_score(image)

        is_sharp = blur_score >= self.blur_threshold
        is_lighting_ok = self.min_brightness <= brightness <= self.max_brightness

        status_message = "Ready"
        if not is_lighting_ok:
            status_message = "Too Dark - Turn on flash" if brightness < self.min_brightness else "Too Glared"
        elif not is_sharp:
            status_message = "Hold steady - refocusing"

        return {
            "blur_score": blur_score,
            "brightness": brightness,
            "is_sharp": is_sharp,
            "is_lighting_ok": is_lighting_ok,
            "is_acceptable": is_sharp and is_lighting_ok,
            "message": status_message
        }
