#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Android Icon Density Converter
Converts high-resolution icons to Android-specific densities
Follows Android adaptive icon standards (108dp base)
"""

from PIL import Image
import os
import sys

# Fix Windows console encoding
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except:
        pass

# Android density configurations
# Adaptive icons use 108dp (not 48dp legacy)
DENSITIES = {
    'mdpi': {
        'multiplier': 1.0,
        'size': 108,  # 108dp * 1.0 = 108px
        'folder': 'mipmap-mdpi'
    },
    'hdpi': {
        'multiplier': 1.5,
        'size': 162,  # 108dp * 1.5 = 162px
        'folder': 'mipmap-hdpi'
    },
    'xhdpi': {
        'multiplier': 2.0,
        'size': 216,  # 108dp * 2.0 = 216px
        'folder': 'mipmap-xhdpi'
    },
    'xxhdpi': {
        'multiplier': 3.0,
        'size': 324,  # 108dp * 3.0 = 324px (most common)
        'folder': 'mipmap-xxhdpi'
    },
    'xxxhdpi': {
        'multiplier': 4.0,
        'size': 432,  # 108dp * 4.0 = 432px
        'folder': 'mipmap-xxxhdpi'
    }
}

# Resampling method
# NEAREST: No anti-aliasing, prevents color bleeding on transparent backgrounds
# LANCZOS: High quality but can cause muddy colors with transparency
RESAMPLING_METHOD = Image.Resampling.NEAREST

# Paths
ASSETS_DIR = "assets"
ANDROID_RES_DIR = os.path.join("android", "app", "src", "main", "res")

def ensure_directory_exists(path):
    """Create directory if it doesn't exist"""
    if not os.path.exists(path):
        os.makedirs(path)
        print(f"  Created directory: {path}")

def convert_icon_to_densities(source_icon, icon_name, output_prefix="ic_launcher"):
    """
    Convert a source icon to all Android densities

    Args:
        source_icon: Path to source icon (PNG)
        icon_name: Display name for logging
        output_prefix: Output filename prefix (e.g., 'ic_launcher', 'ic_launcher_foreground')
    """
    print(f"\nConverting {icon_name}...")

    if not os.path.exists(source_icon):
        print(f"  ✗ Source icon not found: {source_icon}")
        return False

    try:
        # Open source image
        img = Image.open(source_icon)
        print(f"  Source: {source_icon}")
        print(f"  Size: {img.size[0]}x{img.size[1]}px")
        print(f"  Mode: {img.mode}")

        # Ensure RGBA mode for transparency
        if img.mode != 'RGBA':
            print(f"  Converting to RGBA mode...")
            img = img.convert('RGBA')

        # Convert to each density
        for density_name, config in DENSITIES.items():
            size = config['size']
            folder = config['folder']

            # Create output directory
            output_dir = os.path.join(ANDROID_RES_DIR, folder)
            ensure_directory_exists(output_dir)

            # Resize image
            resized = img.resize((size, size), RESAMPLING_METHOD)

            # Save as PNG
            output_path = os.path.join(output_dir, f"{output_prefix}.png")
            resized.save(output_path, "PNG")

            print(f"  ✓ {density_name:8s} ({size}x{size}px) -> {output_path}")

        print(f"  ✓ {icon_name} conversion complete!")
        return True

    except Exception as e:
        print(f"  ✗ Error converting {icon_name}: {e}")
        return False

def verify_source_icons():
    """Check if source icons exist"""
    icon_path = os.path.join(ASSETS_DIR, "icon.png")
    adaptive_icon_path = os.path.join(ASSETS_DIR, "adaptive-icon.png")

    print("\nVerifying source icons...")

    icon_exists = os.path.exists(icon_path)
    adaptive_exists = os.path.exists(adaptive_icon_path)

    print(f"  {'✓' if icon_exists else '✗'} icon.png: {icon_path}")
    print(f"  {'✓' if adaptive_exists else '✗'} adaptive-icon.png: {adaptive_icon_path}")

    if not icon_exists or not adaptive_exists:
        print("\n⚠ Missing source icons!")
        print("  Run: python create_icon.py")
        return False

    return True

def main():
    """Main conversion process"""
    print("=" * 70)
    print("  Android Icon Density Converter")
    print("=" * 70)

    # Verify Android directory exists
    if not os.path.exists(ANDROID_RES_DIR):
        print(f"\n✗ Android res directory not found: {ANDROID_RES_DIR}")
        print("  Make sure you're in the mobile/ directory")
        print("  Run 'npx expo prebuild' if android/ folder doesn't exist")
        sys.exit(1)

    # Verify source icons
    if not verify_source_icons():
        sys.exit(1)

    print(f"\nResampling method: {RESAMPLING_METHOD}")
    print("  (NEAREST prevents color bleeding on transparent backgrounds)")

    # Convert main icon
    icon_path = os.path.join(ASSETS_DIR, "icon.png")
    success1 = convert_icon_to_densities(
        icon_path,
        "Main Icon (icon.png)",
        "ic_launcher"
    )

    # Convert adaptive icon foreground
    adaptive_icon_path = os.path.join(ASSETS_DIR, "adaptive-icon.png")
    success2 = convert_icon_to_densities(
        adaptive_icon_path,
        "Adaptive Icon Foreground (adaptive-icon.png)",
        "ic_launcher_foreground"
    )

    # Summary
    print("\n" + "=" * 70)
    if success1 and success2:
        print("✓ All icons converted successfully!")
    else:
        print("⚠ Some icons failed to convert")
    print("=" * 70)

    print("\nGenerated densities:")
    for density_name, config in DENSITIES.items():
        print(f"  {density_name:8s}: {config['size']:3d}x{config['size']:3d}px ({config['folder']})")

    print("\nNext steps:")
    print("  1. Update colors.xml with iconBackground color")
    print("  2. Check ic_launcher.xml references correct drawable")
    print("  3. Rebuild APK: cd android && ./gradlew assembleRelease")
    print("  4. Test on physical device")
    print()

if __name__ == "__main__":
    main()
