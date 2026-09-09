"""
Document Detector using OpenCV Contours & Geometric Validation
Finds the largest valid quadrilateral representing a page/document in a camera frame.
"""
import cv2
import numpy as np
from typing import Optional, List, Tuple
from .edge_detection import EdgeDetector


class DocumentDetector:
    """Detects 4-corner document boundaries with rigorous geometric criteria."""

    def __init__(self, min_area_ratio: float = 0.08, max_area_ratio: float = 0.98):
        self.min_area_ratio = min_area_ratio
        self.max_area_ratio = max_area_ratio
        self.edge_detector = EdgeDetector()

    def detect(self, image: np.ndarray) -> Optional[np.ndarray]:
        """
        Detects document in the input frame and returns 4 corners mapped back
        to the original image coordinate space as shape (4, 2) in float32.
        """
        orig_h, orig_w = image.shape[:2]
        total_orig_area = orig_h * orig_w

        # Resize for fast real-time processing
        target_w = 640
        scale = orig_w / float(target_w)
        target_h = int(orig_h / scale)
        resized = cv2.resize(image, (target_w, target_h), interpolation=cv2.INTER_AREA)

        edges = self.edge_detector.get_edges(resized)

        # Find external contours
        contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        if not contours:
            return None

        # Sort by contour area descending
        contours = sorted(contours, key=cv2.contourArea, reverse=True)[:5]
        frame_area = target_w * target_h

        for c in contours:
            area = cv2.contourArea(c)
            # Area must be between min and max ratio of frame
            if area < (frame_area * self.min_area_ratio) or area > (frame_area * self.max_area_ratio):
                continue

            peri = cv2.arcLength(c, True)
            # Approximate polygonal curve with tolerance
            approx = cv2.approxPolyDP(c, 0.02 * peri, True)

            if len(approx) == 4 and cv2.isContourConvex(approx):
                corners = approx.reshape(4, 2).astype(np.float32)

                # Validate interior angles (must be approximately 60-120 degrees)
                if self._validate_quadrilateral_angles(corners):
                    # Scale back to original resolution
                    scaled_corners = corners * scale
                    return scaled_corners

        # Fallback to adaptive edge detection if standard Canny didn't hit a convex quad
        adaptive_edges = self.edge_detector.get_adaptive_edges(resized)
        contours, _ = cv2.findContours(adaptive_edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        if contours:
            contours = sorted(contours, key=cv2.contourArea, reverse=True)[:3]
            for c in contours:
                area = cv2.contourArea(c)
                if area < (frame_area * self.min_area_ratio):
                    continue
                peri = cv2.arcLength(c, True)
                approx = cv2.approxPolyDP(c, 0.03 * peri, True)
                if len(approx) == 4 and cv2.isContourConvex(approx):
                    corners = approx.reshape(4, 2).astype(np.float32)
                    if self._validate_quadrilateral_angles(corners):
                        return corners * scale

        return None

    def _validate_quadrilateral_angles(self, pts: np.ndarray) -> bool:
        """Ensure all 4 internal angles are roughly perpendicular (between 50 and 130 deg)."""
        angles = []
        for i in range(4):
            p1 = pts[i]
            p2 = pts[(i + 1) % 4]
            p3 = pts[(i + 2) % 4]

            v1 = p1 - p2
            v2 = p3 - p2

            cosine_angle = np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2) + 1e-7)
            angle = np.degrees(np.arccos(np.clip(cosine_angle, -1.0, 1.0)))
            angles.append(angle)

        return all(50.0 <= a <= 130.0 for a in angles)
