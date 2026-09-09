"""
Comprehensive Filter Suite for CamScanner Python
Implements all 10 document enhancement presets:
Original, Auto, HD, Black & White, Grayscale, Color, Sharpen, Clean, Magic/Document, Low Light.
"""
import cv2
import numpy as np
from .enhance import adjust_brightness_contrast, adjust_gamma, remove_shadows, auto_white_balance
from .sharpen import unsharp_mask, kernel_sharpen
from .denoise import bilateral_smooth, fast_denoise
from .threshold import adaptive_threshold_bw
from .background import whiten_paper_background


class FilterEngine:
    """Applies high-grade document enhancement presets without destroying original image data."""

    @staticmethod
    def apply_filter(image: np.ndarray, filter_name: str = "Magic") -> np.ndarray:
        """Dispatcher for filter modes."""
        filters = {
            "Original": FilterEngine.filter_original,
            "Auto": FilterEngine.filter_auto,
            "HD": FilterEngine.filter_hd,
            "Black & White": FilterEngine.filter_black_and_white,
            "Grayscale": FilterEngine.filter_grayscale,
            "Color": FilterEngine.filter_color,
            "Sharpen": FilterEngine.filter_sharpen,
            "Clean": FilterEngine.filter_clean,
            "Magic": FilterEngine.filter_magic_color,
            "Document": FilterEngine.filter_magic_color,
            "Low Light": FilterEngine.filter_low_light
        }
        fn = filters.get(filter_name, FilterEngine.filter_magic_color)
        return fn(image.copy())

    @staticmethod
    def filter_original(image: np.ndarray) -> np.ndarray:
        """Direct unaltered copy."""
        return image.copy()

    @staticmethod
    def filter_magic_color(image: np.ndarray) -> np.ndarray:
        """
        Iconic CamScanner Magic/Document Color:
        Removes uneven page shadows, cleans paper background to white,
        enhances text edges and preserves colored stamps/signatures.
        """
        # Step 1: Shadow removal
        no_shadows = remove_shadows(image)
        # Step 2: Paper background whitening
        whitened = whiten_paper_background(no_shadows)
        # Step 3: Gentle edge boost
        crisp = unsharp_mask(whitened, sigma=0.8, strength=1.2)
        # Step 4: Boost saturation slightly for seals and signatures
        hsv = cv2.cvtColor(crisp, cv2.COLOR_BGR2HSV)
        hsv[:, :, 1] = cv2.multiply(hsv[:, :, 1], 1.15)
        enhanced = cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)
        return adjust_brightness_contrast(enhanced, brightness=5, contrast=15)

    @staticmethod
    def filter_auto(image: np.ndarray) -> np.ndarray:
        """Automatic balance of white point, contrast, and subtle sharpening."""
        balanced = auto_white_balance(image)
        sharpened = unsharp_mask(balanced, sigma=0.6, strength=1.0)
        return adjust_brightness_contrast(sharpened, brightness=5, contrast=10)

    @staticmethod
    def filter_hd(image: np.ndarray) -> np.ndarray:
        """High definition: bilateral denoising combined with crisp unsharp masking."""
        smooth = bilateral_smooth(image, d=5, sigma_color=30, sigma_space=30)
        crisp = unsharp_mask(smooth, sigma=1.2, strength=1.8)
        return adjust_brightness_contrast(crisp, brightness=3, contrast=12)

    @staticmethod
    def filter_black_and_white(image: np.ndarray) -> np.ndarray:
        """Pure binary black ink on crisp white paper for text-heavy documents."""
        no_shadows = remove_shadows(image)
        return adaptive_threshold_bw(no_shadows, block_size=23, c_constant=9)

    @staticmethod
    def filter_grayscale(image: np.ndarray) -> np.ndarray:
        """Clean 8-bit monochromatic tonal scan with enhanced contrast."""
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        # Normalize histogram
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        norm_gray = clahe.apply(gray)
        return cv2.cvtColor(norm_gray, cv2.COLOR_GRAY2BGR)

    @staticmethod
    def filter_color(image: np.ndarray) -> np.ndarray:
        """Vibrant color document mode for flyers, brochures, and photographs."""
        balanced = auto_white_balance(image)
        whitened = whiten_paper_background(balanced, cutoff_percentile=92.0)
        return adjust_brightness_contrast(whitened, brightness=8, contrast=18)

    @staticmethod
    def filter_sharpen(image: np.ndarray) -> np.ndarray:
        """Maximum edge contrast for fine handwriting and small book fonts."""
        return kernel_sharpen(image)

    @staticmethod
    def filter_clean(image: np.ndarray) -> np.ndarray:
        """Denoised background with high contrast for receipts and invoices."""
        no_shadows = remove_shadows(image)
        whitened = whiten_paper_background(no_shadows, cutoff_percentile=80.0)
        return adjust_brightness_contrast(whitened, brightness=10, contrast=20)

    @staticmethod
    def filter_low_light(image: np.ndarray) -> np.ndarray:
        """Rescues underexposed, dimly lit scans via non-linear gamma and luminance expansion."""
        brightened = adjust_gamma(image, gamma=1.8)
        smooth = bilateral_smooth(brightened, d=7, sigma_color=50, sigma_space=50)
        sharpened = unsharp_mask(smooth, sigma=0.8, strength=1.2)
        return adjust_brightness_contrast(sharpened, brightness=15, contrast=10)
