# La Casa de Sabor - Restaurant Website

A professional, mobile-responsive website for a Mexican restaurant. This is a demonstration of what can be built at the Essential plan price point.

## 🌟 Features

✅ **5 Pages**: Home, Menu, About, Gallery, Contact
✅ **Mobile-Responsive Design**: Optimized for all devices
✅ **Professional Template**: 3 color schemes to choose from
✅ **Menu Display**: Complete menu without online ordering
✅ **Contact Form**: Fully functional with validation
✅ **Google Maps Integration**: Embedded location map
✅ **Social Media Links**: Facebook, Instagram, Twitter, Yelp
✅ **Basic SEO Setup**: Meta tags, descriptions, keywords
✅ **Smooth Animations**: Professional transitions and effects

## 📁 File Structure

```
website/
├── index.html          # Home page
├── menu.html           # Menu page
├── about.html          # About page
├── gallery.html        # Gallery page
├── contact.html        # Contact page
├── css/
│   └── styles.css      # All styling (3 color schemes included)
├── js/
│   └── script.js       # Interactive functionality
├── images/             # Place your images here
└── README.md           # This file
```

## 🎨 Customization Guide

### 1. Change Color Scheme

Open `css/styles.css` and find the COLOR SCHEMES section at the top. Three schemes are provided:

**Current Active Scheme**: Warm Mexican (red/orange)

To switch to a different scheme:
1. Comment out the current scheme by wrapping it in `/* */`
2. Uncomment your preferred scheme by removing `/* */`

**Available Schemes**:
- Scheme 1: Warm Mexican (Red/Orange) - Currently Active
- Scheme 2: Modern Earthy (Brown/Amber)
- Scheme 3: Vibrant Fiesta (Pink/Orange)

### 2. Replace Placeholder Images

The gallery and about sections use placeholder images. To add real images:

1. Add your images to the `images/` folder
2. Replace placeholder divs in HTML files with:
```html
<img src="images/your-image.jpg" alt="Description">
```

**Recommended image locations**:
- Hero background: index.html (line ~30)
- About section: about.html (line ~50)
- Gallery items: gallery.html (throughout)

### 3. Update Google Maps Location

In `contact.html`, find the iframe with Google Maps (around line 150):

**Steps to update**:
1. Go to [Google Maps](https://www.google.com/maps)
2. Search for your restaurant address
3. Click "Share" → "Embed a map"
4. Copy the iframe code
5. Replace the existing iframe in contact.html

### 4. Update Restaurant Information

**Contact Details** (Update in ALL pages' footers):
- Address: `123 Main Street, Anytown, USA`
- Phone: `(555) 123-4567`
- Email: `info@lacasadesabor.com`

**Business Hours** (Update in footer):
- Located in footer section of each page

**Social Media Links**:
- Found in footer of each page
- Replace `https://facebook.com` with your actual links

### 5. Customize Menu Items

Edit `menu.html` to update:
- Dish names
- Descriptions
- Prices
- Categories

### 6. Update Meta Tags for SEO

In each HTML file's `<head>` section, update:
```html
<meta name="description" content="Your description">
<meta name="keywords" content="your, keywords, here">
<title>Your Page Title</title>
```

## 🚀 Going Live

### Option 1: Simple Hosting (Free)
1. **GitHub Pages**:
   - Create a GitHub repository
   - Upload all files
   - Enable GitHub Pages in settings
   - Your site will be at: `username.github.io/repository`

2. **Netlify** (Recommended):
   - Create account at [netlify.com](https://netlify.com)
   - Drag and drop your website folder
   - Get instant HTTPS and custom domain support

### Option 2: Professional Hosting
- Purchase hosting (Bluehost, SiteGround, etc.)
- Upload files via FTP
- Point your domain to the hosting

## 🔧 Making the Contact Form Work

The contact form currently shows a success message but doesn't send emails. To make it functional:

### Option 1: Formspree (Easiest)
1. Go to [formspree.io](https://formspree.io)
2. Create a free account
3. Add this to contact form in `contact.html`:
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

### Option 2: EmailJS
1. Sign up at [emailjs.com](https://www.emailjs.com/)
2. Follow their integration guide
3. Update the JavaScript in `js/script.js`

### Option 3: Server-side (Advanced)
- Requires PHP, Node.js, or other backend
- Add email sending functionality to your server

## 📱 Mobile Responsiveness

The site is fully responsive with breakpoints at:
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: Below 768px

Test on different devices or use browser DevTools.

## ✨ Additional Features You Can Add

This is the Essential plan. For additional features, consider:
- Online ordering system
- Table reservations
- Customer reviews integration
- Blog section
- Email newsletter signup
- Multi-language support
- Advanced SEO optimization

## 🆘 Support & Customization

Need help customizing or want additional features?
- Review the code comments for guidance
- Adjust colors in CSS variables
- Modify text content directly in HTML files

## 📝 Notes for Your Clients

This website demonstrates what's included in the **Essential Plan**:

✅ 5 professional pages
✅ Mobile-responsive design
✅ Contact form
✅ Google Maps integration
✅ Social media links
✅ Basic SEO
✅ Menu display (no online ordering)

**Perfect for**:
- Small to medium restaurants
- Cafes and bistros
- Food trucks
- Catering businesses

**Timeline**: 1-2 weeks for custom version
**Revisions**: 2 rounds included
**Support**: 30 days included

## 🔐 Before Launch Checklist

- [ ] Replace all "La Casa de Sabor" with your restaurant name
- [ ] Update all contact information
- [ ] Add real images
- [ ] Update Google Maps location
- [ ] Test contact form
- [ ] Update social media links
- [ ] Test on mobile devices
- [ ] Check all links work
- [ ] Review SEO meta tags
- [ ] Test in different browsers

## 📄 License

This template is created as a demonstration. Customize freely for your clients.

---

**Built with ❤️ using HTML, CSS, and JavaScript**
