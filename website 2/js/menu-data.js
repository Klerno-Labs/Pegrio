// ========================================
// Menu Data - All menu items
// ========================================

const menuItems = [
    // Curries
    {
        id: 1,
        name: 'Butter Chicken',
        category: 'curries',
        price: 15.99,
        description: 'Tender chicken in creamy tomato sauce with aromatic spices',
        emoji: '🍛',
        tags: [],
        popular: true
    },
    {
        id: 2,
        name: 'Chicken Tikka Masala',
        category: 'curries',
        price: 15.99,
        description: 'Grilled chicken in rich, spiced tomato-based curry sauce',
        emoji: '🍛',
        tags: ['spicy'],
        popular: true
    },
    {
        id: 3,
        name: 'Lamb Rogan Josh',
        category: 'curries',
        price: 17.99,
        description: 'Aromatic lamb curry with Kashmiri spices and yogurt',
        emoji: '🍛',
        tags: ['spicy'],
        popular: false
    },
    {
        id: 4,
        name: 'Palak Paneer',
        category: 'curries',
        price: 13.99,
        description: 'Spinach curry with cottage cheese cubes and spices',
        emoji: '🍛',
        tags: ['vegetarian'],
        popular: true
    },
    {
        id: 5,
        name: 'Chana Masala',
        category: 'curries',
        price: 12.99,
        description: 'Chickpeas cooked in tangy tomato and onion sauce',
        emoji: '🍛',
        tags: ['vegetarian', 'vegan'],
        popular: false
    },
    {
        id: 6,
        name: 'Vindaloo',
        category: 'curries',
        price: 16.99,
        description: 'Fiery Goan curry with your choice of meat',
        emoji: '🍛',
        tags: ['spicy'],
        popular: false
    },

    // Biryanis
    {
        id: 7,
        name: 'Chicken Biryani',
        category: 'biryanis',
        price: 14.99,
        description: 'Fragrant basmati rice with spiced chicken and herbs',
        emoji: '🍚',
        tags: [],
        popular: true
    },
    {
        id: 8,
        name: 'Lamb Biryani',
        category: 'biryanis',
        price: 16.99,
        description: 'Aromatic rice layered with tender lamb and saffron',
        emoji: '🍚',
        tags: [],
        popular: true
    },
    {
        id: 9,
        name: 'Vegetable Biryani',
        category: 'biryanis',
        price: 12.99,
        description: 'Mixed vegetables with basmati rice and exotic spices',
        emoji: '🍚',
        tags: ['vegetarian', 'vegan'],
        popular: false
    },
    {
        id: 10,
        name: 'Hyderabadi Biryani',
        category: 'biryanis',
        price: 17.99,
        description: 'Traditional Hyderabadi style with aromatic spices',
        emoji: '🍚',
        tags: ['spicy'],
        popular: true
    },

    // Tandoori
    {
        id: 11,
        name: 'Tandoori Chicken',
        category: 'tandoori',
        price: 14.99,
        description: 'Chicken marinated in yogurt and spices, grilled in clay oven',
        emoji: '🍗',
        tags: ['spicy'],
        popular: true
    },
    {
        id: 12,
        name: 'Chicken Tikka',
        category: 'tandoori',
        price: 13.99,
        description: 'Boneless chicken pieces marinated and grilled',
        emoji: '🍗',
        tags: [],
        popular: true
    },
    {
        id: 13,
        name: 'Seekh Kebab',
        category: 'tandoori',
        price: 14.99,
        description: 'Minced lamb skewers with herbs and spices',
        emoji: '🍢',
        tags: [],
        popular: false
    },
    {
        id: 14,
        name: 'Paneer Tikka',
        category: 'tandoori',
        price: 12.99,
        description: 'Cottage cheese cubes marinated in spices and grilled',
        emoji: '🧀',
        tags: ['vegetarian'],
        popular: true
    },
    {
        id: 15,
        name: 'Tandoori Prawns',
        category: 'tandoori',
        price: 16.99,
        description: 'Jumbo prawns marinated and cooked in tandoor',
        emoji: '🍤',
        tags: ['spicy'],
        popular: false
    },

    // Breads
    {
        id: 16,
        name: 'Butter Naan',
        category: 'breads',
        price: 3.99,
        description: 'Soft leavened bread brushed with butter',
        emoji: '🫓',
        tags: ['vegetarian'],
        popular: true
    },
    {
        id: 17,
        name: 'Garlic Naan',
        category: 'breads',
        price: 4.49,
        description: 'Naan topped with fresh garlic and cilantro',
        emoji: '🫓',
        tags: ['vegetarian'],
        popular: true
    },
    {
        id: 18,
        name: 'Cheese Naan',
        category: 'breads',
        price: 4.99,
        description: 'Naan stuffed with melted cheese',
        emoji: '🫓',
        tags: ['vegetarian'],
        popular: false
    },
    {
        id: 19,
        name: 'Roti (Chapati)',
        category: 'breads',
        price: 2.99,
        description: 'Whole wheat unleavened flatbread',
        emoji: '🫓',
        tags: ['vegetarian', 'vegan'],
        popular: false
    },
    {
        id: 20,
        name: 'Paratha',
        category: 'breads',
        price: 3.99,
        description: 'Layered whole wheat flatbread',
        emoji: '🫓',
        tags: ['vegetarian'],
        popular: false
    },

    // Appetizers
    {
        id: 21,
        name: 'Samosa (2 pcs)',
        category: 'appetizers',
        price: 5.99,
        description: 'Crispy pastries filled with spiced potatoes and peas',
        emoji: '🥟',
        tags: ['vegetarian', 'vegan'],
        popular: true
    },
    {
        id: 22,
        name: 'Pakora',
        category: 'appetizers',
        price: 6.99,
        description: 'Mixed vegetable fritters in chickpea batter',
        emoji: '🍤',
        tags: ['vegetarian', 'vegan'],
        popular: true
    },
    {
        id: 23,
        name: 'Chicken 65',
        category: 'appetizers',
        price: 8.99,
        description: 'Spicy fried chicken with curry leaves and chilies',
        emoji: '🍗',
        tags: ['spicy'],
        popular: true
    },
    {
        id: 24,
        name: 'Paneer Pakora',
        category: 'appetizers',
        price: 7.99,
        description: 'Cottage cheese fritters with mint chutney',
        emoji: '🧀',
        tags: ['vegetarian'],
        popular: false
    },
    {
        id: 25,
        name: 'Papadum',
        category: 'appetizers',
        price: 2.99,
        description: 'Crispy lentil wafers with chutneys',
        emoji: '🍘',
        tags: ['vegetarian', 'vegan', 'gluten-free'],
        popular: false
    },

    // Desserts
    {
        id: 26,
        name: 'Gulab Jamun',
        category: 'desserts',
        price: 5.99,
        description: 'Sweet milk dumplings in rose-flavored syrup',
        emoji: '🍡',
        tags: ['vegetarian'],
        popular: true
    },
    {
        id: 27,
        name: 'Kheer (Rice Pudding)',
        category: 'desserts',
        price: 5.49,
        description: 'Creamy rice pudding with cardamom and nuts',
        emoji: '🍮',
        tags: ['vegetarian', 'gluten-free'],
        popular: true
    },
    {
        id: 28,
        name: 'Kulfi',
        category: 'desserts',
        price: 4.99,
        description: 'Traditional Indian ice cream with pistachios',
        emoji: '🍦',
        tags: ['vegetarian', 'gluten-free'],
        popular: false
    },
    {
        id: 29,
        name: 'Rasmalai',
        category: 'desserts',
        price: 6.49,
        description: 'Soft cheese dumplings in sweet milk sauce',
        emoji: '🍰',
        tags: ['vegetarian'],
        popular: false
    },

    // Drinks
    {
        id: 30,
        name: 'Mango Lassi',
        category: 'drinks',
        price: 4.99,
        description: 'Sweet yogurt drink blended with mango',
        emoji: '🥤',
        tags: ['vegetarian'],
        popular: true
    },
    {
        id: 31,
        name: 'Sweet Lassi',
        category: 'drinks',
        price: 3.99,
        description: 'Traditional yogurt drink sweetened with sugar',
        emoji: '🥤',
        tags: ['vegetarian'],
        popular: true
    },
    {
        id: 32,
        name: 'Salt Lassi',
        category: 'drinks',
        price: 3.99,
        description: 'Savory yogurt drink with cumin and salt',
        emoji: '🥤',
        tags: ['vegetarian'],
        popular: false
    },
    {
        id: 33,
        name: 'Masala Chai',
        category: 'drinks',
        price: 3.49,
        description: 'Spiced Indian tea with milk',
        emoji: '☕',
        tags: ['vegetarian'],
        popular: true
    },
    {
        id: 34,
        name: 'Rose Sherbet',
        category: 'drinks',
        price: 3.99,
        description: 'Refreshing rose-flavored drink',
        emoji: '🥤',
        tags: ['vegetarian', 'vegan'],
        popular: false
    },
    {
        id: 35,
        name: 'Nimbu Pani (Lemonade)',
        category: 'drinks',
        price: 3.49,
        description: 'Fresh lemon drink with mint and spices',
        emoji: '🍋',
        tags: ['vegetarian', 'vegan', 'gluten-free'],
        popular: false
    }
];
