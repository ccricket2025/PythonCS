"""
Auto Capture Controller for Automatic Scanning
Monitors corner coordinates across consecutive frames. Triggers capture
when the document bounding box remains stable for a specified duration.
"""
import time
import numpy as np
from typing import Optional, Tuple
from .perspective import order_points


class AutoCaptureController:
    """Manages stability metrics and auto-trigger countdown."""

    def __init__(self, stability_frames_required: int = 6, max_point_drift_px: float = 12.0):
        self.stability_frames_required = stability_frames_required
        self.max_point_drift_px = max_point_drift_px

        self.last_corners: Optional[np.ndarray] = None
        self.stable_frame_count: int = 0
        self.is_capture_triggered: bool = False
        self.countdown_progress: float = 0.0

    def reset(self):
        """Reset capture state."""
        self.last_corners = None
        self.stable_frame_count = 0
        self.is_capture_triggered = False
        self.countdown_progress = 0.0

    def update(self, detected_corners: Optional[np.ndarray], is_sharp: bool) -> Tuple[bool, float]:
        """
        Feed new detected corners from current frame.
        Returns:
            should_capture (bool): True when countdown finishes and camera should fire.
            progress (float): 0.0 to 1.0 indicating stabilization progress for UI ring.
        """
        if detected_corners is None or not is_sharp:
            self.stable_frame_count = max(0, self.stable_frame_count - 1)
            self.countdown_progress = max(0.0, self.stable_frame_count / float(self.stability_frames_required))
            self.last_corners = None
            return False, self.countdown_progress

        ordered = order_points(detected_corners)

        if self.last_corners is None:
            self.last_corners = ordered
            self.stable_frame_count = 1
            self.countdown_progress = 1.0 / self.stability_frames_required
            return False, self.countdown_progress

        # Calculate maximum Euclidean distance drift across all 4 points
        drift = np.linalg.norm(ordered - self.last_corners, axis=1)
        max_drift = np.max(drift)

        if max_drift <= self.max_point_drift_px:
            self.stable_frame_count += 1
            # Exponentially smooth coordinate updates
            self.last_corners = self.last_corners * 0.7 + ordered * 0.3
        else:
            # Significant movement, reset stabilization counter
            self.stable_frame_count = 1
            self.last_corners = ordered

        self.countdown_progress = min(1.0, self.stable_frame_count / float(self.stability_frames_required))

        if self.stable_frame_count >= self.stability_frames_required and not self.is_capture_triggered:
            self.is_capture_triggered = True
            return True, 1.0

        return False, self.countdown_progress
