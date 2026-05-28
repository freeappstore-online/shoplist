export const CATEGORY_ORDER = [
  "Produce",
  "Dairy",
  "Meat & Fish",
  "Bakery",
  "Pantry",
  "Frozen",
  "Drinks",
  "Snacks",
  "Household",
  "Other",
] as const;

export type Category = (typeof CATEGORY_ORDER)[number];

const KEYWORDS: Record<Exclude<Category, "Other">, string[]> = {
  Produce: [
    "apple", "apples", "banana", "bananas", "orange", "oranges", "lemon", "lime",
    "tomato", "tomatoes", "potato", "potatoes", "onion", "onions", "garlic",
    "lettuce", "spinach", "kale", "carrot", "carrots", "cucumber", "pepper",
    "peppers", "broccoli", "cauliflower", "celery", "avocado", "berries",
    "strawberry", "strawberries", "blueberry", "blueberries", "grape", "grapes",
    "mushroom", "mushrooms", "ginger", "herbs", "basil", "parsley", "coriander",
    "cilantro", "mint", "salad", "fruit", "veg", "vegetable", "vegetables",
  ],
  Dairy: [
    "milk", "cheese", "butter", "yogurt", "yoghurt", "cream", "sour cream",
    "feta", "mozzarella", "cheddar", "parmesan", "egg", "eggs",
  ],
  "Meat & Fish": [
    "chicken", "beef", "pork", "lamb", "bacon", "ham", "sausage", "sausages",
    "mince", "steak", "fish", "salmon", "tuna", "prawn", "prawns", "shrimp",
    "turkey",
  ],
  Bakery: [
    "bread", "buns", "bun", "bagel", "bagels", "croissant", "croissants",
    "muffin", "muffins", "roll", "rolls", "baguette", "tortilla", "tortillas",
    "pita", "naan",
  ],
  Pantry: [
    "rice", "pasta", "noodles", "flour", "sugar", "salt", "pepper", "oil",
    "olive oil", "vinegar", "soy sauce", "sauce", "ketchup", "mustard",
    "mayo", "mayonnaise", "honey", "jam", "peanut butter", "cereal", "oats",
    "beans", "lentils", "stock", "broth", "tin", "can", "tomato sauce",
  ],
  Frozen: [
    "ice cream", "frozen", "pizza", "fries", "peas",
  ],
  Drinks: [
    "water", "juice", "coffee", "tea", "soda", "coke", "pepsi", "beer",
    "wine", "champagne", "spirits", "vodka", "whisky", "whiskey", "gin",
    "rum", "kombucha", "smoothie", "sparkling",
  ],
  Snacks: [
    "chips", "crisps", "chocolate", "candy", "lollies", "cookies", "biscuit",
    "biscuits", "crackers", "nuts", "popcorn", "pretzels", "snack", "snacks",
  ],
  Household: [
    "paper", "toilet paper", "tissue", "tissues", "soap", "shampoo",
    "conditioner", "toothpaste", "toothbrush", "detergent", "cleaner",
    "bleach", "spray", "sponge", "trash", "bin bags", "bin bag", "foil",
    "cling", "battery", "batteries", "lightbulb", "bulb", "candle", "candles",
  ],
};

export const categorize = (raw: string): Category => {
  const name = raw.toLowerCase().trim();
  if (!name) return "Other";
  for (const cat of CATEGORY_ORDER) {
    if (cat === "Other") continue;
    const list = KEYWORDS[cat as Exclude<Category, "Other">];
    for (const kw of list) {
      if (name === kw || name.includes(kw)) return cat;
    }
  }
  return "Other";
};
