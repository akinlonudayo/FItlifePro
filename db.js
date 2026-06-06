const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
  userId: String,
  date: String,
  type: String,
  duration: Number,
  intensity: String,
  caloriesBurned: Number,
  notes: String,
});

const nutritionSchema = new mongoose.Schema({
  userId: String,
  date: String,
  mealName: String,
  calories: Number,
  macros: { protein: Number, carbs: Number, fat: Number },
  notes: String,
});

const goalSchema = new mongoose.Schema({
  userId: String,
  description: String,
  targetCaloriesBurned: Number,
  targetCaloriesConsumed: Number,
  date: String,
});

const WorkoutModel = mongoose.model("Workout", workoutSchema);
const NutritionModel = mongoose.model("Nutrition", nutritionSchema);
const GoalModel = mongoose.model("Goal", goalSchema);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("DB connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = { connectDB, WorkoutModel, NutritionModel, GoalModel };