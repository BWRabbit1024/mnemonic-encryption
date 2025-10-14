#!/usr/bin/env python3
"""
Update Android adaptive icons with proper foreground and background.
"""

from PIL import Image
import os

def create_adaptive_icons():
    # Load the foreground icon
    foreground_path = 'assets/icon_foreground.png'
    if not os.path.exists(foreground_path):
        print(f"Error: {foreground_path} not found!")
        return
    
    foreground = Image.open(foreground_path)
    
    # Create background (solid black)
    background = Image.new('RGBA', foreground.size, (0, 0, 0, 255))
    
    # Android density folders and sizes
    densities = [
        ('mipmap-mdpi', 48),
        ('mipmap-hdpi', 72),
        ('mipmap-xhdpi', 96),
        ('mipmap-xxhdpi', 144),
        ('mipmap-xxxhdpi', 192),
    ]
    
    for folder, size in densities:
        # Create folder if it doesn't exist
        os.makedirs(f'android/app/src/main/res/{folder}', exist_ok=True)
        
        # Resize foreground and background
        fg_resized = foreground.resize((size, size), Image.Resampling.LANCZOS)
        bg_resized = background.resize((size, size), Image.Resampling.LANCZOS)
        
        # Save foreground
        fg_path = f'android/app/src/main/res/{folder}/ic_launcher_foreground.png'
        fg_resized.save(fg_path)
        print(f"Created: {fg_path}")
        
        # Save background (for reference, though we use color in XML)
        bg_path = f'android/app/src/main/res/{folder}/ic_launcher_background.png'
        bg_resized.save(bg_path)
        print(f"Created: {bg_path}")
    
    print("Adaptive icons created successfully!")
    print("The system will now use:")
    print("- Blue background (defined in colors.xml)")
    print("- White shield + lock as foreground")
    print("- Proper adaptive icon behavior on all devices")

if __name__ == "__main__":
    create_adaptive_icons()
