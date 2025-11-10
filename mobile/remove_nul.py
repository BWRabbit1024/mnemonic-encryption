import os
import shutil

# Use UNC path to delete reserved name
nul_path = r"\\?\D:\02_GitHub\Python-Project\05_mnemonic_encryption\mobile\android\app\build\outputs\apk\release\nul"

try:
    if os.path.exists(nul_path):
        if os.path.isdir(nul_path):
            shutil.rmtree(nul_path)
            print("Removed 'nul' directory successfully")
        else:
            os.remove(nul_path)
            print("Removed 'nul' file successfully")
    else:
        print("'nul' does not exist")
except Exception as e:
    print(f"Error removing 'nul': {e}")
