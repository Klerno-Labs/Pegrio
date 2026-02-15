# Quick Start Guide - Spice Symphony

## 🚀 Get Started in 3 Steps

1. **Open the website**
   - Navigate to the project folder
   - Double-click `index.html` to open in your browser
   - Or use a local server (recommended for best experience)

2. **Explore the features**
   - Click "Order Now" or "View Menu" to see the menu
   - Add items to cart
   - Try the filters and search
   - Complete a test order

3. **Customize for your client**
   - Update restaurant name, colors, and info
   - Modify menu items in `js/menu-data.js`
   - Change contact details in HTML files

## 🎯 Demo the Professional Plan Features

### Show the Complete Website (8 Pages)
1. **Home** - `index.html` - Hero, popular dishes, reviews
2. **Menu** - `menu.html` - Full menu with filtering
3. **Cart** - `cart.html` - Shopping cart
4. **Checkout** - `checkout.html` - Payment and delivery
5. **Confirmation** - `order-confirmation.html` - Order tracking
6. **About** - `about.html` - Story and team
7. **Contact** - `contact.html` - Contact form and map
8. **Reviews** - `reviews.html` - Customer testimonials

### Demo the Online Ordering System
1. Go to Menu page
2. Add items to cart (try "Tacos al Pastor")
3. Click cart icon → Review cart
4. Change quantity or remove items
5. Select "Delivery" or "Pickup"
6. Click "Proceed to Checkout"
7. Fill out the form (use test data)
8. Submit order → See confirmation page

### Show Advanced Menu Features
1. **Categories** - Click different category buttons
2. **Filters** - Check dietary preferences (Vegetarian, Vegan, etc.)
3. **Search** - Type "burrito" or "taco"
4. **Sort** - Try sorting by price or name

### Highlight Google Reviews
1. Go to Reviews page
2. Show the 4.8-star rating
3. Filter by rating (5 stars, 4 stars)
4. Sort by helpful or recent

### Point Out SEO Features
- Right-click → View Page Source
- Show meta descriptions
- Show Open Graph tags
- Point out semantic HTML structure

## 🎨 Customization Quick Reference

### Change Restaurant Name
Search and replace "Spice Symphony" in all HTML files

### Change Colors
Edit `css/main.css` lines 8-10:
```css
--primary-color: #FF6B35;
--secondary-color: #F7931E;
--accent-color: #FFD23F;
```

### Update Contact Info
Search for these in HTML files:
- Phone: (555) 123-4567
- Email: info@lacasadelsol.com
- Address: 123 Main Street, City, ST 12345

### Modify Menu Items
Edit `js/menu-data.js` - Add/remove/edit items in the array

### Change Hours
Update in footer sections of HTML files

## 📱 Test Responsive Design

1. **Desktop** - View normally
2. **Tablet** - Resize browser to ~768px width
3. **Mobile** - Resize to ~375px width or use browser DevTools
4. **Mobile Menu** - Click hamburger menu on mobile view

## 🔍 Feature Checklist for Client Demo

- [ ] Show all 8 pages
- [ ] Demo complete ordering process
- [ ] Filter menu by categories
- [ ] Search for menu items
- [ ] Show dietary filters working
- [ ] Display reviews with filtering
- [ ] Show Instagram feed
- [ ] Demo contact form
- [ ] Show responsive design (resize browser)
- [ ] Point out mobile menu
- [ ] Highlight security features (input sanitization)
- [ ] Show performance (fast loading)
- [ ] Demonstrate SEO features (meta tags)

## 🎬 Suggested Demo Flow

1. **Introduction** (1 min)
   - "This is Spice Symphony, a demo Indian restaurant"
   - "Showcases all Professional Plan features"

2. **Homepage Tour** (2 min)
   - Hero section with call-to-action
   - Popular dishes
   - Customer reviews
   - Instagram feed

3. **Menu System** (3 min)
   - Show all categories
   - Filter by dietary preferences
   - Search functionality
   - Add to cart

4. **Ordering Process** (3 min)
   - Cart management
   - Delivery vs Pickup
   - Checkout form
   - Order confirmation with tracking

5. **Additional Pages** (2 min)
   - About page - story and team
   - Contact page - form and location
   - Reviews page - filtering and sorting

6. **Technical Features** (2 min)
   - Responsive design
   - SEO optimization
   - Security features
   - Performance

7. **Customization** (2 min)
   - Easy to update content
   - Color scheme changes
   - Menu modifications

## 💡 Pro Tips

- **Use a local server** for best experience:
  ```bash
  python -m http.server 8000
  # or
  npx serve
  ```

- **Test the order flow** before showing to client
- **Have menu items ready** that match their restaurant
- **Customize colors** to match their brand before demo
- **Replace emoji placeholders** with real food photos for production

## 🐛 Common Issues

**Cart count not updating?**
- Refresh the page

**Styles not loading?**
- Make sure you're opening from the project root
- Check browser console for errors

**Order confirmation blank?**
- Complete the full order process
- Don't navigate directly to confirmation page

## 📞 Support

For questions or modifications, refer to:
- Full documentation in [README.md](README.md)
- Code comments in each file
- Browser console for debugging

---

**Ready to impress your clients!** 🌮✨
