"""
Manual Crop & Perspective Preview Screen
Allows the user to adjust the 4 boundary corner handles before warping.
"""
import cv2
import numpy as np
from kivymd.uix.screen import MDScreen
from kivymd.uix.boxlayout import MDBoxLayout
from kivymd.uix.button import MDIconButton, MDRaisedButton
from kivymd.uix.label import MDLabel
from kivy.uix.image import Image
from kivy.graphics.texture import Texture

from scanner.perspective import order_points, four_point_transform
from scanner.document_detector import DocumentDetector


class PreviewScreen(MDScreen):
    """Manual 4-corner adjustment and perspective rectification preview."""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.raw_image = None
        self.corners = None
        self.detector = DocumentDetector()
        self.rotation_angle = 0
        self._build_ui()

    def _build_ui(self):
        root = MDBoxLayout(orientation="vertical")

        # Top Bar
        top_bar = MDBoxLayout(
            orientation="horizontal",
            adaptive_height=True,
            padding=["16dp", "8dp", "16dp", "8dp"],
            spacing="16dp"
        )
        back_btn = MDIconButton(icon="arrow-left", on_release=lambda x: self.retake())
        title = MDLabel(text="Adjust Corners", halign="center", font_style="Subtitle1")
        rotate_btn = MDIconButton(icon="rotate-right", on_release=lambda x: self.rotate_image())
        reset_btn = MDIconButton(icon="refresh", on_release=lambda x: self.auto_detect_corners())

        top_bar.add_widget(back_btn)
        top_bar.add_widget(title)
        top_bar.add_widget(rotate_btn)
        top_bar.add_widget(reset_btn)
        root.add_widget(top_bar)

        # Image Canvas
        self.image_view = Image(allow_stretch=True, keep_ratio=True)
        root.add_widget(self.image_view)

        # Bottom Action Bar
        bottom_bar = MDBoxLayout(
            orientation="horizontal",
            adaptive_height=True,
            padding=["24dp", "12dp", "24dp", "16dp"],
            spacing="16dp"
        )
        retake_btn = MDRaisedButton(text="Retake", md_bg_color=(0.8, 0.2, 0.2, 1), on_release=lambda x: self.retake())
        next_btn = MDRaisedButton(text="Next (Warp)", md_bg_color=(0.1, 0.6, 0.3, 1), on_release=lambda x: self.apply_warp())

        bottom_bar.add_widget(retake_btn)
        bottom_bar.add_widget(next_btn)
        root.add_widget(bottom_bar)

        self.add_widget(root)

    def load_captured_image(self, image: np.ndarray, detected_corners: np.ndarray = None):
        """Loads captured frame and initializes crop corners."""
        self.raw_image = image
        self.rotation_angle = 0
        h, w = image.shape[:2]

        if detected_corners is not None:
            self.corners = order_points(detected_corners)
        else:
            # Default to 10% margin quadrilateral inset
            self.corners = np.array([
                [w * 0.1, h * 0.1],
                [w * 0.9, h * 0.1],
                [w * 0.9, h * 0.9],
                [w * 0.1, h * 0.9]
            ], dtype=np.float32)

        self.render_preview()

    def rotate_image(self):
        """Rotate raw image 90 degrees clockwise."""
        if self.raw_image is not None:
            self.raw_image = cv2.rotate(self.raw_image, cv2.ROTATE_90_CLOCKWISE)
            self.auto_detect_corners()

    def auto_detect_corners(self):
        """Re-runs document detector on current image."""
        if self.raw_image is not None:
            detected = self.detector.detect(self.raw_image)
            if detected is not None:
                self.corners = order_points(detected)
            else:
                h, w = self.raw_image.shape[:2]
                self.corners = np.array([
                    [w * 0.05, h * 0.05],
                    [w * 0.95, h * 0.05],
                    [w * 0.95, h * 0.95],
                    [w * 0.05, h * 0.95]
                ], dtype=np.float32)
            self.render_preview()

    def render_preview(self):
        """Draws current image with boundary polygon and corner points."""
        if self.raw_image is None:
            return

        display = self.raw_image.copy()
        if self.corners is not None:
            pts = self.corners.astype(int)
            cv2.polylines(display, [pts], isClosed=True, color=(0, 230, 100), thickness=4)
            for idx, pt in enumerate(pts):
                cv2.circle(display, tuple(pt), 14, (0, 150, 255), -1)
                cv2.circle(display, tuple(pt), 6, (255, 255, 255), -1)

        buf = cv2.flip(display, 0).tobytes()
        texture = Texture.create(size=(display.shape[1], display.shape[0]), colorfmt='bgr')
        texture.blit_buffer(buf, colorfmt='bgr', bufferfmt='ubyte')
        self.image_view.texture = texture

    def apply_warp(self):
        """Applies 4-point perspective warp and navigates to editor screen."""
        if self.raw_image is None or self.corners is None:
            return

        warped = four_point_transform(self.raw_image, self.corners)

        if self.manager:
            editor_screen = self.manager.get_screen("editor")
            editor_screen.load_warped_image(self.raw_image, warped, self.corners.tolist())
            self.manager.current = "editor"

    def retake(self):
        if self.manager:
            self.manager.current = "scanner"
