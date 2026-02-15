#!/usr/bin/env python3
"""
Download additional high-quality images to enhance the website
Includes: chef photos, ambiance, gallery, more menu items, etc.
"""

import os
import urllib.request
import ssl

# Create SSL context to avoid certificate errors
ssl._create_default_https_context = ssl._create_unverified_context

# Additional image mappings
ADDITIONAL_IMAGES = {
    # Chef & Staff
    'chef-portrait.jpg': 'https://images.unsplash.com/photo-1577219491135-ce391730fb4c?w=800&h=1000&fit=crop',
    'chef-cooking.jpg': 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&h=800&fit=crop',
    'team-photo.jpg': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=800&fit=crop',

    # Restaurant Ambiance & Gallery
    'dining-area.jpg': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=800&fit=crop',
    'bar-area.jpg': 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1200&h=800&fit=crop',
    'private-dining.jpg': 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&h=800&fit=crop',
    'exterior-night.jpg': 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1200&h=800&fit=crop',
    'kitchen-action.jpg': 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&h=800&fit=crop&sat=-10',

    # Additional Menu Items
    'udon-noodles.jpg': 'https://images.unsplash.com/photo-1618841557871-b4664fbf0cb3?w=800&h=600&fit=crop',
    'tempura-platter.jpg': 'https://images.unsplash.com/photo-1540928388032-781761541c05?w=800&h=600&fit=crop',
    'bento-box.jpg': 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=800&h=600&fit=crop',
    'yakitori.jpg': 'https://images.unsplash.com/photo-1606656450935-5b03f5ad585f?w=800&h=600&fit=crop',
    'katsu-curry.jpg': 'https://images.unsplash.com/photo-1631709497146-a2c0be4a7fc8?w=800&h=600&fit=crop',
    'donburi.jpg': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop',
    'sashimi-platter.jpg': 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&h=600&fit=crop',
    'california-roll.jpg': 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?w=800&h=600&fit=crop',

    # Drinks & Beverages
    'green-tea.jpg': 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800&h=600&fit=crop',
    'japanese-beer.jpg': 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&h=600&fit=crop',
    'matcha-latte.jpg': 'https://images.unsplash.com/photo-1536013266770-24b4c2a0da8c?w=800&h=600&fit=crop',

    # Desserts
    'dorayaki.jpg': 'https://images.unsplash.com/photo-1582716401301-b2407dc7563d?w=800&h=600&fit=crop&sat=10',
    'taiyaki.jpg': 'https://images.unsplash.com/photo-1563379091339-03b87807a7f6?w=800&h=600&fit=crop',

    # Special Occasions
    'sushi-chef-making.jpg': 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=1200&h=800&fit=crop&sat=20',
    'food-plating.jpg': 'https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?w=1200&h=800&fit=crop',

    # Promotional
    'happy-hour-banner.jpg': 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1600&h=600&fit=crop',
    'delivery-banner.jpg': 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=1600&h=600&fit=crop',
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
    print("Downloading Additional High-Quality Images")
    print("From: Unsplash (Free to use)")
    print("=" * 60)
    print()

    success_count = 0
    total_count = len(ADDITIONAL_IMAGES)

    for filename, url in ADDITIONAL_IMAGES.items():
        filepath = os.path.join(images_dir, filename)

        # Skip if file already exists
        if os.path.exists(filepath):
            print(f"[SKIP] {filename} (already exists)")
            continue

        if download_image(url, filepath):
            success_count += 1

    print()
    print("=" * 60)
    print(f"Download Complete: {success_count}/{total_count} new images")
    print("=" * 60)
    print()
    print("New images added:")
    print("  - Chef & Staff Photos (3)")
    print("  - Restaurant Ambiance (5)")
    print("  - Additional Menu Items (8)")
    print("  - More Drinks (3)")
    print("  - More Desserts (2)")
    print("  - Special Occasions (2)")
    print("  - Promotional Banners (2)")
    print()
    print("Total new images: 25")
    print()
    print("Next: I'll create new pages to showcase these images!")
    print()

if __name__ == '__main__':
    main()
