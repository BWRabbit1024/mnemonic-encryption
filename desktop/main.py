#!/usr/bin/env python3
"""
Secure Mnemonic Encryption Tool - Main Entry Point
Enhanced version with modern cryptographic security

Usage:
    python main.py                 # Interactive menu
    python main.py --encrypt       # Direct encryption mode
    python main.py --decrypt       # Direct decryption mode
    python main.py --list          # List encrypted files
    python main.py --test-password # Test password strength
"""

import sys
import os

# Add desktop directory to Python path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from cli.main import main

if __name__ == "__main__":
    main()