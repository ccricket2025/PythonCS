"""
Storage Manager for CamScanner Python
Handles file system paths, Android storage scopes, raw/enhanced images, and thumbnails.
"""
import os
import shutil
import time
from typing import Tuple, Optional
from PIL import Image


class StorageManager:
    """Handles persistent directory paths, image saving, and thumbnail generation."""

    def __init__(self, base_dir: Optional[str] = None):
        if base_dir is None:
            # Check for Android primary storage or use user home / local directory
            try:
                from jnius import autoclass
                PythonActivity = autoclass('org.kivy.android.PythonActivity')
                currentActivity = PythonActivity.mActivity
                context = currentActivity.getApplicationContext()
                files_dir = context.getExternalFilesDir(None).getAbsolutePath()
                self.base_dir = os.path.join(files_dir, "CamScanner")
            except Exception:
                self.base_dir = os.path.join(os.path.expanduser("~"), ".camscanner_data")
        else:
            self.base_dir = base_dir

        self.raw_dir = os.path.join(self.base_dir, "raw")
        self.enhanced_dir = os.path.join(self.base_dir, "enhanced")
        self.thumbs_dir = os.path.join(self.base_dir, "thumbnails")
        self.pdf_dir = os.path.join(self.base_dir, "exports")

        self._create_directories()

    def _create_directories(self):
        """Create necessary subdirectories if they do not exist."""
        for path in [self.base_dir, self.raw_dir, self.enhanced_dir, self.thumbs_dir, self.pdf_dir]:
            os.makedirs(path, exist_ok=True)

    def generate_image_paths(self, document_name: str, page_number: int) -> Tuple[str, str, str]:
        """Generate safe file paths for raw, enhanced, and thumbnail images."""
        timestamp = int(time.time() * 1000)
        clean_name = "".join(c for c in document_name if c.isalnum() or c in (' ', '_', '-')).rstrip()
        clean_name = clean_name.replace(" ", "_")
        prefix = f"{clean_name}_p{page_number}_{timestamp}"

        raw_path = os.path.join(self.raw_dir, f"{prefix}_raw.jpg")
        enhanced_path = os.path.join(self.enhanced_dir, f"{prefix}_enhanced.jpg")
        thumb_path = os.path.join(self.thumbs_dir, f"{prefix}_thumb.jpg")
        return raw_path, enhanced_path, thumb_path

    def save_thumbnail(self, source_image_path: str, thumb_path: str, size: Tuple[int, int] = (240, 320)) -> bool:
        """Create and save a thumbnail from an enhanced image."""
        try:
            with Image.open(source_image_path) as img:
                img.thumbnail(size, Image.Resampling.LANCZOS)
                img.save(thumb_path, "JPEG", quality=85)
            return True
        except Exception as err:
            print(f"Failed to generate thumbnail: {err}")
            return False

    def delete_file(self, file_path: str) -> bool:
        """Safely delete a file if it exists."""
        try:
            if file_path and os.path.exists(file_path):
                os.remove(file_path)
                return True
        except OSError as e:
            print(f"Error removing file {file_path}: {e}")
        return False

    def get_pdf_export_path(self, document_name: str) -> str:
        """Return a target path for exported PDF document."""
        clean_name = "".join(c for c in document_name if c.isalnum() or c in (' ', '_', '-')).rstrip()
        clean_name = clean_name.replace(" ", "_")
        timestamp = int(time.time())
        return os.path.join(self.pdf_dir, f"{clean_name}_{timestamp}.pdf")
