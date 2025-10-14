#!/usr/bin/env python3
"""
Use the existing adaptive-icon.png as the foreground icon.
Convert it to work with the adaptive icon system.
"""

from PIL import Image
import os

def use_existing_icon():
    # Load the existing adaptive-icon.png
    source_path = 'assets/adaptive-icon.png'
    if not os.path.exists(source_path):
        print(f"Error: {source_path} not found!")
        return
    
    # Load the existing icon
    existing_icon = Image.open(source_path)
    print(f"Loaded existing icon: {existing_icon.size}, mode: {existing_icon.mode}")
    
    # Convert to RGBA if needed
    if existing_icon.mode != 'RGBA':
        existing_icon = existing_icon.convert('RGBA')
    
    # For adaptive icons, we need to extract the foreground part
    # The existing icon might be a complete icon, so we'll use it as foreground
    # and make the background transparent or extract the main elements
    
    # Save as foreground icon
    foreground_path = 'assets/icon_foreground.png'
    existing_icon.save(foreground_path)
    print(f"Saved as foreground icon: {foreground_path}")
    
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
        
        # Resize the existing icon
        resized = existing_icon.resize((size, size), Image.Resampling.LANCZOS)
        
        # Save foreground
        fg_path = f'android/app/src/main/res/{folder}/ic_launcher_foreground.png'
        resized.save(fg_path)
        print(f"Created: {fg_path}")
    
    print("Existing icon converted to adaptive icon system!")
    print("The system will now use:")
    print("- Your preferred existing icon design")
    print("- Proper adaptive icon behavior on all devices")

if __name__ == "__main__":
    use_existing_icon()
