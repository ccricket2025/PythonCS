"""
OCR Text Processing and Unicode Normalization (English & Bengali)
Cleans scanned text output, removes OCR scan artifacts, and enables fast full-text searching.
"""
import re
import unicodedata
from typing import List


class TextProcessor:
    """Utilities for cleaning and formatting OCR text results."""

    @staticmethod
    def clean_text(raw_text: str) -> str:
        """Removes extraneous symbols, stray OCR artifacts, and standardizes spacing."""
        if not raw_text:
            return ""

        # Normalize unicode (NFC) for proper Bengali conjunct characters
        normalized = unicodedata.normalize("NFC", raw_text)

        # Replace repeated blank lines
        lines = [line.strip() for line in normalized.splitlines()]
        cleaned_lines = []
        consecutive_empty = 0

        for line in lines:
            if not line:
                consecutive_empty += 1
                if consecutive_empty <= 1:
                    cleaned_lines.append("")
            else:
                consecutive_empty = 0
                cleaned_lines.append(line)

        return "\n".join(cleaned_lines).strip()

    @staticmethod
    def extract_keywords(text: str, min_len: int = 3) -> List[str]:
        """Extracts search tokens including Bengali script words."""
        # Match alphanumeric words in Latin and Bengali unicode ranges (\u0980-\u09FF)
        words = re.findall(r"[\w\u0980-\u09FF]{" + str(min_len) + r",}", text)
        return list(set(word.lower() for word in words))

    @staticmethod
    def format_for_export(text: str, document_title: str) -> str:
        """Formats recognized text into a clean exportable report."""
        divider = "=" * 40
        return f"{divider}\nDOCUMENT: {document_title}\n{divider}\n\n{text}\n"
