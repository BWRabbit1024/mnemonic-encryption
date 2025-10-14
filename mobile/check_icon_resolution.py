#!/usr/bin/env python3
"""
Check the actual resolution of all icon files.
"""

from PIL import Image
import os

def check_icon_resolution():
    print("=== ICON RESOLUTION CHECK ===\n")
    
    # Check source icon
    source_path = 'assets/icon_foreground.png'
    if os.path.exists(source_path):
        img = Image.open(source_path)
        print(f"Source icon ({source_path}): {img.width}x{img.height}")
    else:
        print(f"Source icon ({source_path}): NOT FOUND")
    
    print()
    
    # Check Android density icons
    densities = ['mdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi']
    expected_sizes = [108, 162, 216, 324, 432]
    
    print("Android Density Icons:")
    for density, expected_size in zip(densities, expected_sizes):
        icon_path = f'android/app/src/main/res/mipmap-{density}/ic_launcher_foreground.png'
        if os.path.exists(icon_path):
            img = Image.open(icon_path)
            status = "CORRECT" if img.width == expected_size and img.height == expected_size else "WRONG"
            print(f"  {density}: {img.width}x{img.height} (expected: {expected_size}x{expected_size}) {status}")
        else:
            print(f"  {density}: NOT FOUND")
    
    print()
    print("=== STANDARD REQUIREMENTS ===")
    print("Source icon: 2048x2048 px (minimum)")
    print("mdpi: 108x108 px")
    print("hdpi: 162x162 px") 
    print("xhdpi: 216x216 px")
    print("xxhdpi: 324x324 px")
    print("xxxhdpi: 432x432 px")

if __name__ == "__main__":
    check_icon_resolution()
