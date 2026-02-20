#!/usr/bin/env python3
"""
Download high-quality Japanese food images from Unsplash
No API key needed - uses direct download URLs
"""

import os
import urllib.request
import ssl

# Create SSL context to avoid certificate errors
ssl._create_default_https_context = ssl._create_unverified_context

# Image mappings - Unsplash photo IDs for Japanese food
IMAGES = {
    # Hero images
    'hero-bg.jpg': 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=1920&h=1080&fit=crop',
    'menu-hero.jpg': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1920&h=800&fit=crop',

    # Ramen
    'tonkotsu-ramen.jpg': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=600&fit=crop',
    'miso-ramen.jpg': 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=800&h=600&fit=crop',
    'shoyu-ramen.jpg': 'https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=800&h=600&fit=crop',

    # Sushi
    'sushi-platter.jpg': 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop',
    'salmon-set.jpg': 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=800&h=600&fit=crop',
    'dragon-roll.jpg': 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800&h=600&fit=crop',

    # Bowls
    'chirashi-bowl.jpg': 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop&sat=-10',

    # Appetizers
    'gyoza.jpg': 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=800&h=600&fit=crop',
    'edamame.jpg': 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=800&h=600&fit=crop',
    'takoyaki.jpg': 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=800&h=600&fit=crop&sat=-20',

    # Desserts
    'mochi.jpg': 'https://images.unsplash.com/photo-1582716401301-b2407dc7563d?w=800&h=600&fit=crop',
    'matcha-cake.jpg': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop',

    # Drinks
    'ramune.jpg': 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&h=600&fit=crop',
    'sake.jpg': 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&h=600&fit=crop',

    # Other
    'restaurant-interior.jpg': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=800&fit=crop',
}

def download_image(url, filepath):
    """Download an image from URL to filepath"""
    try:
        print(f"Downloading {os.path.basename(filepath)}...")
        urllib.request.urlretrieve(url, filepath)
        print(f"[OK] Saved {os.path.basename(filepath)}")
        return True
    except Exception as e:
        print(f"[ERROR] Downloading {os.path.basename(filepath)}: {e}")
        return False

def main():
    # Create images directory if it doesn't exist
    images_dir = os.path.join('assets', 'images')
    os.makedirs(images_dir, exist_ok=True)

    print("=" * 60)
    print("Downloading High-Quality Japanese Food Images")
    print("From: Unsplash (Free to use)")
    print("=" * 60)
    print()

    success_count = 0
    total_count = len(IMAGES)

    for filename, url in IMAGES.items():
        filepath = os.path.join(images_dir, filename)

        # Skip if file already exists
        if os.path.exists(filepath):
            print(f"[SKIP] {filename} (already exists)")
            continue

        if download_image(url, filepath):
            success_count += 1

    print()
    print("=" * 60)
    print(f"Download Complete: {success_count}/{total_count} images downloaded")
    print("=" * 60)
    print()
    print("Next steps:")
    print("1. Refresh your browser (Ctrl+F5)")
    print("2. Images should now appear on the website")
    print("3. Optional: Remove css/image-placeholders.css for better performance")
    print()

if __name__ == '__main__':
    main()
