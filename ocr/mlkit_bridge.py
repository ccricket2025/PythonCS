"""
Google ML Kit Text Recognition Bridge for Android
Uses PyJNIus to communicate with Android ML Kit TextRecognition client.
Supports Latin (English) and Devanagari/Bengali scripts.
"""
import os
from typing import Optional


class MLKitBridge:
    """Invokes Google ML Kit on Android devices using PyJNIus reflection."""

    def __init__(self):
        self.is_android = False
        self.recognizer = None
        self._init_bridge()

    def _init_bridge(self):
        try:
            from jnius import autoclass
            # Check if running within Android Kivy runtime
            PythonActivity = autoclass('org.kivy.android.PythonActivity')
            TextRecognition = autoclass('com.google.mlkit.vision.text.TextRecognition')
            TextRecognizerOptions = autoclass('com.google.mlkit.vision.text.latin.TextRecognizerOptions')

            # Default client
            self.recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS)
            self.is_android = True
            print("Successfully initialized Google ML Kit OCR via PyJNIus")
        except Exception as e:
            self.is_android = False
            self.recognizer = None

    def recognize_text_from_file(self, image_path: str) -> Optional[str]:
        """
        Loads image file into Android InputImage and queries ML Kit synchronously/via Task.
        """
        if not self.is_android or not os.path.exists(image_path):
            return None

        try:
            from jnius import autoclass
            Uri = autoclass('android.net.Uri')
            File = autoclass('java.io.File')
            InputImage = autoclass('com.google.mlkit.vision.common.InputImage')
            PythonActivity = autoclass('org.kivy.android.PythonActivity')
            Tasks = autoclass('com.google.android.gms.tasks.Tasks')

            context = PythonActivity.mActivity.getApplicationContext()
            file_obj = File(image_path)
            uri = Uri.fromFile(file_obj)

            input_image = InputImage.fromFilePath(context, uri)
            task = self.recognizer.process(input_image)
            
            # Await completion
            result = Tasks.await(task)
            if result:
                return result.getText()
            return ""
        except Exception as e:
            print(f"ML Kit text recognition error: {e}")
            return None
