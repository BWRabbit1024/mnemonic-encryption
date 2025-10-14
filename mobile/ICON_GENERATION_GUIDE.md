# Icon Generation Guide

## Overview
This project now uses the checklist-recommended Python script approach for icon generation with full automation.

## Icon Theme
- **Background**: Black (#000000) - set in colors.xml
- **Foreground Pattern**: Transparent with colorful design
  - Gold shield (mnemonic protection symbol)
  - Blue inner shield (security)
  - White lock with keyhole (encryption)
  - Decorative elements (12/24 word count indicators)

## Files Created

### Scripts
- `create_icon.py` - Generates high-resolution base icons (2048x2048px)
- `update_android_icons.py` - Converts icons to Android densities

### Generated Icons
- `assets/icon.png` - Main app icon (2048x2048px)
- `assets/adaptive-icon.png` - Adaptive icon foreground (2048x2048px)

### Android Resources
PNG files in all densities (mdpi through xxxhdpi):
- `android/app/src/main/res/mipmap-*/ic_launcher.png`
- `android/app/src/main/res/mipmap-*/ic_launcher_foreground.png`

## Configuration

### colors.xml
```xml
<color name="ic_launcher_background">#000000</color>
```

### Adaptive Icon XML
Files updated to reference mipmap resources:
- `mipmap-anydpi-v26/ic_launcher.xml`
- `mipmap-anydpi-v26/ic_launcher_round.xml`

Both now use:
```xml
<foreground android:drawable="@mipmap/ic_launcher_foreground"/>
```

## Icon Sizes (Adaptive Icon Standard: 108dp)

| Density | Size | Folder |
|---------|------|--------|
| mdpi | 108×108px | mipmap-mdpi |
| hdpi | 162×162px | mipmap-hdpi |
| xhdpi | 216×216px | mipmap-xhdpi |
| xxhdpi | 324×324px | mipmap-xxhdpi (most common) |
| xxxhdpi | 432×432px | mipmap-xxxhdpi |

## Workflow

### Initial Setup
```bash
# Install dependencies (if not already installed)
pip install pillow
```

### Updating Icons

1. **Edit the icon design**:
   ```bash
   # Edit create_icon.py to modify colors, shapes, or layout
   nano create_icon.py
   ```

2. **Generate base icons**:
   ```bash
   cd mobile
   python create_icon.py
   ```

3. **Convert to Android densities**:
   ```bash
   python update_android_icons.py
   ```

4. **Rebuild APK**:
   ```bash
   cd android
   ./gradlew clean
   ./gradlew assembleRelease
   ```

5. **Test on device**:
   ```bash
   adb install app/build/outputs/apk/release/app-release.apk
   ```

## Technical Details

### Resampling Method
Uses `Image.Resampling.NEAREST` to prevent color bleeding on transparent backgrounds.
- **Pros**: Sharp edges, no muddy colors
- **Cons**: May look pixelated if source resolution is too low
- **Solution**: Start with 2048x2048 source images

### Adaptive Icon Safe Zone
The adaptive icon is designed with 70% scale factor to keep content within the safe zone (66dp of 108dp).

### Transparency
- Foreground icons have **transparent backgrounds**
- Background color is defined in `colors.xml` as `ic_launcher_background`
- Android system composites foreground + background layers

## Troubleshooting

### Icons not updating after rebuild
```bash
# Clear build cache
cd android
./gradlew clean
rm -rf app/build
./gradlew assembleRelease
```

### Unicode errors on Windows
Scripts include Windows console encoding fix:
```python
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
```

### Icon looks different on different launchers
- Different launchers apply different masks (circle, square, rounded)
- Keep important content in the center "safe zone"
- Test on multiple launcher apps

## Comparison: Old vs New Approach

| Aspect | Old (HTML Canvas) | New (Python Scripts) |
|--------|-------------------|----------------------|
| Creation | Manual browser download | Automated script |
| Format | XML vectors + WebP | PNG at all densities |
| Updates | Edit HTML, re-download | Edit script, re-run |
| Automation | Manual | Fully scripted |
| Quality Control | Visual inspection | Programmatic (2048px source) |

## Design Customization

### Changing Colors
Edit `create_icon.py`:
```python
GOLD = (255, 215, 0, 255)        # Shield color
BLUE = (30, 144, 255, 255)       # Inner shield
WHITE = (255, 255, 255, 255)     # Lock color
LIGHT_BLUE = (100, 180, 255, 255) # Decorative elements
```

### Changing Background Color
Edit `colors.xml`:
```xml
<color name="ic_launcher_background">#000000</color>
```

### Modifying Layout
Adjust coordinates and sizes in `create_icon.py`:
- Shield dimensions
- Lock position and size
- Keyhole placement
- Decorative element positions

## Next Steps for Production

1. **Test on physical devices** with different Android versions
2. **Check different launchers** (Pixel Launcher, Samsung One UI, Nova, etc.)
3. **Verify icon clarity** at small sizes (notifications, settings)
4. **Document any custom design changes** in this file

---

Generated on: 2025-10-11
Last updated by: Claude Code Assistant
