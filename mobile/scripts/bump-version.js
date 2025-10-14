const fs = require('fs');
const path = require('path');

// Read app.json
const appJsonPath = path.join(__dirname, '..', 'app.json');
const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));

// Read package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Get current version
const currentVersion = appJson.expo.version;
const versionParts = currentVersion.split('.');
const major = parseInt(versionParts[0]);
const minor = parseInt(versionParts[1]);
const patch = parseInt(versionParts[2]);

// Increment patch version
const newPatch = patch + 1;
const newVersion = `${major}.${minor}.${newPatch}`;

// Update app.json
appJson.expo.version = newVersion;
appJson.expo.android.versionCode = (appJson.expo.android.versionCode || 1) + 1;

// Update package.json
packageJson.version = newVersion;

// Write back to files
fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2) + '\n');
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

console.log(`Version bumped from ${currentVersion} to ${newVersion}`);
console.log(`Android versionCode: ${appJson.expo.android.versionCode}`);
