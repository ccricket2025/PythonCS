"""
SQLite Document Database Manager for CamScanner Python
Provides robust storage, schema migration, search, and document tracking.
"""
import sqlite3
import os
import json
from datetime import datetime
from typing import List, Dict, Optional, Any


class DatabaseManager:
    """Manages SQLite database for scanned documents and pages."""

    def __init__(self, db_path: str = "camscanner.db"):
        self.db_path = db_path
        self._init_db()

    def _get_connection(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_db(self):
        """Initialize SQLite database tables with appropriate indexes."""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS documents (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    page_count INTEGER DEFAULT 1,
                    file_path TEXT,
                    thumbnail_path TEXT,
                    ocr_text TEXT,
                    document_type TEXT DEFAULT 'General',
                    tags TEXT DEFAULT '[]',
                    is_favorite INTEGER DEFAULT 0
                )
            """)

            cursor.execute("""
                CREATE TABLE IF NOT EXISTS document_pages (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    document_id INTEGER NOT NULL,
                    page_number INTEGER NOT NULL,
                    raw_image_path TEXT NOT NULL,
                    enhanced_image_path TEXT NOT NULL,
                    filter_applied TEXT DEFAULT 'Magic',
                    corners_json TEXT,
                    ocr_text TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (document_id) REFERENCES documents (id) ON DELETE CASCADE
                )
            """)

            cursor.execute("CREATE INDEX IF NOT EXISTS idx_doc_name ON documents(name)")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_doc_updated ON documents(updated_at DESC)")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_page_doc_id ON document_pages(document_id)")
            conn.commit()

    def create_document(self, name: str, document_type: str = "General",
                        file_path: str = "", thumbnail_path: str = "",
                        ocr_text: str = "", tags: Optional[List[str]] = None) -> int:
        """Create a new document entry and return its ID."""
        tags_json = json.dumps(tags or [])
        now = datetime.now().isoformat()
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO documents (name, created_at, updated_at, page_count,
                                       file_path, thumbnail_path, ocr_text, document_type, tags)
                VALUES (?, ?, ?, 1, ?, ?, ?, ?, ?)
            """, (name, now, now, file_path, thumbnail_path, ocr_text, document_type, tags_json))
            conn.commit()
            return cursor.lastrowid

    def add_page(self, document_id: int, page_number: int,
                 raw_image_path: str, enhanced_image_path: str,
                 filter_applied: str = "Magic", corners: Optional[List[List[int]]] = None,
                 ocr_text: str = "") -> int:
        """Add a scanned page to a document and update page count."""
        corners_json = json.dumps(corners) if corners else ""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO document_pages (document_id, page_number, raw_image_path,
                                           enhanced_image_path, filter_applied, corners_json, ocr_text)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (document_id, page_number, raw_image_path, enhanced_image_path,
                  filter_applied, corners_json, ocr_text))

            # Update document page count and updated_at
            cursor.execute("""
                UPDATE documents 
                SET page_count = (SELECT COUNT(*) FROM document_pages WHERE document_id = ?),
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            """, (document_id, document_id))
            conn.commit()
            return cursor.lastrowid

    def get_document(self, document_id: int) -> Optional[Dict[str, Any]]:
        """Retrieve single document details."""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM documents WHERE id = ?", (document_id,))
            row = cursor.fetchone()
            if row:
                return dict(row)
            return None

    def get_document_pages(self, document_id: int) -> List[Dict[str, Any]]:
        """Retrieve all pages for a given document ordered by page_number."""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT * FROM document_pages 
                WHERE document_id = ? 
                ORDER BY page_number ASC
            """, (document_id,))
            return [dict(row) for row in cursor.fetchall()]

    def list_documents(self, query: str = "", document_type: str = "All",
                       limit: int = 50, offset: int = 0) -> List[Dict[str, Any]]:
        """Search and list documents with filtering."""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            sql = "SELECT * FROM documents WHERE 1=1"
            params: List[Any] = []

            if query:
                sql += " AND (name LIKE ? OR ocr_text LIKE ?)"
                like_str = f"%{query}%"
                params.extend([like_str, like_str])

            if document_type and document_type != "All":
                sql += " AND document_type = ?"
                params.append(document_type)

            sql += " ORDER BY updated_at DESC LIMIT ? OFFSET ?"
            params.extend([limit, offset])

            cursor.execute(sql, tuple(params))
            return [dict(row) for row in cursor.fetchall()]

    def update_document(self, document_id: int, **kwargs) -> bool:
        """Update fields of an existing document."""
        if not kwargs:
            return False
        fields = []
        params = []
        for key, value in kwargs.items():
            fields.append(f"{key} = ?")
            params.append(value)
        fields.append("updated_at = CURRENT_TIMESTAMP")
        params.append(document_id)

        sql = f"UPDATE documents SET {', '.join(fields)} WHERE id = ?"
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(sql, tuple(params))
            conn.commit()
            return cursor.rowcount > 0

    def delete_document(self, document_id: int) -> bool:
        """Delete document and all associated pages from database."""
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM document_pages WHERE document_id = ?", (document_id,))
            cursor.execute("DELETE FROM documents WHERE id = ?", (document_id,))
            conn.commit()
            return cursor.rowcount > 0
