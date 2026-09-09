"""
PDF Document Generator using ReportLab
Assembles scanned pages into multi-page PDFs with A4, Letter, and original dimensions.
"""
import os
from typing import List, Optional, Tuple
from PIL import Image
from reportlab.lib.pagesizes import A4, letter
from reportlab.pdfgen import canvas


class PDFGenerator:
    """Generates standardized PDF documents from processed scanned image pages."""

    PAGE_SIZES = {
        "A4": A4,
        "Letter": letter
    }

    QUALITY_SCALES = {
        "Low": 0.5,
        "Medium": 0.75,
        "High": 0.9,
        "Original": 1.0
    }

    @staticmethod
    def generate_pdf(
        image_paths: List[str],
        output_pdf_path: str,
        title: str = "Scanned Document",
        page_size_name: str = "A4",
        quality: str = "High",
        include_page_numbers: bool = True
    ) -> bool:
        """
        Creates a PDF file from a sequence of images.
        """
        if not image_paths:
            return False

        valid_images = [p for p in image_paths if os.path.exists(p)]
        if not valid_images:
            return False

        # Ensure output directory exists
        os.makedirs(os.path.dirname(os.path.abspath(output_pdf_path)), exist_ok=True)

        target_size = PDFGenerator.PAGE_SIZES.get(page_size_name, A4)
        c = canvas.Canvas(output_pdf_path, pagesize=target_size)
        c.setTitle(title)
        c.setCreator("CamScanner Python")

        total_pages = len(valid_images)

        for page_idx, img_path in enumerate(valid_images, start=1):
            try:
                with Image.open(img_path) as img:
                    img_w, img_h = img.size
                    
                    if page_size_name == "Original":
                        # Fit canvas page size to image dimensions directly (in 72 DPI points)
                        pt_w = img_w * 72.0 / 150.0
                        pt_h = img_h * 72.0 / 150.0
                        c.setPageSize((pt_w, pt_h))
                        page_w, page_h = pt_w, pt_h
                    else:
                        page_w, page_h = target_size
                        c.setPageSize(target_size)

                    # Compute aspect-preserving scale to fit within page with margins
                    margin = 20.0 if page_size_name != "Original" else 0.0
                    avail_w = page_w - (2 * margin)
                    avail_h = page_h - (2 * margin)

                    scale = min(avail_w / img_w, avail_h / img_h)
                    draw_w = img_w * scale
                    draw_h = img_h * scale

                    # Center image on page
                    x = (page_w - draw_w) / 2.0
                    y = (page_h - draw_h) / 2.0

                    c.drawImage(img_path, x, y, width=draw_w, height=draw_h, preserveAspectRatio=True)

                    if include_page_numbers and page_size_name != "Original":
                        c.setFont("Helvetica", 9)
                        c.setFillColorRGB(0.4, 0.4, 0.4)
                        c.drawRightString(page_w - margin, 10, f"{page_idx} / {total_pages}")

                    c.showPage()
            except Exception as e:
                print(f"Error drawing page {img_path} to PDF: {e}")

        c.save()
        return os.path.exists(output_pdf_path)
