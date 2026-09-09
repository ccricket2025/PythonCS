"""
Perspective Correction and 4-Point Homography Transformation
Transforms arbitrary perspective quadrilateral documents into flattened, rectangular images.
"""
import cv2
import numpy as np
from typing import Tuple


def order_points(pts: np.ndarray) -> np.ndarray:
    """
    Orders 4 coordinate points into consistent order:
    [top-left, top-right, bottom-right, bottom-left]
    """
    rect = np.zeros((4, 2), dtype="float32")

    # The top-left point will have the smallest sum (x + y),
    # whereas the bottom-right point will have the largest sum
    s = pts.sum(axis=1)
    rect[0] = pts[np.argmin(s)]
    rect[2] = pts[np.argmax(s)]

    # Top-right point will have the smallest difference (y - x),
    # whereas bottom-left will have the largest difference
    diff = np.diff(pts, axis=1)
    rect[1] = pts[np.argmin(diff)]
    rect[3] = pts[np.argmax(diff)]

    return rect


def four_point_transform(image: np.ndarray, pts: np.ndarray) -> np.ndarray:
    """
    Applies perspective transformation to straighten the document quad.
    """
    rect = order_points(pts)
    (tl, tr, br, bl) = rect

    # Compute width of new image (maximum distance between horizontal corners)
    width_a = np.sqrt(((br[0] - bl[0]) ** 2) + ((br[1] - bl[1]) ** 2))
    width_b = np.sqrt(((tr[0] - tl[0]) ** 2) + ((tr[1] - tl[1]) ** 2))
    max_width = max(int(width_a), int(width_b))

    # Compute height of new image (maximum distance between vertical corners)
    height_a = np.sqrt(((tr[0] - br[0]) ** 2) + ((tr[1] - br[1]) ** 2))
    height_b = np.sqrt(((tl[0] - bl[0]) ** 2) + ((tl[1] - bl[1]) ** 2))
    max_height = max(int(height_a), int(height_b))

    # Safety limits to avoid massive allocation on edge case invalid inputs
    max_width = max(100, min(max_width, 4000))
    max_height = max(100, min(max_height, 4000))

    dst = np.array([
        [0, 0],
        [max_width - 1, 0],
        [max_width - 1, max_height - 1],
        [0, max_height - 1]
    ], dtype="float32")

    # Compute perspective transform matrix & warp
    matrix = cv2.getPerspectiveTransform(rect, dst)
    warped = cv2.warpPerspective(image, matrix, (max_width, max_height), flags=cv2.INTER_LANCZOS4)
    return warped


def adjust_to_aspect_ratio(image: np.ndarray, target_ratio: float = 1.414) -> np.ndarray:
    """
    Optional adjustment for standard document ratios:
    - A4: ~1.414 (height/width)
    - US Letter: 1.294
    - ID Card: 0.63 or 1.58
    """
    h, w = image.shape[:2]
    current_ratio = h / float(w)
    # If within 5% of target ratio, snap cleanly
    if abs(current_ratio - target_ratio) / target_ratio < 0.08:
        new_height = int(w * target_ratio)
        return cv2.resize(image, (w, new_height), interpolation=cv2.INTER_CUBIC)
    return image
