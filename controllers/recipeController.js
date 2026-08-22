const env = require('../config/env');

// Curated Fallback Recipe Dataset (Used when Spoonacular API Key is not set or rate limited)
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
    title: 'Avocado & Poached Egg Protein Toast',
    category: 'Breakfast',
    diets: ['Vegetarian', 'High Fiber', 'Clean Eating', 'Quickly Prepared', 'On the Go'],
    prepTime: '5 min',
    cookTime: '5 min',
    difficulty: 'Easy',
    cal: 290,
    protein: 16,
    carbs: 24,
    fat: 15,
    calRange: '200–300 kcal',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
    description: 'Toasted whole wheat sourdough bread topped with mashed avocado, chili flakes, and two soft-poached eggs.',
    ingredients: [
      { name: 'Whole Wheat Sourdough Slice', amount: 1, unit: 'piece' },
      { name: 'Fresh Organic Eggs', amount: 2, unit: 'piece' },
      { name: 'Hass Avocado', amount: 50, unit: 'g' }
    ],
    steps: [
      'Toast sourdough slice until golden and crispy.',
      'Mash avocado with lemon juice and sea salt.',
      'Poach 2 eggs for 3 minutes and place on top of mashed avocado toast.'
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

// Helper to determine calorie range tag
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
 * Controller: Search & Fetch Recipes via Spoonacular API (or Fallback Engine)
 */
exports.searchRecipes = async (req, res) => {
  const { query, category, diet, minCal, maxCal } = req.query;
  const apiKey = env.SPOONACULAR_API_KEY;

  console.log(`[Recipes API] Request received. Query: "${query || ''}", Category: "${category || ''}", Diet: "${diet || ''}", Spoonacular Key: ${apiKey ? 'PRESENT' : 'NOT SET'}`);

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
      if (!response.ok) {
        throw new Error(`Spoonacular API returned status ${response.status}`);
      }

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
    } catch (err) {
      console.warn('[Recipes API] Spoonacular fetch failed or rate limited:', err.message);
    }
  }

  // Fallback engine if no Spoonacular key or request failed
  let filtered = [...FALLBACK_RECIPES];

  if (query && query.trim()) {
    const q = query.toLowerCase().trim();
    filtered = filtered.filter(r => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q));
  }

  if (category && category !== 'All') {
    filtered = filtered.filter(r => r.category.toLowerCase() === category.toLowerCase() || r.diets.includes(category));
  }

  res.json({ source: 'fallback', recipes: filtered });
};
