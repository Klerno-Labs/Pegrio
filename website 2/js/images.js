// ========================================
// Image Helper - Unsplash Integration
// ========================================

// Pexels image URLs for Indian food
const unsplashImages = {
    // Curries
    'Butter Chicken': 'https://images.pexels.com/photos/2474658/pexels-photo-2474658.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    'Chicken Tikka Masala': 'https://images.pexels.com/photos/6210749/pexels-photo-6210749.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    'Lamb Rogan Josh': 'https://images.pexels.com/photos/8879563/pexels-photo-8879563.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    'Palak Paneer': 'https://images.pexels.com/photos/5410401/pexels-photo-5410401.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    'Chana Masala': 'https://images.pexels.com/photos/6210747/pexels-photo-6210747.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    'Vindaloo': 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',

    // Biryanis
    'Chicken Biryani': 'https://images.pexels.com/photos/12737659/pexels-photo-12737659.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    'Lamb Biryani': 'https://images.pexels.com/photos/11629819/pexels-photo-11629819.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    'Vegetable Biryani': 'https://images.pexels.com/photos/16743486/pexels-photo-16743486.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    'Hyderabadi Biryani': 'https://images.pexels.com/photos/15774066/pexels-photo-15774066.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',

    // Tandoori
    'Tandoori Chicken': 'https://images.pexels.com/photos/6210959/pexels-photo-6210959.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    'Chicken Tikka': 'https://images.pexels.com/photos/7625056/pexels-photo-7625056.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    'Seekh Kebab': 'https://images.pexels.com/photos/6210960/pexels-photo-6210960.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    'Paneer Tikka': 'https://images.pexels.com/photos/14477891/pexels-photo-14477891.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    'Tandoori Prawns': 'https://images.pexels.com/photos/3763847/pexels-photo-3763847.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',

    // Breads
    'Butter Naan': 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    'Garlic Naan': 'https://images.pexels.com/photos/7625056/pexels-photo-7625056.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    'Cheese Naan': 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    'Roti (Chapati)': 'https://images.pexels.com/photos/5560762/pexels-photo-5560762.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    'Paratha': 'https://images.pexels.com/photos/7625058/pexels-photo-7625058.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',

    // Appetizers
    'Samosa (2 pcs)': 'https://images.pexels.com/photos/6249524/pexels-photo-6249524.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    'Pakora': 'https://images.pexels.com/photos/6210748/pexels-photo-6210748.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    'Chicken 65': 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    'Paneer Pakora': 'https://images.pexels.com/photos/6659350/pexels-photo-6659350.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    'Papadum': 'https://images.pexels.com/photos/7625058/pexels-photo-7625058.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',

    // Desserts
    'Gulab Jamun': 'https://images.pexels.com/photos/5560758/pexels-photo-5560758.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    'Kheer (Rice Pudding)': 'https://images.pexels.com/photos/7625059/pexels-photo-7625059.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    'Kulfi': 'https://images.pexels.com/photos/13998089/pexels-photo-13998089.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    'Rasmalai': 'https://images.pexels.com/photos/14477892/pexels-photo-14477892.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',

    // Drinks
    'Mango Lassi': 'https://images.pexels.com/photos/5560757/pexels-photo-5560757.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    'Sweet Lassi': 'https://images.pexels.com/photos/7625062/pexels-photo-7625062.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    'Salt Lassi': 'https://images.pexels.com/photos/7625062/pexels-photo-7625062.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    'Masala Chai': 'https://images.pexels.com/photos/7625060/pexels-photo-7625060.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    'Rose Sherbet': 'https://images.pexels.com/photos/5560757/pexels-photo-5560757.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    'Nimbu Pani (Lemonade)': 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=800&h=600'
};

// Get image URL for a dish
function getImageUrl(dishName) {
    return unsplashImages[dishName] || 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop';
}

// Instagram feed images
const instagramFeedImages = [
    'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1593010932917-92d3bc309053?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1619895092538-128341789043?w=500&h=500&fit=crop'
];

// Hero background images
const heroImages = [
    'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1920&h=1080&fit=crop'
];
