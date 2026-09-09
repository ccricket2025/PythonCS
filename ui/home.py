"""
Home Screen for CamScanner Python
Presents recent scanned documents, search interface, categories, and scanner entry buttons.
"""
from kivymd.uix.screen import MDScreen
from kivymd.uix.boxlayout import MDBoxLayout
from kivymd.uix.toolbar import MDTopAppBar
from kivymd.uix.textfield import MDTextField
from kivymd.uix.list import MDList, TwoLineAvatarIconListItem, IconLeftWidget, IconRightWidget
from kivymd.uix.scrollview import MDScrollView
from kivymd.uix.button import MDFloatingActionButtonSpeedDial, MDIconButton
from kivymd.uix.chip import MDChip
from kivy.clock import Clock
from kivy.properties import ObjectProperty


class DocumentListItem(TwoLineAvatarIconListItem):
    """List item displaying document thumbnail, title, date, and page count."""

    def __init__(self, doc_data: dict, on_tap_callback, **kwargs):
        super().__init__(**kwargs)
        self.doc_data = doc_data
        self.text = doc_data.get("name", "Untitled Scan")
        pages = doc_data.get("page_count", 1)
        created = doc_data.get("created_at", "")[:10]
        self.secondary_text = f"{pages} {'pages' if pages > 1 else 'page'} • {created}"

        # Left document icon
        icon = IconLeftWidget(icon="file-document-outline")
        self.add_widget(icon)

        # Right more-options button
        more_btn = IconRightWidget(icon="dots-vertical")
        self.add_widget(more_btn)

        self.bind(on_release=lambda x: on_tap_callback(self.doc_data))


class HomeScreen(MDScreen):
    """Main dashboard displaying documents library and scan triggers."""

    def __init__(self, db_manager, storage_manager, **kwargs):
        super().__init__(**kwargs)
        self.db = db_manager
        self.storage = storage_manager
        self._build_ui()

    def _build_ui(self):
        root_layout = MDBoxLayout(orientation="vertical")

        # Top App Bar
        self.toolbar = MDTopAppBar(
            title="CamScanner",
            elevation=4,
            anchor_title="left",
            right_action_items=[
                ["magnify", lambda x: self.toggle_search()],
                ["cog", lambda x: self.open_settings()]
            ]
        )
        root_layout.add_widget(self.toolbar)

        # Category Chips bar
        chip_bar = MDBoxLayout(
            orientation="horizontal",
            adaptive_height=True,
            padding=["16dp", "8dp", "16dp", "8dp"],
            spacing="8dp"
        )
        for cat in ["All", "Receipts", "ID Cards", "Contracts", "Notes"]:
            chip = MDChip(text=cat, check=True if cat == "All" else False)
            chip.bind(on_release=self.on_category_selected)
            chip_bar.add_widget(chip)
        root_layout.add_widget(chip_bar)

        # Scrollable Document List
        scroll = MDScrollView()
        self.doc_list = MDList()
        scroll.add_widget(self.doc_list)
        root_layout.add_widget(scroll)

        # Speed dial FAB for Quick Scan or Batch Scan
        data = {
            'Single Scan': 'camera',
            'Batch Scan': 'camera-burst',
            'ID Card Mode': 'card-account-details-outline',
            'Import Image': 'image-plus'
        }
        self.fab = MDFloatingActionButtonSpeedDial(
            data=data,
            root_button_anim=True,
            callback=self.on_speed_dial_action
        )
        self.add_widget(root_layout)
        self.add_widget(self.fab)

    def on_enter(self):
        """Reload documents on screen focus."""
        self.refresh_document_list()

    def refresh_document_list(self, query: str = ""):
        """Fetch records from SQLite and populate the MDList."""
        self.doc_list.clear_widgets()
        docs = self.db.list_documents(query=query)

        if not docs:
            # Empty state
            item = TwoLineAvatarIconListItem(
                text="No documents scanned yet",
                secondary_text="Tap the camera button below to scan your first page"
            )
            item.add_widget(IconLeftWidget(icon="camera-document"))
            self.doc_list.add_widget(item)
            return

        for doc in docs:
            item = DocumentListItem(doc, on_tap_callback=self.open_document)
            self.doc_list.add_widget(item)

    def on_category_selected(self, instance_chip):
        """Filter document list based on category chip."""
        category = instance_chip.text
        docs = self.db.list_documents(document_type=category if category != "All" else "")
        self.doc_list.clear_widgets()
        for doc in docs:
            self.doc_list.add_widget(DocumentListItem(doc, on_tap_callback=self.open_document))

    def toggle_search(self):
        """Show or hide interactive search bar."""
        # Routed through application controller
        if hasattr(self.manager, 'search_active'):
            pass

    def open_document(self, doc_data: dict):
        """Navigate to multi-page document details screen."""
        if self.manager:
            doc_screen = self.manager.get_screen("documents")
            doc_screen.load_document(doc_data["id"])
            self.manager.current = "documents"

    def open_settings(self):
        if self.manager:
            self.manager.current = "settings"

    def on_speed_dial_action(self, instance):
        """Handles scan mode triggers."""
        icon = getattr(instance, 'icon', '')
        if icon == 'camera':
            self.start_scanner(mode="single")
        elif icon == 'camera-burst':
            self.start_scanner(mode="batch")
        elif icon == 'card-account-details-outline':
            self.start_scanner(mode="id_card")
        elif icon == 'image-plus':
            self.import_from_gallery()

    def start_scanner(self, mode: str = "single"):
        if self.manager:
            scanner_screen = self.manager.get_screen("scanner")
            scanner_screen.setup_mode(mode)
            self.manager.current = "scanner"

    def import_from_gallery(self):
        """Invokes Android/desktop image selection."""
        # Implemented via storage/manager
        pass
