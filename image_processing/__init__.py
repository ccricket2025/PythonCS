"""
Image Enhancement and Document Filter Suite
"""
from .filters import FilterEngine
from .enhance import adjust_brightness_contrast, adjust_gamma, remove_shadows, auto_white_balance
from .sharpen import unsharp_mask, kernel_sharpen
from .denoise import fast_denoise, bilateral_smooth
from .threshold import adaptive_threshold_bw, otsu_threshold_bw
from .background import whiten_paper_background

__all__ = [
    "FilterEngine",
    "adjust_brightness_contrast",
    "adjust_gamma",
    "remove_shadows",
    "auto_white_balance",
    "unsharp_mask",
    "kernel_sharpen",
    "fast_denoise",
    "bilateral_smooth",
    "adaptive_threshold_bw",
    "otsu_threshold_bw",
    "whiten_paper_background"
]
