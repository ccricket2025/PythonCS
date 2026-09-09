"""
Image Enhancement Engine: Brightness, Contrast, Gamma, and Shadow Removal
"""
import cv2
import numpy as np


def adjust_brightness_contrast(image: np.ndarray, brightness: int = 0, contrast: int = 0) -> np.ndarray:
    """
    Adjust brightness (-100 to 100) and contrast (-100 to 100) using linear transform.
    """
    if brightness == 0 and contrast == 0:
        return image

    brightness_offset = brightness * (255.0 / 100.0)
    # Map contrast [-100, 100] to factor [0, 3]
    if contrast > 0:
        factor = (100.0 + contrast * 2.0) / 100.0
    else:
        factor = (100.0 + contrast) / 100.0

    table = np.array([
        np.clip(factor * (i - 128) + 128 + brightness_offset, 0, 255)
        for i in range(256)
    ]).astype("uint8")

    return cv2.LUT(image, table)


def adjust_gamma(image: np.ndarray, gamma: float = 1.0) -> np.ndarray:
    """Non-linear luminance adjustment via power-law transform."""
    if gamma == 1.0:
        return image
    inv_gamma = 1.0 / max(0.1, gamma)
    table = np.array([((i / 255.0) ** inv_gamma) * 255 for i in range(256)]).astype("uint8")
    return cv2.LUT(image, table)


def remove_shadows(image: np.ndarray) -> np.ndarray:
    """
    Eliminates ambient shadows and lighting gradients across document paper
    by dividing color channels by their dilated morphological background.
    """
    planes = cv2.split(image)
    result_planes = []
    for plane in planes:
        dilated = cv2.dilate(plane, np.ones((7, 7), np.uint8))
        bg_blur = cv2.medianBlur(dilated, 21)
        diff = 255 - cv2.absdiff(plane, bg_blur)
        norm = cv2.normalize(diff, None, alpha=0, beta=255, norm_type=cv2.NORM_MINMAX, dtype=cv2.CV_8UC1)
        result_planes.append(norm)

    result = cv2.merge(result_planes)
    return result


def auto_white_balance(image: np.ndarray) -> np.ndarray:
    """Simple gray-world assumption white balancing."""
    result = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
    avg_a = np.average(result[:, :, 1])
    avg_b = np.average(result[:, :, 2])
    result[:, :, 1] = result[:, :, 1] - ((avg_a - 128) * (result[:, :, 0] / 255.0) * 1.1)
    result[:, :, 2] = result[:, :, 2] - ((avg_b - 128) * (result[:, :, 0] / 255.0) * 1.1)
    return cv2.cvtColor(result, cv2.COLOR_LAB2BGR)
