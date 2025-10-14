#!/usr/bin/env python3
"""
Create the proper foreground icon based on the original design:
- Shield + lock with keyhole
- White/light colors for foreground
- Transparent background
"""

from PIL import Image, ImageDraw
import os

def create_proper_foreground_icon():
    # Create a transparent 1024x1024 image
    size = 1024
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Shield + lock design (adapted for foreground)
    # Main shield (white/light for foreground)
    shield_points = [
        (512, 150), (750, 250), (750, 450),
        (750, 650), (512, 850), (274, 650),
        (274, 450), (274, 250)
    ]
    
    # Draw main shield (white)
    draw.polygon(shield_points, fill=(255, 255, 255, 255))
    
    # Draw inner shield (light gray)
    inner_shield_points = [
        (512, 200), (700, 280), (700, 450),
        (700, 620), (512, 780), (324, 620),
        (324, 450), (324, 280)
    ]
    draw.polygon(inner_shield_points, fill=(240, 240, 240, 255))
    
    # Draw lock body (dark gray)
    lock_x, lock_y = 412, 450
    lock_width, lock_height = 200, 180
    draw.rectangle([lock_x, lock_y, lock_x + lock_width, lock_y + lock_height], 
                   fill=(100, 100, 100, 255))
    
    # Draw lock shackle (dark gray)
    shackle_center_x, shackle_center_y = 512, 380
    shackle_radius = 62
    shackle_width = 20
    
    # Draw shackle as thick arc
    for i in range(shackle_width):
        draw.arc([shackle_center_x - shackle_radius - i, shackle_center_y - shackle_radius - i,
                  shackle_center_x + shackle_radius + i, shackle_center_y + shackle_radius + i],
                 180, 0, fill=(100, 100, 100, 255), width=2)
    
    # Draw keyhole (white)
    keyhole_center_x, keyhole_center_y = 512, 520
    keyhole_radius = 25
    draw.ellipse([keyhole_center_x - keyhole_radius, keyhole_center_y - keyhole_radius,
                  keyhole_center_x + keyhole_radius, keyhole_center_y + keyhole_radius],
                 fill=(255, 255, 255, 255))
    
    # Draw keyhole slot
    slot_x = keyhole_center_x - 10
    slot_y = keyhole_center_y + keyhole_radius
    slot_width, slot_height = 20, 40
    draw.rectangle([slot_x, slot_y, slot_x + slot_width, slot_y + slot_height],
                   fill=(255, 255, 255, 255))
    
    # Add sparkle effects (white)
    sparkles = [
        (200, 300, 15),
        (800, 400, 10),
        (150, 600, 12)
    ]
    
    for x, y, radius in sparkles:
        draw.ellipse([x - radius, y - radius, x + radius, y + radius],
                     fill=(255, 255, 255, 200))
    
    # Save the foreground icon
    foreground_path = 'assets/icon_foreground.png'
    img.save(foreground_path)
    print(f"Proper foreground icon created: {foreground_path}")
    
    return foreground_path

if __name__ == "__main__":
    create_proper_foreground_icon()
