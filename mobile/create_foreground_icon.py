#!/usr/bin/env python3
"""
Create a foreground-only icon for Android adaptive icons.
This creates just the key symbol without background.
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_foreground_icon():
    # Create a transparent 1024x1024 image
    size = 1024
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Key symbol parameters
    key_size = 400
    key_x = (size - key_size) // 2
    key_y = (size - key_size) // 2 - 80  # Move key up by 80 pixels
    
    # Draw a simple key symbol
    # Key head (circle)
    head_radius = key_size // 6
    head_center_x = key_x + key_size // 3
    head_center_y = key_y + key_size // 2
    
    # Key shaft (rectangle)
    shaft_width = key_size // 8
    shaft_height = key_size // 2
    shaft_x = head_center_x + head_radius
    shaft_y = head_center_y - shaft_height // 2
    
    # Key teeth (small rectangles)
    teeth_width = key_size // 12
    teeth_height = key_size // 6
    
    # Draw key head (circle)
    draw.ellipse([
        head_center_x - head_radius,
        head_center_y - head_radius,
        head_center_x + head_radius,
        head_center_y + head_radius
    ], fill=(255, 255, 255, 255))  # White
    
    # Draw key shaft
    draw.rectangle([
        shaft_x,
        shaft_y,
        shaft_x + shaft_width,
        shaft_y + shaft_height
    ], fill=(255, 255, 255, 255))  # White
    
    # Draw key teeth (2 small rectangles)
    teeth1_x = shaft_x + shaft_width
    teeth1_y = shaft_y + shaft_height // 4
    draw.rectangle([
        teeth1_x,
        teeth1_y,
        teeth1_x + teeth_width,
        teeth1_y + teeth_height
    ], fill=(255, 255, 255, 255))  # White
    
    teeth2_x = shaft_x + shaft_width
    teeth2_y = shaft_y + shaft_height * 3 // 4 - teeth_height
    draw.rectangle([
        teeth2_x,
        teeth2_y,
        teeth2_x + teeth_width,
        teeth2_y + teeth_height
    ], fill=(255, 255, 255, 255))  # White
    
    # Save the foreground icon
    foreground_path = 'assets/icon_foreground.png'
    img.save(foreground_path)
    print(f"Foreground icon created: {foreground_path}")
    
    return foreground_path

if __name__ == "__main__":
    create_foreground_icon()
