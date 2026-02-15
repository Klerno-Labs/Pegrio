# 📸 How to Add Images to Your Website

## Quick Start

All images go in the `public/images/` folder. Here's how to use them:

### 1. Add Your Images

Place your images in these folders:

```
public/
  images/
    demos/          # Demo website screenshots
    hero/           # Hero section background
    testimonials/   # Client photos
    features/       # Feature screenshots
```

### 2. Use Images in Your Code

```tsx
// Import Next.js Image component (already done)
import Image from 'next/image'

// Use the image
<Image
  src="/images/demos/restaurant-demo.jpg"
  alt="Restaurant website demo"
  width={800}
  height={600}
  className="rounded-lg"
/>
```

---

## Examples

### Hero Section with Background Image

```tsx
<section className="relative bg-cover bg-center"
  style={{backgroundImage: "url('/images/hero/restaurant-bg.jpg')"}}>
  {/* Hero content */}
</section>
```

### Demo Screenshots

Replace the emoji placeholders with actual screenshots:

```tsx
<Image
  src="/images/demos/thai-restaurant.png"
  alt="Thai restaurant website"
  width={1200}
  height={800}
  className="rounded-2xl shadow-2xl"
/>
```

### Testimonial Photos

```tsx
<Image
  src="/images/testimonials/maria.jpg"
  alt="Maria Rodriguez"
  width={80}
  height={80}
  className="rounded-full"
/>
```

---

## Image Optimization Tips

### 1. **Resize Before Upload**
- Hero images: 1920x1080px
- Demo screenshots: 1200x800px
- Testimonials: 400x400px
- Icons/logos: 512x512px

### 2. **Compress Images**
Use tools like:
- TinyPNG (https://tinypng.com)
- Squoosh (https://squoosh.app)
- ImageOptim (Mac)

### 3. **Use WebP Format**
Next.js automatically converts images to WebP for better performance.

### 4. **Lazy Loading**
Next.js Image component handles this automatically!

---

## Where to Get Images

### Free Stock Photos
- **Unsplash**: https://unsplash.com/s/photos/restaurant
- **Pexels**: https://www.pexels.com/search/food/
- **Pixabay**: https://pixabay.com/images/search/restaurant/

### AI-Generated Images
- **Midjourney**: Create custom restaurant visuals
- **DALL-E 3**: Generate food photography
- **Stable Diffusion**: Free AI image generation

### Take Screenshots
For demo sites:
1. Build the actual restaurant website
2. Use a screenshot tool (Windows: `Win + Shift + S`)
3. Save to `public/images/demos/`

---

## Quick Implementation

### Replace Demo Card Images

In `app/page.tsx`, find the `DemoCard` component and add:

```tsx
function DemoCard({ tier, icon, name, description, gradient, isPopular, imageUrl }: {
  tier: string
  icon: string
  name: string
  description: string
  gradient: string
  isPopular?: boolean
  imageUrl?: string  // NEW
}) {
  return (
    <div className="...">
      <div className={`relative h-72 bg-gradient-to-br ${gradient} ...`}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="...">
            <span className="text-8xl">{icon}</span>
            <p className="text-3xl font-bold">{name}</p>
          </div>
        )}
      </div>
      ...
    </div>
  )
}
```

Then use it:

```tsx
<DemoCard
  tier="Essential"
  icon="🌮"
  name="The Simple Taco"
  imageUrl="/images/demos/simple-taco.jpg"  // NEW
  ...
/>
```

---

## Placeholders Until You Have Real Images

Use these services for placeholder images:

```tsx
// Placeholder service
<Image
  src="https://placehold.co/1200x800/2563eb/white?text=Restaurant+Demo"
  alt="Demo"
  width={1200}
  height={800}
/>

// Or use Unsplash's API for random food images
<Image
  src="https://source.unsplash.com/1200x800/?restaurant,food"
  alt="Restaurant"
  width={1200}
  height={800}
/>
```

---

## Best Practices

✅ **DO:**
- Use descriptive file names: `thai-restaurant-demo.jpg` not `img1.jpg`
- Add alt text for accessibility
- Use Next.js `<Image>` component (not `<img>`)
- Keep images under 500KB
- Use WebP or JPEG format

❌ **DON'T:**
- Upload massive uncompressed images
- Use spaces in filenames
- Forget alt text
- Use PNG for photos (use JPEG/WebP instead)
- Hotlink images from other sites

---

## Ready-to-Use Image Sizes

```
Hero Background:     1920x1080px (landscape)
Demo Screenshots:    1200x800px (landscape)
Feature Images:      800x600px (landscape)
Testimonial Photos:  400x400px (square)
Logo:                512x512px (square)
Icons:               256x256px (square)
Mobile Screenshots:  750x1334px (portrait)
```

---

## Example: Complete Demo Section with Images

```tsx
<DemoCard
  tier="Essential"
  icon="🌮"
  name="The Simple Taco"
  description="Clean, professional 5-page site with menu display"
  gradient="from-orange-500 to-red-600"
  imageUrl="/images/demos/simple-taco-demo.jpg"
/>

<DemoCard
  tier="Professional"
  icon="🍜"
  name="Thai Way 6"
  description="Full-featured with online ordering and custom design"
  gradient="from-purple-500 to-indigo-600"
  imageUrl="/images/demos/thai-way-6-demo.jpg"
  isPopular
/>

<DemoCard
  tier="Premium"
  icon="🍝"
  name="Bella Vita Italian"
  description="Enterprise solution with payments, accounts, and analytics"
  gradient="from-pink-500 to-rose-600"
  imageUrl="/images/demos/bella-vita-demo.jpg"
/>
```

---

Need help? Just ask! 🚀
