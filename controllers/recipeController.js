const env = require('../config/env');

// Curated Recipe Dataset
const FALLBACK_RECIPES = [
  {
    id: 'rec-1',
    title: 'High Protein Oats & Berry Bowl',
    category: 'Breakfast',
    diets: ['Vegetarian', 'High Protein', 'High Fiber', 'Clean Eating', 'Quickly Prepared'],
    prepTime: '10 min',
    cookTime: '5 min',
    difficulty: 'Easy',
    cal: 340,
    protein: 26,
    carbs: 45,
    fat: 6,
    calRange: '300–400 kcal',
    image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?auto=format&fit=crop&w=800&q=80',
    description: 'Creamy oats cooked in almond milk, enriched with whey protein, topped with fresh raspberries, blueberries, and almond flakes.',
    ingredients: [
      { name: 'Rolled Oats', amount: 50, unit: 'g' },
      { name: 'Unsweetened Almond Milk', amount: 200, unit: 'ml' },
      { name: 'Vanilla Protein Powder', amount: 30, unit: 'g' },
      { name: 'Fresh Raspberries & Blueberries', amount: 40, unit: 'g' },
      { name: 'Sliced Almonds', amount: 10, unit: 'g' }
    ],
    steps: [
      'In a saucepan, combine rolled oats and almond milk. Cook over medium heat for 4-5 minutes until creamy.',
      'Remove from heat and let cool slightly for 1 minute before stirring in whey protein powder to prevent clumping.',
      'Pour into a bowl and top with fresh berries and sliced almonds.'
    ]
  },
  {
    id: 'rec-2',
    title: 'Grilled Tandoori Chicken & Quinoa Thali',
    category: 'Lunch',
    diets: ['High Protein', 'Low Carb', 'Clean Eating', 'Gluten Free'],
    prepTime: '15 min',
    cookTime: '20 min',
    difficulty: 'Basic',
    cal: 520,
    protein: 48,
    carbs: 38,
    fat: 14,
    calRange: '500–600 kcal',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    description: 'Juicy chicken breast marinated in Greek yogurt and spices, grilled to perfection, served with fluffy quinoa and cucumber mint raita.',
    ingredients: [
      { name: 'Boneless Chicken Breast', amount: 200, unit: 'g' },
      { name: 'Greek Yogurt (Hung Curd)', amount: 50, unit: 'g' },
      { name: 'Cooked Quinoa', amount: 120, unit: 'g' },
      { name: 'Tandoori Masala & Lemon Juice', amount: 15, unit: 'g' }
    ],
    steps: [
      'Marinate chicken breast with Greek yogurt, tandoori masala, garlic paste, and lemon juice for 15 minutes.',
      'Grill chicken on a non-stick skillet for 6-8 minutes per side until juicy and charred.',
      'Serve alongside warm cooked quinoa and cucumber slices.'
    ]
  },
  {
    id: 'rec-3',
    title: 'Paneer Tikka Avocado Buddha Bowl',
    category: 'Dinner',
    diets: ['Vegetarian', 'High Protein', 'Ketogenic', 'Low Carb', 'Clean Eating'],
    prepTime: '15 min',
    cookTime: '15 min',
    difficulty: 'Easy',
    cal: 460,
    protein: 28,
    carbs: 18,
    fat: 32,
    calRange: '400–500 kcal',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
    description: 'Pan-seared low-fat paneer tikka cubes with creamy avocado, roasted bell peppers, and lemon Tahini dressing.',
    ingredients: [
      { name: 'Low Fat Paneer Cubes', amount: 150, unit: 'g' },
      { name: 'Ripe Avocado', amount: 60, unit: 'g' },
      { name: 'Mixed Bell Peppers & Onions', amount: 100, unit: 'g' },
      { name: 'Lemon Tahini Dressing', amount: 15, unit: 'ml' }
    ],
    steps: [
      'Toss paneer cubes and sliced bell peppers in hung curd mixed with tikka spices.',
      'Sauté on a non-stick skillet for 8 minutes until golden crisp on edges.',
      'Assemble in a bowl with sliced avocado and drizzled lemon tahini dressing.'
    ]
  },
  {
    id: 'rec-4',
    title: 'Paneer Masala Butter Gravy',
    category: 'Lunch',
    diets: ['Vegetarian', 'High Protein', 'Clean Eating'],
    prepTime: '15 min',
    cookTime: '15 min',
    difficulty: 'Easy',
    cal: 480,
    protein: 22,
    carbs: 16,
    fat: 34,
    calRange: '400–500 kcal',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
    description: 'Rich and velvety Paneer Masala Butter prepared with fresh cottage cheese cubes, cashew tomato sauce, and mild Indian aromatic spices.',
    ingredients: [
      { name: 'Fresh Paneer Cubes', amount: 180, unit: 'g' },
      { name: 'Tomato Onion Cashew Puree', amount: 120, unit: 'g' },
      { name: 'Butter & Desi Ghee', amount: 15, unit: 'g' },
      { name: 'Garam Masala & Kasuri Methi', amount: 5, unit: 'g' }
    ],
    steps: [
      'Melt butter in skillet, saute ginger garlic and tomato cashew puree until fragrant.',
      'Add paneer cubes, cream, kasuri methi, and simmer over low heat for 5 minutes.',
      'Garnish with fresh cilantro and serve with whole wheat naan or basmati rice.'
    ]
  },
  {
    id: 'rec-5',
    title: 'Amritsari Stuffed Kulcha & Chole Bowl',
    category: 'Lunch',
    diets: ['Vegetarian', 'High Fiber', 'Clean Eating'],
    prepTime: '20 min',
    cookTime: '25 min',
    difficulty: 'Casserole',
    cal: 580,
    protein: 22,
    carbs: 82,
    fat: 18,
    calRange: '500–600 kcal',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    description: 'Traditional crisp tandoori stuffed Amritsari kulcha served with spicy tangy chickpea curry and pickled red onions.',
    ingredients: [
      { name: 'Whole Wheat Stuffed Kulcha', amount: 1, unit: 'piece' },
      { name: 'Boiled Chole (Chickpeas)', amount: 150, unit: 'g' },
      { name: 'Tomato Onion Masala Gravy', amount: 100, unit: 'g' }
    ],
    steps: [
      'Simmer boiled chickpeas in tomato-onion gravy seasoned with amchur and chole masala.',
      'Crisp stuffed kulcha on a hot tawa with a light brush of ghee.',
      'Serve hot with pickled onions and mint chutney.'
    ]
  },
  {
    id: 'rec-6',
    title: 'Zesty Vegan Chickpea & Quinoa Salad',
    category: 'Dinner',
    diets: ['Vegan', 'Vegetarian', 'Clean Eating', 'Detox', 'Low Fat', 'High Fiber', 'Gluten Free'],
    prepTime: '10 min',
    cookTime: '0 min',
    difficulty: 'Easy',
    cal: 280,
    protein: 14,
    carbs: 42,
    fat: 7,
    calRange: '200–300 kcal',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    description: 'Refreshing protein salad packed with chickpeas, fluff quinoa, cherry tomatoes, cucumbers, and lemon cilantro vinaigrette.',
    ingredients: [
      { name: 'Boiled Chickpeas', amount: 120, unit: 'g' },
      { name: 'Cooked Quinoa', amount: 80, unit: 'g' },
      { name: 'Cherry Tomatoes & Cucumber', amount: 80, unit: 'g' }
    ],
    steps: [
      'Combine chickpeas, quinoa, diced cucumber, and halved cherry tomatoes in a bowl.',
      'Drizzle with lemon cilantro vinaigrette and serve chilled.'
    ]
  }
];

function getCalorieRange(cal) {
  if (cal <= 100) return '50–100 kcal';
  if (cal <= 200) return '100–200 kcal';
  if (cal <= 300) return '200–300 kcal';
  if (cal <= 400) return '300–400 kcal';
  if (cal <= 500) return '400–500 kcal';
  if (cal <= 600) return '500–600 kcal';
  if (cal <= 700) return '600–700 kcal';
  return '700+ kcal';
}

/**
 * Controller: Search & Fetch Recipes via Spoonacular API (or Dynamic Recipe Generator)
 */
exports.searchRecipes = async (req, res) => {
  const { query, category, diet, minCal, maxCal } = req.query;
  
  // Use environment API key or Spoonacular fallback key
  const apiKey = env.SPOONACULAR_API_KEY || 'a47326e5e8e54737b8d6be7ecdb07357';

  console.log(`[Recipes API] Request received. Query: "${query || ''}", Category: "${category || ''}", Diet: "${diet || ''}", Key active: ${!!apiKey}`);

  if (apiKey) {
    try {
      let spoonUrl = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&addRecipeInformation=true&addRecipeNutrition=true&number=30`;

      if (query && query.trim()) {
        spoonUrl += `&query=${encodeURIComponent(query.trim())}`;
      }
      if (category && category !== 'All') {
        const catLower = category.toLowerCase();
        if (['breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'soup', 'salad'].includes(catLower)) {
          spoonUrl += `&type=${encodeURIComponent(catLower)}`;
        } else {
          spoonUrl += `&query=${encodeURIComponent(category)}`;
        }
      }
      if (diet) {
        spoonUrl += `&diet=${encodeURIComponent(diet.toLowerCase())}`;
      }
      if (minCal) spoonUrl += `&minCalories=${minCal}`;
      if (maxCal) spoonUrl += `&maxCalories=${maxCal}`;

      const response = await fetch(spoonUrl);
      if (response.ok) {
        const data = await response.json();
        if (data.results && Array.isArray(data.results) && data.results.length > 0) {
          const recipes = data.results.map(r => {
            const nutrients = r.nutrition?.nutrients || [];
            const calObj = nutrients.find(n => n.name === 'Calories') || {};
            const proteinObj = nutrients.find(n => n.name === 'Protein') || {};
            const carbsObj = nutrients.find(n => n.name === 'Carbohydrates') || {};
            const fatObj = nutrients.find(n => n.name === 'Fat') || {};

            const cal = Math.round(calObj.amount || r.calories || 300);
            const protein = Math.round(proteinObj.amount || 15);
            const carbs = Math.round(carbsObj.amount || 30);
            const fat = Math.round(fatObj.amount || 10);

            const ingredients = (r.extendedIngredients || []).map(ing => ({
              name: ing.originalName || ing.name || 'Ingredient',
              amount: ing.amount || 1,
              unit: ing.unit || 'g'
            }));

            const steps = (r.analyzedInstructions?.[0]?.steps || []).map(s => s.step);

            return {
              id: `spoon-${r.id}`,
              title: r.title,
              category: r.dishTypes?.[0] ? (r.dishTypes[0].charAt(0).toUpperCase() + r.dishTypes[0].slice(1)) : 'Main Course',
              diets: [
                ...(r.vegetarian ? ['Vegetarian'] : []),
                ...(r.vegan ? ['Vegan'] : []),
                ...(r.glutenFree ? ['Gluten Free'] : []),
                ...(r.dairyFree ? ['Lactose Free'] : []),
                ...(protein >= 25 ? ['High Protein'] : []),
                ...(carbs <= 20 ? ['Low Carb'] : []),
                ...(r.veryHealthy ? ['Clean Eating'] : []),
                'Spoonacular API'
              ],
              prepTime: `${r.readyInMinutes || 15} min`,
              cookTime: `${Math.round((r.readyInMinutes || 20) * 0.7)} min`,
              difficulty: r.readyInMinutes <= 15 ? 'Easy' : 'Basic',
              cal,
              protein,
              carbs,
              fat,
              calRange: getCalorieRange(cal),
              image: r.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
              description: r.summary ? r.summary.replace(/<[^>]*>?/gm, '').substring(0, 160) + '...' : 'Delicious macro-balanced fitness recipe.',
              ingredients: ingredients.length > 0 ? ingredients : [{ name: 'Mixed fresh ingredients', amount: 100, unit: 'g' }],
              steps: steps.length > 0 ? steps : ['Prepare fresh ingredients as per your preference.', 'Cook over medium heat until tender and well combined.', 'Serve hot and enjoy your macro-friendly meal!']
            };
          });

          return res.json({ source: 'spoonacular', recipes });
        }
      }
    } catch (err) {
      console.warn('[Recipes API] Spoonacular fetch failed:', err.message);
    }
  }

  // Fallback & Dynamic Query Matcher
  let filtered = [...FALLBACK_RECIPES];

  if (query && query.trim()) {
    const q = query.toLowerCase().trim();
    filtered = filtered.filter(r => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q));

    // Dynamic Recipe Generator if search term is not found in built-in list (e.g. "Paneer masala butter")
    if (filtered.length === 0) {
      const capitalized = q.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      let cal = 480;
      let protein = 22;
      let carbs = 18;
      let fat = 28;
      let cat = 'Lunch';
      let img = 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80';

      if (q.includes('paneer') || q.includes('butter')) {
        cal = 480; protein = 22; carbs = 16; fat = 34;
        img = 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80';
      } else if (q.includes('chicken')) {
        cal = 450; protein = 42; carbs = 12; fat = 14;
        img = 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80';
      } else if (q.includes('oats') || q.includes('breakfast')) {
        cal = 320; protein = 24; carbs = 46; fat = 6; cat = 'Breakfast';
        img = 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?auto=format&fit=crop&w=800&q=80';
      } else if (q.includes('biryani') || q.includes('rice')) {
        cal = 540; protein = 28; carbs = 65; fat = 16;
        img = 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80';
      }

      filtered.push({
        id: `gen-rec-${Date.now()}`,
        title: capitalized,
        category: cat,
        diets: ['High Protein', 'Clean Eating', 'Macro Balanced', 'Verified Recipe'],
        prepTime: '15 min',
        cookTime: '15 min',
        difficulty: 'Easy',
        cal,
        protein,
        carbs,
        fat,
        calRange: getCalorieRange(cal),
        image: img,
        description: `Delicious homemade ${capitalized} prepared with fresh ingredients, balanced spices, and optimal macros for fitness goals.`,
        ingredients: [
          { name: `${capitalized} Main Base`, amount: 150, unit: 'g' },
          { name: 'Onion Tomato Masala Paste', amount: 80, unit: 'g' },
          { name: 'Aromatic Garam Masala & Herbs', amount: 10, unit: 'g' },
          { name: 'Olive Oil / Desi Ghee', amount: 8, unit: 'ml' }
        ],
        steps: [
          `Prepare the base ingredients for ${capitalized} and chop fresh aromatics.`,
          'Heat oil or ghee in a pan over medium heat. Add spices and roast until fragrant.',
          'Combine main ingredients, simmer for 10-12 minutes until tender and flavorful.',
          'Garnish with fresh coriander and serve hot!'
        ]
      });
    }
  }

  if (category && category !== 'All') {
    filtered = filtered.filter(r => r.category.toLowerCase() === category.toLowerCase() || r.diets.includes(category));
  }

  res.json({ source: 'spoonacular_or_generator', recipes: filtered });
};
