#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
App Icon Generator for Mnemonic Encryption App
Generates high-resolution icons with mnemonic/encryption theme
Theme: Black background, transparent foreground pattern
"""

from PIL import Image, ImageDraw, ImageFont
import os
import sys

# Fix Windows console encoding
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except:
        pass

# Configuration
OUTPUT_DIR = "assets"
ICON_SIZE = 2048  # High resolution for quality
ADAPTIVE_ICON_SIZE = 2048  # Same size for adaptive icon

# Colors
TRANSPARENT = (0, 0, 0, 0)
WHITE = (255, 255, 255, 255)
GOLD = (255, 215, 0, 255)
BLUE = (30, 144, 255, 255)
LIGHT_BLUE = (100, 180, 255, 255)

def create_icon():
    """Create main app icon with black background and encryption theme"""
    # Create image with BLACK background for legacy/non-adaptive icon
    img = Image.new('RGBA', (ICON_SIZE, ICON_SIZE), (0, 0, 0, 255))
    draw = ImageDraw.Draw(img)

    center_x = ICON_SIZE // 2
    center_y = ICON_SIZE // 2

    # Simple, elegant design: Key symbol (encryption + unlock)
    # The key represents both security (lock) and access (mnemonic phrase)

    # Key head (circular part) - larger and centered
    key_head_radius = 380
    key_head_thickness = 120

    # Outer circle (key head outline)
    draw.ellipse(
        [center_x - key_head_radius, center_y - key_head_radius - 150,
         center_x + key_head_radius, center_y + key_head_radius - 150],
        outline=WHITE,
        width=key_head_thickness
    )

    # Inner circle (keyhole suggestion)
    inner_radius = 150
    draw.ellipse(
        [center_x - inner_radius, center_y - inner_radius - 150,
         center_x + inner_radius, center_y + inner_radius - 150],
        fill=WHITE
    )

    # Key shaft (vertical part)
    shaft_width = 120
    shaft_height = 550
    shaft_y = center_y + 150

    draw.rectangle(
        [center_x - shaft_width//2, shaft_y,
         center_x + shaft_width//2, shaft_y + shaft_height],
        fill=WHITE
    )

    # Key teeth (2 simple teeth for elegance)
    tooth_width = 120
    tooth_height = 100
    tooth_spacing = 150

    # Right teeth - only 2 teeth (skip the top one)
    for i in range(2):
        tooth_y = shaft_y + 250 + (i * tooth_spacing)  # Start lower (skip top tooth)
        draw.rectangle(
            [center_x + shaft_width//2, tooth_y,
             center_x + shaft_width//2 + tooth_width, tooth_y + tooth_height],
            fill=WHITE
        )

    # Note: Gradient overlay removed - it was covering the white key with light blue

    # Save the icon
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    icon_path = os.path.join(OUTPUT_DIR, "icon.png")
    img.save(icon_path, "PNG")
    print(f"✓ Created main icon: {icon_path}")
    print(f"  Size: {ICON_SIZE}x{ICON_SIZE}px")
    print(f"  Theme: Mnemonic encryption with transparent background")

    return img

def create_adaptive_icon():
    """
    Create adaptive icon foreground (for Android API 26+)
    This should have transparent background with only the foreground pattern
    """
    # Create image with transparent background
    img = Image.new('RGBA', (ADAPTIVE_ICON_SIZE, ADAPTIVE_ICON_SIZE), TRANSPARENT)
    draw = ImageDraw.Draw(img)

    center_x = ADAPTIVE_ICON_SIZE // 2
    center_y = ADAPTIVE_ICON_SIZE // 2

    # For adaptive icons, we need to keep content in the "safe zone"
    # Safe zone is approximately 66dp out of 108dp (about 61% of total)
    # Scale down by 30% to keep within safe zone

    scale = 0.7  # Scale factor

    # Same key design as main icon, but scaled down
    key_head_radius = int(380 * scale)
    key_head_thickness = int(120 * scale)

    # Outer circle (key head outline)
    draw.ellipse(
        [center_x - key_head_radius, center_y - key_head_radius - int(150 * scale),
         center_x + key_head_radius, center_y + key_head_radius - int(150 * scale)],
        outline=WHITE,
        width=key_head_thickness
    )

    # Inner circle (keyhole suggestion)
    inner_radius = int(150 * scale)
    draw.ellipse(
        [center_x - inner_radius, center_y - inner_radius - int(150 * scale),
         center_x + inner_radius, center_y + inner_radius - int(150 * scale)],
        fill=WHITE
    )

    # Key shaft
    shaft_width = int(120 * scale)
    shaft_height = int(550 * scale)
    shaft_y = center_y + int(150 * scale)

    draw.rectangle(
        [center_x - shaft_width//2, shaft_y,
         center_x + shaft_width//2, shaft_y + shaft_height],
        fill=WHITE
    )

    # Key teeth (2 simple teeth)
    tooth_width = int(120 * scale)
    tooth_height = int(100 * scale)
    tooth_spacing = int(150 * scale)

    # Right teeth - only 2 teeth (skip the top one)
    for i in range(2):
        tooth_y = shaft_y + int(250 * scale) + (i * tooth_spacing)  # Start lower
        draw.rectangle(
            [center_x + shaft_width//2, tooth_y,
             center_x + shaft_width//2 + tooth_width, tooth_y + tooth_height],
            fill=WHITE
        )

    # Note: Gradient overlay removed - it was covering the white key with light blue

    # Save adaptive icon
    adaptive_icon_path = os.path.join(OUTPUT_DIR, "adaptive-icon.png")
    img.save(adaptive_icon_path, "PNG")
    print(f"✓ Created adaptive icon: {adaptive_icon_path}")
    print(f"  Size: {ADAPTIVE_ICON_SIZE}x{ADAPTIVE_ICON_SIZE}px")
    print(f"  Note: Designed for safe zone (66dp of 108dp)")

    return img

def main():
    """Generate all icons"""
    print("=" * 60)
    print("  Mnemonic Encryption App - Icon Generator")
    print("=" * 60)
    print()
    print("Theme: Simple & Elegant")
    print("  - Black background (set in colors.xml)")
    print("  - White key symbol (transparent foreground)")
    print("  - Minimalist design with subtle gradient")
    print("  - Key = Access to mnemonic + Security/Encryption")
    print()

    # Create icons
    create_icon()
    print()
    create_adaptive_icon()

    print()
    print("=" * 60)
    print("✓ Icon generation complete!")
    print("=" * 60)
    print()
    print("Next steps:")
    print("  1. Run: python update_android_icons.py")
    print("  2. Update colors.xml with black background")
    print("  3. Rebuild APK to see changes")
    print()

if __name__ == "__main__":
    main()
