"""
CamScanner Python - Main Application Entry Point
Initializes KivyMD runtime, requests Android runtime permissions,
constructs the ScreenManager navigation graph, and injects core managers.
"""
import os
import sys
from kivy.core.window import Window
from kivy.utils import platform
from kivymd.app import MDApp
from kivymd.uix.screenmanager import MDScreenManager

from database.database import DatabaseManager
from storage.manager import StorageManager
from ui.home import HomeScreen
from ui.scanner import ScannerScreen
from ui.preview import PreviewScreen
from ui.editor import EditorScreen
from ui.documents import DocumentsScreen
from ui.settings import SettingsScreen


class CamScannerApp(MDApp):
    """Core application lifecycle controller."""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.db = None
        self.storage = None
        self.sm = None

    def build(self):
        """Constructs theme styles, database/storage controllers, and UI screens."""
        # Mobile portrait simulation for desktop development
        if platform not in ("android", "ios"):
            Window.size = (390, 800)

        # CamScanner-inspired emerald / teal color palette
        self.theme_cls.primary_palette = "Teal"
        self.theme_cls.accent_palette = "Amber"
        self.theme_cls.theme_style = "Light"

        # Request Android runtime permissions
        self.request_android_permissions()

        # Initialize persistence & storage
        self.storage = StorageManager()
        self.db = DatabaseManager(os.path.join(self.storage.base_dir, "camscanner.db"))

        # Screen Manager
        self.sm = MDScreenManager()
        self.sm.add_widget(HomeScreen(name="home", db_manager=self.db, storage_manager=self.storage))
        self.sm.add_widget(ScannerScreen(name="scanner"))
        self.sm.add_widget(PreviewScreen(name="preview"))
        self.sm.add_widget(EditorScreen(name="editor", db_manager=self.db, storage_manager=self.storage))
        self.sm.add_widget(DocumentsScreen(name="documents", db_manager=self.db, storage_manager=self.storage))
        self.sm.add_widget(SettingsScreen(name="settings"))

        self.sm.current = "home"
        return self.sm

    def request_android_permissions(self):
        """Requests CAMERA and storage access on modern Android (API 24 to 34+)."""
        if platform == "android":
            try:
                from android.permissions import request_permissions, Permission
                request_permissions([
                    Permission.CAMERA,
                    Permission.READ_EXTERNAL_STORAGE,
                    Permission.WRITE_EXTERNAL_STORAGE,
                    Permission.READ_MEDIA_IMAGES
                ])
            except Exception as err:
                print(f"Failed to trigger Android permission request: {err}")

    def on_pause(self):
        """Ensures app state is preserved when paused in Android background."""
        return True

    def on_resume(self):
        """Handles foreground restoration."""
        pass


if __name__ == "__main__":
    CamScannerApp().run()
