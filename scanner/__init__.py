"""
Document Scanning and Real-time CV Pipeline Package
"""
from .camera import ThreadedCamera
from .edge_detection import EdgeDetector
from .document_detector import DocumentDetector
from .perspective import order_points, four_point_transform, adjust_to_aspect_ratio
from .auto_capture import AutoCaptureController
from .quality import QualityChecker

__all__ = [
    "ThreadedCamera",
    "EdgeDetector",
    "DocumentDetector",
    "order_points",
    "four_point_transform",
    "adjust_to_aspect_ratio",
    "AutoCaptureController",
    "QualityChecker"
]
