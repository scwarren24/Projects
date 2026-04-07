import FoodEntry from '../models/food.js' 

// GET all food entries
export const getAllData = async (req, res) => {
  try {
    const foods = await FoodEntry.findAll();
    res.json(foods);
  } catch (error) {
    console.error("Error fetching all data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET all foods for a specific user
export const getDataById = async (req, res) => {
  const { userId } = req.params;
  try {
    const foods = await FoodEntry.findAll({
      where: { userId }
    });

    
    const maxId = foods.reduce((max, food) => Math.max(max, food.foodId), 0);
    res.status(200).json({
      nextFoodId: maxId + 1,
      foods
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST:
export const addData = async (req, res) => {
  try {
    const { userId, label, nutData } = req.body;

   
    const existingFoods = await FoodEntry.findAll({ where: { userId } });
    const nextFoodId = existingFoods.reduce((max, food) => Math.max(max, food.foodId), 0) + 1;

    const newFood = await FoodEntry.create({
      userId,
      foodId: nextFoodId,
      label,
      nutData
    });

    res.status(201).json({ message: "Food added", foodId: newFood.foodId });
  } catch (error) {
    console.error("Error adding food:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE:
export const deleteData = async (req, res) => {
  const { userId, foodId } = req.params;
  try {
    const deleted = await FoodEntry.destroy({
      where: { userId, foodId }
    });

    if (deleted === 0) {
      return res.status(404).json({ message: "Food not found" });
    }

    res.json({ message: "Food deleted successfully" });
  } catch (error) {
    console.error("Error deleting food:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
