# Build Instructions

## Automated Version Management System

This project has an automated version management system that ensures version numbers are consistent across:
1. The app UI (shown at bottom of main screen)
2. The APK filename
3. app.json (Expo configuration)
4. package.json

## Building Release APK

### Option 1: Use the automated build script (RECOMMENDED)

Simply run:
```batch
build-release.bat
```

This script will:
1. ✅ Automatically bump the version number (increments patch version)
2. ✅ Update both `app.json` and `package.json`
3. ✅ Build the release APK
4. ✅ Rename the APK file with the version number
5. ✅ Display the final APK location

**Output**: `android/app/build/outputs/apk/release/MnemonicEncryption-v1.1.1.apk`

### Option 2: Manual version bump + build

If you want to bump the version manually first:

```batch
npm run bump-version
build-release.bat
```

### Option 3: Build without version bump

If you want to build without changing the version:

```batch
cd android
gradlew assembleRelease
```

Then manually rename the APK in `android/app/build/outputs/apk/release/`

## Version Number Format

We use semantic versioning: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes (manually update in app.json)
- **MINOR**: New features (manually update in app.json)
- **PATCH**: Bug fixes and small improvements (auto-incremented by script)

Current version: `1.1.0` → Next build will be: `1.1.1`

## How It Works

1. **Version Storage**: Version is stored in `app.json` under `expo.version`
2. **Version Display**: App reads version from `Constants.expoConfig.version` (from app.json)
3. **Version Bump Script**: `scripts/bump-version.js` increments the patch number
4. **Build Script**: `build-release.bat` runs the bump script, builds APK, and renames it

## Manual Version Management

To manually change MAJOR or MINOR version, edit `app.json`:

```json
{
  "expo": {
    "version": "2.0.0",  // Change this
    "android": {
      "versionCode": 10  // Increment this for each release
    }
  }
}
```

**Important**: Always increment `versionCode` for each release (required by Play Store).

## Development vs Release Builds

### Development Build (with hot reload)
```batch
build-dev.bat
```
- For testing during development
- Supports hot reload
- Does NOT bump version

### Release Build (for distribution)
```batch
build-release.bat
```
- For distributing to users
- Optimized and minified
- AUTOMATICALLY bumps version
- Creates versioned APK filename

## Troubleshooting

### Version not updating in app
- Make sure you built a new APK after running the bump script
- Uninstall the old app and install the new one
- Check that `app.json` has the new version

### APK not found
- Check `android/app/build/outputs/apk/release/` directory
- Make sure the build completed successfully
- Look for error messages in the build output

### Version bump failed
- Ensure Node.js is installed
- Check that `app.json` and `package.json` exist
- Verify the JSON files are valid (no syntax errors)
