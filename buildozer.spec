[app]

# (str) Title of your application
title = CamScanner Python

# (str) Package name
package.name = camscannerpython

# (str) Package domain (needed for android/ios packaging)
package.domain = org.scanner.camscanner

# (str) Source code where the main.py lives
source.dir = .

# (list) Source files to include (let empty to include all the files)
source.include_exts = py,png,jpg,jpeg,kv,atlas,json,txt,ttf,otf

# (list) List of inclusions using pattern matching
source.include_patterns = assets/*,ui/*,scanner/*,image_processing/*,ocr/*,pdf/*,database/*,storage/*

# (str) Application versioning (method 1)
version = 1.0.0

# (list) Application requirements
# Note: sqlite3 is built into Python 3; PyJNIus handles native Android bridge
requirements = python3,kivy,kivymd,pillow,numpy,opencv,pyjnius

# (str) Presplash of the application
#presplash.filename = %(source.dir)s/assets/presplash.png

# (str) Icon of the application
#icon.filename = %(source.dir)s/assets/icon.png

# (str) Supported orientation (one of landscape, sensorLandscape, portrait or all)
orientation = portrait

# (bool) Indicate if the application should be fullscreen
fullscreen = 0

# (list) Permissions required by the app
android.permissions = CAMERA,READ_EXTERNAL_STORAGE,WRITE_EXTERNAL_STORAGE,READ_MEDIA_IMAGES

# (int) Target Android API (API 34 = Android 14)
android.api = 34

# (int) Minimum API your APK / AAB will support (API 24 = Android 7.0)
android.minapi = 24

# (str) Android NDK version to use (25b is fully compatible with OpenCV and Python 3.10)
android.ndk = 25b

# (bool) Automatically accept Android SDK license agreements (eliminates broken pipe issues)
android.accept_sdk_license = True

# (bool) Skip update of SDK tools if already present
android.skip_update = False

# (bool) Use --private data storage (True) or --dir public storage (False)
android.private_storage = True

# (list) Android additional libraries to copy into libs
android.add_libs_armeabi_v7a =
android.add_libs_arm64_v8a =

# (list) Gradle dependencies for ML Kit OCR and CameraX
android.gradle_dependencies = com.google.mlkit:text-recognition:16.0.0,androidx.camera:camera-core:1.3.1,androidx.camera:camera-camera2:1.3.1,androidx.camera:camera-lifecycle:1.3.1,androidx.camera:camera-view:1.3.1

# (list) The Android archs to build for (64-bit target for Google Play Store and modern devices)
android.archs = arm64-v8a

# (bool) Enables Android auto backup feature (Android API >= 23)
android.allow_backup = True


[buildozer]

# (int) Log level (0 = error only, 1 = info, 2 = debug with command output)
log_level = 2

# (int) Display warning if buildozer is run as root (0 = False, 1 = True)
warn_on_root = 1
