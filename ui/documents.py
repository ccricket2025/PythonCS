"""
Multi-Page Document View & Export Screen
Manages document pages, reordering, adding pages, PDF generation, and export sharing.
"""
import os
from kivymd.uix.screen import MDScreen
from kivymd.uix.boxlayout import MDBoxLayout
from kivymd.uix.toolbar import MDTopAppBar
from kivymd.uix.button import MDRaisedButton, MDIconButton, MDFlatButton
from kivymd.uix.scrollview import MDScrollView
from kivymd.uix.gridlayout import MDGridLayout
from kivymd.uix.card import MDCard
from kivymd.uix.label import MDLabel
from kivymd.uix.dialog import MDDialog
from kivy.uix.image import Image

from pdf.exporter import DocumentExporter


class PageCard(MDCard):
    """Card displaying a single page thumbnail and its page number."""

    def __init__(self, page_data: dict, on_delete_callback, **kwargs):
        super().__init__(
            orientation="vertical",
            size_hint=(None, None),
            size=("140dp", "200dp"),
            elevation=2,
            padding="8dp",
            spacing="4dp",
            **kwargs
        )
        self.page_data = page_data
        page_num = page_data.get("page_number", 1)
        img_path = page_data.get("enhanced_image_path", "")

        # Thumbnail image
        if os.path.exists(img_path):
            thumb = Image(source=img_path, allow_stretch=True, keep_ratio=True)
            self.add_widget(thumb)

        # Bottom label & delete
        footer = MDBoxLayout(orientation="horizontal", adaptive_height=True)
        lbl = MDLabel(text=f"Page {page_num}", font_style="Caption", halign="left")
        del_btn = MDIconButton(
            icon="delete-outline",
            user_font_size="16sp",
            on_release=lambda x: on_delete_callback(page_data)
        )
        footer.add_widget(lbl)
        footer.add_widget(del_btn)
        self.add_widget(footer)


class DocumentsScreen(MDScreen):
    """Detailed multi-page document organizer and PDF exporter."""

    def __init__(self, db_manager, storage_manager, **kwargs):
        super().__init__(**kwargs)
        self.db = db_manager
        self.storage = storage_manager
        self.current_doc_id = None
        self.current_doc = None
        self.pages = []
        self._build_ui()

    def _build_ui(self):
        root = MDBoxLayout(orientation="vertical")

        # Top Bar
        self.top_bar = MDTopAppBar(
            title="Document Details",
            elevation=4,
            left_action_items=[["arrow-left", lambda x: self.go_back()]],
            right_action_items=[
                ["share-variant", lambda x: self.share_document()],
                ["file-pdf-box", lambda x: self.export_pdf()],
                ["dots-vertical", lambda x: self.show_options()]
            ]
        )
        root.add_widget(self.top_bar)

        # Page Grid Container
        scroll = MDScrollView()
        self.grid = MDGridLayout(
            cols=2,
            adaptive_height=True,
            padding=["16dp", "16dp", "16dp", "16dp"],
            spacing="16dp"
        )
        scroll.add_widget(self.grid)
        root.add_widget(scroll)

        # Bottom Action Bar: Add Page & Export
        bottom_bar = MDBoxLayout(
            orientation="horizontal",
            adaptive_height=True,
            padding=["16dp", "8dp", "16dp", "12dp"],
            spacing="16dp"
        )
        add_page_btn = MDRaisedButton(
            text="+ Add Page",
            icon="camera-plus",
            on_release=lambda x: self.add_page_scan()
        )
        export_btn = MDRaisedButton(
            text="Export PDF",
            icon="file-export",
            md_bg_color=(0.1, 0.6, 0.3, 1),
            on_release=lambda x: self.export_pdf()
        )

        bottom_bar.add_widget(add_page_btn)
        bottom_bar.add_widget(export_btn)
        root.add_widget(bottom_bar)

        self.add_widget(root)

    def load_document(self, doc_id: int):
        """Loads document and its page collection from SQLite."""
        self.current_doc_id = doc_id
        self.current_doc = self.db.get_document(doc_id)
        if self.current_doc:
            self.top_bar.title = self.current_doc.get("name", "Document")
        self.refresh_pages()

    def refresh_pages(self):
        """Re-render page cards in grid."""
        self.grid.clear_widgets()
        if not self.current_doc_id:
            return

        self.pages = self.db.get_document_pages(self.current_doc_id)
        for page in self.pages:
            card = PageCard(page, on_delete_callback=self.delete_page)
            self.grid.add_widget(card)

    def add_page_scan(self):
        """Launch scanner attached to current document ID."""
        if self.manager:
            scanner_screen = self.manager.get_screen("scanner")
            scanner_screen.setup_mode("single")
            # Link current doc ID in editor for continuation
            editor = self.manager.get_screen("editor")
            editor.current_doc_id = self.current_doc_id
            self.manager.current = "scanner"

    def delete_page(self, page_data: dict):
        """Removes page from storage and updates database."""
        page_id = page_data.get("id")
        self.storage.delete_file(page_data.get("enhanced_image_path", ""))
        self.storage.delete_file(page_data.get("raw_image_path", ""))

        with self.db._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM document_pages WHERE id = ?", (page_id,))
            conn.commit()

        self.refresh_pages()

    def export_pdf(self):
        """Generates multi-page PDF document."""
        if not self.pages:
            return

        page_paths = [p["enhanced_image_path"] for p in self.pages if os.path.exists(p["enhanced_image_path"])]
        if not page_paths:
            return

        doc_name = self.current_doc.get("name", "Scan") if self.current_doc else "Scan"
        pdf_path = self.storage.get_pdf_export_path(doc_name)

        success = DocumentExporter.export_to_pdf(page_paths, pdf_path, title=doc_name)
        if success:
            dialog = MDDialog(
                title="PDF Created Successfully",
                text=f"Saved to:\n{pdf_path}",
                buttons=[
                    MDFlatButton(text="SHARE", on_release=lambda x: self.share_file(pdf_path, dialog)),
                    MDFlatButton(text="OK", on_release=lambda x: dialog.dismiss())
                ]
            )
            dialog.open()

    def share_document(self):
        self.export_pdf()

    def share_file(self, file_path: str, dialog):
        dialog.dismiss()
        DocumentExporter.share_file_android(file_path, "application/pdf")

    def show_options(self):
        pass

    def go_back(self):
        if self.manager:
            self.manager.current = "home"
