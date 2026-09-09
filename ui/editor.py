"""
Image Editor & Enhancement Screen
Applies document filters (Magic Color, B&W, Sharpen, etc.), brightness/contrast adjustments,
triggers OCR, and persists enhanced pages to SQLite and storage.
"""
import cv2
import numpy as np
from kivymd.uix.screen import MDScreen
from kivymd.uix.boxlayout import MDBoxLayout
from kivymd.uix.button import MDIconButton, MDRaisedButton, MDFlatButton
from kivymd.uix.label import MDLabel
from kivymd.uix.scrollview import MDScrollView
from kivymd.uix.dialog import MDDialog
from kivy.uix.image import Image
from kivy.graphics.texture import Texture

from image_processing.filters import FilterEngine
from image_processing.enhance import adjust_brightness_contrast
from ocr.engine import OCREngine


class FilterButton(MDFlatButton):
    """Button representing a filter preset."""
    def __init__(self, filter_name: str, on_select, **kwargs):
        super().__init__(text=filter_name, **kwargs)
        self.filter_name = filter_name
        self.bind(on_release=lambda x: on_select(self.filter_name))


class EditorScreen(MDScreen):
    """Page editor with live enhancement presets and OCR tools."""

    def __init__(self, db_manager, storage_manager, **kwargs):
        super().__init__(**kwargs)
        self.db = db_manager
        self.storage = storage_manager
        self.ocr_engine = OCREngine()

        self.raw_image = None
        self.base_warped = None
        self.current_enhanced = None
        self.corners = None
        self.active_filter = "Magic"
        self.brightness = 0
        self.contrast = 0

        self.current_doc_id = None
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
        back_btn = MDIconButton(icon="arrow-left", on_release=lambda x: self.go_back())
        title = MDLabel(text="Enhance Page", halign="center", font_style="Subtitle1")
        ocr_btn = MDIconButton(icon="text-recognition", on_release=lambda x: self.trigger_ocr())
        save_btn = MDRaisedButton(text="Save", md_bg_color=(0.1, 0.6, 0.3, 1), on_release=lambda x: self.save_page())

        top_bar.add_widget(back_btn)
        top_bar.add_widget(title)
        top_bar.add_widget(ocr_btn)
        top_bar.add_widget(save_btn)
        root.add_widget(top_bar)

        # Image Viewer
        self.image_view = Image(allow_stretch=True, keep_ratio=True)
        root.add_widget(self.image_view)

        # Bottom Filter Carousel
        filter_scroll = MDScrollView(size_hint_y=None, height="64dp")
        filter_bar = MDBoxLayout(
            orientation="horizontal",
            adaptive_width=True,
            padding=["12dp", "8dp", "12dp", "8dp"],
            spacing="8dp"
        )

        filter_names = [
            "Magic", "Original", "Auto", "HD", "Black & White",
            "Grayscale", "Color", "Sharpen", "Clean", "Low Light"
        ]
        for name in filter_names:
            btn = FilterButton(filter_name=name, on_select=self.set_filter)
            filter_bar.add_widget(btn)

        filter_scroll.add_widget(filter_bar)
        root.add_widget(filter_scroll)

        self.add_widget(root)

    def load_warped_image(self, raw_image: np.ndarray, warped_image: np.ndarray, corners: list, doc_id: int = None):
        """Receives rectified quad image and applies initial Magic Color filter."""
        self.raw_image = raw_image
        self.base_warped = warped_image
        self.corners = corners
        self.current_doc_id = doc_id
        self.active_filter = "Magic"
        self.apply_current_pipeline()

    def set_filter(self, filter_name: str):
        """Switch active document filter preset."""
        self.active_filter = filter_name
        self.apply_current_pipeline()

    def apply_current_pipeline(self):
        """Runs active filter and brightness/contrast adjustments."""
        if self.base_warped is None:
            return

        filtered = FilterEngine.apply_filter(self.base_warped, self.active_filter)
        self.current_enhanced = adjust_brightness_contrast(filtered, self.brightness, self.contrast)
        self.render_image(self.current_enhanced)

    def render_image(self, img: np.ndarray):
        """Displays image array on Kivy Image texture."""
        buf = cv2.flip(img, 0).tobytes()
        texture = Texture.create(size=(img.shape[1], img.shape[0]), colorfmt='bgr')
        texture.blit_buffer(buf, colorfmt='bgr', bufferfmt='ubyte')
        self.image_view.texture = texture

    def save_page(self):
        """Saves page to disk, registers in database, and redirects to documents screen."""
        if self.current_enhanced is None:
            return

        doc_name = f"Scan_{int(cv2.getTickCount())}"
        # If continuing an existing document or creating a new document entry
        if self.current_doc_id is None:
            self.current_doc_id = self.db.create_document(name=doc_name)

        doc = self.db.get_document(self.current_doc_id)
        pages = self.db.get_document_pages(self.current_doc_id)
        page_num = len(pages) + 1

        raw_path, enh_path, thumb_path = self.storage.generate_image_paths(doc["name"], page_num)

        # Save raw and enhanced files (never overwrite original)
        cv2.imwrite(raw_path, self.raw_image)
        cv2.imwrite(enh_path, self.current_enhanced)
        self.storage.save_thumbnail(enh_path, thumb_path)

        self.db.add_page(
            document_id=self.current_doc_id,
            page_number=page_num,
            raw_image_path=raw_path,
            enhanced_image_path=enh_path,
            filter_applied=self.active_filter,
            corners=self.corners
        )

        # Update thumbnail on document root
        if page_num == 1:
            self.db.update_document(self.current_doc_id, thumbnail_path=thumb_path, file_path=enh_path)

        if self.manager:
            doc_screen = self.manager.get_screen("documents")
            doc_screen.load_document(self.current_doc_id)
            self.manager.current = "documents"

    def trigger_ocr(self):
        """Executes OCR recognition and shows recognized text dialog."""
        if self.current_enhanced is None:
            return

        # Save temporary frame to check
        temp_path = "/tmp/temp_ocr.jpg"
        cv2.imwrite(temp_path, self.current_enhanced)
        result = self.ocr_engine.recognize_document_page(temp_path)

        text_to_show = result.get("text", "") or result.get("error", "No text detected.")
        dialog = MDDialog(
            title=f"OCR ({result.get('engine', 'Engine')})",
            text=text_to_show,
            buttons=[MDFlatButton(text="CLOSE", on_release=lambda x: dialog.dismiss())]
        )
        dialog.open()

    def go_back(self):
        if self.manager:
            self.manager.current = "preview"
