"""
Camera Scanner Screen with Real-Time OpenCV Document Overlay
Renders live camera frames, auto-detects 4 corners, draws boundary overlay,
and manages auto-capture countdown.
"""
import cv2
import numpy as np
from kivymd.uix.screen import MDScreen
from kivymd.uix.boxlayout import MDBoxLayout
from kivymd.uix.button import MDIconButton, MDFloatingActionButton
from kivymd.uix.label import MDLabel
from kivy.uix.image import Image
from kivy.graphics.texture import Texture
from kivy.graphics import Color, Line, Ellipse
from kivy.clock import Clock

from scanner.camera import ThreadedCamera
from scanner.document_detector import DocumentDetector
from scanner.auto_capture import AutoCaptureController
from scanner.quality import QualityChecker
from scanner.perspective import order_points


class ScannerScreen(MDScreen):
    """Viewfinder screen with live computer vision document detection overlay."""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.camera = ThreadedCamera()
        self.detector = DocumentDetector()
        self.auto_capture = AutoCaptureController()
        self.quality = QualityChecker()

        self.is_auto_capture_enabled = True
        self.detected_corners = None
        self.current_frame = None
        self.scan_mode = "single"  # single, batch, id_card

        self._build_ui()

    def _build_ui(self):
        root = MDBoxLayout(orientation="vertical")

        # Top Controls (Back, Flash, Auto/Manual toggle)
        top_bar = MDBoxLayout(
            orientation="horizontal",
            adaptive_height=True,
            padding=["16dp", "8dp", "16dp", "8dp"],
            spacing="16dp"
        )
        back_btn = MDIconButton(icon="arrow-left", on_release=lambda x: self.go_back())
        self.title_label = MDLabel(text="Auto Scan", halign="center", font_style="Subtitle1")
        self.flash_btn = MDIconButton(icon="flash-off", on_release=self.toggle_flash)
        self.auto_btn = MDIconButton(icon="magic-staff", on_release=self.toggle_auto_capture)

        top_bar.add_widget(back_btn)
        top_bar.add_widget(self.title_label)
        top_bar.add_widget(self.flash_btn)
        top_bar.add_widget(self.auto_btn)
        root.add_widget(top_bar)

        # Video Frame Container
        self.frame_display = Image(allow_stretch=True, keep_ratio=True)
        root.add_widget(self.frame_display)

        # Status text overlay (e.g. "Hold steady", "Too dark", "Document detected")
        self.status_label = MDLabel(
            text="Align document within camera frame",
            halign="center",
            adaptive_height=True,
            theme_text_color="Hint",
            padding=["0dp", "8dp"]
        )
        root.add_widget(self.status_label)

        # Bottom Shutter / Capture Bar
        bottom_bar = MDBoxLayout(
            orientation="horizontal",
            adaptive_height=True,
            padding=["32dp", "16dp", "32dp", "24dp"],
            spacing="32dp"
        )
        gallery_btn = MDIconButton(icon="image", user_font_size="32sp", on_release=lambda x: self.pick_gallery())
        self.shutter_btn = MDFloatingActionButton(
            icon="camera",
            elevation_normal=8,
            on_release=lambda x: self.trigger_manual_capture()
        )
        mode_btn = MDIconButton(icon="file-document-multiple", user_font_size="32sp", on_release=self.cycle_mode)

        bottom_bar.add_widget(gallery_btn)
        bottom_bar.add_widget(self.shutter_btn)
        bottom_bar.add_widget(mode_btn)
        root.add_widget(bottom_bar)

        self.add_widget(root)

    def on_enter(self):
        """Starts camera thread and registers UI update clock."""
        self.camera.start()
        self.auto_capture.reset()
        Clock.schedule_interval(self.process_frame, 1.0 / 30.0)

    def on_leave(self):
        """Stops camera on navigation away."""
        Clock.unschedule(self.process_frame)
        self.camera.stop()

    def setup_mode(self, mode: str):
        self.scan_mode = mode
        self.title_label.text = f"{mode.replace('_', ' ').title()} Scan"

    def toggle_flash(self, instance):
        # Flash toggle handler for Android CameraX bridge
        if instance.icon == "flash-off":
            instance.icon = "flash"
        else:
            instance.icon = "flash-off"

    def toggle_auto_capture(self, instance):
        self.is_auto_capture_enabled = not self.is_auto_capture_enabled
        instance.icon = "magic-staff" if self.is_auto_capture_enabled else "hand-back-right"
        self.status_label.text = "Auto-Capture ON" if self.is_auto_capture_enabled else "Manual Capture Mode"

    def cycle_mode(self, instance):
        modes = ["single", "batch", "id_card"]
        next_idx = (modes.index(self.scan_mode) + 1) % len(modes)
        self.setup_mode(modes[next_idx])

    def process_frame(self, dt):
        """Main CV loop running on UI thread for frame drawing."""
        frame = self.camera.read()
        if frame is None:
            return

        self.current_frame = frame
        eval_result = self.quality.evaluate_frame(frame)
        corners = self.detector.detect(frame)
        self.detected_corners = corners

        # Draw overlay lines onto the frame preview
        display_frame = frame.copy()
        if corners is not None:
            ordered = order_points(corners).astype(int)
            # Draw polygon perimeter in bright green
            cv2.polylines(display_frame, [ordered], isClosed=True, color=(0, 255, 120), thickness=3)
            # Draw corner anchor circles
            for pt in ordered:
                cv2.circle(display_frame, tuple(pt), 8, (0, 200, 255), -1)

            self.status_label.text = "Document Detected ✓"
        else:
            self.status_label.text = eval_result.get("message", "Looking for document...")

        # Auto-capture logic
        if self.is_auto_capture_enabled and corners is not None:
            should_capture, progress = self.auto_capture.update(corners, eval_result["is_sharp"])
            if should_capture:
                self.trigger_manual_capture()
                return

        # Render OpenCV BGR to Kivy Texture
        buf = cv2.flip(display_frame, 0).tobytes()
        texture = Texture.create(size=(frame.shape[1], frame.shape[0]), colorfmt='bgr')
        texture.blit_buffer(buf, colorfmt='bgr', bufferfmt='ubyte')
        self.frame_display.texture = texture

    def trigger_manual_capture(self):
        """Captures high-resolution frame and transitions to manual crop / perspective screen."""
        if self.current_frame is None:
            return

        captured_image = self.current_frame.copy()
        corners = self.detected_corners

        if self.manager:
            preview_screen = self.manager.get_screen("preview")
            preview_screen.load_captured_image(captured_image, corners)
            self.manager.current = "preview"

    def pick_gallery(self):
        pass

    def go_back(self):
        if self.manager:
            self.manager.current = "home"
