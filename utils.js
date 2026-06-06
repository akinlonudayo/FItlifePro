// Validation
const isValidDate = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date);
const isPositiveNumber = (val) => typeof val === "number" && val > 0;

const validateWorkout = ({ date, duration, caloriesBurned, intensity }) => {
  if (!isValidDate(date)) return "Invalid date format (YYYY-MM-DD)";
  if (!isPositiveNumber(duration)) return "Duration must be a positive number";
  if (!isPositiveNumber(caloriesBurned)) return "Calories burned must be positive";
  if (!["Low", "Medium", "High"].includes(intensity)) return "Invalid intensity";
  return null;
};

const validateNutrition = ({ date, calories }) => {
  if (!isValidDate(date)) return "Invalid date format (YYYY-MM-DD)";
  if (!isPositiveNumber(calories)) return "Calories must be a positive number";
  return null;
};

// Functional Programming helpers
const totalCaloriesConsumed = (nutritionLogs) =>
  nutritionLogs.reduce((sum, log) => sum + log.calories, 0);

const totalCaloriesBurned = (workoutLogs) =>
  workoutLogs.reduce((sum, log) => sum + log.caloriesBurned, 0);

const calorieBalance = (nutritionLogs, workoutLogs) =>
  totalCaloriesConsumed(nutritionLogs) - totalCaloriesBurned(workoutLogs);

const filterByType = (workoutLogs, type) =>
  workoutLogs.filter((log) => log.type.toLowerCase() === type.toLowerCase());

const getCalorieSummary = (logs) =>
  logs.map((log) => ({ meal: log.mealName, calories: log.calories }));

// Goal Tracker factory (Closure)
const createGoalTracker = (targetCaloriesBurned, targetCaloriesConsumed) => {
  let _burned = 0;
  let _consumed = 0;

  return {
    logBurned: (amount) => { _burned += amount; },
    logConsumed: (amount) => { _consumed += amount; },
    getStatus: () => ({
      burned: _burned,
      consumed: _consumed,
      burnedGoalMet: _burned >= targetCaloriesBurned,
      consumedOnTrack: _consumed <= targetCaloriesConsumed,
    }),
  };
};

module.exports = {
  validateWorkout,
  validateNutrition,
  totalCaloriesConsumed,
  totalCaloriesBurned,
  calorieBalance,
  filterByType,
  getCalorieSummary,
  createGoalTracker,
};