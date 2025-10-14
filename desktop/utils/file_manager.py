"""
File Management Utilities
Secure handling of encrypted mnemonic file storage
"""

import os
import json
from datetime import datetime
from typing import Optional, Dict, Any
from pathlib import Path


class SecureFileManager:
    """Handles secure file operations for encrypted mnemonic storage."""

    def __init__(self, storage_dir: str = "encrypted_storage"):
        """
        Initialize file manager with storage directory.

        Args:
            storage_dir: Directory to store encrypted files
        """
        self.storage_dir = Path(storage_dir)
        self.storage_dir.mkdir(exist_ok=True)

    def save_encrypted_mnemonic(self, encrypted_data: str, filename: str,
                               metadata: Optional[Dict[str, Any]] = None) -> bool:
        """
        Save encrypted mnemonic to file with metadata.

        Args:
            encrypted_data: The encrypted mnemonic string
            filename: Name for the storage file (without extension)
            metadata: Optional metadata to store with the file

        Returns:
            True if successful, False otherwise
        """
        try:
            file_path = self.storage_dir / f"{filename}.enc"

            # Prepare data structure
            data = {
                'encrypted_mnemonic': encrypted_data,
                'created_at': datetime.now().isoformat(),
                'metadata': metadata or {}
            }

            # Write to file with restrictive permissions
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2)

            # Set file permissions (readable only by owner on Unix systems)
            if os.name != 'nt':  # Not Windows
                os.chmod(file_path, 0o600)

            return True

        except Exception as e:
            print(f"Error saving file: {e}")
            return False

    def load_encrypted_mnemonic(self, filename: str) -> Optional[Dict[str, Any]]:
        """
        Load encrypted mnemonic from file.

        Args:
            filename: Name of the file (without extension)

        Returns:
            Dictionary with encrypted data and metadata, or None if failed
        """
        try:
            file_path = self.storage_dir / f"{filename}.enc"

            if not file_path.exists():
                return None

            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)

            return data

        except Exception as e:
            print(f"Error loading file: {e}")
            return None

    def list_encrypted_files(self) -> list:
        """
        List all encrypted mnemonic files.

        Returns:
            List of dictionaries with file information
        """
        files = []
        try:
            for file_path in self.storage_dir.glob("*.enc"):
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        data = json.load(f)

                    files.append({
                        'filename': file_path.stem,
                        'created_at': data.get('created_at', 'Unknown'),
                        'metadata': data.get('metadata', {})
                    })
                except Exception:
                    # Skip corrupted files
                    continue

        except Exception as e:
            print(f"Error listing files: {e}")

        return files

    def delete_encrypted_file(self, filename: str) -> bool:
        """
        Securely delete an encrypted mnemonic file.

        Args:
            filename: Name of the file to delete (without extension)

        Returns:
            True if successful, False otherwise
        """
        try:
            file_path = self.storage_dir / f"{filename}.enc"

            if not file_path.exists():
                return False

            # On some systems, you might want to overwrite before deletion
            # This is a basic secure deletion
            file_path.unlink()
            return True

        except Exception as e:
            print(f"Error deleting file: {e}")
            return False

    def backup_encrypted_file(self, filename: str, backup_dir: str) -> bool:
        """
        Create a backup copy of an encrypted file.

        Args:
            filename: Name of the file to backup
            backup_dir: Directory to store the backup

        Returns:
            True if successful, False otherwise
        """
        try:
            source = self.storage_dir / f"{filename}.enc"
            backup_path = Path(backup_dir)
            backup_path.mkdir(exist_ok=True)

            destination = backup_path / f"{filename}_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.enc"

            if source.exists():
                import shutil
                shutil.copy2(source, destination)
                return True

            return False

        except Exception as e:
            print(f"Error creating backup: {e}")
            return False


class ConfigManager:
    """Manages application configuration."""

    def __init__(self, config_file: str = "config.json"):
        """Initialize configuration manager."""
        self.config_file = Path(config_file)
        self.default_config = {
            'storage_directory': 'encrypted_storage',
            'auto_backup': True,
            'backup_directory': 'backups',
            'security_settings': {
                'min_password_length': 12,
                'require_strong_password': True,
                'pbkdf2_iterations': 100000
            }
        }

    def load_config(self) -> Dict[str, Any]:
        """Load configuration from file or create default."""
        try:
            if self.config_file.exists():
                with open(self.config_file, 'r', encoding='utf-8') as f:
                    config = json.load(f)
                # Merge with defaults for any missing keys
                return {**self.default_config, **config}
            else:
                # Create default config file
                self.save_config(self.default_config)
                return self.default_config.copy()

        except Exception as e:
            print(f"Error loading config, using defaults: {e}")
            return self.default_config.copy()

    def save_config(self, config: Dict[str, Any]) -> bool:
        """Save configuration to file."""
        try:
            with open(self.config_file, 'w', encoding='utf-8') as f:
                json.dump(config, f, indent=2)
            return True
        except Exception as e:
            print(f"Error saving config: {e}")
            return False