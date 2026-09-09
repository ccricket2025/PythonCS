"""
Camera Interface and Threaded Frame Streamer
Decouples camera I/O and frame reading from the main Kivy UI loop.
Supports both standard OpenCV camera capture and Android CameraX bridge.
"""
import cv2
import threading
import time
from typing import Optional, Tuple
import numpy as np


class ThreadedCamera:
    """Provides non-blocking video frame retrieval in a dedicated daemon thread."""

    def __init__(self, src: int = 0, target_res: Tuple[int, int] = (1920, 1080)):
        self.src = src
        self.target_res = target_res
        self.cap: Optional[cv2.VideoCapture] = None
        self.frame: Optional[np.ndarray] = None
        self.is_running: bool = False
        self.lock = threading.Lock()
        self.thread: Optional[threading.Thread] = None

    def start(self) -> bool:
        """Initialize camera device and spawn background reader thread."""
        try:
            self.cap = cv2.VideoCapture(self.src)
            if not self.cap.isOpened():
                # Fallback to default index if custom index fails
                self.cap = cv2.VideoCapture(0)
            
            if not self.cap.isOpened():
                return False

            # Set desired capture resolution
            self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, self.target_res[0])
            self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, self.target_res[1])

            self.is_running = True
            self.thread = threading.Thread(target=self._capture_loop, daemon=True)
            self.thread.start()
            return True
        except Exception as e:
            print(f"Error starting camera: {e}")
            return False

    def _capture_loop(self):
        """Continually reads frames in background thread."""
        while self.is_running and self.cap and self.cap.isOpened():
            ret, frame = self.cap.read()
            if ret and frame is not None:
                with self.lock:
                    self.frame = frame
            else:
                time.sleep(0.01)

    def read(self) -> Optional[np.ndarray]:
        """Returns the most recent frame safely."""
        with self.lock:
            if self.frame is not None:
                return self.frame.copy()
            return None

    def stop(self):
        """Stops thread and releases camera hardware."""
        self.is_running = False
        if self.thread and self.thread.is_alive():
            self.thread.join(timeout=1.0)
        if self.cap:
            self.cap.release()
            self.cap = None
        self.frame = None
