"""
Document Exporter and Android File Sharing
Handles PDF creation, single/multi-page image exports (JPG, PNG), and triggers system share intents.
"""
import os
import shutil
from typing import List, Optional
from PIL import Image
from .generator import PDFGenerator


class DocumentExporter:
    """Exports documents to external formats and provides Android share sheet triggers."""

    @staticmethod
    def export_to_pdf(
        page_image_paths: List[str],
        output_file_path: str,
        title: str = "Document",
        page_size: str = "A4",
        quality: str = "High"
    ) -> bool:
        """Export pages as a combined PDF document."""
        return PDFGenerator.generate_pdf(
            image_paths=page_image_paths,
            output_pdf_path=output_file_path,
            title=title,
            page_size_name=page_size,
            quality=quality
        )

    @staticmethod
    def export_to_images(
        page_image_paths: List[str],
        output_dir: str,
        fmt: str = "JPEG",
        quality: int = 90
    ) -> List[str]:
        """Export pages as standalone JPG or PNG image files."""
        os.makedirs(output_dir, exist_ok=True)
        exported_files = []

        ext = ".jpg" if fmt.upper() in ["JPG", "JPEG"] else ".png"

        for idx, src_path in enumerate(page_image_paths, start=1):
            if not os.path.exists(src_path):
                continue
            dest_filename = f"page_{idx}{ext}"
            dest_path = os.path.join(output_dir, dest_filename)

            try:
                with Image.open(src_path) as img:
                    if ext == ".jpg":
                        img.convert("RGB").save(dest_path, "JPEG", quality=quality)
                    else:
                        img.save(dest_path, "PNG")
                exported_files.append(dest_path)
            except Exception as e:
                print(f"Failed to export image page {idx}: {e}")

        return exported_files

    @staticmethod
    def share_file_android(file_path: str, mime_type: str = "application/pdf") -> bool:
        """
        Triggers native Android ACTION_SEND share sheet via PyJNIus FileProvider.
        """
        if not os.path.exists(file_path):
            return False

        try:
            from jnius import autoclass
            PythonActivity = autoclass('org.kivy.android.PythonActivity')
            Intent = autoclass('android.content.Intent')
            String = autoclass('java.lang.String')
            File = autoclass('java.io.File')
            FileProvider = autoclass('androidx.core.content.FileProvider')

            activity = PythonActivity.mActivity
            context = activity.getApplicationContext()

            file_obj = File(file_path)
            # Authority matches buildozer package name + fileprovider
            package_name = context.getPackageName()
            authority = f"{package_name}.fileprovider"

            uri = FileProvider.getUriForFile(context, authority, file_obj)

            intent = Intent(Intent.ACTION_SEND)
            intent.setType(String(mime_type))
            intent.putExtra(Intent.EXTRA_STREAM, uri)
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)

            chooser = Intent.createChooser(intent, String("Share Document via"))
            activity.startActivity(chooser)
            return True
        except Exception as e:
            print(f"Android share intent failed or non-Android environment: {e}")
            return False
