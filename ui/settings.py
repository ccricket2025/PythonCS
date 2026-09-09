"""
Application Settings & Scanner Configuration Screen
Configures camera resolution, OCR languages (English & Bengali),
auto-capture thresholds, and default PDF page standards.
"""
from kivymd.uix.screen import MDScreen
from kivymd.uix.boxlayout import MDBoxLayout
from kivymd.uix.toolbar import MDTopAppBar
from kivymd.uix.list import MDList, OneLineListItem, TwoLineListItem, OneLineAvatarIconListItem, IconRightWidget
from kivymd.uix.scrollview import MDScrollView
from kivymd.uix.selectioncontrol import MDSwitch


class SettingsScreen(MDScreen):
    """Preferences screen for scan sensitivity and output configurations."""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._build_ui()

    def _build_ui(self):
        root = MDBoxLayout(orientation="vertical")

        toolbar = MDTopAppBar(
            title="Settings",
            elevation=4,
            left_action_items=[["arrow-left", lambda x: self.go_back()]]
        )
        root.add_widget(toolbar)

        scroll = MDScrollView()
        list_container = MDList()

        # Section 1: Scanner & Capture
        list_container.add_widget(OneLineListItem(text="SCANNER PREFERENCES", theme_text_color="Primary"))

        auto_cap_item = TwoLineListItem(
            text="Auto Capture",
            secondary_text="Automatically snaps picture when document is steady"
        )
        list_container.add_widget(auto_cap_item)

        flash_item = TwoLineListItem(
            text="Camera Flash",
            secondary_text="Always assist with flashlight in dim lighting"
        )
        list_container.add_widget(flash_item)

        # Section 2: Image Quality & PDF
        list_container.add_widget(OneLineListItem(text="PDF & IMAGE EXPORT", theme_text_color="Primary"))

        pdf_size_item = TwoLineListItem(
            text="Default Page Size",
            secondary_text="A4 (210 x 297 mm)"
        )
        list_container.add_widget(pdf_size_item)

        pdf_qual_item = TwoLineListItem(
            text="PDF Quality",
            secondary_text="High (Print-ready sharpness)"
        )
        list_container.add_widget(pdf_qual_item)

        # Section 3: OCR Languages
        list_container.add_widget(OneLineListItem(text="OCR TEXT RECOGNITION", theme_text_color="Primary"))

        ocr_lang_item = TwoLineListItem(
            text="Recognition Script",
            secondary_text="English + Bengali (Google ML Kit)"
        )
        list_container.add_widget(ocr_lang_item)

        # Section 4: About
        list_container.add_widget(OneLineListItem(text="ABOUT", theme_text_color="Primary"))
        about_item = TwoLineListItem(
            text="CamScanner Python Edition",
            secondary_text="Version 1.0.0 (Buildozer APK)"
        )
        list_container.add_widget(about_item)

        scroll.add_widget(list_container)
        root.add_widget(scroll)

        self.add_widget(root)

    def go_back(self):
        if self.manager:
            self.manager.current = "home"
