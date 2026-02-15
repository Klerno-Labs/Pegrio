# Quick Customization Guide for Clients

This guide will help you quickly customize the website for your restaurant.

## 🎯 5-Minute Quick Start

### 1. Restaurant Name (Required)
**Search and replace in ALL files**:
- Find: `La Casa de Sabor`
- Replace with: `Your Restaurant Name`

**Files to update**: All .html files

### 2. Contact Information (Required)

Update these in the footer of **each HTML page**:

```html
<!-- Find and replace these -->
Address: 123 Main Street, Anytown, USA
Phone: (555) 123-4567
Email: info@lacasadesabor.com
```

### 3. Business Hours (Required)

Located in the footer of each page:
```html
Monday - Thursday: 11am - 9pm
Friday - Saturday: 11am - 10pm
Sunday: 12pm - 8pm
```

### 4. Social Media Links (Required)

In the footer of each page, find:
```html
<a href="https://facebook.com" target="_blank">
<a href="https://instagram.com" target="_blank">
<a href="https://twitter.com" target="_blank">
<a href="https://yelp.com" target="_blank">
```

Replace with your actual social media URLs.

## 🍽️ Menu Customization

### Updating Menu Items (menu.html)

Each menu item follows this structure:
```html
<div class="menu-item">
    <div class="menu-item-header">
        <h3>Dish Name</h3>
        <span class="price">$12.99</span>
    </div>
    <p>Description of the dish</p>
</div>
```

**To add a new item**: Copy this block and paste it in the appropriate category.

**To remove an item**: Delete the entire `<div class="menu-item">...</div>` block.

### Adding New Menu Categories

```html
<div class="menu-category">
    <h2 class="category-title">Category Name</h2>
    <div class="menu-items">
        <!-- Menu items go here -->
    </div>
</div>
```

## 🎨 Changing Colors

### Quick Color Change

Open `css/styles.css` and find the `:root` section (around line 10).

**Option 1: Use Pre-made Scheme**
- Scheme 1 (Active): Warm Red/Orange
- Scheme 2: Brown/Amber (uncomment to use)
- Scheme 3: Pink/Orange (uncomment to use)

**Option 2: Custom Colors**
Replace these values with your brand colors:
```css
:root {
    --primary-color: #D84315;      /* Main brand color */
    --secondary-color: #FFA726;    /* Accent color */
    --accent-color: #66BB6A;       /* Highlight color */
}
```

**Finding color codes**: Use [coolors.co](https://coolors.co) or [colorhunt.co](https://colorhunt.co)

## 📸 Adding Your Photos

### Step 1: Prepare Images
- **Recommended sizes**:
  - Hero images: 1920x1080px
  - Gallery images: 800x600px
  - About section: 600x400px
- Save as JPG or PNG
- Optimize images at [tinypng.com](https://tinypng.com)

### Step 2: Upload Images
Place all images in the `images/` folder with descriptive names:
- `hero-background.jpg`
- `tacos-al-pastor.jpg`
- `restaurant-interior.jpg`
- etc.

### Step 3: Update HTML

**For Gallery (gallery.html)**:
Replace placeholder divs with:
```html
<div class="gallery-item">
    <img src="images/your-photo.jpg" alt="Description of photo">
</div>
```

**For Hero Background (index.html)**:
Add this style to the hero section:
```html
<section class="hero" style="background-image: url('images/hero-background.jpg');">
```

**For About Section (about.html)**:
Replace the placeholder div with:
```html
<div class="about-image">
    <img src="images/your-image.jpg" alt="Description">
</div>
```

## 🗺️ Google Maps Setup

### Step-by-Step:

1. **Go to Google Maps**: https://www.google.com/maps

2. **Search** for your restaurant address

3. **Click "Share"** button

4. **Select "Embed a map"** tab

5. **Copy the iframe code** (looks like `<iframe src="..."></iframe>`)

6. **Open contact.html**

7. **Find the existing iframe** (around line 150)

8. **Replace it** with your copied iframe code

## 📝 About Page Content

### Your Story Section
Edit `about.html` around line 40:
- Replace the story with your restaurant's history
- Keep it 2-3 paragraphs
- Make it personal and authentic

### Team Members
Edit the team section (around line 120):
```html
<div class="team-member">
    <div class="team-image">
        <i class="fas fa-user-tie"></i>
        <!-- OR replace with actual photo -->
    </div>
    <h3>Person Name</h3>
    <p class="role">Their Role</p>
    <p>Brief description</p>
</div>
```

## 📱 Testing Your Changes

### Before Going Live:

1. **Open in Browser**: Double-click `index.html`

2. **Test All Pages**: Click through every page

3. **Test Mobile View**:
   - Press F12 in browser
   - Click device icon (mobile view)
   - Try different screen sizes

4. **Test Contact Form**: Fill it out and submit

5. **Check Links**: Click all navigation and social links

6. **Spelling**: Proofread all content

## 🚀 Publishing Your Website

### Free Option - Netlify (Recommended):

1. Go to [netlify.com](https://www.netlify.com)
2. Sign up for free account
3. Drag your entire website folder
4. Your site is live!
5. Optional: Add custom domain

### Alternative - GitHub Pages:

1. Create GitHub account
2. Create new repository
3. Upload all files
4. Settings → Pages → Enable
5. Your site is live at `username.github.io/repository`

## ❓ Common Questions

### Q: How do I change the logo?
**A**: Currently using a pepper icon. To add custom logo:
```html
<!-- In navigation, replace this: -->
<i class="fas fa-pepper-hot"></i>
<!-- With this: -->
<img src="images/logo.png" alt="Logo" style="height: 40px;">
```

### Q: Can I add more pages?
**A**: Yes! Copy an existing HTML file, rename it, and update the navigation in all files.

### Q: How do I make the contact form send emails?
**A**: See README.md "Making the Contact Form Work" section. Easiest option is Formspree.

### Q: The colors aren't changing?
**A**: Make sure you're editing `css/styles.css` and refreshing your browser (Ctrl+F5 or Cmd+Shift+R).

### Q: Images aren't showing?
**A**: Check:
1. Image is in `images/` folder
2. Filename matches exactly (case-sensitive)
3. Path is correct: `images/filename.jpg`

## 🛠️ Need More Help?

### Changing Text:
- Open the .html file in any text editor
- Find the text you want to change
- Type the new text
- Save the file

### Changing Styles:
- Open `css/styles.css`
- Find the element you want to style
- Modify the properties
- Save and refresh browser

## ✅ Pre-Launch Checklist

- [ ] Restaurant name updated everywhere
- [ ] Contact info (phone, email, address) updated
- [ ] Business hours updated
- [ ] Social media links added
- [ ] Menu items customized
- [ ] About page story written
- [ ] Photos added (or placeholders removed)
- [ ] Google Maps updated
- [ ] All pages tested
- [ ] Mobile view tested
- [ ] Contact form tested
- [ ] Spelling checked
- [ ] Ready to publish!

---

**Pro Tip**: Make small changes and test frequently. It's easier to fix small issues than to debug everything at once!

**Still Stuck?** Most issues can be solved by:
1. Checking spelling of file names
2. Refreshing the browser (Ctrl+F5)
3. Making sure files are saved
4. Reviewing the code comments in the files
