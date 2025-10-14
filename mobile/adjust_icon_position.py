#!/usr/bin/env python3
"""
Adjust the position of the key pattern in the existing icon to center it better.
"""

from PIL import Image
import os

def adjust_icon_position():
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
    
    # Create a new image with the same size
    size = existing_icon.size[0]  # Assuming square
    new_img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    
    # Paste the existing icon but move it up by 100 pixels to center the key better
    offset_y = -100  # Move up by 100 pixels
    new_img.paste(existing_icon, (0, offset_y), existing_icon)
    
    # Save as foreground icon
    foreground_path = 'assets/icon_foreground.png'
    new_img.save(foreground_path)
    print(f"Saved adjusted foreground icon: {foreground_path}")
    
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
        
        # Resize the adjusted icon
        resized = new_img.resize((size, size), Image.Resampling.LANCZOS)
        
        # Save foreground
        fg_path = f'android/app/src/main/res/{folder}/ic_launcher_foreground.png'
        resized.save(fg_path)
        print(f"Created: {fg_path}")
    
    print("Icon position adjusted!")
    print("Key pattern moved up by 100 pixels to center it better")

if __name__ == "__main__":
    adjust_icon_position()
